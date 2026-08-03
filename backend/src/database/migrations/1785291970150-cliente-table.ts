import { MigrationInterface, QueryRunner } from 'typeorm';

export class ClienteTable1785291970150 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "clientes" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "nome_razao_social" VARCHAR(255) NOT NULL,
        "cnpj_cpf" VARCHAR(14) NOT NULL,
        "cep" VARCHAR(8) NOT NULL,
        "logradouro" VARCHAR NOT NULL,
        "numero" VARCHAR NOT NULL,
        "bairro" VARCHAR NOT NULL,
        "cidade" VARCHAR NOT NULL,
        "uf" VARCHAR(2) NOT NULL,
        "complemento" VARCHAR
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "clientes";`);
  }
}
