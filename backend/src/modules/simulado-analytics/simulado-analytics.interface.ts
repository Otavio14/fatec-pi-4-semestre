export interface ISimuladoAnalytics {
  id_usuario: number;
  id_simulado: number;
  comecou_em: Date;
  completou_em?: Date;
  duracao_total?: number;
  info_dispositivo?: any;
  questoes: Array<IQuestaoAnalytics>;
  // navigation?: INavigationEvent[];
}

export interface IQuestaoAnalytics {
  id_questao: number;
  visualizada_em: Date;
  respondida_em?: Date;
  tempo_gasto: number;
  id_alternativa_selecionada?: number;
  esta_correta: boolean;
  // answerChanges: IAnswerChange[];
  quantidade_de_alteracoes: number;
  pulada: boolean;
  revisitada: boolean;
}

export interface ISA {
  sessionId: "uuid-v4-generated"; // unique session identifier
  usuarioId: "user-id";
  simuladoId: "test-id";
  startedAt: "2025-11-30T10:00:00Z"; // ISO timestamp
  completedAt: "2025-11-30T10:45:00Z";
  totalDuration: 2700; // seconds
  deviceInfo: {
    // optional: device/browser context
    platform: "android";
    version: "13";
  };
  questions: [
    {
      questaoId: "question-id";
      viewedAt: "2025-11-30T10:00:00Z"; // when question was displayed
      answeredAt: "2025-11-30T10:02:15Z"; // when answer was submitted
      timeSpent: 135; // seconds on this question
      selectedAlternativa: "alternative-id"; // final answer
      isCorrect: true;
      answerChanges: [
        // track all changes
        {
          alternativaId: "alt-1";
          timestamp: "2025-11-30T10:01:00Z";
        },
        {
          alternativaId: "alt-3";
          timestamp: "2025-11-30T10:02:15Z";
        },
      ];
      changeCount: 1; // how many times answer was changed
      skipped: false; // if user skipped initially
      revisited: false; // if user came back to this question
    },
  ];
  navigation: [
    // optional: track all navigation events
    {
      action: "next|previous|jump";
      fromQuestion: 1;
      toQuestion: 2;
      timestamp: "2025-11-30T10:02:15Z";
    },
  ];
}
