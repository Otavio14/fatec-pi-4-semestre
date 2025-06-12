import { PencilIcon, TrashIcon } from "@phosphor-icons/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { InputComponent } from "../components/input.component";
import { SelectComponent } from "../components/select.component";
import { errorSwal } from "../services/api.service";
import { VestibularService } from "../services/vestibular.service";
import { Swal, Toast } from "../shared/swal.shared";
import { IVestibular } from "../types/vestibular.type";

export const VestibularPage = () => {
  const [vestibulares, setVestibulares] = useState<Array<IVestibular>>([]);
  const [showModal, setShowModal] = useState(false);
  const [reload, setReload] = useState(false);
  const [id, setId] = useState(0);
  const [form, setForm] = useState<IVestibular>({
    ano: new Date().getFullYear(),
    id: 0,
    semestre: 0,
  });

  const vestibularService = useMemo(() => new VestibularService(), []);
  const DialogRef = useRef<HTMLDialogElement>(null);

  const openModal = (id: number) => {
    setId(id);

    vestibularService
      .findOne(id)
      .then(({ data: { dados } }) => {
        setShowModal(true);
        setForm(dados);
      })
      .catch(errorSwal);
  };

  const deletar = (id: number) => {
    Swal.fire({
      title: "Deseja deletar este vestibular?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sim",
      cancelButtonText: "Não",
    }).then(({ isConfirmed }) => {
      if (isConfirmed)
        vestibularService
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
    setForm({ ano: new Date().getFullYear(), id: 0, semestre: 0 });
  };

  const salvar = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (id) {
      vestibularService
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
      vestibularService
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
    vestibularService
      .findAll()
      .then(({ data: { dados } }) => {
        setVestibulares(dados);
      })
      .catch(errorSwal);
  }, [vestibularService, reload]);

  return (
    <div className="flex h-full w-full flex-col p-4">
      <header className="flex w-full items-center gap-4">
        <h1 className="w-full flex-1 p-4 text-3xl font-bold">Vestibulares</h1>
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
      <div className="flex max-h-[80vh] flex-col overflow-scroll rounded p-4">
        <table>
          <thead>
            <tr>
              <th>Ano</th>
              <th>Semestre</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {vestibulares.map((vestibular, index) => (
              <tr key={index}>
                <td>{vestibular.ano}</td>
                <td>{vestibular.semestre}</td>
                <td>
                  <button onClick={() => openModal(vestibular?.id)}>
                    <PencilIcon size={20} />
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => {
                      deletar(vestibular?.id);
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
            {id ? "Editar" : "Cadastrar"} Vestibular
          </h1>
          <InputComponent
            placeholder="Ano"
            type="number"
            min="1900"
            max="2099"
            step="1"
            Label={"Ano"}
            name="ano"
            onChange={({ target: { name, value } }) => {
              setForm((prevData) => ({
                ...prevData,
                [name]: value,
              }));
            }}
            value={form.ano}
            required
          />
          <SelectComponent
            Label="Semestre"
            name="semestre"
            onChange={({ target: { name, value } }) => {
              setForm((prevData) => ({
                ...prevData,
                [name]: value,
              }));
            }}
            value={form.semestre}
            required
          >
            <option value={0} disabled>
              Selecione o semestre
            </option>
            <option value={1}>1º Semestre</option>
            <option value={2}>2º Semestre</option>
          </SelectComponent>
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
