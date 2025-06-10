import { IApiResponse, ICrud } from "../types/index.type";
import { ISimuladoRedacao } from "../types/simulado-redacao.type";
import { apiService } from "./api.service";

export class SimuladoRedacaoService implements ICrud<ISimuladoRedacao, number> {
  private readonly rootUrl = "/simulados-redacoes";

  create(data: Partial<ISimuladoRedacao>) {
    return apiService.post<IApiResponse<number>>(`${this.rootUrl}`, data);
  }

  delete(id: number) {
    return apiService.delete<IApiResponse<number>>(`${this.rootUrl}/${id}`);
  }

  findAll() {
    return apiService.get<IApiResponse<Array<ISimuladoRedacao>>>(
      `${this.rootUrl}`,
    );
  }

  findOne(id: number) {
    return apiService.get<IApiResponse<ISimuladoRedacao>>(
      `${this.rootUrl}/${id}`,
    );
  }

  update(id: number, data: ISimuladoRedacao) {
    return apiService.put<IApiResponse<number>>(`${this.rootUrl}/${id}`, data);
  }
}
