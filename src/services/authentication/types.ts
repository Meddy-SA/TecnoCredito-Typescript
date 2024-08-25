export type LoginDto = {
  user: string;
  password: string;
  machine?: string;
}

export type UserData = {
  userName: string;
  name: string;
  lastName: string;
  email: string;
  password: string;
  userId?: string;
  avatar?: string;
  token?: string;
  menu?: string;
}

export const DefaultUser: UserData = {
  userName: '',
  name: '',
  lastName: '',
  email: '',
  password: '',
  avatar: '',
  token: '',
  menu: '',
}
