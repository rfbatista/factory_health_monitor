import { Result } from "../shared/result";

type Props = {
  name: string;
  unit: string;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
};

export class MachineDataType {
  readonly id: number;
  readonly props: Props;

  private constructor(props: Props, id: number) {
    this.props = props;
    this.id = id;
  }

  static create(props: Props, id?: number): Result<MachineDataType> {
    return Result.ok(new MachineDataType(props, id));
  }
}
