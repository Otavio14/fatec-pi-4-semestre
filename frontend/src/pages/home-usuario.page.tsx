import React, { useEffect, useState } from "react";
import { apiService } from "../services/api.service";
import { authService } from "../services/auth.service";

interface User {
  id: number,
  nome: string,
  email: string,
  perfil: string
}

export const HomeUsuarioPage = () => {
  const [editando, setEditando] = useState(false);

  const [user, setUser] = useState<User>({
    id: 0,
    nome: "",
    email: "",
    perfil: "",
  });

  const historicoVestibulares = [8, 10, 6]; // acertos
  const historicoRedacoes = [700, 800, 680]; // pontuação
  const recordeSeguido = 12;

  useEffect(() => {
    const info = authService.getUserInfo()
    setUser(info)
  }, [])

  // const salvarAlteracoes = () => {
  //   const data = {
  //     email: "aluno@gmail.com",
  //     id: 2,
  //     nome: "Teste da Silva Oliveira",
  //   }
  //   setEditando(false);
  //   if (user) {
  //     apiService.put(`/usuarios/2`, data).then((res) => {
  //       console.log({ response: res })
  //     }).catch((err) => {
  //       console.log({ error: err })
  //     })
  //   }
  // };

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="mx-auto max-w-4xl rounded-xl bg-white p-8 shadow-md">
        <h1 className="mb-6 text-3xl font-bold text-gray-800">
          Perfil
        </h1>
        <div className="flex flex-col items-center gap-6 md:flex-row">
          <div className="flex-1 space-y-4">
            {/* {editando ? (
              <>
                <input
                  type="text"
                  value={user?.nome || ""}
                  onChange={(e) => setUser((prev) => ({
                    ...prev!,
                    nome: e.target.value
                  }))
                  }
                  className="w-full rounded border px-4 py-2"
                />
                <input
                  type="email"
                  value={user?.email || ""}
                  onChange={(e) => setUser((prev) => ({
                    ...prev!,
                    email: e.target.value
                  }))}
                  className="w-full rounded border px-4 py-2"
                />
                <button
                  onClick={salvarAlteracoes}
                  className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                >
                  Salvar
                </button>
              </>
            ) : ( */}
              <>
                <p className="text-xl font-semibold text-gray-700">{user?.nome || "carregando..."}</p>
                <p className="text-gray-600">{user?.email || "carregando..."}</p>
                {/* <button
                  onClick={() => setEditando(true)}
                  className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                  Editar Informações
                </button> */}
              </>
            {/* )} */}
          </div>
        </div>

        <hr className="my-8" />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-blue-50 p-4 shadow">
            <h3 className="mb-2 text-lg font-semibold text-blue-700">
              Histórico de Vestibulares
            </h3>
            <ul className="space-y-1 text-gray-700">
              {historicoVestibulares.map((pontos, idx) => (
                <li key={idx}>
                  Prova {idx + 1}: {pontos} acertos
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg bg-green-50 p-4 shadow">
            <h3 className="mb-2 text-lg font-semibold text-green-700">
              Pontuação em Redações
            </h3>
            <ul className="space-y-1 text-gray-700">
              {historicoRedacoes.map((nota, idx) => (
                <li key={idx}>
                  Redação {idx + 1}: {nota} pontos
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg bg-yellow-50 p-4 shadow">
            <h3 className="mb-2 text-lg font-semibold text-yellow-700">
              Recorde Pessoal
            </h3>
            <p className="text-gray-700">
              Acertos seguidos:{" "}
              <span className="font-bold">{recordeSeguido}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
