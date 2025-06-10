import { IApiResponse, ICrud } from "../types/index.type";
import { IQuestaoMateria } from "../types/questao-materia.type";
import { apiService } from "./api.service";

export class QuestaoMateriaService implements ICrud<IQuestaoMateria, number> {
  private readonly rootUrl = "/questoes-materias";

  create(data: Partial<IQuestaoMateria>) {
    return apiService.post<IApiResponse<number>>(`${this.rootUrl}`, data);
  }

  delete(id: number) {
    return apiService.delete<IApiResponse<number>>(`${this.rootUrl}/${id}`);
  }

  findAll() {
    return apiService.get<IApiResponse<Array<IQuestaoMateria>>>(
      `${this.rootUrl}`,
    );
  }

  findOne(id: number) {
    return apiService.get<IApiResponse<IQuestaoMateria>>(
      `${this.rootUrl}/${id}`,
    );
  }

  update(id: number, data: IQuestaoMateria) {
    return apiService.put<IApiResponse<number>>(`${this.rootUrl}/${id}`, data);
  }
}
