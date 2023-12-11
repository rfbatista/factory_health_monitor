import { LogMachineDataUseCaseDto } from "src/dtos/LogMachineDataUseCaseDto";
import {
  AuthenticateUserUseCaseInput,
  AuthenticateUserUseCaseOutput,
} from "../dtos/AuthenticateUserUseCaseDto";
import {
  AuthorizateUserUseCaseInput,
  AuthorizateUserUseCaseOutput,
} from "../dtos/AuthorizateUserUseCaseDto";
import {
  RefreshUserAuthorizationUseCaseInput,
  RefreshUserAuthorizationUseCaseOutput,
} from "../dtos/RefreshUserAuthorizationUseCaseDto";
import { UseCase } from "../shared/usecase";
import { MachineDataPointDto } from "src/entities/MachineDataPoint";

export type AuthenticateUserUseCase = UseCase<
  AuthenticateUserUseCaseInput,
  AuthenticateUserUseCaseOutput
>;
export type AuthorizateUserUseCase = UseCase<
  AuthorizateUserUseCaseInput,
  AuthorizateUserUseCaseOutput
>;

export type RefreshUserAuthorizationUseCase = UseCase<
  RefreshUserAuthorizationUseCaseInput,
  RefreshUserAuthorizationUseCaseOutput
>;

export type LogMachineDataUseCase = UseCase<
  LogMachineDataUseCaseDto,
  MachineDataPointDto
>;
