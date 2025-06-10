import { IApiResponse, ICrud } from "../types/index.type";
import { ISimuladoQuestao } from "../types/simulado-questao.type";
import { apiService } from "./api.service";

export class SimuladoQuestaoService implements ICrud<ISimuladoQuestao, number> {
  private readonly rootUrl = "/simulados-questoes";

  create(data: Partial<ISimuladoQuestao>) {
    return apiService.post<IApiResponse<number>>(`${this.rootUrl}`, data);
  }

  delete(id: number) {
    return apiService.delete<IApiResponse<number>>(`${this.rootUrl}/${id}`);
  }

  findAll() {
    return apiService.get<IApiResponse<Array<ISimuladoQuestao>>>(
      `${this.rootUrl}`,
    );
  }

  findOne(id: number) {
    return apiService.get<IApiResponse<ISimuladoQuestao>>(
      `${this.rootUrl}/${id}`,
    );
  }

  update(id: number, data: ISimuladoQuestao) {
    return apiService.put<IApiResponse<number>>(`${this.rootUrl}/${id}`, data);
  }
}
