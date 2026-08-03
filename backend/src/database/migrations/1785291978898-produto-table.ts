import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProdutoTable1785291978898 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "produtos" (
        "id" SERIAL PRIMARY KEY,
        "nome" VARCHAR(255) NOT NULL,
        "preco_custo" DECIMAL(10,2) NOT NULL,
        "preco_venda" DECIMAL(10,2) NOT NULL,
        "quantidade_estoque" INT NOT NULL,
        "ativo" BOOLEAN NOT NULL DEFAULT true
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "produtos";`);
  }
}
