import { Module } from "@nestjs/common";
import { MongodbService } from "./mongodb.service";

@Module({
  exports: [MongodbService],
  providers: [MongodbService],
})
export class MongodbModule {}
