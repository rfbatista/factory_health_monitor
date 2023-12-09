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
