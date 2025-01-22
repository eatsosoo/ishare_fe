import type { DropMenu } from '../components/Dropdown';
import type { LocaleSetting, LocaleType } from '#/config';

export const LOCALE: { [key: string]: LocaleType } = {
  ZH_CN: 'zh_CN',
  EN_US: 'en',
  VI: 'vi',
};

export const localeSetting: LocaleSetting = {
  showPicker: true,
  // Locale
  locale: LOCALE.VI,
  // Default locale
  fallback: LOCALE.VI,
  // available Locales
  availableLocales: [LOCALE.VI, LOCALE.EN_US, LOCALE.ZH_CN],
};

// locale list
export const localeList: DropMenu[] = [
  {
    text: '简体中文',
    event: LOCALE.ZH_CN,
  },
  {
    text: 'English',
    event: LOCALE.EN_US,
  },
  {
    text: 'Tiếng Việt',
    event: LOCALE.VI,
  },
];
