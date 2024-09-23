export type LoginDto = {
  user: string;
  password: string;
  machine?: string;
};

export type UserData = {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  fullName?: string;
  userId?: string;
  avatar?: string;
  token?: string;
  menu?: string;
};

export const DefaultUser: UserData = {
  userName: "",
  firstName: "",
  lastName: "",
  fullName: "",
  email: "",
  password: "",
  avatar: "",
  token: "",
  menu: "",
};
