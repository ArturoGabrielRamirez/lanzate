import * as Yup from 'yup';

export const getSignupValidationSchema = (t: (key: string) => string) => {
  return Yup.object({
    email: Yup.string()
      .email(t('validation.emailInvalid'))
      .required(t('validation.emailRequired')),
    password: Yup.string()
      .min(8, t('validation.passwordMin'))
      .matches(/[a-z]/, t('validation.passwordLowercase'))
      .matches(/[A-Z]/, t('validation.passwordUppercase'))
      .matches(/[0-9]/, t('validation.passwordNumber'))
      .required(t('validation.passwordRequired')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], t('validation.passwordMatch'))
      .required(t('validation.confirmPasswordRequired')),
  });
};

