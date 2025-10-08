import * as Yup from 'yup';

import { getLoginValidationSchema } from '@/features/auth/login/schemas';

export interface SignInActionParams {
  email: string;
  password: string;
}

export interface SignInParams {
  email: string;
  password: string;
}

export type LoginFormData = Yup.InferType<ReturnType<typeof getLoginValidationSchema>>;