type Props = {
  machineName: string;
  partName: string;
  value: number;
};

export class MachineDataLog {
  machineName: string;
  partName: string;
  value: number;

  private constructor(props: Props) {
    Object.assign(this, props);
  }

  static create(props: Props): MachineDataLog {
    return new MachineDataLog(props);
  }

  toDto() {
    return {
      machineName: this.machineName,
      partName: this.partName,
      value: this.value,
    };
  }
}
