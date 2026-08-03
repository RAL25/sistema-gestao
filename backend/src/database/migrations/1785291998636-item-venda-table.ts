import { MigrationInterface, QueryRunner } from 'typeorm';

export class ItemVendaTable1785291998636 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "itens_venda" (
        "id" SERIAL PRIMARY KEY,
        "venda_id" INT NOT NULL,
        "produto_id" INT NOT NULL,
        "quantidade" INT NOT NULL,
        "preco_unitario" DECIMAL(10,2) NOT NULL,
        CONSTRAINT "fk_itens_venda_venda" FOREIGN KEY ("venda_id") REFERENCES "vendas"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_itens_venda_produto" FOREIGN KEY ("produto_id") REFERENCES "produtos"("id") ON DELETE RESTRICT
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "itens_venda";`);
  }
}
