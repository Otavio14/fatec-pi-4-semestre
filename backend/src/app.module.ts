import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./common/auth/auth.module";
import configuration from "./common/config/configuration";
import { DatabaseModule } from "./common/database/database.module";
import { RoleGuard } from "./common/guards/role.guard";
import { HashModule } from "./common/hash/hash.module";
import { AlternativaModule } from "./modules/alternativa/alternativa.module";
import { CursoMateriaModule } from "./modules/curso-materia/curso-materia.module";
import { CursoModule } from "./modules/curso/curso.module";
import { DeepseekModule } from "./modules/deepseek/deepseek.module";
import { MateriaModule } from "./modules/materia/materia.module";
import { ProvaModule } from "./modules/prova/prova.module";
import { QuestaoMateriaModule } from "./modules/questao-materia/questao-materia.module";
import { QuestaoReferenciaModule } from "./modules/questao-referencia/questao-referencia.module";
import { QuestaoModule } from "./modules/questao/questao.module";
import { RedacaoReferenciaModule } from "./modules/redacao-referencia/redacao-referencia.module";
import { RedacaoModule } from "./modules/redacao/redacao.module";
import { ReferenciaModule } from "./modules/referencia/referencia.module";
import { SimuladoQuestaoModule } from "./modules/simulado-questao/simulado-questao.module";
import { SimuladoRedacaoModule } from "./modules/simulado-redacao/simulado-redacao.module";
import { SimuladoModule } from "./modules/simulado/simulado.module";
import { UsuarioModule } from "./modules/usuario/usuario.module";
import { VestibularModule } from "./modules/vestibular/vestibular.module";

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
    AlternativaModule,
    CursoMateriaModule,
    CursoModule,
    DatabaseModule,
    DeepseekModule,
    MateriaModule,
    ProvaModule,
    QuestaoMateriaModule,
    QuestaoModule,
    QuestaoReferenciaModule,
    RedacaoModule,
    RedacaoReferenciaModule,
    ReferenciaModule,
    SimuladoModule,
    SimuladoQuestaoModule,
    SimuladoRedacaoModule,
    UsuarioModule,
    VestibularModule,
    HashModule,
    // PdfModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule {}
