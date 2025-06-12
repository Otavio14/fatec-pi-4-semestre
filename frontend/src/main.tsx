import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AppRouting } from "./app.routing";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename="/fatec-pi-4-semestre">
      <AppRouting />
    </BrowserRouter>
  </StrictMode>,
);
