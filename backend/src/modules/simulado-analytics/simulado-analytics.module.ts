import { Module } from "@nestjs/common";
import { MongodbModule } from "../../common/mongodb/mongodb.module";
import { SimuladoAnalyticsController } from "./simulado-analytics.controller";
import { SimuladoAnalyticsService } from "./simulado-analytics.service";

@Module({
  controllers: [SimuladoAnalyticsController],
  providers: [SimuladoAnalyticsService],
  imports: [MongodbModule],
})
export class SimuladoAnalyticsModule {}
