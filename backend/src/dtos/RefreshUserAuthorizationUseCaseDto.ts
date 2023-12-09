import { IsString } from "class-validator";

export class RefreshUserAuthorizationUseCaseInput {
  @IsString()
  refreshToken: string;
}

export class RefreshUserAuthorizationUseCaseOutput {
  @IsString()
  accessToken: string;

  @IsString()
  identityToken: string;

  constructor({ accessToken, identityToken }) {
    this.accessToken = accessToken;
    this.identityToken = identityToken;
  }
}
