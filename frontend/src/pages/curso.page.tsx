import { PencilIcon, TrashIcon } from "@phosphor-icons/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { InputComponent } from "../components/input.component";
import { errorSwal } from "../services/api.service";
import { CursoService } from "../services/curso.service";
import { Swal, Toast } from "../shared/swal.shared";
import { ICurso } from "../types/curso.type";

export const CursoPage = () => {
  const [cursos, setCursos] = useState<Array<ICurso>>([]);
  const [showModal, setShowModal] = useState(false);
  const [reload, setReload] = useState(false);
  const [id, setId] = useState(0);
  const [form, setForm] = useState<ICurso>({ nome: "", id: 0 });

  const cursoService = useMemo(() => new CursoService(), []);
  const DialogRef = useRef<HTMLDialogElement>(null);

  const openModal = (id: number) => {
    setId(id);

    cursoService
      .findOne(id)
      .then(({ data: { dados } }) => {
        setShowModal(true);
        setForm(dados);
      })
      .catch(errorSwal);
  };

  const deletar = (id: number) => {
    Swal.fire({
      title: "Deseja deletar este curso?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sim",
      cancelButtonText: "Não",
    }).then(({ isConfirmed }) => {
      if (isConfirmed)
        cursoService
          .delete(id)
          .then(({ data: { icone, mensagem, titulo } }) => {
            setReload((r) => !r);
            Toast.fire({
              title: titulo,
              text: mensagem,
              icon: icone,
            });
          })
          .catch(errorSwal);
    });
  };

  const closeModal = () => {
    setShowModal(false);
    setId(0);
    setForm({ nome: "", id: 0 });
  };

  const salvar = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (id) {
      cursoService
        .update(id, form)
        .then(({ data: { icone, mensagem, titulo } }) => {
          closeModal();
          setReload((r) => !r);
          Toast.fire({
            title: titulo,
            text: mensagem,
            icon: icone,
          });
        });
    } else {
      cursoService
        .create(form)
        .then(({ data: { icone, mensagem, titulo } }) => {
          closeModal();
          setReload((r) => !r);
          Toast.fire({
            title: titulo,
            text: mensagem,
            icon: icone,
          });
        });
    }
  };

  useEffect(() => {
    if (showModal && !DialogRef?.current?.hasAttribute("open"))
      DialogRef?.current?.showModal();
    else DialogRef?.current?.close();
  }, [showModal]);

  useEffect(() => {
    cursoService
      .findAll()
      .then(({ data: { dados } }) => {
        setCursos(dados);
      })
      .catch(errorSwal);
  }, [cursoService, reload]);

  return (
    <div className="flex h-full w-full flex-col p-4">
      <header className="flex w-full items-center gap-4">
        <h1 className="w-full flex-1 p-4 text-3xl font-bold">Cursos</h1>
        <input
          type="search"
          className="rounded-sm border border-blue-500 p-2"
          placeholder="Pesquisar"
        />
        <button
          className="flex h-fit w-fit cursor-pointer items-center justify-center rounded-sm bg-blue-500 px-4 py-4 font-semibold text-white transition hover:bg-blue-600"
          onClick={() => setShowModal(true)}
        >
          Adicionar
        </button>
      </header>
      <div className="flex flex-col rounded p-4">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cursos.map((curso, index) => (
              <tr key={index}>
                <td>{curso.nome}</td>
                <td>
                  <button onClick={() => openModal(curso?.id)}>
                    <PencilIcon size={20} />
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => {
                      deletar(curso?.id);
                    }}
                  >
                    <TrashIcon size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <dialog
        ref={DialogRef}
        onCancel={closeModal}
        className={`fixed top-0 left-0 z-[13] h-screen w-screen flex-col items-center overflow-y-auto border-none bg-transparent p-4 backdrop:bg-black/50 ${
          showModal ? "flex" : ""
        }`}
      >
        <form
          onSubmit={salvar}
          className="w-fir z-[15] mx-0 my-auto flex h-fit flex-col items-center rounded-lg bg-[#f8f9ff] p-2 sm:p-12"
        >
          <h1 className="text-center text-[38px] leading-[140%] font-semibold">
            {id ? "Editar" : "Cadastrar"} Curso
          </h1>
          <InputComponent
            placeholder="Nome"
            Label={"Nome"}
            name="nome"
            onChange={({ target: { name, value } }) => {
              setForm((prevData) => ({
                ...prevData,
                [name]: value,
              }));
            }}
            value={form.nome}
            required
          />
          <div className="flex gap-4">
            <button
              className="w-fit rounded border bg-[#2B38D1] px-[34px] py-[15px] leading-[20px] font-semibold text-white hover:bg-white hover:text-[#0c2d57]"
              type="submit"
            >
              Salvar
            </button>
            <button
              type="button"
              className="w-fit rounded border bg-[#dd3842] px-[34px] py-[15px] leading-[20px] font-semibold text-white hover:bg-white hover:text-[#0c2d57]"
              onClick={closeModal}
            >
              Cancelar
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
};
