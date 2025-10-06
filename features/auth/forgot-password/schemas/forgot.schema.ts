import * as Yup from 'yup';

export const getForgotValidationSchema = (t: (key: string) => string) => {
  return Yup.object({
    email: Yup.string()
      .email(t('validation.emailInvalid'))
      .required(t('validation.emailRequired')),
  });
};


