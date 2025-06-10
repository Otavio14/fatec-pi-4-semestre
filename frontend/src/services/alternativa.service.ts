import { IAlternativa } from "../types/alternativa.type";
import { IApiResponse, ICrud } from "../types/index.type";
import { apiService } from "./api.service";

export class AlternativaService implements ICrud<IAlternativa, number> {
  private readonly rootUrl = "/alternativas";

  create(data: Partial<IAlternativa>) {
    return apiService.post<IApiResponse<number>>(`${this.rootUrl}`, data);
  }

  delete(id: number) {
    return apiService.delete<IApiResponse<number>>(`${this.rootUrl}/${id}`);
  }

  findAll() {
    return apiService.get<IApiResponse<Array<IAlternativa>>>(`${this.rootUrl}`);
  }

  findOne(id: number) {
    return apiService.get<IApiResponse<IAlternativa>>(`${this.rootUrl}/${id}`);
  }

  update(id: number, data: IAlternativa) {
    return apiService.put<IApiResponse<number>>(`${this.rootUrl}/${id}`, data);
  }
}
