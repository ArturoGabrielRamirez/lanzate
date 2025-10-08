import * as Yup from 'yup';

export const getLoginValidationSchema = (t: (key: string) => string) => {
  return Yup.object({
    email: Yup.string()
      .email(t('validation.emailInvalid'))
      .required(t('validation.emailRequired')),
    password: Yup.string()
      .min(8, t('validation.passwordMin'))
      .required(t('validation.passwordRequired')),
  });
};
