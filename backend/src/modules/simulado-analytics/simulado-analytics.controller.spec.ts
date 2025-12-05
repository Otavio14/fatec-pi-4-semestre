import { Test } from "@nestjs/testing";
import { DatabaseModule } from "../../common/database/database.module";
import { SimuladoAnalyticsController } from "./simulado-analytics.controller";
import { SimuladoAnalyticsService } from "./simulado-analytics.service";

describe("Prova Controller", () => {
  let provaController: SimuladoAnalyticsController;
  let provaService: SimuladoAnalyticsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [SimuladoAnalyticsController],
      providers: [SimuladoAnalyticsService, DatabaseModule],
    }).compile();

    provaService = moduleRef.get<SimuladoAnalyticsService>(SimuladoAnalyticsService);
    provaController = moduleRef.get<SimuladoAnalyticsController>(
      SimuladoAnalyticsController,
    );
  });

  describe("findAll", () => {
    it("teste generico", () => {
      expect(1).toBe(1);
    });
  });
});
