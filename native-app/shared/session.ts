export type SessionProps = {
  accessToken: string;
  refreshToken: string;
  identityToken: string;
};

export class Session {
  accessToken: string;
  refreshToken: string;
  identityToken: string;

  private constructor(props: SessionProps) {
    Object.assign(this, props);
  }

  static create(props: SessionProps) {
    return new Session(props);
  }

  toStore(): string {
    const props: SessionProps = {
      accessToken: this.accessToken,
      refreshToken: this.refreshToken,
      identityToken: this.identityToken,
    };
    return JSON.stringify(props);
  }
}
