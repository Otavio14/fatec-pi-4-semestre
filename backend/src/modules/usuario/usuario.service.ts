import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { API_RESPONSE_CONSTANTS } from "../../common/constants/api-response.constant";
import { DatabaseService } from "../../common/database/database.service";
import { HashService } from "../../common/hash/hash.service";
import { ICrudService } from "../../common/index.interface";
import { CreateDto, GetDto } from "./usuario.dto";
import { IUsuario } from "./usuario.interface";

@Injectable()
export class UsuarioService implements ICrudService<IUsuario, number> {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly hashService: HashService,
  ) {}

  async create(data: CreateDto): Promise<boolean> {
    const results = await this.databaseService.executeQuery<IUsuario>({
      sql: "SELECT id FROM usuarios WHERE email = ?;",
      args: [data.email],
    });

    if (results.length > 0 && results[0].id) {
      throw new HttpException(
        {
          ...API_RESPONSE_CONSTANTS.CREATE.WARNING,
          mensagem: "E-mail já cadastrado!",
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const senhaHash = await this.hashService.create(data.senha);

    return this.databaseService.executeInsert({
      sql: "INSERT INTO usuarios (nome, email, senha, perfil) VALUES (?, ?, ?, ?);",
      args: [data.nome, data.email, senhaHash, data.perfil],
    });
  }

  delete(id: number): Promise<boolean> {
    return this.databaseService.executeUpdate({
      sql: "DELETE FROM usuarios WHERE id = ?;",
      args: [id],
    });
  }

  findAll(): Promise<Array<GetDto>> {
    return this.databaseService.executeQuery<GetDto>(
      "SELECT id, nome, email, perfil FROM usuarios;",
    );
  }

  async findOne(id: number): Promise<GetDto | object> {
    const results = await this.databaseService.executeQuery<IUsuario>({
      sql: "SELECT id, nome, email, perfil FROM usuarios WHERE id = ?;",
      args: [id],
    });

    if (results.length > 0) {
      return results[0];
    } else {
      return {};
    }
  }

  async update(id: number, data: IUsuario): Promise<boolean> {
    const results = await this.databaseService.executeQuery<IUsuario>({
      sql: "SELECT id FROM usuarios WHERE email = ? AND id != ?;",
      args: [data.email, id],
    });

    if (results.length > 0 && results[0].id) {
      throw new HttpException(
        {
          ...API_RESPONSE_CONSTANTS.CREATE.WARNING,
          mensagem: "E-mail já cadastrado!",
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const senhaHash = await this.hashService.create(data.senha);

    return this.databaseService.executeUpdate({
      sql: "UPDATE usuarios SET nome = ?, email = ?, senha = ?, perfil = ? WHERE id = ?;",
      args: [data.nome, data.email, senhaHash, data.perfil, id],
    });
  }

  async findOneByEmail(email: IUsuario["email"]): Promise<IUsuario | null> {
    const results = await this.databaseService.executeQuery<IUsuario>({
      sql: "SELECT id, nome, email, perfil, senha FROM usuarios WHERE email = ?;",
      args: [email],
    });

    if (results.length > 0) {
      return results[0];
    } else {
      return null;
    }
  }

  async validSenha(senha: string, senhaHash: string): Promise<boolean> {
    return this.hashService.compare(senha, senhaHash);
  }
}
