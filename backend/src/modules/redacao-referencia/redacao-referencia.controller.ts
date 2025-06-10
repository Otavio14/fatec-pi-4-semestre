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
import { Roles } from "../../common/decorators/role.decorator";
import { IApiResponse, ICrudController } from "../../common/index.interface";
import { IRedacaoReferencia } from "./redacao-referencia.interface";
import { RedacaoReferenciaService } from "./redacao-referencia.service";

@Controller("redacoes-referencias")
export class RedacaoReferenciaController
  implements ICrudController<IRedacaoReferencia, number>
{
  constructor(
    private readonly redacaoReferenciaService: RedacaoReferenciaService,
  ) {}

  private readonly logger = new Logger(RedacaoReferenciaController.name, {
    timestamp: true,
  });

  @Post()
  @Roles(["Administrador"])
  async create(
    @Body() data: IRedacaoReferencia,
  ): Promise<IApiResponse<boolean>> {
    try {
      await this.redacaoReferenciaService.create(data);

      return {
        ...API_RESPONSE_CONSTANTS.CREATE.SUCCESS,
        mensagem: "Redação referência cadastrada com sucesso!",
      };
    } catch (error) {
      this.logger.error(error);
      return API_RESPONSE_CONSTANTS.CREATE.ERROR;
    }
  }

  @Delete(":id")
  @Roles(["Administrador"])
  async delete(@Param("id") id: number): Promise<IApiResponse<boolean>> {
    try {
      await this.redacaoReferenciaService.delete(id);

      return {
        ...API_RESPONSE_CONSTANTS.DELETE.SUCCESS,
        mensagem: "Redação referência excluída com sucesso!",
      };
    } catch (error) {
      this.logger.error(error);
      return API_RESPONSE_CONSTANTS.DELETE.ERROR;
    }
  }

  @Get()
  async findAll(): Promise<IApiResponse<Array<IRedacaoReferencia>>> {
    try {
      const data = await this.redacaoReferenciaService.findAll();

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
  ): Promise<IApiResponse<IRedacaoReferencia | object>> {
    try {
      const data = await this.redacaoReferenciaService.findOne(id);

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
  @Roles(["Administrador"])
  async update(
    @Param("id") id: number,
    @Body() data: IRedacaoReferencia,
  ): Promise<IApiResponse<boolean>> {
    try {
      await this.redacaoReferenciaService.update(id, data);

      return {
        ...API_RESPONSE_CONSTANTS.UPDATE.SUCCESS,
        mensagem: "Redação referência alterada com sucesso!",
      };
    } catch (error) {
      this.logger.error(error);
      return API_RESPONSE_CONSTANTS.UPDATE.ERROR;
    }
  }
}
