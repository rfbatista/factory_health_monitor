import { Prisma } from "@prisma/client";
import { Inject, Service } from "typedi";
import { MachineDataType } from "../entities/MachineDataType";
import { prisma } from "../infrastructure/database";
import { Logger, LoggerToken } from "../ports/infrastructure";
import { MachineDataTypesRepository } from "../ports/repositories";
import { Pagination } from "../shared/pagination";
import { Result } from "../shared/result";
import { ERRORS_CODE } from "src/errors";

@Service()
export class MachineDataTypeRepositoryImpl
  implements MachineDataTypesRepository
{
  private database: Prisma.MachinesDataTypeDelegate;

  @Inject(LoggerToken)
  private log!: Logger;

  constructor() {
    this.database = prisma.machinesDataType;
  }

  async getByName(name: string): Promise<Result<MachineDataType>> {
    const machineFound = await this.database.findFirst({
      where: {
        name,
      },
    });
    if (machineFound == null) return Result.fail(ERRORS_CODE.machine_data_type_not_found);
    return MachineDataType.create(
      {
        ...machineFound,
        createdAt: machineFound.created_at,
        updatedAt: machineFound.updated_at,
        deletedAt: machineFound.deleted_at,
      },
      machineFound.id,
    );
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
    return MachineDataType.create(
      {
        ...machineCreated,
        createdAt: machineCreated.created_at,
        updatedAt: machineCreated.updated_at,
        deletedAt: machineCreated.deleted_at,
      },
      machineCreated.id,
    );
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
    return MachineDataType.create(
      {
        ...machineDeleted,
        createdAt: machineDeleted.created_at,
        updatedAt: machineDeleted.updated_at,
        deletedAt: machineDeleted.deleted_at,
      },
      machineDeleted.id,
    );
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
    return MachineDataType.create(
      {
        ...machineUpdated,
        createdAt: machineUpdated.created_at,
        updatedAt: machineUpdated.updated_at,
        deletedAt: machineUpdated.deleted_at,
      },
      machineUpdated.id,
    );
  }

  async getById(id: number): Promise<Result<MachineDataType>> {
    const machine = await this.database.findUnique({
      where: {
        id,
        deleted_at: null,
      },
    });
    if (machine === null)
      return Result.fail("failed to create machine data type");
    return MachineDataType.create(
      {
        ...machine,
        createdAt: machine.created_at,
        updatedAt: machine.updated_at,
        deletedAt: machine.deleted_at,
      },
      machine.id,
    );
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
          deleted_at: null,
        },
      }),
    ]);
    const total = result[0];
    const machines: MachineDataType[] = [];
    for (const machine of result[1]) {
      const entityOrError = MachineDataType.create(
        {
          ...machine,
          createdAt: machine.created_at,
          updatedAt: machine.updated_at,
          deletedAt: machine.deleted_at,
        },
        machine.id,
      );
      if (entityOrError.isFailure) {
        this.log.error("invalid machine data type in database", entityOrError);
        continue;
      }
      machines.push(entityOrError.getValue());
    }
    return Pagination.create<MachineDataType>(machines, { total });
  }
}
