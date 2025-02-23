import { isArray } from '@/utils/is';
import { GroupQuestionItem } from '../test/types/question';

export function renderGroupQuestions(group: GroupQuestionItem, style: string) {
  const { question_text, question_options, question_type } = group;
  const regexMap = {
    fill_in: /\[question_(\d+)]/g,
    true_false_not_given: /\[question_(\d+)]/g,
    correct_letter: /\[question_(\d+)]/g,
    choice: /\[question_(\d+)]/g,
    multiple_choice: /\[question_(\d+(?:_\d+)*)]/g,
  };

  const generateFn = (match: string) => {
    const matchFormat = match.slice(1, -1);
    return `<input type="text" value="" name="${matchFormat}" class="${style} w-38" />`;
  };

  const generateFn2 = (match: string) => {
    if (!isArray(question_options)) return '';
    const matchFormat = match.slice(1, -1);
    return `<select value="" name="${matchFormat}" class="${style} w-22 pb-[5px]" >
      <option value=""></option>
        ${question_options.map((option) => `<option value="${option.value}" }>${option.label}</option>`)}
    </select>`;
  };

  const generateFn3 = (match: string) => {
    if (isArray(question_options) || !question_options) return '';
    const matchFormat = match.slice(1, -1);
    const html = question_options[matchFormat].map(
      (option) =>
        `<div class="flex items-center mb-2">
          <span class="bg-gray-200 font-bold mr-[10px] w-[24px] h-[24px] rounded-full text-center line-height-[24px]">
            ${option.value}
          </span>
          <label class="custom-input custom-radio">
            <input type="radio" name="${matchFormat}" value="${option.value}" />
            <span class="checkmark"></span>
            ${option.label}
          </label>
        </div>`,
    );

    return html.join('\n');
  };

  const generateFn4 = (match: string) => {
    if (!isArray(question_options)) return '';
    const matchFormat = match.slice(1, -1);
    const html = question_options.map(
      (option) => `<div class="flex items-center mb-2">
          <span class="bg-gray-200 font-bold mr-[10px] w-[24px] h-[24px] rounded-full text-center">
            ${option.value}
          </span>
          <label class="custom-input custom-checkbox">
            <input type="checkbox" name="${matchFormat}" value="${option.value}" />
            <span class="checkmark"></span>
            ${option.label}
          </label>
        </div>`,
    );
    return html.join('\n');
  };

  const fnMap = {
    fill_in: generateFn,
    true_false_not_given: generateFn2,
    correct_letter: generateFn2,
    choice: generateFn3,
    multiple_choice: generateFn4,
  };

  const finalHtml = question_text.replace(regexMap[question_type], fnMap[question_type]);

  return finalHtml;
}
