import { Injectable, OnModuleInit } from "@nestjs/common";
import {
  Abortable,
  Collection,
  Filter,
  FindOptions,
  MongoClient,
  OptionalId,
} from "mongodb";
import { ISimuladoAnalytics } from "../../modules/simulado-analytics/simulado-analytics.interface";

@Injectable()
export class MongodbService implements OnModuleInit {
  private readonly MONGODB_DATABASE_URL =
    process.env.MONGODB_DATABASE_URL || "mongodb://localhost:27017";
  private readonly TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;
  private database: MongoClient;
  private collection: Collection;

  async onModuleInit() {
    this.database = new MongoClient(this.MONGODB_DATABASE_URL);
    await this.database.connect();
    this.collection = this.database
      .db("fatec-pi")
      .collection("simulado-analytics");
  }

  getDatabase(): MongoClient {
    return this.database;
  }

  async executeInsert(stmt: OptionalId<ISimuladoAnalytics>): Promise<boolean> {
    const result = await this.collection.insertOne(stmt);
    return Number(result?.insertedId || 0) > 0;
  }

  async executeQuery<T>(
    filter: Filter<Document>,
    options?: FindOptions & Abortable,
  ): Promise<T[]> {
    const result = await this.collection.find(filter, options).toArray();
    return result as T[];
  }

  // async executeUpdate(stmt: InStatement): Promise<boolean> {
  //   const result = await this.database.execute(stmt);
  //   return Number(result.rowsAffected) > 0;
  // }
}
