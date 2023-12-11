import { Authorized, Body, JsonController, Post } from "routing-controllers";
import {
  AuthenticateUserUseCaseInput,
  AuthenticateUserUseCaseOutput,
} from "src/dtos/AuthenticateUserUseCaseDto";
import { RefreshUserAuthorizationUseCaseInput } from "src/dtos/RefreshUserAuthorizationUseCaseDto";
import { Result } from "src/shared/result";
import { AuthenticateUserUseCaseImpl } from "src/usecases/AuthenticateUserUseCaseImpl";
import { RefreshUserAuthorizationUseCaseImpl } from "src/usecases/RefreshUserAuthorizationUseCaseImpl";
import { Service } from "typedi";

@JsonController("/v1/auth")
@Service()
export class AuthController {
  constructor(
    private authenticateUser: AuthenticateUserUseCaseImpl,
    private refreshUser: RefreshUserAuthorizationUseCaseImpl,
  ) {}
  @Post("/signin")
  async authenticate(
    @Body({ required: true, validate: true })
    input: AuthenticateUserUseCaseInput,
  ): Promise<Result<AuthenticateUserUseCaseOutput>> {
    try {
      const r = await this.authenticateUser.execute(input);
      return r;
    } catch (e) {
      console.error("error aquio", e);
      throw e;
    }
  }

  @Authorized()
  @Post("/refresh")
  async refreshAuthentication(
    @Body() input: RefreshUserAuthorizationUseCaseInput,
  ) {
    const r = await this.refreshUser.execute(input);
    return r;
  }
}
