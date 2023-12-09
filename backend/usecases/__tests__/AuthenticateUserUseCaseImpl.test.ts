import Container from "typedi";
import { AuthenticateUserUseCase } from "../../ports/usecase";
import { AuthenticateUserUseCaseImpl } from "../AuthenticateUserUseCaseImpl";
import { AuthenticateUserUseCaseInput } from "../../dtos/AuthenticateUserUseCaseDto";
import { clearDatabase, prisma } from "../../infrastructure/database";
import { Password } from "../../shared/password";

describe("AuthenticateUserUseCaseImpl", () => {
  let useCase: AuthenticateUserUseCase;

  beforeEach(async () => {
    Container.reset();
    await clearDatabase();
    useCase = Container.get<AuthenticateUserUseCase>(
      AuthenticateUserUseCaseImpl,
    );
  });

  it("should authenticate user successfully", async () => {
    const input: AuthenticateUserUseCaseInput = {
      email: "test@example.com",
      password: "password123",
    };
    const pwd = await Password.fromRaw(input.password);
    await prisma.user.create({
      data: {
        email: input.email,
        name: "teste 1",
        password: pwd.hash,
        salt: pwd.salt,
      },
    });

    const result = await useCase.execute(input);
    expect(result.isSuccess).toBe(true);
    const { accessToken } = result.getValue();
    expect(accessToken).toBeDefined();
  });

  it("should handle invalid user password", async () => {
    const input: AuthenticateUserUseCaseInput = {
      email: "test@example.com",
      password: "invalidPassword",
    };
    const pwd = await Password.fromRaw("teste");
    await prisma.user.create({
      data: {
        email: input.email,
        name: "teste 1",
        password: pwd.hash,
        salt: pwd.salt,
      },
    });

    const result = await useCase.execute(input);

    expect(result.isFailure).toBe(true);
  });

  it("should handle user not found", async () => {
    const input: AuthenticateUserUseCaseInput = {
      email: "nonexistent@example.com",
      password: "password123",
    };

    const result = await useCase.execute(input);

    expect(result.isFailure).toBe(true);
  });
});
