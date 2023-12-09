import * as jwt from "jsonwebtoken";
import { Inject, Service } from "typedi";
import {
  AuthenticateUserUseCaseInput,
  AuthenticateUserUseCaseOutput,
} from "../dtos/AuthenticateUserUseCaseDto";
import { appConfig } from "../infrastructure/config";
import { UserRepository, UserRepositoryToken } from "../ports/repositories";
import { AuthenticateUserUseCase } from "../ports/usecase";
import { Result } from "../shared/result";
import { Session } from "../shared/session";

@Service()
export class AuthenticateUserUseCaseImpl implements AuthenticateUserUseCase {
  @Inject(UserRepositoryToken)
  private userRepository: UserRepository;
  async execute(
    input: AuthenticateUserUseCaseInput,
  ): Promise<Result<AuthenticateUserUseCaseOutput>> {
    const userOrError = await this.userRepository.getByEmail(input.email);
    if (userOrError.isFailure)
      return Result.combineError("user not found", userOrError);
    const user = userOrError.getValue();
    if (!user.isValidPassword(input.password))
      return Result.fail("invalid password provided");
    const session = Session.fromUser(user);
    const accessToken = jwt.sign(
      session.toJWT(),
      appConfig.auth.accessTokenKey,
      {
        expiresIn: appConfig.auth.accessTokenExpiration,
      },
    );
    const refreshToken = jwt.sign(
      session.toJWT(),
      appConfig.auth.refreshTokenKey,
      {
        expiresIn: appConfig.auth.refreshTokenExpiration,
      },
    );
    const identityToken = jwt.sign(
      session.toJWT(),
      appConfig.auth.identityTokenKey,
      {
        expiresIn: appConfig.auth.identityTokenExpiration,
      },
    );
    return Result.ok(
      new AuthenticateUserUseCaseOutput({
        accessToken,
        refreshToken,
        identityToken,
      }),
    );
  }
}
