import * as yup from 'yup';
import i18n from '../i18n';

const t = (key: string) => i18n.t(`errors:${key}`);

export const userSchema = yup.object({
  userName: yup
    .string()
    .required(t('usernameRequired'))
    .max(10, t('usernameMax')),
  email: yup.string().required(t('emailRequired')).email(t('emailInvalid')),
  password: yup
    .string()
    .required(t('passwordRequired'))
    .min(8, t('passwordMin'))
    .matches(/[a-z]/, t('passwordLower'))
    .matches(/[A-Z]/, t('passwordUpper'))
    .matches(/[0-9]/, t('passwordNumber'))
    .matches(/[!@#$%^&*(),.?":{}|<>]/, t('passwordSpecial')),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], t('passwordsMatch'))
    .required(t('confirmPassword')),
});

export const loginSchema = yup.object({
  email: yup.string().required(t('emailRequired')).email(t('emailInvalid')),
  password: yup.string().required(t('passwordRequired')),
});

export const emailSchema = yup.object({
  email: yup.string().required(t('emailRequired')).email(t('emailInvalid')),
});

export const resetPasswordSchema = yup.object({
  password: yup
    .string()
    .required(t('passwordRequired'))
    .min(8, t('passwordMin'))
    .matches(/[a-z]/, t('passwordLower'))
    .matches(/[A-Z]/, t('passwordUpper'))
    .matches(/[0-9]/, t('passwordNumber'))
    .matches(/[!@#$%^&*(),.?":{}|<>]/, t('passwordSpecial')),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], t('passwordsMatch'))
    .required(t('confirmPassword')),
});

export const changePasswordSchema = yup.object({
  currentPassword: yup.string().required(t('currentPasswordRequired')),
  newPassword: yup
    .string()
    .required(t('newPasswordRequired'))
    .min(8, t('passwordMin'))
    .matches(/[a-z]/, t('passwordLower'))
    .matches(/[A-Z]/, t('passwordUpper'))
    .matches(/[0-9]/, t('passwordNumber'))
    .matches(/[!@#$%^&*(),.?":{}|<>]/, t('passwordSpecial')),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], t('passwordsMatch'))
    .required(t('confirmPasswordRequired')),
});
