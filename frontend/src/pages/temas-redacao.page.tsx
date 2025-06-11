import { useEffect, useState } from "react";
import { apiService } from "../services/api.service";

export const TemasRedacaoPage = () => {
  const [essayText, setEssayText] = useState("");
  const [redacoesComReferencias, setRedacoesComReferencias] = useState<any[]>([]);
  const [redacaoSorteada, setRedacaoSorteada] = useState<any>(null);

  const confirmarRedacao = () => {
    console.log(essayText)
  }

  const sortearNovaRedacao = () => {
    if (!Array.isArray(redacoesComReferencias) || redacoesComReferencias.length <= 1) return;

    let nova;
    do {
      nova = redacoesComReferencias[Math.floor(Math.random() * redacoesComReferencias.length)];
    } while (nova.redacaoInfo.data.dados.id === redacaoSorteada.redacaoInfo.data.dados.id);

    setRedacaoSorteada(nova);
  };


  useEffect(() => {
    apiService.get("/redacoes-referencias").then(async (res) => {
      const redacoes_referencias = res.data.dados;

      const redacoesComReferencias = await Promise.all(
        redacoes_referencias.map(async (redacoesReferencias: any) => {
          const redacoesInfo = await apiService.get(`/redacoes/${redacoesReferencias.id_redacao}`);
          const referenciasInfo = await apiService.get(`/referencias/${redacoesReferencias.id_referencia}`);
          const provaInfo = await apiService.get(`/provas/${redacoesInfo.data.dados.id_prova}`);

          return {
            ...redacoesReferencias,
            provaInfo,
            redacaoInfo: redacoesInfo,
            referenciaInfo: referenciasInfo,
          };
        })
      );

      // ✅ Aqui estava faltando isso:
      setRedacoesComReferencias(redacoesComReferencias);

      // Sorteia uma redação aleatoriamente
      const sorteada = redacoesComReferencias[Math.floor(Math.random() * redacoesComReferencias.length)];
      setRedacaoSorteada(sorteada);
    }).catch((err) => {
      console.log("Erro ao buscar redações ou referências:", err);
    });
  }, []);


  if (!redacaoSorteada) return <div className="p-10 text-gray-600">Carregando tema de redação...</div>;

  const redacao = redacaoSorteada;

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-gradient-to-b from-[#f5f7fa] to-[#c3cfe2] px-4 py-10">
      <div className="flex w-full max-w-4xl flex-col gap-6 rounded-2xl bg-white p-8 shadow-xl">
        {/* Informações da prova */}
        <div className="text-sm font-medium text-gray-500">
          {redacao.provaInfo.data.dados.nome}
        </div>

        {/* Texto de referência */}
        <div className="pointer-events-none self-start rounded-full bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700">
          Texto de Referência
        </div>
        <div>
          <h2 className="text-2xl leading-snug font-bold text-gray-800">
            {redacao.referenciaInfo.data.dados.titulo}
          </h2>
          <p className="leading-snug font-bold text-gray-800">
            {redacao.referenciaInfo.data.dados.legenda}
          </p>
          {redacao.referenciaInfo.data.dados.url_imagem ? (
            <img
              className="flex justify-center align-center mx-auto mt-4"
              src={redacao.referenciaInfo.data.dados.url_imagem}
            />
          ) : null}
          <p className="my-4">
            {redacao.referenciaInfo.data.dados.texto}
          </p>
        </div>

        {/* Título do tema */}
        <div className="pointer-events-none self-start rounded-full bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700">
          Tema da Redação
        </div>

        <h2 className="text-2xl leading-snug font-bold text-gray-800">
          {redacao.redacaoInfo.data.dados.instrucoes}
        </h2>

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
