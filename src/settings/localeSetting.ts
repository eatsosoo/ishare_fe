import type { DropMenu } from '../components/Dropdown';
import type { LocaleSetting, LocaleType } from '#/config';

export const LOCALE: { [key: string]: LocaleType } = {
  VI: 'vi',
  EN_US: 'en',
};

export const localeSetting: LocaleSetting = {
  showPicker: true,
  // Locale
  locale: LOCALE.VI,
  // Default locale
  fallback: LOCALE.VI,
  // available Locales
  availableLocales: [LOCALE.VI, LOCALE.EN_US],
};

// locale list
export const localeList: DropMenu[] = [
  {
    text: 'English',
    event: LOCALE.EN_US,
  },
  {
    text: 'Tiếng Việt',
    event: LOCALE.VI,
  },
];
