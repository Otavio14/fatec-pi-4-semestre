import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import StudyingContainerImage from "../assets/StudyingContainerImg.png";
import { CardComponent } from "../components/card.component";

const slogans = [
  "Prepare-se para a FATEC com eficiência!",
  "Treine com questões reais e temas atualizados.",
  "O seu futuro começa aqui!",
];

const cards = [
  {
    title: "Questões Alternativas",
    description:
      "Treine com questões de múltipla escolha de vestibulares passados.",
    image: "https://cdn-icons-png.flaticon.com/512/3135/3135765.png",
    link: "/questoes-alternativas",
  },
  {
    title: "Temas de Redação",
    description:
      "Explore temas anteriores e escreva redações como nos vestibulares.",
    image: "https://cdn-icons-png.flaticon.com/512/1055/1055644.png",
    link: "/temas-redacao",
  },
  {
    title: "Vestibular Completo",
    description:
      "Simule a ultima prova completa até o momento com tempo cronometrado",
    image: "https://cdn-icons-png.flaticon.com/512/1048/1048953.png",
    link: "/vestibular-completo",
  },
];

export const HomePage = () => {
  const [sloganIndex, setSloganIndex] = useState(2);

  useEffect(() => {
    const interval = setInterval(() => {
      setSloganIndex((prev) => (prev + 1) % slogans.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center gap-[4rem] overflow-x-hidden bg-gradient-to-b from-[#f5f7fa] to-[#c3cfe2]">
      <div className="relative h-[300px] w-screen">
        <img
          src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"
          alt="Estudante focando nos estudos"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 px-4">
          <h1 className="bg-gradient-to-r from-red-400 via-gray-400 to-white bg-clip-text text-center text-3xl leading-relaxed font-extrabold text-transparent drop-shadow-2xl transition-all duration-700 ease-in-out md:text-5xl">
            {slogans[sloganIndex]}
          </h1>
        </div>
      </div>

      <div className="flex w-full max-w-6xl flex-row gap-4 px-4">
        {cards.map((card, index) => (
          <CardComponent
            key={index}
            title={card.title}
            description={card.description}
            image={card.image}
            link={card.link}
          />
        ))}
      </div>

      <div className="mb-8 flex w-full max-w-6xl flex-col gap-8 overflow-hidden rounded-2xl bg-white px-6 py-10 shadow-lg transition-transform duration-300 hover:scale-105">
        {/* Título no topo */}
        <h2 className="text-center text-4xl leading-tight font-extrabold text-gray-800 md:text-5xl">
          Desafie-se com Provas Anteriores
        </h2>

        {/* Conteúdo principal: imagem + texto */}
        <div className="flex w-[80%] flex-col items-center justify-center gap-8 self-center md:flex-row">
          {/* Imagem à esquerda */}
          <div className="flex w-full items-center justify-center md:w-1/2">
            <img
              src={StudyingContainerImage}
              alt="Estudando para provas"
              className="w-[80%] object-contain md:w-[70%]"
            />
          </div>

          {/* Texto e botão à direita */}
          <div className="flex w-full flex-col items-center justify-center gap-6 px-4 md:w-1/2 md:items-start">
            <p className="text-center text-lg text-gray-600 md:text-left">
              Teste seus conhecimentos resolvendo questões reais dos
              vestibulares anteriores da FATEC. Melhore seu desempenho e esteja
              preparado para conquistar sua vaga!
            </p>
            <NavLink
              to="/provas-anteriores"
              className="inline-flex rounded-full bg-blue-500 px-8 py-3 text-lg font-semibold text-white transition hover:bg-blue-600"
            >
              Ver Provas
            </NavLink>
          </div>
        </div>
      </div>
      <a
        href="https://vestibular.fatec.sp.gov.br/home/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full justify-center"
      >
        <div
          className="relative mb-8 flex w-full max-w-6xl cursor-pointer flex-col gap-8 overflow-hidden rounded-2xl bg-white bg-cover bg-center px-6 py-10 text-white shadow-lg transition-transform duration-300 hover:scale-105"
          style={{
            backgroundImage:
              "url('https://imgs.search.brave.com/PYOLl9kC5RsVHGDeI7NrExDz0BArRksbLQLlc_pm-dM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly92ZXN0/aWJ1bGFyZXMuZXN0/cmF0ZWdpYS5jb20v/cG9ydGFsL3dwLWNv/bnRlbnQvdXBsb2Fk/cy8yMDIwLzA4L3Zl/c3RpYnVsYXItZmF0/ZWMuanBn')",
          }}
        >
          {/* Overlay para escurecer a imagem */}
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.5)]"></div>

          {/* Conteúdo sobreposto à imagem */}
          <div className="relative z-10">
            <h2 className="text-center text-4xl leading-tight font-extrabold text-white md:text-5xl">
              Inscreva-se no Vestibular da Fatec!
            </h2>
            <p className="mx-auto text-center text-lg text-white">
              Utilize todo seu treinamento na prática por meio do processo
              seletivo!
            </p>
          </div>
        </div>
      </a>
    </div>
  );
};
