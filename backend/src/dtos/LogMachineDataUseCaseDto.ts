import { IsNumber, IsString } from "class-validator";

export class LogMachineDataUseCaseDto {
  @IsString()
  machineName: string;

  @IsString()
  partName: string;

  @IsNumber()
  value: number;
}
