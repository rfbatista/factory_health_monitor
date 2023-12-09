import { Prisma } from "@prisma/client";
import { Service } from "typedi";
import { User } from "../entities/User";
import { prisma } from "../infrastructure/database";
import { UserRepository } from "../ports/repositories";
import { Password } from "../shared/password";
import { Result } from "../shared/result";

@Service()
export class UserRepositoryImpl implements UserRepository {
  private database: Prisma.UserDelegate;

  constructor() {
    this.database = prisma.user;
  }

  async create(entity: User): Promise<Result<User>> {
    const userCreated = await this.database.create({
      data: {
        name: entity.name,
        email: entity.email,
        password: entity.password,
        salt: entity.salt,
      },
    });
    const password = Password.fromHash(userCreated.password, userCreated.salt);
    return User.create({ ...userCreated, password }, userCreated.id);
  }

  async getByEmail(email: string): Promise<Result<User>> {
    const userFound = await this.database.findUnique({
      where: {
        email,
      },
    });
    if (userFound === null) return Result.fail("user not found");
    const password = Password.fromHash(userFound.password, userFound.salt);
    return User.create({ ...userFound, password }, userFound.id);
  }
}
