import { useNavigate } from "react-router-dom";
import fatec from "../assets/fatec.png";
import logo from "../assets/logo.png";
import userImage from "../assets/user.svg";
import { authService } from "../services/auth.service";

export const HeaderComponent = () => {
  const Navigate = useNavigate();

  return (
    <div className="mb-4 flex h-20 w-full flex-row items-center justify-around bg-white px-6 shadow-md">
      <div className="flex items-center">
        <img
          src={fatec}
          alt="Logo Fatec"
          className="h-14 cursor-pointer"
          onClick={() =>
            window.open("https://vestibular.fatec.sp.gov.br/home/", "_blank")
          }
        />
      </div>
      <div className="flex items-center">
        <img
          src={logo}
          alt="logo Fatecando"
          className="h-18 cursor-pointer"
          onClick={() => Navigate("/")}
        />
      </div>
      {authService.isAuthenticated() ? (
        <img
          src={userImage}
          alt="Usuário"
          className="h-12 w-12 cursor-pointer rounded-full border-2 border-red-500 shadow-sm"
          onClick={() => Navigate("/login")}
        />) : (
        <h1
          className="h-fit px-2 py-1 w-fit cursor-pointer rounded-lx border-b-2 border-red-500 shadow-sm
          hover:scale-102 cursor-pointer hover:bg-red-600 hover:text-white"
          onClick={() => Navigate("/login")}
        >
          Entre
        </h1>
      )}
    </div>
  );
};
