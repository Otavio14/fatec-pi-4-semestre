import { Navigate, Route, Routes } from "react-router-dom";
import { OutletComponent } from "./components/outlet.component";
import { CadastroPage } from "./pages/cadastro.page";
import { CursoPage } from "./pages/curso.page";
import { HomeAdminPage } from "./pages/home-admin.page";
import { HomeUsuarioPage } from "./pages/home-usuario.page";
import { HomePage } from "./pages/home.page";
import { ImportarProvaPage } from "./pages/importar-prova";
import { LoginPage } from "./pages/login.page";
import { NotFoundPage } from "./pages/not-found.page";
import { ProvaPage } from "./pages/prova.page";
import { ProvasAnterioresPage } from "./pages/provas-anteriores.page";
import { QuestoesAlternativasPage } from "./pages/questoes-alternativas.page";
import { TemasRedacaoPage } from "./pages/temas-redacao.page";
import { UsuarioPage } from "./pages/usuario.page";
import { VestibularCompletoPage } from "./pages/vestibular-completo.page";
import { VestibularPage } from "./pages/vestibular.page";
import { authService } from "./services/auth.service";
import { IPerfil } from "./types/index.type";

export const AppRouting = () => {
  const AuthenticatedRouter = ({ children }: { children: React.ReactNode }) => {
    if (!authService.isAuthenticated()) return <Navigate to="/login" replace />;

    return <>{children}</>;
  };

  const AuthenticatedAdminRouter = ({
    children,
  }: {
    children: React.ReactNode;
  }) => {
    if (!authService.isAuthenticatedAdmin())
      return <Navigate to="/login" replace />;

    return <>{children}</>;
  };

  const renderTags = (component: React.ReactNode, header?: IPerfil) => {
    return <OutletComponent Header={header}>{component}</OutletComponent>;
  };

  return (
    <Routes>
      {/* <-------------------------------------------------- Rotas Públicas */}
      <Route path="/">
        <Route index element={renderTags(<HomePage />, "Público")} />
        <Route path="login" element={renderTags(<LoginPage />)} />
        <Route path="cadastro" element={renderTags(<CadastroPage />)} />
        <Route path="*" element={renderTags(<NotFoundPage />)} />
        <Route
          path="/questoes-alternativas"
          element={renderTags(<QuestoesAlternativasPage />, "Público")}
        />
        <Route
          path="/temas-redacao"
          element={renderTags(<TemasRedacaoPage />, "Público")}
        />
        <Route
          path="/vestibular-completo"
          element={renderTags(<VestibularCompletoPage />, "Público")}
        />
        <Route
          path="/provas-anteriores"
          element={renderTags(<ProvasAnterioresPage />, "Público")}
        />
      </Route>
      {/* <-------------------------------------------------- Rotas Públicas */}
      {/* <-------------------------------------------------- Rotas Usuários */}
      <Route
        path="/aluno/*"
        element={
          <AuthenticatedRouter>
            <Routes>
              <Route index element={renderTags(<HomeUsuarioPage />, "Aluno")} />
            </Routes>
          </AuthenticatedRouter>
        }
      />
      {/* <-------------------------------------------------- Rotas Usuários */}
      {/* <--------------------------------------------- Rotas Administrador */}
      <Route
        path="/admin/*"
        element={
          <AuthenticatedAdminRouter>
            <Routes>
              <Route
                index
                element={renderTags(<HomeAdminPage />, "Administrador")}
              />
              <Route
                path="importar-prova"
                element={renderTags(<ImportarProvaPage />, "Administrador")}
              />
              <Route
                path="usuarios"
                element={renderTags(<UsuarioPage />, "Administrador")}
              />
              <Route
                path="cursos"
                element={renderTags(<CursoPage />, "Administrador")}
              />
              <Route
                path="provas"
                element={renderTags(<ProvaPage />, "Administrador")}
              />
              <Route
                path="vestibulares"
                element={renderTags(<VestibularPage />, "Administrador")}
              />
            </Routes>
          </AuthenticatedAdminRouter>
        }
      />
      {/* <--------------------------------------------- Rotas Administrador */}
      <Route path="*" element={renderTags(<NotFoundPage />)} />
    </Routes>
  );
};
