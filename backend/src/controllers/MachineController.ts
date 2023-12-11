import { Request } from "express";
import {
  Authorized,
  Body,
  JsonController,
  Post,
  Req,
} from "routing-controllers";
import { LogMachineDataUseCaseDto } from "src/dtos/LogMachineDataUseCaseDto";
import { Result } from "src/shared/result";
import { LogMachineDataUseCaseImpl } from "src/usecases/LogMachineDataUseCase";
import { Service } from "typedi";
import { getMachineHealth } from "../machineHealth";
import { MachineDataPointDto } from "src/entities/MachineDataPoint";

@JsonController("/v1/machine")
@Service()
export class MachineController {
  constructor(private logMachineData: LogMachineDataUseCaseImpl) {}

  @Authorized()
  @Post("/health")
  async calculateHealth(@Req() req: Request): Promise<Result<unknown>> {
    const result = getMachineHealth(req);
    if (result.error) return Result.fail(result.error);
    return Result.ok(result);
  }

  @Authorized()
  @Post("/log")
  async log(
    @Body() input: LogMachineDataUseCaseDto,
  ): Promise<Result<MachineDataPointDto>> {
    const result = await this.logMachineData.execute(input);
    return result;
  }
}
