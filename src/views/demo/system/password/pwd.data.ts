import { FormSchema } from '@/components/Form';
import { useI18n } from '@/hooks/web/useI18n';

const { t } = useI18n();

export const formSchema: FormSchema[] = [
  {
    field: 'passwordOld',
    label: t('form.security.oldPassword'),
    component: 'InputPassword',
    required: true,
  },
  {
    field: 'passwordNew',
    label: t('form.security.newPassword'),
    component: 'StrengthMeter',
    componentProps: {
      placeholder: t('form.security.newPassword'),
    },
    rules: [
      {
        required: true,
        message: t('form.security.passwordNotEmpty'),
      },
    ],
  },
  {
    field: 'confirmPassword',
    label: t('form.security.confirmPassword'),
    component: 'InputPassword',

    dynamicRules: ({ values }) => {
      return [
        {
          required: true,
          validator: (_, value) => {
            if (!value) {
              return Promise.reject(t('form.security.passwordNotEmpty'));
            }
            if (value !== values.passwordNew) {
              return Promise.reject(t('form.security.confirmPasswordNotMatch'));
            }
            return Promise.resolve();
          },
        },
      ];
    },
  },
];
