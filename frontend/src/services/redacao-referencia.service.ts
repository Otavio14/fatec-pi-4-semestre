import { IApiResponse, ICrud } from "../types/index.type";
import { IRedacaoReferencia } from "../types/redacao-referencia.type";
import { apiService } from "./api.service";

export class RedacaoReferenciaService
  implements ICrud<IRedacaoReferencia, number>
{
  private readonly rootUrl = "/redacoes-referencias";

  create(data: Partial<IRedacaoReferencia>) {
    return apiService.post<IApiResponse<number>>(`${this.rootUrl}`, data);
  }

  delete(id: number) {
    return apiService.delete<IApiResponse<number>>(`${this.rootUrl}/${id}`);
  }

  findAll() {
    return apiService.get<IApiResponse<Array<IRedacaoReferencia>>>(
      `${this.rootUrl}`,
    );
  }

  findOne(id: number) {
    return apiService.get<IApiResponse<IRedacaoReferencia>>(
      `${this.rootUrl}/${id}`,
    );
  }

  update(id: number, data: IRedacaoReferencia) {
    return apiService.put<IApiResponse<number>>(`${this.rootUrl}/${id}`, data);
  }
}
