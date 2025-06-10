import { IApiResponse, ICrud } from "../types/index.type";
import { IQuestaoReferencia } from "../types/questao-referencia.type";
import { apiService } from "./api.service";

export class QuestaoReferenciaService
  implements ICrud<IQuestaoReferencia, number>
{
  private readonly rootUrl = "/questoes-referencias";

  create(data: Partial<IQuestaoReferencia>) {
    return apiService.post<IApiResponse<number>>(`${this.rootUrl}`, data);
  }

  delete(id: number) {
    return apiService.delete<IApiResponse<number>>(`${this.rootUrl}/${id}`);
  }

  findAll() {
    return apiService.get<IApiResponse<Array<IQuestaoReferencia>>>(
      `${this.rootUrl}`,
    );
  }

  findOne(id: number) {
    return apiService.get<IApiResponse<IQuestaoReferencia>>(
      `${this.rootUrl}/${id}`,
    );
  }

  update(id: number, data: IQuestaoReferencia) {
    return apiService.put<IApiResponse<number>>(`${this.rootUrl}/${id}`, data);
  }
}
