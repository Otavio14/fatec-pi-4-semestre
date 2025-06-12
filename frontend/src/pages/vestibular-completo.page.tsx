import { useEffect, useState } from "react";
import { apiService } from "../services/api.service";
import { useNavigate } from "react-router-dom";

interface Alternativa {
  correta: boolean;
  id: number;
  id_questao: number;
  nome: string;
  texto: string;
}

interface Questao {
  id: number;
  id_prova: number;
  prova: string;
  texto: string;
  alternativas: Alternativa[];
}

export const VestibularCompletoPage = () => {
  const [questoesComReferencias, setQuestoesComReferencias] = useState<any[]>([]);
  const [respostasSelecionadas, setRespostasSelecionadas] = useState<{ [questaoId: number]: number }>({});
  const [resultado, setResultado] = useState<{ [questaoId: number]: boolean | null }>({});

  const [essayText, setEssayText] = useState("");
  const [redacoesComReferencias, setRedacoesComReferencias] = useState<any[]>([]);
  const [redacaoSorteada, setRedacaoSorteada] = useState<any>(null);

  const navigate = useNavigate();

  function embaralhar<T>(array: T[]): T[] {
    return array
      .map((item) => ({ item, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ item }) => item);
  }

  useEffect(() => {
    apiService.get("questoes-referencias").then(async (res) => {
      const questoesReferencias = res.data.dados;
      const questoesComReferencias = await Promise.all(
        questoesReferencias.map(async (questoesReferencias: any) => {
          const questoesInfo = await apiService.get(`/questoes/${questoesReferencias.id_questao}`);
          const referenciasInfo = await apiService.get(`/referencias/${questoesReferencias.id_referencia}`);
          const provaInfo = await apiService.get(`/provas/${questoesInfo.data.dados.id_prova}`);
          const altRes = await apiService.get(`/alternativas?questaoId=${questoesInfo.data.dados.id}`);

          return {
            ...questoesReferencias,
            prova: provaInfo.data.dados.nome,
            alternativas: altRes.data.dados || [],
            questao: questoesInfo.data.dados,
            referencia: referenciasInfo.data.dados,
          };
        })
      );

      const questoesEmbaralhadas = embaralhar(questoesComReferencias).slice(0, 10);
      setQuestoesComReferencias(questoesEmbaralhadas);
    });
  }, []);

  useEffect(() => {
    apiService.get("/redacoes-referencias").then(async (res) => {
      const redacoes_referencias = res.data.dados;

      // Obtem todos os ids únicos de redações
      const idsRedacoes = [...new Set(redacoes_referencias.map((r: any) => r.id_redacao))];

      // Busca todas as redações com suas referências
      const redacoesAgrupadas = await Promise.all(
        idsRedacoes.map(async (id_redacao) => {
          const referenciasDaRedacao = redacoes_referencias.filter((r: any) => r.id_redacao === id_redacao);

          const redacoesInfo = await apiService.get(`/redacoes/${id_redacao}`);
          const provaInfo = await apiService.get(`/provas/${redacoesInfo.data.dados.id_prova}`);

          const referencias = await Promise.all(
            referenciasDaRedacao.map(async (item: any) => {
              const referenciaInfo = await apiService.get(`/referencias/${item.id_referencia}`);
              return referenciaInfo.data.dados;
            })
          );

          return {
            id_redacao,
            redacaoInfo: redacoesInfo,
            provaInfo,
            referencias,
          };
        })
      );

      setRedacoesComReferencias(redacoesAgrupadas);

      // Sorteia a primeira
      const redacaoInicial = redacoesAgrupadas[Math.floor(Math.random() * redacoesAgrupadas.length)];
      setRedacaoSorteada(redacaoInicial);
    }).catch((err) => {
      console.log("Erro ao buscar redações ou referências:", err);
    });
  }, []);

  const handleSelecionar = (questaoId: number, alternativaId: number) => {
    setRespostasSelecionadas((prev) => ({
      ...prev,
      [questaoId]: alternativaId,
    }));
    setResultado((prev) => ({
      ...prev,
      [questaoId]: null, // limpa o resultado ao trocar a alternativa
    }));
  };

  const handleResponderTodas = () => {
    console.log("Encerrar Simulado clicado");
    const novoResultado: { [questaoId: number]: boolean } = {};

    questoesComReferencias.forEach((questao) => {
      const alternativaSelecionadaId = respostasSelecionadas[questao.id];
      console.log(`Questão ${questao.id} - alternativa selecionada:`, alternativaSelecionadaId);
      const alternativa = questao.alternativas.find((alt: any) => alt.id === alternativaSelecionadaId);
      const correta = alternativa?.correta || false;
      console.log(`Questão ${questao.id} - correta?`, correta);
      novoResultado[questao.id] = correta;
    });

    setResultado(novoResultado);
  };


  if (questoesComReferencias.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#f5f7fa] to-[#c3cfe2] p-6">
        <p className="text-lg font-semibold text-gray-700">Gerando Simulado...</p>
      </div>
    );
  }

  const redacao = redacaoSorteada;

  return (
    <div className="flex min-h-screen flex-col items-center gap-6 bg-gradient-to-b from-[#f5f7fa] to-[#c3cfe2] p-6">
      <button
        onClick={() => navigate("/")}
        className="bg-green-200 hover:bg-green-300 text-gray-800 mr-auto font-medium py-2 px-4 rounded-lg transition duration-200"
      >
        Voltar
      </button>

      {questoesComReferencias?.map((questao) => {
        const respondida = resultado.hasOwnProperty(questao.id) && resultado[questao.id] !== null;

        return (
          <div
            key={questao.id}
            className={`w-full max-w-xl rounded-2xl p-6 shadow-xl transition-colors duration-300 ${respondida ? "bg-gray-300" : "bg-white"
              }`}
          >
            <div className="mb-4 rounded-full bg-gray-200 px-4 py-1 text-sm font-semibold text-gray-700 w-fit">
              {questao.prova}
            </div>
            <div className="bg-gray-200 p-2 rounded-md shadow-md mb-4">
              <h1 className="text-lg font-bold">{questao.referencia.titulo}</h1>
              <p className="text-sm font-bold text-blue-900 mb-4">{questao.referencia.legenda}</p>
              <p className="mb-2">{questao.referencia.texto}</p>
              {questao.referencia.url_imagem ? (
                <img
                  className="mb-2 w-full h-full"
                  src={questao.referencia.url_imagem}
                  alt="imagem da referencia"
                />
              ) : null}
            </div>
            <h2
              className={`mb-4 text-lg font-bold ${respondida ? "text-gray-700" : "text-gray-800"
                }`}
            >
              {questao.questao.texto}
            </h2>
            <div className="flex flex-col gap-2">
              {questao.alternativas.map((alternativa: any) =>
                alternativa.id_questao === questao.id ? (
                  <label
                    key={alternativa.id}
                    className={`flex items-center gap-2 rounded-md border px-4 py-2 cursor-pointer transition-colors duration-200 ${respostasSelecionadas[questao.id] === alternativa.id
                      ? "border-blue-500 bg-blue-100"
                      : "hover:border-blue-400"
                      } ${respondida ? "cursor-not-allowed opacity-70" : ""}`}
                  >
                    <input
                      type="radio"
                      name={`questao-${questao.id}`}
                      value={alternativa.id}
                      checked={respostasSelecionadas[questao.id] === alternativa.id}
                      onChange={() => handleSelecionar(questao.id, alternativa.id)}
                      disabled={respondida}
                    />
                    <span>
                      <b>({alternativa.nome})</b> {alternativa.texto}
                    </span>
                  </label>
                ) : null
              )}
            </div>
            {resultado[questao.id] !== undefined && resultado[questao.id] !== null && (
              <p
                className={`mt-3 font-semibold ${resultado[questao.id] ? "text-green-600" : "text-red-600"
                  }`}
              >
                {resultado[questao.id] ? "Resposta correta!" : "Resposta incorreta."}
              </p>
            )}
          </div>
        );
      })}

      {/* REDAÇÃO */}
      <div className="flex w-full max-w-4xl flex-col gap-6 rounded-2xl bg-white p-8 shadow-xl">
        {/* Informações da prova */}
        <div className="text-sm font-medium text-gray-500">
          {redacao?.provaInfo?.data?.dados?.nome}
        </div>

        {/* Textos de referência */}
        <div className="pointer-events-none self-start rounded-full bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700">
          Textos de Referência
        </div>

        {redacao?.referencias?.map((referencia: any, index: number) => (
          <div key={index} className="mb-6 bg-gray-200 p-2 shadow-md rounded-md">
            <h2 className="text-xl font-bold text-gray-800">{referencia.titulo}</h2>
            <p className="font-bold text-gray-800">{referencia.legenda}</p>
            {referencia.data?.dados?.url_imagem ? (
              <img
                className="flex justify-center align-center mx-auto mt-4"
                src={referencia.data.dados.url_imagem}
                alt={`Referência ${index + 1}`}
              />
            ) : null}
            <p className="my-4">{referencia.texto}</p>
          </div>
        ))}

        {/* Título do tema */}
        <div className="pointer-events-none self-start rounded-full bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700">
          Tema da Redação
        </div>
        <div className="border-2 rounded-xl text-center shadow-md">
          <h1 className="text-xl leading-snug text-gray-800">
            A partir da coletânea apresentada, elabore um texto narrativo ou um texto
            dissertativo-argumentativo explorando o seguinte tema:
          </h1>
          <h2 className="text-2xl leading-snug font-bold text-gray-800">
            {redacao?.redacaoInfo?.data?.dados?.instrucoes}
          </h2>
        </div>
        <div className="text-center">
          <h1 className="font-bold text-xl">Orientações</h1> <br />
          <p className="text-start text-md">
            • Narração – explore adequadamente os elementos desse gênero: fato(s), personagem(ns), tempo e lugar.
          </p>
          <p className="text-start text-md">
            • Dissertação – selecione, organize e relacione os argumentos, fatos e opiniões para sustentar suas ideias e pontos de vista.
          </p>
          <h1 className="font-bold text-xl text-start mt-2">Ao elaborar seu texto:</h1> <br />
          <p className="text-start text-md">Atribua um título para sua redação;</p>
          <p className="text-start text-md">Não o redija em versos;</p>
          <p className="text-start text-md">Organize-o em parágrafos;</p>
          <p className="text-start text-md">Empregue apenas a norma culta da língua portuguesa;</p>
          <p className="text-start text-md">Não copie os textos apresentados na coletânea e na prova;</p>
        </div>

        {/* Campo de texto */}
        <textarea
          className="min-h-[300px] w-full resize-none rounded-lg border border-gray-300 p-4 text-gray-700 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          placeholder="Escreva sua redação aqui..."
          value={essayText}
          onChange={(e) => setEssayText(e.target.value)}
        />

        <button
          onClick={handleResponderTodas}
          className={`mt-4 px-6 py-3 rounded-lg font-semibold shadow transition
    ${Object.keys(respostasSelecionadas).length !== questoesComReferencias.length
              ? 'bg-gray-400 text-white cursor-not-allowed'  // estado desabilitado (exemplo)
              : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
            }
  `}
          disabled={
            Object.keys(respostasSelecionadas).length !== questoesComReferencias.length
          }
        >
          Encerrar Simulado
        </button>
      </div>
    </div >
  );
};
