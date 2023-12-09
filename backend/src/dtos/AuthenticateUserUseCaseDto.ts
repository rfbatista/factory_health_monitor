import { IsEmail, IsString } from "class-validator";

export class AuthenticateUserUseCaseInput {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class AuthenticateUserUseCaseOutput {
  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;

  @IsString()
  identityToken: string;

  constructor({ accessToken, identityToken, refreshToken }) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.identityToken = identityToken;
  }
}
