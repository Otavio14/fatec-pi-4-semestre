import { Body, Controller, Get, Logger, Param, Post } from "@nestjs/common";
import { API_RESPONSE_CONSTANTS } from "../../common/constants/api-response.constant";
import { Roles } from "../../common/decorators/role.decorator";
import { IApiResponse } from "../../common/index.interface";
import { ISimuladoAnalytics } from "./simulado-analytics.interface";
import { SimuladoAnalyticsService } from "./simulado-analytics.service";

@Controller("simulado-analytics")
export class SimuladoAnalyticsController {
  constructor(
    private readonly simuladoAnalyticsService: SimuladoAnalyticsService,
  ) {}

  private readonly logger = new Logger(SimuladoAnalyticsController.name, {
    timestamp: true,
  });

  @Post()
  @Roles(["Aluno"])
  async create(
    @Body() data: ISimuladoAnalytics,
  ): Promise<IApiResponse<boolean>> {
    try {
      await this.simuladoAnalyticsService.create(data);

      return {
        ...API_RESPONSE_CONSTANTS.CREATE.SUCCESS,
        mensagem: "Prova cadastrada com sucesso!",
      };
    } catch (error) {
      this.logger.error(error);
      return API_RESPONSE_CONSTANTS.CREATE.ERROR;
    }
  }

  @Get(":id")
  async findOne(
    @Param("id") id: number,
  ): Promise<IApiResponse<ISimuladoAnalytics | object>> {
    try {
      const data = await this.simuladoAnalyticsService.findOne(id);

      return {
        ...API_RESPONSE_CONSTANTS.FIND_ONE.SUCCESS,
        dados: data,
      };
    } catch (error) {
      this.logger.error(error);
      return API_RESPONSE_CONSTANTS.FIND_ONE.ERROR;
    }
  }
}
