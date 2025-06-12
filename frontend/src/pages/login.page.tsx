import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { errorSwal } from "../services/api.service";
import { authService } from "../services/auth.service";
import { UsuarioService } from "../services/usuario.service";

interface ILoginForm {
  email: string;
  senha: string;
}

export const LoginPage = () => {
  const [loginForm, setLoginForm] = useState<ILoginForm>({
    email: "",
    senha: "",
  });

  const navigate = useNavigate();
  const usuarioService = new UsuarioService();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    usuarioService
      .login(loginForm)
      .then(({ data: { dados } }) => {
        localStorage.setItem("token", dados);

        if (authService.isAuthenticatedAdmin()) {
          navigate("/admin");
        } else if (authService.isAuthenticated()) {
          navigate("/aluno");
        }
      })
      .catch(errorSwal);
  };

  useEffect(() => {
    if (authService.isAuthenticatedAdmin()) {
      navigate("/admin");
    } else if (authService.isAuthenticated()) {
      navigate("/aluno");
    }
  }, [navigate]);

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
          Entrar na Plataforma
        </h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="mb-1 text-sm font-medium text-gray-700"
            >
              E-mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              value={loginForm.email}
              onChange={({ target: { name, value } }) => {
                setLoginForm((prevData) => ({
                  ...prevData,
                  [name]: value,
                }));
              }}
              autoComplete="email"
              required
              autoFocus
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
              type="password"
              id="senha"
              name="senha"
              className="rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              value={loginForm.senha}
              onChange={({ target: { name, value } }) => {
                setLoginForm((prevData) => ({
                  ...prevData,
                  [name]: value,
                }));
              }}
              autoComplete="off"
              required
            />
          </div>

          <button
            type="submit"
            className="mt-4 w-full rounded-full bg-blue-500 px-4 py-2 font-semibold text-white transition hover:bg-blue-600"
          >
            Entrar
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Ainda não tem uma conta?
          <NavLink to="/cadastro" className="text-blue-500 hover:underline">
            {" "}
            Cadastre-se
          </NavLink>
        </p>
      </div>
    </div>
  );
};
