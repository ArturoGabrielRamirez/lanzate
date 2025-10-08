export interface SignUpActionParams {
  email: string;
  password: string;
}

export interface SignUpParams {
  email: string;
  password: string;
}

export interface CreateUserParams {
  email: string;
  supabaseUserId?: string;
  avatar?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  provider?: string;
}

