import { ICursoMateria } from "../types/curso-materia.type";
import { IApiResponse, ICrud } from "../types/index.type";
import { apiService } from "./api.service";

export class CursoMateriaService implements ICrud<ICursoMateria, number> {
  private readonly rootUrl = "/cursos-materias";

  create(data: Partial<ICursoMateria>) {
    return apiService.post<IApiResponse<number>>(`${this.rootUrl}`, data);
  }

  delete(id: number) {
    return apiService.delete<IApiResponse<number>>(`${this.rootUrl}/${id}`);
  }

  findAll() {
    return apiService.get<IApiResponse<Array<ICursoMateria>>>(
      `${this.rootUrl}`,
    );
  }

  findOne(id: number) {
    return apiService.get<IApiResponse<ICursoMateria>>(`${this.rootUrl}/${id}`);
  }

  update(id: number, data: ICursoMateria) {
    return apiService.put<IApiResponse<number>>(`${this.rootUrl}/${id}`, data);
  }
}
