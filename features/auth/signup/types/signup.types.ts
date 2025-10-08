import * as Yup from 'yup';

import { getSignupValidationSchema } from '@/features/auth/signup/schemas';

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

export type SignUpFormData = Yup.InferType<ReturnType<typeof getSignupValidationSchema>>;
