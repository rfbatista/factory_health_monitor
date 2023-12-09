import { clearDatabase } from "src/infrastructure/database";
import { AuthorizateUserUseCaseImpl } from "../AuthorizateUserUseCaseImpl";
import * as jwt from "jsonwebtoken";
import Container from "typedi";

jest.mock("jsonwebtoken");

describe("AuthorizateUserUseCaseImpl", () => {
  let usecase: AuthorizateUserUseCaseImpl;
  beforeEach(async () => {
    await clearDatabase();
    Container.reset();
    usecase = Container.get(AuthorizateUserUseCaseImpl);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it("should successfully authorize the user with a valid access token", async () => {
    const mockJwtPayload = {
      name: "teste",
      email: "teste@email.com",
    };
    const validAccessToken = "validAccessToken";
    const usecase = new AuthorizateUserUseCaseImpl();

    (jwt.verify as jest.Mock).mockReturnValueOnce(mockJwtPayload);

    const result = await usecase.execute({
      accessToken: validAccessToken,
    });

    expect(result.isSuccess).toBe(true);
  });

  it("should fail to authorize the user with an invalid access token", async () => {
    const invalidAccessToken = "invalidAccessToken";

    (jwt.verify as jest.Mock).mockImplementationOnce(() => {
      throw new Error("Invalid token");
    });

    const result = await usecase.execute({
      accessToken: invalidAccessToken,
    });
    expect(result.isFailure).toBe(true);
    expect(result.error).toBe("invalid access token");
  });
});
