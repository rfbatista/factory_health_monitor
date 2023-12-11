import { LogMachineDataUseCaseDto } from "src/dtos/LogMachineDataUseCaseDto";
import { Machine } from "src/entities/Machine";
import {
  MachineDataPoint,
  MachineDataPointDto,
} from "src/entities/MachineDataPoint";
import { MachineDataType } from "src/entities/MachineDataType";
import { ERRORS_CODE } from "src/errors";
import {
  MachineDataPointRepositoryToken,
  MachineDataPointsRepository,
  MachineDataTypeRepositoryToken,
  MachineDataTypesRepository,
  MachineRepository,
  MachineRepositoryToken,
} from "src/ports/repositories";
import { LogMachineDataUseCase } from "src/ports/usecase";
import { Result } from "src/shared/result";
import { Inject, Service } from "typedi";

@Service()
export class LogMachineDataUseCaseImpl implements LogMachineDataUseCase {
  @Inject(MachineRepositoryToken)
  private machineRepo: MachineRepository;

  @Inject(MachineDataPointRepositoryToken)
  private machineDataPointRepo: MachineDataPointsRepository;

  @Inject(MachineDataTypeRepositoryToken)
  private machineDataTypeRepo: MachineDataTypesRepository;

  async execute(
    input: LogMachineDataUseCaseDto,
  ): Promise<Result<MachineDataPointDto>> {
    try {
      let machine: Machine;
      let machineDataType: MachineDataType;
      const machineOrError = await this.machineRepo.getByName(
        input.machineName,
      );
      if (machineOrError.isFailure) {
        if (machineOrError.error !== ERRORS_CODE.machine_not_found)
          return Result.combineError("failed to create log", machineOrError);
        const newMachine = Machine.create({
          name: input.machineName,
          type: "default",
        });
        const machineCreatedOrError = await this.machineRepo.create(
          newMachine.getValue(),
        );
        if (machineCreatedOrError.isFailure)
          return Result.combineError(
            "failed to create log",
            machineCreatedOrError,
          );
        machine = machineCreatedOrError.getValue();
      } else {
        machine = machineOrError.getValue();
      }
      const machineDataTypeOrError = await this.machineDataTypeRepo.getByName(
        input.partName,
      );
      if (machineDataTypeOrError.isFailure) {
        if (
          machineDataTypeOrError.error !==
          ERRORS_CODE.machine_data_type_not_found
        )
          return Result.combineError("failed to create log", machineOrError);
        const newMachineDataType = MachineDataType.create({
          name: input.partName,
          unit: "default",
        });
        const machineCreatedOrError = await this.machineDataTypeRepo.create(
          newMachineDataType.getValue(),
        );
        if (machineCreatedOrError.isFailure)
          return Result.combineError(
            "failed to create log",
            machineCreatedOrError,
          );
        machineDataType = machineCreatedOrError.getValue();
      } else {
        machineDataType = machineDataTypeOrError.getValue();
      }
      const datapoint = MachineDataPoint.create({
        machineDataTypeId: machineDataType.id,
        machineId: machine.id,
        value: input.value,
      });
      const datapointCreated = await this.machineDataPointRepo.create(
        datapoint.getValue(),
      );
      if (datapointCreated.isFailure)
        return Result.fail(ERRORS_CODE.internal_error);
      return Result.ok(datapointCreated.getValue().toDto());
    } catch (e) {
      console.error(e);
      return Result.fail(ERRORS_CODE.internal_error);
    }
  }
}
