// import { List, SignOut } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export const HeaderAdminComponent = () => {
  const Navigate = useNavigate();
  const [OpenMenu, setOpenMenu] = useState(false);
  const Location = useLocation();

  const logout = () => {
    localStorage.removeItem("token");
    Navigate("/login");
  };

  useEffect(() => {
    setOpenMenu(false);
  }, [Location]);

  return (
    <div className="flex flex-col md:grid md:grid-cols-[200px,1fr]">
      {/* Desktop */}
      <div className="hidden h-screen w-[200px] flex-col gap-8 overflow-auto bg-[#D3D0CB] p-4 text-white md:flex">
        <div className="w-full p-4">
          <img className="h-full object-contain" src={logo} />
        </div>
        <div className="flex flex-col gap-4 font-semibold text-[#0C2D57]">
          <NavLink to="/admin" end>
            Home
          </NavLink>
          <NavLink to="/admin/cursos">Cursos</NavLink>
          <NavLink to="/admin/provas">Provas</NavLink>
          <NavLink to="/admin/vestibulares">Vestibulares</NavLink>
          <NavLink to="/admin/usuarios">Usuários</NavLink>
        </div>
        <button
          onClick={logout}
          className="mx-auto mt-auto w-fit rounded bg-[#dd3842] px-[34px] py-[15px] leading-[20px] font-semibold text-white"
        >
          Sair
        </button>
      </div>
      {/* Mobile */}
      <div className="relative grid h-[123px] w-screen grid-cols-[auto,1fr,auto] items-center bg-[#D3D0CB] px-0 text-white sm:px-4 md:hidden">
        <button
          className="justify-self-start px-4"
          onClick={() => {
            setOpenMenu((o) => !o);
          }}
        >
          {/* <List size={32} /> */}
        </button>
        <div className="flex h-full max-h-[123px] w-full items-center justify-center p-4">
          {/* <img className="h-full object-contain" src={Icone} /> */}
        </div>
        <button
          onClick={logout}
          className="justify-self-end px-4 text-[#0C2D57]"
        >
          {/* <SignOut size={32} /> */}
        </button>
        <div
          style={{
            transition: "max-height 0.5s, padding 0.5s",
            maxHeight: OpenMenu ? "calc(100vh - 123px)" : "0",
          }}
          className={`absolute top-full flex ${OpenMenu ? "overflow-auto py-8" : "overflow-hidden py-0"} h-fit w-screen flex-col items-center gap-8 bg-[#D3D0CB] text-white`}
        >
          <NavLink to="/admin" end>
            Home
          </NavLink>
          <NavLink to="/admin/avaliacoes">Avaliações</NavLink>
          <NavLink to="/admin/categorias">Categorias</NavLink>
          <NavLink to="/admin/clientes">Clientes</NavLink>
          <NavLink to="/admin/cupons">Cupons</NavLink>
          <NavLink to="/admin/pedidos">Pedidos</NavLink>
          <NavLink to="/admin/fornecedores">Fornecedores</NavLink>
          <NavLink to="/admin/fornecedores-produtos">
            Fornecedores Produtos
          </NavLink>
          <NavLink to="/admin/produtos">Produtos</NavLink>
          <NavLink to="/admin/produtos-categorias">Produtos Categorias</NavLink>
          <NavLink to="/admin/usuarios">Usuários</NavLink>
        </div>
      </div>
      <Outlet />
    </div>
  );
};
