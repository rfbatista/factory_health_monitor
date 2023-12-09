import { Prisma } from "@prisma/client";
import { Machine } from "../entities/Machine";
import { prisma } from "../infrastructure/database";
import { MachineRepository } from "../ports/repositories";
import { Pagination } from "../shared/pagination";
import { Result } from "../shared/result";
import { Inject } from "typedi";
import { Logger, LoggerToken } from "../ports/infrastructure";

export class MachineRepositoryImpl implements MachineRepository {
  private database: Prisma.MachinesDelegate;

  @Inject(LoggerToken)
  private log!: Logger;

  constructor() {
    this.database = prisma.machines;
  }
  async create(entity: Machine): Promise<Result<Machine>> {
    const machineCreated = await this.database.create({
      data: {
        type: entity.props.type,
        code: entity.props.code,
        created_at: entity.props.createdAt,
        updated_at: entity.props.updatedAt,
        deleted_at: entity.props.deletedAt,
      },
    });
    return Machine.create(machineCreated, machineCreated.id);
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
    return Machine.create(machineDeleted, machineDeleted.id);
  }
  async update(entity: Machine): Promise<Result<Machine>> {
    const machineUpdated = await this.database.update({
      where: {
        id: entity.id,
      },
      data: {
        type: entity.props.type,
        code: entity.props.code,
        created_at: entity.props.createdAt,
        updated_at: entity.props.updatedAt,
        deleted_at: entity.props.deletedAt,
      },
    });
    return Machine.create(machineUpdated, machineUpdated.id);
  }
  async getById(id: number): Promise<Result<Machine>> {
    const machine = await this.database.findUnique({
      where: {
        id,
        deleted_at: null,
      },
    });
    if (machine === null) return Result.fail("failed to create machine");
    return Machine.create(machine, machine.id);
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
      const entityOrError = Machine.create(machine, machine.id);
      if (entityOrError.isFailure) {
        this.log.error("invalid machine in database", entityOrError);
        continue;
      }
      machines.push(entityOrError.getValue<Machine>());
    }
    return Pagination.create<Machine>(machines, { total });
  }
}
