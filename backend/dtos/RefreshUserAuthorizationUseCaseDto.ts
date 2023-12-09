import { IsJWT } from "class-validator";

export class RefreshUserAuthorizationUseCaseInput {
  @IsJWT()
  refreshToken: string;
}

export class RefreshUserAuthorizationUseCaseOutput {
  @IsJWT()
  accessToken: string;

  @IsJWT()
  identityToken: string;

  constructor({ accessToken, identityToken }) {
    this.accessToken = accessToken;
    this.identityToken = identityToken;
  }
}
