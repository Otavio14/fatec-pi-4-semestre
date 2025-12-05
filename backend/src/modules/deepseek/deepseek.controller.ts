import { Body, Controller, Logger, Post } from "@nestjs/common";
import { API_RESPONSE_CONSTANTS } from "../../common/constants/api-response.constant";
import { IApiResponse } from "../../common/index.interface";
import { CorrigirRedacaoDto } from "./deepseek.dto";
import { DeepseekService } from "./deepseek.service";

@Controller("deepseek")
export class DeepseekController {
  constructor(private readonly deepseekService: DeepseekService) {}

  private readonly logger = new Logger(DeepseekController.name, {
    timestamp: true,
  });

  @Post("corrigir")
  async corrigir(@Body() dto: CorrigirRedacaoDto): Promise<IApiResponse<string>> {
    try {
      this.logger.log(`Recebida requisição para corrigir redação. Texto length: ${dto?.texto?.length || 0}`);
      
      if (!dto || !dto.texto || !dto.texto.trim()) {
        this.logger.warn("Texto da redação não fornecido ou vazio");
        return {
          codigo: 400,
          dados: "",
          icone: "warning",
          mensagem: "O texto da redação é obrigatório!",
          titulo: "Aviso!",
          valido: true,
        };
      }

      this.logger.log("Chamando DeepseekService para corrigir redação...");
      const feedback = await this.deepseekService.corrigirRedacao(dto.texto);
      this.logger.log(`Feedback recebido com sucesso. Length: ${feedback?.length || 0}`);

      return {
        codigo: 200,
        dados: feedback,
        icone: "success",
        mensagem: "Correção realizada com sucesso!",
        titulo: "Sucesso!",
        valido: true,
      };
    } catch (error) {
      this.logger.error("Erro ao corrigir redação:", error);
      this.logger.error("Stack trace:", error instanceof Error ? error.stack : "N/A");
      return {
        codigo: 500,
        dados: "",
        icone: "error",
        mensagem: error instanceof Error ? `Erro: ${error.message}` : "Erro ao corrigir a redação. Tente novamente mais tarde.",
        titulo: "Erro!",
        valido: false,
      };
    }
  }
}

