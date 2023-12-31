import { Action, Interceptor, InterceptorInterface } from "routing-controllers";
import { Service } from "typedi";

export class Result<T> {
  public isSuccess: boolean;
  public isFailure: boolean;
  public error: string;
  private value: T | undefined;

  private constructor(isSuccess: boolean, error?: string, value?: T) {
    if (isSuccess && error) {
      throw new Error(`InvalidOperation: A result cannot be 
        successful and contain an error`);
    }
    if (!isSuccess && !error) {
      throw new Error(`InvalidOperation: A failing result 
        needs to contain an error message`);
    }

    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this.error = error || "";
    this.value = value;

    Object.freeze(this);
  }

  public getValue(): T {
    if (!this.isSuccess) {
      throw new Error(`Cant retrieve the value from a failed result.`);
    }

    return this.value as T;
  }

  public static ok<U>(value?: U): Result<U> {
    return new Result<U>(true, undefined, value);
  }

  public static fail<U>(error: string): Result<U> {
    return new Result<U>(false, error);
  }

  public static combineError<U>(
    error: string,
    fail: Result<unknown>,
  ): Result<U> {
    return new Result<U>(false, error + "\n" + fail.error);
  }
}

@Interceptor()
@Service()
export class ResultInterceptor implements InterceptorInterface {
  intercept(action: Action, result: unknown) {
    if (!(result instanceof Result)) return result;
    if (result.isFailure) {
      action.response.status(400);
      return { error: { message: result.error } };
    }
    action.response.status(200);
    return result.getValue();
  }
}
