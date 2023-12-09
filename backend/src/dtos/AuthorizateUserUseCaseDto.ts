import { IsObject } from "class-validator";
import { Session } from "../shared/session";

export class AuthorizateUserUseCaseInput {
  accessToken: string;
}

export class AuthorizateUserUseCaseOutput {
  @IsObject()
  session: Session;
  constructor({ session }) {
    this.session = session;
  }
}
