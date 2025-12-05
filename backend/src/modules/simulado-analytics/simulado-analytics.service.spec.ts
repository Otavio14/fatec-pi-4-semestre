import { Test } from "@nestjs/testing";
import { DatabaseModule } from "../../common/database/database.module";
import { SimuladoAnalyticsService } from "./simulado-analytics.service";

describe("Prova Service", () => {
  let provaService: SimuladoAnalyticsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [SimuladoAnalyticsService],
      imports: [DatabaseModule],
    }).compile();

    provaService = moduleRef.get<SimuladoAnalyticsService>(SimuladoAnalyticsService);
  });

  describe("findAll", () => {
    it("teste generico", () => {
      expect(1).toBe(1);
    });
  });
});
