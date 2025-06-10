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
import { ISimulado } from "./simulado.interface";
import { SimuladoService } from "./simulado.service";

@Controller("simulados")
export class SimuladoController implements ICrudController<ISimulado, number> {
  constructor(private readonly simuladoService: SimuladoService) {}

  private readonly logger = new Logger(SimuladoController.name, {
    timestamp: true,
  });

  @Post()
  @Roles(["Aluno"])
  async create(@Body() data: ISimulado): Promise<IApiResponse<boolean>> {
    try {
      await this.simuladoService.create(data);

      return {
        ...API_RESPONSE_CONSTANTS.CREATE.SUCCESS,
        mensagem: "Simulado cadastrado com sucesso!",
      };
    } catch (error) {
      this.logger.error(error);
      return API_RESPONSE_CONSTANTS.CREATE.ERROR;
    }
  }

  @Delete(":id")
  @Roles(["Aluno"])
  async delete(@Param("id") id: number): Promise<IApiResponse<boolean>> {
    try {
      await this.simuladoService.delete(id);

      return {
        ...API_RESPONSE_CONSTANTS.DELETE.SUCCESS,
        mensagem: "Simulado excluído com sucesso!",
      };
    } catch (error) {
      this.logger.error(error);
      return API_RESPONSE_CONSTANTS.DELETE.ERROR;
    }
  }

  @Get()
  @Roles(["Aluno"])
  async findAll(): Promise<IApiResponse<Array<ISimulado>>> {
    try {
      const data = await this.simuladoService.findAll();

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
  @Roles(["Aluno"])
  async findOne(
    @Param("id") id: number,
  ): Promise<IApiResponse<ISimulado | object>> {
    try {
      const data = await this.simuladoService.findOne(id);

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
  @Roles(["Aluno"])
  async update(
    @Param("id") id: number,
    @Body() data: ISimulado,
  ): Promise<IApiResponse<boolean>> {
    try {
      await this.simuladoService.update(id, data);

      return {
        ...API_RESPONSE_CONSTANTS.UPDATE.SUCCESS,
        mensagem: "Simulado alterado com sucesso!",
      };
    } catch (error) {
      this.logger.error(error);
      return API_RESPONSE_CONSTANTS.UPDATE.ERROR;
    }
  }
}
