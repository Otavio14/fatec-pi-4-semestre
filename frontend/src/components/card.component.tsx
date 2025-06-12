import { NavLink } from "react-router-dom";

interface CardProps {
  title: string;
  description: string;
  image: string;
  link: string;
}

export const CardComponent = ({
  title,
  description,
  image,
  link,
}: CardProps) => {
  return (
    <div className="flex h-fit w-full flex-col items-center justify-center gap-[1.5rem] rounded-2xl bg-white text-center shadow-lg transition-transform duration-300 hover:scale-105">
      <img src={image} alt={title} className="mt-4 h-24 w-24" />
      <h2 className="text-xl font-bold text-gray-700">{title}</h2>
      <p className="text-sm text-gray-600">{description}</p>
      <NavLink
        to={link}
        className="mb-4 flex h-[30px] w-[100px] items-center justify-center rounded-full bg-blue-500 px-8 font-semibold text-white transition hover:bg-blue-600"
      >
        Iniciar
      </NavLink>
    </div>
  );
};
