import * as jwt from "jsonwebtoken";
import {
  AuthorizateUserUseCaseInput,
  AuthorizateUserUseCaseOutput,
} from "../dtos/AuthorizateUserUseCaseDto";
import { appConfig } from "../infrastructure/config";
import { AuthorizateUserUseCase } from "../ports/usecase";
import { Result } from "../shared/result";
import { Session } from "../shared/session";
import { Service } from "typedi";

@Service()
export class AuthorizateUserUseCaseImpl implements AuthorizateUserUseCase {
  async execute(
    input: AuthorizateUserUseCaseInput,
  ): Promise<Result<AuthorizateUserUseCaseOutput>> {
    try {
      const jwtPayload = jwt.verify(
        input.accessToken,
        appConfig.auth.accessTokenKey,
        { complete: true },
      );
      const session = Session.fromJwt(jwtPayload);
      return Result.ok(new AuthorizateUserUseCaseOutput({ session }));
    } catch (e) {
      console.log("falha ao verificar o token", e);
      return Result.fail("invalid access token");
    }
  }
}
