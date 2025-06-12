import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "../services/api.service";

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


export const QuestoesAlternativasPage = () => {
  const [questoesComReferencias, setQuestoesComReferencias] = useState<any[]>([]);
  const [respostasSelecionadas, setRespostasSelecionadas] = useState<{ [questaoId: number]: number }>({});
  const [resultado, setResultado] = useState<{ [questaoId: number]: boolean | null }>({});

  const navigate = useNavigate()

  function embaralhar<T>(array: T[]): T[] {
    return array
      .map((item) => ({ item, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ item }) => item);
  }

useEffect(() => {
  apiService.get("questoes-referencias").then(async (res) => {
    const questoesReferencias = res.data.dados
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
    console.log({ questoes_com_referencias: questoesComReferencias })
  }, [questoesComReferencias]);


  const handleSelecionar = (questaoId: number, alternativaId: number) => {
    setRespostasSelecionadas(prev => ({
      ...prev,
      [questaoId]: alternativaId,
    }));
    setResultado(prev => ({
      ...prev,
      [questaoId]: null // limpa o resultado ao trocar a alternativa
    }));
  };

  const handleResponder = (questao: Questao) => {
    const alternativaSelecionada = questao.alternativas.find(
      (alt) => alt.id === respostasSelecionadas[questao.id]
    );
    const correta = alternativaSelecionada?.correta || false;
    setResultado(prev => ({
      ...prev,
      [questao.id]: correta
    }));
  };

  if (questoesComReferencias.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#f5f7fa] to-[#c3cfe2] p-6">
        <p className="text-lg font-semibold text-gray-700">Carregando questões...</p>
      </div>
    );
  }


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
              <h1 className="text-lg font-bold">
                {questao.referencia.titulo}
              </h1>
              <p className="text-sm font-bold text-blue-900 mb-4">
                {questao.referencia.legenda}
              </p>
              <p className="mb-2">
                {questao.referencia.texto}
              </p>
              {questao.referencia.url_imagem ? <img className="mb-2 w-full h-full" src={questao.referencia.url_imagem} alt="imagem da referencia" /> : null}
            </div>
            <h2 className={`mb-4 text-lg font-bold ${respondida ? "text-gray-700" : "text-gray-800"}`}>
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
                    <span><b>({alternativa.nome})</b>  {alternativa.texto}</span>
                  </label>
                ) : null
              )}
            </div>
            <button
              onClick={() => handleResponder(questao)}
              className="mt-4 bg-blue-500 px-4 py-2 rounded-md text-white disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={respondida || respostasSelecionadas[questao.id] === undefined}
            >
              Responder
            </button>
            {resultado[questao.id] !== undefined && resultado[questao.id] !== null && (
              <p className={`mt-3 font-semibold ${resultado[questao.id] ? "text-green-600" : "text-red-600"}`}>
                {resultado[questao.id] ? "Resposta correta!" : "Resposta incorreta."}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};
