import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { API_RESPONSE_CONSTANTS } from "../../common/constants/api-response.constant";
import { IApiResponse, ICrudController } from "../../common/index.interface";
import { IQuestaoReferencia } from "./questao-referencia.interface";
import { QuestaoReferenciaService } from "./questao-referencia.service";

@Controller("questoes-referencias")
export class QuestaoReferenciaController
  implements ICrudController<IQuestaoReferencia, number>
{
  constructor(
    private readonly questaoReferenciaService: QuestaoReferenciaService,
  ) {}

  private readonly logger = new Logger(QuestaoReferenciaController.name, {
    timestamp: true,
  });

  @Post()
  async create(
    @Body() data: IQuestaoReferencia,
  ): Promise<IApiResponse<boolean>> {
    try {
      await this.questaoReferenciaService.create(data);

      return {
        ...API_RESPONSE_CONSTANTS.CREATE.SUCCESS,
        mensagem: "Questão referência cadastrada com sucesso!",
      };
    } catch (error) {
      this.logger.error(error);
      return API_RESPONSE_CONSTANTS.CREATE.ERROR;
    }
  }

  @Delete(":id")
  async delete(@Param("id") id: number): Promise<IApiResponse<boolean>> {
    try {
      await this.questaoReferenciaService.delete(id);

      return {
        ...API_RESPONSE_CONSTANTS.DELETE.SUCCESS,
        mensagem: "Questão referência excluída com sucesso!",
      };
    } catch (error) {
      this.logger.error(error);
      return API_RESPONSE_CONSTANTS.DELETE.ERROR;
    }
  }

  @Get()
  async findAll(): Promise<IApiResponse<Array<IQuestaoReferencia>>> {
    try {
      const data = await this.questaoReferenciaService.findAll();

      return {
        ...API_RESPONSE_CONSTANTS.FIND_ALL.SUCCESS,
        dados: data,
      };
    } catch (error) {
      this.logger.error(error);
      return API_RESPONSE_CONSTANTS.FIND_ALL.ERROR;
    }
  }

  @Get(":id")
  async findOne(
    @Param("id") id: number,
  ): Promise<IApiResponse<IQuestaoReferencia | object>> {
    try {
      const data = await this.questaoReferenciaService.findOne(id);

      return {
        ...API_RESPONSE_CONSTANTS.FIND_ONE.SUCCESS,
        dados: data,
      };
    } catch (error) {
      this.logger.error(error);
      return API_RESPONSE_CONSTANTS.FIND_ONE.ERROR;
    }
  }

  @Put(":id")
  async update(
    @Param("id") id: number,
    @Body() data: IQuestaoReferencia,
  ): Promise<IApiResponse<boolean>> {
    try {
      await this.questaoReferenciaService.update(id, data);

      return {
        ...API_RESPONSE_CONSTANTS.UPDATE.SUCCESS,
        mensagem: "Questão referência alterada com sucesso!",
      };
    } catch (error) {
      this.logger.error(error);
      return API_RESPONSE_CONSTANTS.UPDATE.ERROR;
    }
  }
}
