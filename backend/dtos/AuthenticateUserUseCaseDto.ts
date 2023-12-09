import { IsEmail, IsJWT, IsStrongPassword } from "class-validator";

export class AuthenticateUserUseCaseInput {
  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;
}

export class AuthenticateUserUseCaseOutput {
  @IsJWT()
  accessToken: string;

  @IsJWT()
  refreshToken: string;

  @IsJWT()
  identityToken: string;

  constructor({ accessToken, identityToken, refreshToken }) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.identityToken = identityToken;
  }
}
