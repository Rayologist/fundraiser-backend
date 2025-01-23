import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1737577970639 implements MigrationInterface {
  name = 'Init1737577970639';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "Campaign" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" character(26) NOT NULL, "config" text NOT NULL, "title" text NOT NULL, "description" text NOT NULL, "longDescription" text NOT NULL, "pictures" text NOT NULL, "active" boolean NOT NULL, "deleted" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_b30142ad5361f256de9adfc5a69" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Payment" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" character(26) NOT NULL, "userId" character(26) NOT NULL, "orderId" text NOT NULL, "transactionId" text, "status" smallint NOT NULL DEFAULT '0', "paymentMethod" text, "transactedAt" TIMESTAMP WITH TIME ZONE, "providerResponse" text, CONSTRAINT "PK_07e9fb9a8751923eb876d57a575" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "User" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" character(26) NOT NULL, "firstName" text NOT NULL, "lastName" text NOT NULL, "email" text NOT NULL, "picture" text NOT NULL, "refreshToken" text NOT NULL, CONSTRAINT "UQ_4a257d2c9837248d70640b3e36e" UNIQUE ("email"), CONSTRAINT "PK_9862f679340fb2388436a5ab3e4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "CartItem" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" character(26) NOT NULL, "quantity" integer NOT NULL, "price" numeric(12,2) NOT NULL, "productId" character(26) NOT NULL, "userId" character(26) NOT NULL, CONSTRAINT "PK_ed839195df950f7ef36a1f17ac2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Product" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" character(26) NOT NULL, "title" text NOT NULL, "description" text NOT NULL, "pictures" text NOT NULL, "goalAmount" numeric(12,2) NOT NULL, "currentAmount" numeric(12,2) NOT NULL DEFAULT '0', "totalContributors" integer NOT NULL DEFAULT '0', "currency" character(5) NOT NULL, "active" boolean NOT NULL, "deleted" boolean NOT NULL DEFAULT false, "campaignId" character(26) NOT NULL, CONSTRAINT "PK_9fc040db7872192bbc26c515710" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "OrderItem" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" character(26) NOT NULL, "quantity" integer NOT NULL, "price" numeric(12,2) NOT NULL, "currency" character varying(5) NOT NULL, "productId" character(26) NOT NULL, "orderId" text NOT NULL, CONSTRAINT "PK_6bdc02af31674c4216a6b0a8b39" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "DonorInfo" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" character(26) NOT NULL, "fullName" text NOT NULL, "email" text NOT NULL, "isGILMember" boolean NOT NULL, "receiptRequest" boolean NOT NULL, "receiptName" text, "taxId" text, "phoneNumber" text, "orderId" text NOT NULL, CONSTRAINT "REL_a9c8645bc7fefb23446af08c27" UNIQUE ("orderId"), CONSTRAINT "PK_1101197c6e0827b9284325892d9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Order" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" text NOT NULL, "userId" character(26) NOT NULL, "donorInfoId" character(26) NOT NULL, CONSTRAINT "PK_3d5a3861d8f9a6db372b2b317b7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Receipt" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" character(26) NOT NULL, "userId" character(26) NOT NULL, "orderId" text NOT NULL, "description" text NOT NULL, "donorInfoId" character(26) NOT NULL, "notes" text, CONSTRAINT "PK_83a8032351433085916cc8318b0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "Payment" ADD CONSTRAINT "FK_7a1045559464dd2ed4fc9587cc1" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Payment" ADD CONSTRAINT "FK_23b99029eabbb5212833ed37957" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "CartItem" ADD CONSTRAINT "FK_d26ee078939b94811462a0280d8" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "CartItem" ADD CONSTRAINT "FK_1cc03aae533aa1dcd3c8ca21859" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Product" ADD CONSTRAINT "FK_7124bab622010e514c0cf772cd4" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OrderItem" ADD CONSTRAINT "FK_5b590ac1105dfd63b399cdc79bb" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OrderItem" ADD CONSTRAINT "FK_c94ace27164b9ffde93ebdbe95c" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "DonorInfo" ADD CONSTRAINT "FK_a9c8645bc7fefb23446af08c278" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Order" ADD CONSTRAINT "FK_cdc25a0a42e8f451020a26680b3" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Receipt" ADD CONSTRAINT "FK_44457296cb262d3819be21c6eed" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Receipt" ADD CONSTRAINT "FK_5db95d447d1feeb2160fd26edaf" FOREIGN KEY ("donorInfoId") REFERENCES "DonorInfo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Receipt" ADD CONSTRAINT "FK_5e37e124ad31c6d2316f71ce0a2" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Receipt" DROP CONSTRAINT "FK_5e37e124ad31c6d2316f71ce0a2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Receipt" DROP CONSTRAINT "FK_5db95d447d1feeb2160fd26edaf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Receipt" DROP CONSTRAINT "FK_44457296cb262d3819be21c6eed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Order" DROP CONSTRAINT "FK_cdc25a0a42e8f451020a26680b3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "DonorInfo" DROP CONSTRAINT "FK_a9c8645bc7fefb23446af08c278"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OrderItem" DROP CONSTRAINT "FK_c94ace27164b9ffde93ebdbe95c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OrderItem" DROP CONSTRAINT "FK_5b590ac1105dfd63b399cdc79bb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Product" DROP CONSTRAINT "FK_7124bab622010e514c0cf772cd4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "CartItem" DROP CONSTRAINT "FK_1cc03aae533aa1dcd3c8ca21859"`,
    );
    await queryRunner.query(
      `ALTER TABLE "CartItem" DROP CONSTRAINT "FK_d26ee078939b94811462a0280d8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Payment" DROP CONSTRAINT "FK_23b99029eabbb5212833ed37957"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Payment" DROP CONSTRAINT "FK_7a1045559464dd2ed4fc9587cc1"`,
    );
    await queryRunner.query(`DROP TABLE "Receipt"`);
    await queryRunner.query(`DROP TABLE "Order"`);
    await queryRunner.query(`DROP TABLE "DonorInfo"`);
    await queryRunner.query(`DROP TABLE "OrderItem"`);
    await queryRunner.query(`DROP TABLE "Product"`);
    await queryRunner.query(`DROP TABLE "CartItem"`);
    await queryRunner.query(`DROP TABLE "User"`);
    await queryRunner.query(`DROP TABLE "Payment"`);
    await queryRunner.query(`DROP TABLE "Campaign"`);
  }
}
