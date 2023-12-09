import { instanceToPlain } from "class-transformer";
import { IsEmail, IsString } from "class-validator";
import * as jwt from "jsonwebtoken";
import { User } from "../entities/User";

export class Session {
  @IsEmail()
  email: string;

  @IsString()
  name?: string;

  static fromJwt(token: jwt.JwtPayload) {
    const session = new Session();
    session.email = token.email;
    session.name = token.name || undefined;
    return session;
  }

  static fromUser(user: User) {
    const session = new Session();
    session.email = user.email;
    session.name = user.name || undefined;
    return session;
  }

  toJWT() {
    return instanceToPlain(this);
  }
}
