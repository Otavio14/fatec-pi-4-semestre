import axios from "axios";
import Swal from "sweetalert2";
import { IApiResponse } from "../types/index.type";

export const apiService = axios.create({
  baseURL: window.location.hostname.includes("localhost")
    ? "http://localhost:3000"
    : "https://fatec-pi-4-semestre-latest.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

apiService.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

export const errorSwal = ({
  response: {
    data: { mensagem, icone, titulo },
  },
}: {
  response: { data: IApiResponse };
}) => {
  Swal.fire({
    icon: icone,
    title: titulo,
    text: mensagem,
  });
};
