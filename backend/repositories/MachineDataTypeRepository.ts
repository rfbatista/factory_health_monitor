import { Prisma } from "@prisma/client";
import { Inject } from "typedi";
import { MachineDataType } from "../entities/MachineDataType";
import { prisma } from "../infrastructure/database";
import { Logger, LoggerToken } from "../ports/infrastructure";
import { MachineDataTypesRepository } from "../ports/repositories";
import { Pagination } from "../shared/pagination";
import { Result } from "../shared/result";

export class MachineDataTypeRepositoryImpl
  implements MachineDataTypesRepository
{
  private database: Prisma.MachinesDataTypeDelegate;

  @Inject(LoggerToken)
  private log!: Logger;

  constructor() {
    this.database = prisma.machinesDataType;
  }
  async create(entity: MachineDataType): Promise<Result<MachineDataType>> {
    const machineCreated = await this.database.create({
      data: {
        name: entity.props.name,
        unit: entity.props.unit,
        created_at: entity.props.createdAt,
        updated_at: entity.props.updatedAt,
        deleted_at: entity.props.deletedAt,
      },
    });
    return MachineDataType.create(machineCreated, machineCreated.id);
  }
  async delete(id: number): Promise<Result<MachineDataType>> {
    const machineDeleted = await this.database.update({
      where: {
        id,
      },
      data: {
        deleted_at: new Date(),
      },
    });
    return MachineDataType.create(machineDeleted, machineDeleted.id);
  }
  async update(entity: MachineDataType): Promise<Result<MachineDataType>> {
    const machineUpdated = await this.database.update({
      where: {
        id: entity.id,
      },
      data: {
        name: entity.props.name,
        unit: entity.props.unit,
        created_at: entity.props.createdAt,
        updated_at: entity.props.updatedAt,
        deleted_at: entity.props.deletedAt,
      },
    });
    return MachineDataType.create(machineUpdated, machineUpdated.id);
  }
  async getById(id: number): Promise<Result<MachineDataType>> {
    const machine = await this.database.findUnique({
      where: {
        id,
        deleted_at: null
      },
    });
    if (machine === null) return Result.fail("failed to create machine data type");
    return MachineDataType.create(machine, machine.id);
  }

  async list(
    take: number,
    skip: number,
  ): Promise<Result<Pagination<MachineDataType>>> {
    const result = await prisma.$transaction([
      this.database.count(),
      this.database.findMany({
        take,
        skip,
        where: {
          deleted_at: null
        }
      }),
    ]);
    const total = result[0];
    const machines: MachineDataType[] = [];
    for (const machine of result[1]) {
      const entityOrError = MachineDataType.create(machine, machine.id);
      if (entityOrError.isFailure) {
        this.log.error("invalid machine data type in database", entityOrError);
        continue;
      }
      machines.push(entityOrError.getValue<MachineDataType>());
    }
    return Pagination.create<MachineDataType>(machines, { total });
  }
}
