import { ComponentType } from '../../types/componentType';
import { useI18n } from '@/hooks/web/useI18n';

const { t } = useI18n();

/**
 * @description: 生成placeholder
 */
export function createPlaceholderMessage(component: ComponentType) {
  if (component.includes('TimeRangePicker')) {
    return [t('common.start'), t('common.end')];
  }

  if (component.includes('Input') || component.includes('AutoComplete')) {
    return t('common.inputText');
  }
  if (component.includes('Picker')) {
    return t('common.chooseText');
  }

  if (
    component.includes('Select') ||
    component.includes('Checkbox') ||
    component.includes('Radio') ||
    component.includes('Switch') ||
    component.includes('DatePicker') ||
    component.includes('TimePicker')
  ) {
    return t('common.chooseText');
  }

  return '';
}

export function formatTime(value: string) {
  const date = new Date(value);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  const formattedTime = `${hours}:${minutes}:${seconds}`;

  return formattedTime;
}
