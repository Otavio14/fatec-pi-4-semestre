import { Client, createClient, InStatement } from "@libsql/client";
import { Injectable, OnModuleInit } from "@nestjs/common";

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly TURSO_DATABASE_URL =
    process.env.TURSO_DATABASE_URL || "file:src/common/database/local.db";
  private readonly TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;
  private database: Client;

  onModuleInit() {
    this.database = createClient({
      url: this.TURSO_DATABASE_URL,
      authToken: this.TURSO_AUTH_TOKEN,
    });
  }

  getDatabase(): Client {
    return this.database;
  }

  async executeInsert(stmt: InStatement): Promise<boolean> {
    const result = await this.database.execute(stmt);
    return Number(result?.lastInsertRowid || 0) > 0;
  }

  async executeQuery<T>(stmt: InStatement): Promise<T[]> {
    const result = await this.database.execute(stmt);
    return result.rows as T[];
  }

  async executeUpdate(stmt: InStatement): Promise<boolean> {
    const result = await this.database.execute(stmt);
    return Number(result.rowsAffected) > 0;
  }
}
