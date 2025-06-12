import { useEffect, useState } from "react";
import { apiService } from "../services/api.service";
import { useNavigate } from "react-router-dom";

export const TemasRedacaoPage = () => {
  const [essayText, setEssayText] = useState("");
  const [redacoesComReferencias, setRedacoesComReferencias] = useState<any[]>([]);
  const [redacaoSorteada, setRedacaoSorteada] = useState<any>(null);

  const navigate = useNavigate()

  const confirmarRedacao = () => {
    console.log(essayText)
  }

  const sortearNovaRedacao = () => {
    if (!Array.isArray(redacoesComReferencias) || redacoesComReferencias.length <= 1) return;

    let nova;
    do {
      nova = redacoesComReferencias[Math.floor(Math.random() * redacoesComReferencias.length)];
    } while (nova.id_redacao === redacaoSorteada.id_redacao);

    setRedacaoSorteada(nova);
    setEssayText(""); // limpa o campo de texto
  };



  useEffect(() => {
    apiService.get("/redacoes-referencias").then(async (res) => {
      const redacoes_referencias = res.data.dados;

      // Obtem todos os ids únicos de redações
      const idsRedacoes = [...new Set(redacoes_referencias.map((r: any) => r.id_redacao))];

      // Busca todas as redações com suas referências
      const redacoesAgrupadas = await Promise.all(idsRedacoes.map(async (id_redacao) => {
        const referenciasDaRedacao = redacoes_referencias.filter((r: any) => r.id_redacao === id_redacao);

        const redacoesInfo = await apiService.get(`/redacoes/${id_redacao}`);
        const provaInfo = await apiService.get(`/provas/${redacoesInfo.data.dados.id_prova}`);

        const referencias = await Promise.all(referenciasDaRedacao.map(async (item: any) => {
          const referenciaInfo = await apiService.get(`/referencias/${item.id_referencia}`);
          return referenciaInfo.data.dados;
        }));

        return {
          id_redacao,
          redacaoInfo: redacoesInfo,
          provaInfo,
          referencias,
        };
      }));

      setRedacoesComReferencias(redacoesAgrupadas);

      // Sorteia a primeira
      const redacaoInicial = redacoesAgrupadas[Math.floor(Math.random() * redacoesAgrupadas.length)];
      setRedacaoSorteada(redacaoInicial);
    }).catch((err) => {
      console.log("Erro ao buscar redações ou referências:", err);
    });
  }, []);




  if (!redacaoSorteada) return <div className="p-10 text-gray-600">Carregando tema de redação...</div>;

  const redacao = redacaoSorteada;

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-gradient-to-b from-[#f5f7fa] to-[#c3cfe2] px-4 py-10">
      <button
        onClick={() => navigate("/")}
        className="bg-green-200 hover:bg-green-300 text-gray-800 mr-auto font-medium py-2 px-4 rounded-lg transition duration-200"
      >
        Voltar
      </button>
      <div className="flex w-full max-w-4xl flex-col gap-6 rounded-2xl bg-white p-8 shadow-xl">
        {/* Informações da prova */}
        <div className="text-sm font-medium text-gray-500">
          {redacao.provaInfo.data.dados.nome}
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
          <h1 className="text-xl leading-snug text-gray-800">A partir da coletânea apresentada, elabore um texto narrativo ou um texto
            dissertativo-argumentativo explorando o seguinte tema:</h1>
          <h2 className="text-2xl leading-snug font-bold text-gray-800">
            {redacao.redacaoInfo.data.dados.instrucoes}
          </h2>
        </div>
        <div className="text-center">
          <h1 className="font-bold text-xl">Orientações</h1> <br />
          <p className="text-start text-md">• Narração – explore adequadamente os elementos desse gênero: fato(s), personagem(ns), tempo e lugar.</p>
          <p className="text-start text-md">• Dissertação – selecione, organize e relacione os argumentos, fatos e opiniões para sustentar suas ideias e pontos de vista.</p>
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
        <div className="flex flex-row gap-6">
          <button
            onClick={sortearNovaRedacao}
            disabled={!!essayText}
            className={`mt-4 self-end rounded-lg px-4 py-2 font-semibold shadow transition 
    ${essayText
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'}`}
          >
            Sortear outro tema
          </button>

          <button
            onClick={confirmarRedacao}
            disabled={!essayText}
            className={`mt-4 self-end rounded-lg px-4 py-2 font-semibold shadow transition 
    ${essayText
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'}`}
          >
            Enviar Redação
          </button>
        </div>


      </div>
    </div >
  );
};
