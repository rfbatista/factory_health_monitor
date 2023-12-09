import { Result } from "../shared/result";

type Props = {
  machineId: number;
  machineDataTypeId: number;
  value: number;
  createdAt: Date;
  deletedAt: Date;
};

export class MachineDataPoint {
  readonly id: number;
  readonly props: Props;

  private constructor(props: Props, id: number) {
    this.props = props;
    this.id = id;
  }

  static create(props: Props, id: number): Result<MachineDataPoint> {
    return Result.ok(new MachineDataPoint(props, id));
  }
}
