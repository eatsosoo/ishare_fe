import type { FormInstance } from 'ant-design-vue/lib/form/Form';
import type {
  RuleObject,
  NamePath,
  Rule as ValidationRule,
} from 'ant-design-vue/lib/form/interface';
import { ref, computed, unref, Ref } from 'vue';
import { useI18n } from '@/hooks/web/useI18n';

export enum LoginStateEnum {
  LOGIN,
  REGISTER,
  RESET_PASSWORD,
  MOBILE,
  QR_CODE,
}

const currentState = ref(LoginStateEnum.LOGIN);

// 这里也可以优化
// import { createGlobalState } from '@vueuse/core'

export function useLoginState() {
  function setLoginState(state: LoginStateEnum) {
    currentState.value = state;
  }

  const getLoginState = computed(() => currentState.value);

  function handleBackLogin() {
    setLoginState(LoginStateEnum.LOGIN);
  }

  return { setLoginState, getLoginState, handleBackLogin };
}

export function useFormValid<T extends Object = any>(formRef: Ref<FormInstance>) {
  const validate = computed(() => {
    const form = unref(formRef);
    return form?.validate ?? ((_nameList?: NamePath) => Promise.resolve());
  });

  async function validForm() {
    const form = unref(formRef);
    if (!form) return;
    const data = await form.validate();
    return data as T;
  }

  return { validate, validForm };
}

export function useFormRules(formData?: Recordable) {
  const { t } = useI18n();

  const getUsernameFormRule = computed(() =>
    createRule(t('sys.login.accountPlaceholder'), 'user_name'),
  );
  const getNameFormRule = computed(() => createRule(t('sys.login.namePlaceholder'), 'name'));
  const getPasswordFormRule = computed(() =>
    createRule(t('sys.login.passwordPlaceholder'), 'password'),
  );
  const getMobileFormRule = computed(() =>
    createRule(t('sys.login.mobilePlaceholder'), 'phone_number'),
  );
  const getEmailFormRule = computed(() => createRule(t('sys.login.emailPlaceholder'), 'email'));

  const validatePolicy = async (_: RuleObject, value: boolean) => {
    return !value ? Promise.reject(t('sys.login.policyPlaceholder')) : Promise.resolve();
  };

  const validateConfirmPassword = (password: string) => {
    return async (_: RuleObject, value: string) => {
      if (!value) {
        return Promise.reject(t('sys.login.passwordPlaceholder'));
      }
      if (value !== password) {
        return Promise.reject(t('sys.login.diffPwd'));
      }
      return Promise.resolve();
    };
  };

  const getFormRules = computed((): { [k: string]: ValidationRule | ValidationRule[] } => {
    const usernameFormRule = unref(getUsernameFormRule);
    const nameFormRule = unref(getNameFormRule);
    const passwordFormRule = unref(getPasswordFormRule);
    const mobileFormRule = unref(getMobileFormRule);
    const emailFormRule = unref(getEmailFormRule);

    switch (unref(currentState)) {
      // register form rules
      case LoginStateEnum.REGISTER:
        return {
          username: usernameFormRule,
          name: nameFormRule,
          password: passwordFormRule,
          phone_number: mobileFormRule,
          email: emailFormRule,
          confirmPassword: [
            { validator: validateConfirmPassword(formData?.password), trigger: 'change' },
          ],
          policy: [{ validator: validatePolicy, trigger: 'change' }],
        };

      // login form rules
      default:
        return {
          username: usernameFormRule,
          password: passwordFormRule,
        };
    }
  });
  return { getFormRules };
}

function createRule(message: string, type: string): ValidationRule[] {
  const baseRule: ValidationRule = {
    required: true,
    message,
    trigger: 'change',
  };

  const typeSpecificRules: Record<string, Partial<ValidationRule>> = {
    phone_number: { len: 10 },
    username: { len: 6 },
    password: { len: 8 },
    name: { len: 3 },
    email: { type: 'email' },
  };

  return [{ ...baseRule, ...typeSpecificRules[type] }];
}
