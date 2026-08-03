import { MigrationInterface, QueryRunner } from 'typeorm';

export class UsuarioTable1785291922328 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Habilita a extensão para geração de UUID no PostgreSQL caso não exista
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    // Cria o tipo Enum para o cargo do usuário
    await queryRunner.query(
      `CREATE TYPE "cargo_enum" AS ENUM ('Administrador', 'Vendedor');`,
    );

    // Cria a tabela usuarios
    await queryRunner.query(`
      CREATE TABLE "usuarios" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "nome" VARCHAR(255) NOT NULL,
        "email" VARCHAR(254) NOT NULL UNIQUE,
        "senha_hash" VARCHAR(255) NOT NULL,
        "cargo" "cargo_enum" NOT NULL,
        "ativo" BOOLEAN NOT NULL DEFAULT true
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "usuarios";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "cargo_enum";`);
  }
}
