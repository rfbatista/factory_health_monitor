import { Body, JsonController, Post } from "routing-controllers";
import { AuthenticateUserUseCaseInput } from "src/dtos/AuthenticateUserUseCaseDto";
import { User, UserDto } from "src/entities/User";
import { UserRepositoryImpl } from "src/repositories/UserRepository";
import { Password } from "src/shared/password";
import { Result } from "src/shared/result";
import { Service } from "typedi";

@JsonController("/v1/user")
@Service()
export class UserController {
  constructor(private userRepo: UserRepositoryImpl) {}

  @Post("/create")
  async authenticate(
    @Body()
    input: AuthenticateUserUseCaseInput,
  ): Promise<Result<UserDto>> {
    const r = await this.userRepo.getByEmail(input.email);
    if (r.isSuccess) return Result.fail("user already exists");
    const pwd = await Password.fromRaw(input.password);
    const user = User.create({
      email: input.email,
      password: pwd,
    });
    const userCread = await this.userRepo.create(user.getValue());
    return Result.ok(userCread.getValue().toDto());
  }
}
