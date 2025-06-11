import { useEffect, useState } from "react";
import { apiService } from "../services/api.service";
import { useNavigate } from "react-router";

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
  const [questoesAlternativas, setQuestoesAlternativas] = useState<Questao[]>([]);
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
  apiService.get("/questoes").then(async (res) => {
    const questoes = res.data.dados;

    // Embaralha e seleciona apenas 10 questões
    const questoesAleatorias = embaralhar(questoes).slice(0, 10);

    const questoesComAlternativas = await Promise.all(
      questoesAleatorias.map(async (questao: any) => {
        const altRes = await apiService.get(`/alternativas?questaoId=${questao.id}`);
        const fromProva = await apiService.get(`/provas/${questao.id_prova}`);
        console.log({Questão: questao, prova: fromProva})
        return {
          ...questao,
          prova: fromProva.data.dados.nome,
          alternativas: altRes.data.dados || [],
        };
      })
    );
    setQuestoesAlternativas(questoesComAlternativas);
  }).catch((err) => {
    console.error("Erro ao buscar questões ou alternativas:", err);
  });
}, []);


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

  return (
    <div className="flex min-h-screen flex-col items-center gap-6 bg-gradient-to-b from-[#f5f7fa] to-[#c3cfe2] p-6">
      <button
        onClick={() => navigate("/")}
        className="bg-green-200 hover:bg-green-300 text-gray-800 mr-auto font-medium py-2 px-4 rounded-lg transition duration-200"
      >
        Voltar
      </button>
      {questoesAlternativas.map((questao) => {
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
            <h2 className={`mb-4 text-lg font-bold ${respondida ? "text-gray-700" : "text-gray-800"}`}>
              {questao.texto}
            </h2>
            <div className="flex flex-col gap-2">
              {questao.alternativas.map((alternativa) =>
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
                    <span>{alternativa.texto}</span>
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
