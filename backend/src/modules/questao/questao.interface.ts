export interface IQuestao {
  id_prova: number;
  id: number;
  numero: number;
  texto: string;
}

export interface IMultiplasQuestoes {
  id_prova: number;
  questoes: Array<{
    numero: number;
    texto: string;
  }>;
}