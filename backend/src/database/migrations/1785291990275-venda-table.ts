import { MigrationInterface, QueryRunner } from 'typeorm';

export class VendaTable1785291990275 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Cria o tipo Enum para o status da venda
    await queryRunner.query(
      `CREATE TYPE "status_venda_enum" AS ENUM ('CONCLUIDA', 'CANCELADA');`,
    );

    await queryRunner.query(`
      CREATE TABLE "vendas" (
        "id" SERIAL PRIMARY KEY,
        "cliente_id" UUID NOT NULL,
        "vendedor_id" UUID NOT NULL,
        "data_venda" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "valor_total" DECIMAL(10,2) NOT NULL,
        "status" "status_venda_enum" NOT NULL DEFAULT 'CONCLUIDA',
        "cancelada_em" DATE,
        CONSTRAINT "fk_vendas_cliente" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE RESTRICT,
        CONSTRAINT "fk_vendas_vendedor" FOREIGN KEY ("vendedor_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "vendas";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "status_venda_enum";`);
  }
}
