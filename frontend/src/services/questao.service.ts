import { IApiResponse, ICrud } from "../types/index.type";
import { IQuestao } from "../types/questao.type";
import { apiService } from "./api.service";

export class QuestaoService implements ICrud<IQuestao, number> {
  private readonly rootUrl = "/questoes";

  create(data: Partial<IQuestao>) {
    return apiService.post<IApiResponse<number>>(`${this.rootUrl}`, data);
  }

  delete(id: number) {
    return apiService.delete<IApiResponse<number>>(`${this.rootUrl}/${id}`);
  }

  findAll() {
    return apiService.get<IApiResponse<Array<IQuestao>>>(`${this.rootUrl}`);
  }

  findOne(id: number) {
    return apiService.get<IApiResponse<IQuestao>>(`${this.rootUrl}/${id}`);
  }

  update(id: number, data: IQuestao) {
    return apiService.put<IApiResponse<number>>(`${this.rootUrl}/${id}`, data);
  }
}
