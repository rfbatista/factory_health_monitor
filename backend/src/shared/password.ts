import * as bcrypt from "bcryptjs";

export class Password {
  private _salt: string;
  private pwdhash: string;
  private constructor(hash: string, salt: string) {
    this.pwdhash = hash;
    this._salt = salt;
  }

  static async fromRaw(password: string): Promise<Password> {
    const salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hashSync(password, salt);
    return new Password(hash, salt);
  }

  static fromHash(pwdhash: string, salt: string) {
    return new Password(pwdhash, salt);
  }

  get hash() {
    return this.pwdhash;
  }

  get salt() {
    return this._salt;
  }

  isEqualTo(value: string) {
    const hash = bcrypt.hashSync(value, this._salt);
    return this.hash === hash;
  }
}
