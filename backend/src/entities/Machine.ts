import { Result } from "../shared/result";

type Props = {
  type: string;
  name: string;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
};

export class Machine {
  readonly id: number;
  readonly props: Props;

  private constructor(props: Props, id: number) {
    this.props = props;
    this.id = id;
  }

  static create(props: Props, id?: number): Result<Machine> {
    return Result.ok(new Machine(props, id));
  }
}
