import { ArticleIcon, PencilIcon, TrashIcon } from "@phosphor-icons/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { InputComponent } from "../components/input.component";
import { SelectComponent } from "../components/select.component";
import { errorSwal } from "../services/api.service";
import { ProvaService } from "../services/prova.service";
import { RedacaoService } from "../services/redacao.service";
import { ReferenciaService } from "../services/referencia.service";
import { VestibularService } from "../services/vestibular.service";
import { Swal, Toast } from "../shared/swal.shared";
import { IProva } from "../types/prova.type";
import { IRedacao } from "../types/redacao.type";
import { IReferencia } from "../types/referencia.type";
import { IVestibular } from "../types/vestibular.type";

export const ProvaPage = () => {
  const [provas, setProvas] = useState<Array<IProva>>([]);
  const [vestibulares, setVestibulares] = useState<Array<IVestibular>>([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalRedacao, setShowModalRedacao] = useState(false);
  const [reload, setReload] = useState(false);
  const [id, setId] = useState(0);
  const [form, setForm] = useState<IProva>({
    id_vestibular: 0,
    id: 0,
    instrucoes: "",
    nome: "",
    url_arquivo: "",
  });
  const [idVestibular, setIdVestibular] = useState(0);

  const provaService = useMemo(() => new ProvaService(), []);
  const vestibularService = useMemo(() => new VestibularService(), []);
  const DialogRef = useRef<HTMLDialogElement>(null);

  const openModal = (id: number) => {
    setId(id);

    provaService
      .findOne(id)
      .then(({ data: { dados } }) => {
        setShowModal(true);
        setForm(dados);
      })
      .catch(errorSwal);
  };

  const openModalRedacao = (id: number) => {
    setId(id);
    setShowModalRedacao(true);
  };

  const deletar = (id: number) => {
    Swal.fire({
      title: "Deseja deletar esta prova?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sim",
      cancelButtonText: "Não",
    }).then(({ isConfirmed }) => {
      if (isConfirmed)
        provaService
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
    setForm({
      id_vestibular: 0,
      id: 0,
      instrucoes: "",
      nome: "",
      url_arquivo: "",
    });
  };

  const salvar = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (id) {
      provaService
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
      provaService
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

  useEffect(() => {
    setForm((prevData) => ({
      ...prevData,
      id_vestibular: idVestibular,
    }));

    if (idVestibular)
      provaService
        .findAllByVestibularId(idVestibular)
        .then(({ data: { dados } }) => {
          setProvas(dados);
        })
        .catch(errorSwal);
    else setProvas([]);
  }, [provaService, reload, idVestibular]);

  return (
    <div className="flex h-full w-full flex-col p-4">
      <header className="flex w-full items-center gap-4">
        <h1 className="w-full flex-1 p-4 text-3xl font-bold">Provas</h1>
        <SelectComponent
          value={idVestibular}
          onChange={(e) => setIdVestibular(Number(e.target.value))}
        >
          <option value={0}>Selecione um vestibular</option>
          {vestibulares.map((vestibular) => (
            <option key={vestibular.id} value={vestibular.id}>
              {vestibular.ano} - {vestibular.semestre}º Semestre
            </option>
          ))}
        </SelectComponent>
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
              <th></th>
            </tr>
          </thead>
          <tbody>
            {provas.map((prova, index) => (
              <tr key={index}>
                <td>{prova.nome}</td>
                <td>
                  <button onClick={() => openModalRedacao(prova?.id)}>
                    <ArticleIcon size={20} />
                  </button>
                </td>
                <td>
                  <button onClick={() => openModal(prova?.id)}>
                    <PencilIcon size={20} />
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => {
                      deletar(prova?.id);
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
            {id ? "Editar" : "Cadastrar"} Prova
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
      <RedacaoModal
        ShowModal={showModalRedacao}
        SetShowModal={setShowModalRedacao}
        IdProva={id}
      />
    </div>
  );
};

interface IRedacaoModalProps {
  IdProva: number;
  ShowModal: boolean;
  SetShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const RedacaoModal = ({
  IdProva,
  ShowModal,
  SetShowModal,
}: IRedacaoModalProps) => {
  const [redacao, setRedacao] = useState<IRedacao>({
    id_prova: 0,
    id: 0,
    instrucoes: "",
  });
  const [referencias, setReferencias] = useState<Array<IReferencia>>([]);
  const [reload, setReload] = useState(false);
  const [formRedacao, setFormRedacao] = useState<IRedacao>({
    id_prova: 0,
    id: 0,
    instrucoes: "",
  });
  const [formReferencia, setFormReferencia] = useState<IReferencia>({
    id: 0,
    informacao_acesso: "",
    legenda: "",
    texto: "",
    titulo: "",
    url_imagem: "",
  });

  const redacaoService = useMemo(() => new RedacaoService(), []);
  const referenciaService = useMemo(() => new ReferenciaService(), []);
  const DialogRef = useRef<HTMLDialogElement>(null);

  const closeModal = () => {
    SetShowModal(false);
    // setForm({ nome: "", id: 0 });
  };

  const salvar = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // if (id) {
    //   cursoService
    //     .update(id, form)
    //     .then(({ data: { icone, mensagem, titulo } }) => {
    //       closeModal();
    //       setReload((r) => !r);
    //       Toast.fire({
    //         title: titulo,
    //         text: mensagem,
    //         icon: icone,
    //       });
    //     });
    // } else {
    //   cursoService
    //     .create(form)
    //     .then(({ data: { icone, mensagem, titulo } }) => {
    //       closeModal();
    //       setReload((r) => !r);
    //       Toast.fire({
    //         title: titulo,
    //         text: mensagem,
    //         icon: icone,
    //       });
    //     });
    // }
  };

  useEffect(() => {
    if (ShowModal && !DialogRef?.current?.hasAttribute("open"))
      DialogRef?.current?.showModal();
    else DialogRef?.current?.close();
  }, [ShowModal]);

  useEffect(() => {
    redacaoService
      .findOneByProvaId(IdProva)
      .then(({ data: { dados } }) => {
        setFormRedacao(dados);
      })
      .catch(errorSwal);
  }, [ShowModal, IdProva, redacaoService]);

  useEffect(() => {
    referenciaService
      .findOneByProvaId(IdProva)
      .then(({ data: { dados } }) => {
        setFormRedacao(dados);
      })
      .catch(errorSwal);
  }, [ShowModal, IdProva, referenciaService]);

  return (
    <dialog
      ref={DialogRef}
      onCancel={closeModal}
      className={`fixed top-0 left-0 z-[13] h-screen w-screen flex-col items-center overflow-y-auto border-none bg-transparent p-4 backdrop:bg-black/50 ${
        ShowModal ? "flex" : ""
      }`}
    >
      <form
        onSubmit={salvar}
        className="w-fir z-[15] mx-0 my-auto flex h-fit flex-col items-center rounded-lg bg-[#f8f9ff] p-2 sm:p-12"
      >
        <h1 className="text-center text-[38px] leading-[140%] font-semibold">
          Redação
        </h1>
        <InputComponent
          placeholder="Instruções..."
          Label={"Instruções"}
          name="instrucoes"
          onChange={({ target: { name, value } }) => {
            setFormRedacao((prevData) => ({
              ...prevData,
              [name]: value,
            }));
          }}
          value={formRedacao.instrucoes}
          required
          Textarea
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
  );
};

const QuestaoModal = () => {
  return <div></div>;
};

const ReferenciaModal = () => {
  return <div></div>;
};
