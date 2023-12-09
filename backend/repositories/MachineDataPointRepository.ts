import { Prisma } from "@prisma/client";
import { Inject } from "typedi";
import { MachineDataPoint } from "../entities/MachineDataPoint";
import { prisma } from "../infrastructure/database";
import { Logger, LoggerToken } from "../ports/infrastructure";
import { MachineDataPointsRepository } from "../ports/repositories";
import { Pagination } from "../shared/pagination";
import { Result } from "../shared/result";

export class MachineDataPointRepositoryImpl
  implements MachineDataPointsRepository
{
  private database: Prisma.MachinesDataPointsDelegate;

  @Inject(LoggerToken)
  private log!: Logger;

  constructor() {
    this.database = prisma.machines;
  }
  async create(entity: MachineDataPoint): Promise<Result<MachineDataPoint>> {
    const machineCreated = await this.database.create({
      data: {
        machine_data_type_id: entity.props.machineDataTypeId,
        machine_id: entity.props.machineId,
        value: entity.props.value,
        created_at: entity.props.createdAt,
      },
    });
    return MachineDataPoint.create(machineCreated, machineCreated.id);
  }

  async delete(id: number): Promise<Result<MachineDataPoint>> {
    const machineDeleted = await this.database.update({
      where: {
        id,
      },
      data: {
        deleted_at: new Date(),
      },
    });
    return MachineDataPoint.create(machineDeleted, machineDeleted.id);
  }

  async getById(id: number): Promise<Result<MachineDataPoint>> {
    const machine = await this.database.findUnique({
      where: {
        id,
        deleted_at: null,
      },
    });
    if (machine === null) return Result.fail("failed to create machine data point");
    return MachineDataPoint.create(machine, machine.id);
  }

  async list(
    take: number,
    skip: number,
  ): Promise<Result<Pagination<MachineDataPoint>>> {
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
    const machines: MachineDataPoint[] = [];
    for (const machine of result[1]) {
      const entityOrError = MachineDataPoint.create(machine, machine.id);
      if (entityOrError.isFailure) {
        this.log.error("invalid machine data point in database", entityOrError);
        continue;
      }
      machines.push(entityOrError.getValue<MachineDataPoint>());
    }
    return Pagination.create<MachineDataPoint>(machines, { total });
  }
}
