import { useEffect, useState } from "react";

const questions = [
  {
    theme: "Matemática",
    question: "Qual é o valor de x na equação 2x + 3 = 7?",
    options: ["1", "2", "3", "4"],
    correctAnswer: "2",
  },
  {
    theme: "Geografia",
    question: "Qual é o maior país em extensão territorial do mundo?",
    options: ["Brasil", "Estados Unidos", "Canadá", "Rússia"],
    correctAnswer: "Rússia",
  },
  {
    theme: "Português",
    question:
      "Assinale a alternativa em que todas as palavras estão escritas corretamente:",
    options: [
      "Excessão, enxergar, privilégio",
      "Exceção, enchergar, previlégio",
      "Exceção, enxergar, privilégio",
      "Excessão, enchergar, previlégio",
    ],
    correctAnswer: "Exceção, enxergar, privilégio",
  },
];

export const VestibularCompletoPage = () => {
  const [userAnswers, setUserAnswers] = useState<string[]>(
    Array(questions.length).fill(""),
  );
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const examDuration = 4 * 60 * 60; // 5 minutos em segundos
  const [timeLeft, setTimeLeft] = useState(examDuration);

  // Reduz o tempo a cada segundo
  useEffect(() => {
    if (submitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          handleSubmit(); // Submete automaticamente ao terminar
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [submitted]);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const sec = (seconds % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  };

  const handleSelectOption = (questionIndex: number, option: string) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[questionIndex] = option;
    setUserAnswers(updatedAnswers);
  };

  const handleSubmit = () => {
    let newScore = 0;
    questions.forEach((q, i) => {
      if (userAnswers[i] === q.correctAnswer) newScore++;
    });
    setScore(newScore);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f7fa] to-[#c3cfe2] px-4 py-10">
      <div className="mx-auto flex max-w-4xl flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">
            Simulado Completo - FATEC
          </h1>
          <div className="rounded-full bg-black px-4 py-2 font-mono text-lg text-white shadow-md">
            ⏳ {formatTime(timeLeft)}
          </div>
        </div>

        {questions.map((q, index) => (
          <div
            key={index}
            className="rounded-xl bg-white p-6 shadow-md transition hover:scale-[1.01]"
          >
            <div className="pointer-events-none mb-2 inline-block rounded-full bg-gray-200 px-4 py-1 text-sm font-semibold text-gray-700">
              {q.theme}
            </div>

            <p className="mb-4 text-lg font-medium text-gray-800">
              {index + 1}. {q.question}
            </p>

            <div className="flex flex-col gap-2">
              {q.options.map((option, i) => (
                <label
                  key={i}
                  className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-200 px-4 py-2 hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={option}
                    checked={userAnswers[index] === option}
                    onChange={() => handleSelectOption(index, option)}
                    disabled={submitted}
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        {!submitted ? (
          <button
            onClick={handleSubmit}
            className="mt-6 self-center rounded-full bg-blue-600 px-8 py-3 text-lg font-semibold text-white hover:bg-blue-700"
          >
            Enviar Respostas
          </button>
        ) : (
          <div className="mt-6 text-center text-xl font-semibold text-green-700">
            Você acertou {score} de {questions.length} questões!
          </div>
        )}
      </div>
    </div>
  );
};
