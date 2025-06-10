import { IApiResponse, ICrud } from "../types/index.type";
import { IMateria } from "../types/materia.type";
import { apiService } from "./api.service";

export class MateriaService implements ICrud<IMateria, number> {
  private readonly rootUrl = "/materias";

  create(data: Partial<IMateria>) {
    return apiService.post<IApiResponse<number>>(`${this.rootUrl}`, data);
  }

  delete(id: number) {
    return apiService.delete<IApiResponse<number>>(`${this.rootUrl}/${id}`);
  }

  findAll() {
    return apiService.get<IApiResponse<Array<IMateria>>>(`${this.rootUrl}`);
  }

  findOne(id: number) {
    return apiService.get<IApiResponse<IMateria>>(`${this.rootUrl}/${id}`);
  }

  update(id: number, data: IMateria) {
    return apiService.put<IApiResponse<number>>(`${this.rootUrl}/${id}`, data);
  }
}
