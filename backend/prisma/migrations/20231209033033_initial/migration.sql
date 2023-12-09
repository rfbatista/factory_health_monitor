-- CreateTable
CREATE TABLE "machines" (
    "id" SERIAL NOT NULL,
    "type" TEXT,
    "code" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "machines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "machines_data_types" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "machines_data_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "machines_data_points" (
    "id" SERIAL NOT NULL,
    "machine_id" INTEGER NOT NULL,
    "machine_data_type_id" INTEGER NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "machines_data_points_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "machines_data_points" ADD CONSTRAINT "machines_data_points_machine_id_fkey" FOREIGN KEY ("machine_id") REFERENCES "machines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "machines_data_points" ADD CONSTRAINT "machines_data_points_machine_data_type_id_fkey" FOREIGN KEY ("machine_data_type_id") REFERENCES "machines_data_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
