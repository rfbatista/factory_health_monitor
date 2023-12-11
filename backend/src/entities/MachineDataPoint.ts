import { Result } from "../shared/result";

type Props = {
  machineId: number;
  machineDataTypeId: number;
  value: number;
  createdAt?: Date | null;
  deletedAt?: Date | null;
};

export class MachineDataPointDto {
  id: number;
  value: number;
  createdAt?: Date | null;
  deletedAt?: Date | null;
}

export class MachineDataPoint {
  readonly id: number;
  readonly props: Props;

  private constructor(props: Props, id: number) {
    this.props = props;
    this.id = id;
  }

  static create(props: Props, id?: number): Result<MachineDataPoint> {
    return Result.ok(new MachineDataPoint(props, id));
  }

  toDto(): MachineDataPointDto {
    const dto = new MachineDataPointDto();
    dto.id = this.id;
    dto.value = this.props.value;
    dto.createdAt = this.props.createdAt;
    return dto;
  }
}
