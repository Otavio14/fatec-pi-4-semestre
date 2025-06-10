import { IApiResponse, ICrud } from "../types/index.type";
import { ISimulado } from "../types/simulado.type";
import { apiService } from "./api.service";

export class SimuladoService implements ICrud<ISimulado, number> {
  private readonly rootUrl = "/simulados";

  create(data: Partial<ISimulado>) {
    return apiService.post<IApiResponse<number>>(`${this.rootUrl}`, data);
  }

  delete(id: number) {
    return apiService.delete<IApiResponse<number>>(`${this.rootUrl}/${id}`);
  }

  findAll() {
    return apiService.get<IApiResponse<Array<ISimulado>>>(`${this.rootUrl}`);
  }

  findOne(id: number) {
    return apiService.get<IApiResponse<ISimulado>>(`${this.rootUrl}/${id}`);
  }

  update(id: number, data: ISimulado) {
    return apiService.put<IApiResponse<number>>(`${this.rootUrl}/${id}`, data);
  }
}
