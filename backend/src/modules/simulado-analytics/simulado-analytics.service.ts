import { Injectable } from "@nestjs/common";
import { MongodbService } from "../../common/mongodb/mongodb.service";
import { ISimuladoAnalytics } from "./simulado-analytics.interface";

@Injectable()
export class SimuladoAnalyticsService {
  constructor(private readonly mongodbService: MongodbService) {}

  // Insert into 'test_sessions' collection using MongoClient
  create(data: ISimuladoAnalytics): Promise<boolean> {
    return this.mongodbService.executeInsert(data);
  }

  // Aggregate: avg time per question, success rate, most changed answers
  async findOne(id_simulado: number): Promise<ISimuladoAnalytics | object> {
    const results = await this.mongodbService.executeQuery<ISimuladoAnalytics>(
      { id_simulado: id_simulado },
      {},
    );

    if (results.length > 0) {
      return results[0];
    } else {
      return {};
    }
  }

  // Track user improvement over time
  async findOneHistoricoPerformanceUsuario(
    id_usuario: number,
  ): Promise<ISimuladoAnalytics | object> {
    const results = await this.mongodbService.executeQuery<ISimuladoAnalytics>(
      { id_usuario: id_usuario },
      {},
    );

    if (results.length > 0) {
      return results[0];
    } else {
      return {};
    }
  }

  // Aggregate: success rate, avg time, change frequency for this question
  async findOneMetricasDificuldadeQuestao(
    id: number,
  ): Promise<ISimuladoAnalytics | object> {
    const results = await this.mongodbService.executeQuery<ISimuladoAnalytics>(
      { "questoes.id_questao": id },
      {},
    );

    if (results.length > 0) {
      return results[0];
    } else {
      return {};
    }
  }
}
