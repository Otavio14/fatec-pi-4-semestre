import { Injectable, Logger } from "@nestjs/common";
import OpenAI from "openai";

const PROMPT_BASE = `Você é um corretor experiente de redações para vestibulares do ENEM (Exame Nacional do Ensino Médio). Corrija o texto abaixo considerando os seguintes critérios:

1. Adequação ao tema proposto.
2. Organização e estrutura do texto (introdução, desenvolvimento e conclusão).
3. Coerência e coesão textual.
4. Uso correto da gramática, ortografia e pontuação.
5. Clareza e objetividade na argumentação.
6. Uso adequado do repertório sociocultural (se aplicável).
7. Apresentação de uma proposta de intervenção social, quando pertinente.

COMPETENCIAS OFICIAIS OBRIGATÓRIAS

Competência 1:Demonstrar domínio da modalidade escrita formal da língua portuguesa.
Competência 2:Compreender a proposta de redação e aplicar conceitos das várias áreas de
conhecimento para desenvolver o tema, dentro dos limites estruturais do texto
dissertativo-argumentativo em prosa.
Competência 3:Selecionar, relacionar, organizar e interpretar informações, fatos, opiniões e
argumentos em defesa de um ponto de vista.
Competência 4:Demonstrar conhecimento dos mecanismos linguísticos necessários para a
construção da argumentação.
Competência 5:Elaborar proposta de intervenção para o problema abordado que respeite os
direitos humanos.


Ao corrigir, faça uma análise detalhada dos pontos fortes e fracos do texto, destacando erros e acertos em cada critério.
Lembre-se de que toda argumentação retida deve ser análisada conforme as bases das estratégias argumentativas (Alusão Histórica, Comprovação, Raciocínio Lógico, Citação, Comparação e Exemplificação). Portanto, não se avalia tão somente o que foi dito, mas também a estrutura argumentativa ao entorno de toda a tese desenvolvida.
Por fim, dê uma nota final de 0 a 1000, considerando todos os aspectos acima.

---

Redação:
`;

@Injectable()
export class DeepseekService {
  private openai: OpenAI;
  private readonly logger = new Logger(DeepseekService.name);

  constructor() {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      this.logger.error("DEEPSEEK_API_KEY não está definida nas variáveis de ambiente!");
      throw new Error("A variável de ambiente DEEPSEEK_API_KEY não está definida.");
    }

    this.logger.log("Inicializando cliente OpenAI para Deepseek...");
    this.openai = new OpenAI({
      apiKey,
      baseURL: "https://api.deepseek.com/v1",
    });
  }

  async corrigirRedacao(texto: string): Promise<string> {
    try {
      this.logger.log(`Iniciando correção de redação. Tamanho do texto: ${texto.length} caracteres`);
      
      const prompt = PROMPT_BASE + texto + "\n\nForneça a correção detalhada e a nota final, com justificativas claras. IMPORTANTE: A resposta deve ser apenas em texto simples, SEM markdown, SEM formatação de nenhum tipo, frases corridas, SEM bullets, emojis, negrito ou itálico. NÃO utilize formatação visual. Somente texto puro.";

      this.logger.log("Enviando requisição para API do Deepseek...");
      const response = await this.openai.chat.completions.create({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: "Você é um assistente que corrige redações." },
          { role: "user", content: prompt },
        ],
      });

      const feedback = response.choices[0]?.message?.content ?? "Erro: resposta vazia da API.";
      this.logger.log(`Feedback recebido com sucesso. Tamanho: ${feedback.length} caracteres`);
      
      return feedback;
    } catch (error: any) {
      this.logger.error("Erro ao chamar API do Deepseek:", error);
      this.logger.error("Detalhes do erro:", {
        code: error.code,
        status: error.status,
        message: error.message,
        type: error.constructor.name,
      });

      if (error.code === "ECONNREFUSED" || error.message?.includes("Connection") || error.message?.includes("connect")) {
        const apiKey = process.env.DEEPSEEK_API_KEY;
        if (!apiKey) {
          throw new Error("DEEPSEEK_API_KEY não está configurada. Configure a variável de ambiente DEEPSEEK_API_KEY no arquivo .env");
        }
        throw new Error("Erro de conexão com a API do Deepseek. Verifique sua conexão com a internet e se a chave de API está correta.");
      }
      if (error.status === 401 || error.message?.includes("authentication") || error.message?.includes("Invalid API key")) {
        throw new Error("Erro de autenticação: A chave de API do Deepseek é inválida ou não está configurada.");
      }
      if (error.status === 429) {
        throw new Error("Limite de requisições excedido. Tente novamente mais tarde.");
      }
      throw new Error(`Erro ao chamar API do Deepseek: ${error.message || "Erro desconhecido"}`);
    }
  }
}

