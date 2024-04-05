interface UserState {
  userType: "CUSTOMER" | "SELLER" | "ADMIN";
  id: number;
  name: string;
  email: string;
  fullname?: string;
  company_name: string;
}

type State = {
  user: UserState;
};

type UserAction = {
  type: string;
  user: UserState;
};

type DispatchType = (args: UserAction) => UserAction;

type Tokens = {
  access_token: string,
  refresh_token: string
}
