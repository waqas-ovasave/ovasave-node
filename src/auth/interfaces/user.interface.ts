export enum Role {
  Admin = 'admin',
  User = 'user',
}

type User = {
  id: number;
  email: string;
  password: string;
  role: Role | string;
};

export interface IAuthenticate {
  readonly user: User;
  readonly token: string;
}
