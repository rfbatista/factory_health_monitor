import { Prisma } from "@prisma/client";
import { Machine } from "../entities/Machine";
import { prisma } from "../infrastructure/database";
import { MachineRepository } from "../ports/repositories";
import { Pagination } from "../shared/pagination";
import { Result } from "../shared/result";
import { Inject, Service } from "typedi";
import { Logger, LoggerToken } from "../ports/infrastructure";
import { ERRORS_CODE } from "src/errors";

@Service()
export class MachineRepositoryImpl implements MachineRepository {
  private database: Prisma.MachinesDelegate;
  @Inject(LoggerToken)
  private log!: Logger;

  constructor() {
    this.database = prisma.machines;
  }
  async getByName(name: string): Promise<Result<Machine>> {
    const machineFound = await this.database.findFirst({
      where: {
        name,
      },
    });
    if (machineFound == null) return Result.fail(ERRORS_CODE.machine_not_found);
    return Machine.create(
      {
        ...machineFound,
        createdAt: machineFound.created_at,
        updatedAt: machineFound.updated_at,
        deletedAt: machineFound.deleted_at,
      },
      machineFound.id,
    );
  }

  async create(entity: Machine): Promise<Result<Machine>> {
    const machineCreated = await this.database.create({
      data: {
        type: entity.props.type,
        name: entity.props.name,
        created_at: entity.props.createdAt,
        updated_at: entity.props.updatedAt,
        deleted_at: entity.props.deletedAt,
      },
    });
    return Machine.create(
      {
        ...machineCreated,
        createdAt: machineCreated.created_at,
        updatedAt: machineCreated.updated_at,
        deletedAt: machineCreated.deleted_at,
      },
      machineCreated.id,
    );
  }
  async delete(id: number): Promise<Result<Machine>> {
    const machineDeleted = await this.database.update({
      where: {
        id,
      },
      data: {
        deleted_at: new Date(),
      },
    });
    return Machine.create(
      {
        ...machineDeleted,
        createdAt: machineDeleted.created_at,
        updatedAt: machineDeleted.updated_at,
        deletedAt: machineDeleted.deleted_at,
      },
      machineDeleted.id,
    );
  }
  async update(entity: Machine): Promise<Result<Machine>> {
    const machineUpdated = await this.database.update({
      where: {
        id: entity.id,
      },
      data: {
        type: entity.props.type,
        name: entity.props.name,
        created_at: entity.props.createdAt,
        updated_at: entity.props.updatedAt,
        deleted_at: entity.props.deletedAt,
      },
    });

    return Machine.create(
      {
        ...machineUpdated,
        createdAt: machineUpdated.created_at,
        updatedAt: machineUpdated.updated_at,
        deletedAt: machineUpdated.deleted_at,
      },
      machineUpdated.id,
    );
  }
  async getById(id: number): Promise<Result<Machine>> {
    const machine = await this.database.findUnique({
      where: {
        id,
        deleted_at: null,
      },
    });
    if (machine === null) return Result.fail("failed to create machine");
    return Machine.create(
      {
        ...machine,
        createdAt: machine.created_at,
        updatedAt: machine.updated_at,
        deletedAt: machine.deleted_at,
      },
      machine.id,
    );
  }

  async list(take: number, skip: number): Promise<Result<Pagination<Machine>>> {
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
    const machines: Machine[] = [];
    for (const machine of result[1]) {
      const entityOrError = Machine.create(
        {
          ...machine,
          createdAt: machine.created_at,
          updatedAt: machine.updated_at,
          deletedAt: machine.deleted_at,
        },
        machine.id,
      );
      if (entityOrError.isFailure) {
        this.log.error("invalid machine in database", entityOrError);
        continue;
      }
      machines.push(entityOrError.getValue());
    }
    return Pagination.create<Machine>(machines, { total });
  }
}
