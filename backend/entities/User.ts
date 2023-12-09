import { Password } from "../shared/password";
import { Result } from "../shared/result";

type Props = {
  name?: string | null;
  email: string;
  password: Password;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
};

export class User {
  readonly id: number;
  private props: Props;

  private constructor(props: Props, id: number) {
    this.props = props;
    this.id = id;
  }

  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get password(): string {
    return this.props.password.hash;
  }

  get salt(): string {
    return this.props.password.salt;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get deletedAt() {
    return this.props.deletedAt;
  }

  isValidPassword(value: string) {
    return this.props.password.isEqualTo(value);
  }

  static create(props: Props, id: number): Result<User> {
    return Result.ok(new User(props, id));
  }
}
