import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { AuthService } from "../../common/auth/auth.service";
import { API_RESPONSE_CONSTANTS } from "../../common/constants/api-response.constant";
import { Roles } from "../../common/decorators/role.decorator";
import { IApiResponse, ICrudController } from "../../common/index.interface";
import { CreateDto, GetDto, LoginDto } from "./usuario.dto";
import { IUsuario } from "./usuario.interface";
import { UsuarioService } from "./usuario.service";

@Controller("usuarios")
export class UsuarioController implements ICrudController<IUsuario, number> {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly authService: AuthService,
  ) {}

  private readonly logger = new Logger(UsuarioController.name, {
    timestamp: true,
  });

  @Post()
  async create(@Body() data: CreateDto): Promise<IApiResponse<boolean>> {
    try {
      if (!data.perfil) data.perfil = "Aluno";

      await this.usuarioService.create(data);

      return {
        ...API_RESPONSE_CONSTANTS.CREATE.SUCCESS,
        mensagem: "Usuário cadastrado com sucesso!",
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      this.logger.error(error);
      return API_RESPONSE_CONSTANTS.CREATE.ERROR;
    }
  }

  @Delete(":id")
  @Roles(["Administrador"])
  async delete(@Param("id") id: number): Promise<IApiResponse<boolean>> {
    try {
      await this.usuarioService.delete(id);

      return {
        ...API_RESPONSE_CONSTANTS.DELETE.SUCCESS,
        mensagem: "Usuário excluído com sucesso!",
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      this.logger.error(error);
      return API_RESPONSE_CONSTANTS.DELETE.ERROR;
    }
  }

  @Get()
  // @Roles(["Administrador"])
  async findAll(): Promise<IApiResponse<Array<GetDto>>> {
    try {
      const data = await this.usuarioService.findAll();

      return {
        ...API_RESPONSE_CONSTANTS.FIND_ALL.SUCCESS,
        dados: data,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      this.logger.error(error);
      return API_RESPONSE_CONSTANTS.FIND_ALL.ERROR;
    }
  }

  @Get(":id")
  @Roles(["Administrador"])
  async findOne(
    @Param("id") id: number,
  ): Promise<IApiResponse<GetDto | object>> {
    try {
      const data = await this.usuarioService.findOne(id);

      return {
        ...API_RESPONSE_CONSTANTS.FIND_ONE.SUCCESS,
        dados: data,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      this.logger.error(error);
      return API_RESPONSE_CONSTANTS.FIND_ONE.ERROR;
    }
  }

  @Put(":id")
  @Roles(["Aluno"])
  async update(
    @Param("id") id: number,
    @Body() data: IUsuario,
  ): Promise<IApiResponse<boolean>> {
    try {
      await this.usuarioService.update(id, data);

      return {
        ...API_RESPONSE_CONSTANTS.UPDATE.SUCCESS,
        mensagem: "Usuário alterado com sucesso!",
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      this.logger.error(error);
      return API_RESPONSE_CONSTANTS.UPDATE.ERROR;
    }
  }

  @Post("login")
  async login(@Body() data: LoginDto): Promise<IApiResponse<string>> {
    try {
      const usuario = await this.usuarioService.findOneByEmail(data.email);

      if (usuario) {
        const validSenha = await this.usuarioService.validSenha(
          data.senha,
          usuario.senha,
        );

        if (validSenha) {
          const token = await this.authService.create({
            id: usuario.id,
            email: usuario.email,
            nome: usuario.nome,
            perfil: usuario.perfil,
          });

          return {
            ...API_RESPONSE_CONSTANTS.CREATE.SUCCESS,
            dados: token,
            mensagem: "Login realizado com sucesso!",
          };
        } else {
          throw new HttpException(
            {
              ...API_RESPONSE_CONSTANTS.CREATE.WARNING,
              dados: "",
              mensagem: "Senha incorreta!",
            },
            HttpStatus.BAD_REQUEST,
          );
        }
      } else {
        throw new HttpException(
          {
            ...API_RESPONSE_CONSTANTS.CREATE.WARNING,
            dados: "",
            mensagem: "E-mail não cadastrado!",
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      if (error instanceof HttpException) throw error;

      this.logger.error(error);
      return { ...API_RESPONSE_CONSTANTS.CREATE.ERROR, dados: "" };
    }
  }
}
