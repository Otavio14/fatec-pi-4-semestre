import { ArrowLeftIcon } from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import { errorSwal } from "../services/api.service";
import { ProvaService } from "../services/prova.service";
import { IProva } from "../types/prova.type";

export const ProvasAnterioresPage = () => {
  const [provas, setProvas] = useState<Array<IProva>>([]);
  const [urlProva, setUrlProva] = useState<string | null>(null);

  const provaService = useMemo(() => new ProvaService(), []);

  useEffect(() => {
    provaService
      .findAll()
      .then(({ data: { dados } }) => {
        setProvas(dados);
      })
      .catch(errorSwal);
  }, [provaService]);

  return (
    <div className="flex h-full w-full flex-1 flex-col bg-gradient-to-b from-[#fefefe] to-[#f0f0f0] px-4 py-10">
      <div className="mx-auto flex h-full w-full max-w-4xl flex-col">
        <div className="mb-8 flex items-center gap-4">
          {urlProva ? (
            <button
              className="cursor-pointer"
              title="Voltar"
              onClick={() => setUrlProva(null)}
            >
              <ArrowLeftIcon size={32} />
            </button>
          ) : null}
          <h1 className="text-3xl font-bold text-gray-800">
            Provas Anteriores
          </h1>
        </div>

        {urlProva ? (
          <div className="flex h-full w-full flex-col items-center justify-center">
            <embed
              type="application/pdf"
              src={urlProva}
              className="h-full min-h-[70vh] w-full"
            />
          </div>
        ) : (
          <div className="space-y-4">
            {provas.map((prova, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-6 py-4 shadow transition hover:shadow-md"
              >
                <div>
                  <p className="text-lg font-semibold text-gray-800">
                    {prova.nome}
                  </p>
                </div>
                <button
                  onClick={() => setUrlProva(prova.url_arquivo)}
                  className="rounded-full bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                >
                  Acessar Prova
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
