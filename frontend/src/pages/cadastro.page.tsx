import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { errorSwal } from "../services/api.service";
import { authService } from "../services/auth.service";
import { UsuarioService } from "../services/usuario.service";

interface IRegisterForm {
  email: string;
  nome: string;
  senha: string;
  senhaConfirmacao?: string;
}

export const CadastroPage = () => {
  const [registerForm, setRegisterForm] = useState<IRegisterForm>({
    email: "",
    nome: "",
    senha: "",
    senhaConfirmacao: "",
  });

  const navigate = useNavigate();
  const usuarioService = new UsuarioService();

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (registerForm.senha !== registerForm.senhaConfirmacao) {
      Swal.fire({
        icon: "warning",
        title: "Senhas não coincidem",
        text: "As senhas informadas não coincidem. Por favor, verifique e tente novamente.",
      });
      return;
    }

    usuarioService
      .create(registerForm)
      .then(() => {
        usuarioService
          .login({ email: registerForm.email, senha: registerForm.senha })
          .then(({ data: { dados } }) => {
            localStorage.setItem("token", dados);

            if (authService.isAuthenticatedAdmin()) {
              navigate("/admin");
            } else if (authService.isAuthenticated()) {
              navigate("/aluno");
            }
          })
          .catch(errorSwal);
      })
      .catch(errorSwal);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#f5f7fa] to-[#c3cfe2] px-4">
      <button
        onClick={() => navigate("/")}
        className="fixed top-8 left-8 mr-auto rounded-lg bg-blue-500 px-4 py-2 font-medium text-white transition duration-200 hover:bg-blue-600"
      >
        Home
      </button>
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl transition-transform duration-300 hover:scale-105">
        <h2 className="mb-6 text-center text-3xl font-extrabold text-gray-800 md:text-4xl">
          Criar Conta
        </h2>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label
              htmlFor="nome"
              className="mb-1 text-sm font-medium text-gray-700"
            >
              Nome Completo
            </label>
            <input
              autoComplete="name"
              className="rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              id="nome"
              name="nome"
              required
              value={registerForm.nome}
              onChange={({ target: { name, value } }) => {
                setRegisterForm((prevData) => ({
                  ...prevData,
                  [name]: value,
                }));
              }}
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="mb-1 text-sm font-medium text-gray-700"
            >
              E-mail
            </label>
            <input
              autoComplete="email"
              className="rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              id="email"
              name="email"
              required
              type="email"
              value={registerForm.email}
              onChange={({ target: { name, value } }) => {
                setRegisterForm((prevData) => ({
                  ...prevData,
                  [name]: value,
                }));
              }}
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="senha"
              className="mb-1 text-sm font-medium text-gray-700"
            >
              Senha
            </label>
            <input
              autoComplete="off"
              className="rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              id="senha"
              name="senha"
              required
              type="password"
              value={registerForm.senha}
              onChange={({ target: { name, value } }) => {
                setRegisterForm((prevData) => ({
                  ...prevData,
                  [name]: value,
                }));
              }}
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="senhaConfirmacao"
              className="mb-1 text-sm font-medium text-gray-700"
            >
              Confirmar Senha
            </label>
            <input
              type="password"
              id="senhaConfirmacao"
              className="rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              required
              name="senhaConfirmacao"
              value={registerForm.senhaConfirmacao}
              autoComplete="off"
              onChange={({ target: { name, value } }) => {
                setRegisterForm((prevData) => ({
                  ...prevData,
                  [name]: value,
                }));
              }}
            />
          </div>

          <button
            type="submit"
            className="mt-4 w-full rounded-full bg-blue-500 px-4 py-2 font-semibold text-white transition hover:bg-blue-600"
          >
            Cadastrar
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Já tem uma conta?{" "}
          <NavLink to="/login" className="text-blue-500 hover:underline">
            Entrar
          </NavLink>
        </p>
      </div>
    </div>
  );
};
