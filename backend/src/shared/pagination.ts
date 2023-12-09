import { Result } from "./result";

type PaginationMetadata = {
  total: number;
};

export class Pagination<T> {
  meta: PaginationMetadata;
  data: T[];
  private constructor(data: T[], meta: PaginationMetadata) {
    this.data = data;
    this.meta = meta;
  }
  static create<T>(data: T[], meta: PaginationMetadata): Result<Pagination<T>> {
    return Result.ok(new Pagination(data, meta));
  }
}
