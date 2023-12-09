import {
  RefreshUserAuthorizationUseCaseInput,
  RefreshUserAuthorizationUseCaseOutput,
} from "../dtos/RefreshUserAuthorizationUseCaseDto";
import * as jwt from "jsonwebtoken";
import { Session } from "src/shared/session";
import { Service } from "typedi";
import { appConfig } from "../infrastructure/config";
import { RefreshUserAuthorizationUseCase } from "../ports/usecase";
import { Result } from "../shared/result";

@Service()
export class RefreshUserAuthorizationUseCaseImpl
  implements RefreshUserAuthorizationUseCase
{
  async execute(
    input: RefreshUserAuthorizationUseCaseInput,
  ): Promise<Result<RefreshUserAuthorizationUseCaseOutput>> {
    try {
      const jwtPayload = jwt.verify(
        input.refreshToken,
        appConfig.auth.refreshTokenKey,
        { complete: true },
      );
      const session = Session.fromJwt(jwtPayload);
      const accessToken = jwt.sign(session.toJWT(), appConfig.auth.accessTokenKey, {
        expiresIn: appConfig.auth.accessTokenExpiration,
      });
      const identityToken = jwt.sign(session.toJWT(), appConfig.auth.identityTokenKey, {
        expiresIn: appConfig.auth.identityTokenExpiration,
      });
      return Result.ok(
        new RefreshUserAuthorizationUseCaseOutput({
          accessToken,
          identityToken,
        }),
      );
    } catch (e) {
      return Result.fail("invalid refresh token");
    }
  }
}
