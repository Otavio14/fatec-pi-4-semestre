import { Test } from "@nestjs/testing";
import { DatabaseModule } from "../../common/database/database.module";
import { QuestaoController } from "./questao.controller";
import { QuestaoService } from "./questao.service";
import { API_RESPONSE_CONSTANTS } from "src/common/constants/api-response.constant";

describe("Questao Controller", () => {
  let questaoController: QuestaoController;
  let questaoService: QuestaoService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [QuestaoController],
      providers: [QuestaoService, DatabaseModule],
    }).compile();

    questaoService = moduleRef.get<QuestaoService>(QuestaoService);
    questaoController = moduleRef.get<QuestaoController>(
      QuestaoController,
    );
  });

  describe("findAll", () => {
    it("teste generico", () => {
      expect(1).toBe(1);
    });
  });

  describe("createMultiple", () => {
    it("should create multiple questions", async () => {
      const mockData = {
        id_prova: 1,
        questoes: [
          { numero: 1, texto: "Questão 1" },
          { numero: 2, texto: "Questão 2" },
        ],
      };

      jest.spyOn(questaoService, 'createMultiple').mockResolvedValue(true);

      const result = await questaoController.createMultiple(mockData);
      expect(result).toEqual({
        ...API_RESPONSE_CONSTANTS.CREATE.SUCCESS,
        mensagem: "Questões cadastradas com sucesso!",
      });
      expect(questaoService.createMultiple).toHaveBeenCalledWith(mockData);
    });

    it("should handle errors when creating multiple questions", async () => {
      const mockData = {
        id_prova: 1,
        questoes: [
          { numero: 1, texto: "Questão 1" },
        ],
      };

      jest.spyOn(questaoService, 'createMultiple').mockRejectedValue(new Error('Database error'));

      const result = await questaoController.createMultiple(mockData);
      expect(result).toEqual(API_RESPONSE_CONSTANTS.CREATE.ERROR);
    });
  });
});
