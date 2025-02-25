import { GroupQuestionItem } from '../test/types/question';

export function renderGroupQuestions(group: GroupQuestionItem, style: string, answers = {}) {
  const { question_text, question_options, question_type } = group;
  const regexMap = {
    fill_in: /\[question_(\d+)]/g,
    true_false_not_given: /\[question_(\d+)]/g,
    correct_letter: /\[question_(\d+)]/g,
    choice: /\[question_(\d+)]/g,
    multiple_choice: /\[question_(\d+(?:_\d+)*)]/g,
  };

  const generateFn = (match: string, index) => {
    const matchFormat = match.slice(1, -1);
    return `<input type="text" value="${answers[matchFormat] || ''}" name="${matchFormat}" class="${style} w-38 custom-text-input" placeholder="${index}"/>`;
  };

  const generateFn2 = (match: string) => {
    if (!question_options || !Array.isArray(question_options)) return '';
    const matchFormat = match.slice(1, -1);
    const selectedValue = answers[matchFormat] || ''; // Lấy đáp án nếu có
    return `
      <select name="${matchFormat}" class="${style} w-22 pb-[5px] custom-select-input">
        <option value=""></option>
        ${question_options
          .map(
            ({ value, label }) =>
              `<option value="${value}" ${value === selectedValue ? 'selected' : ''}>${label}</option>`,
          )
          .join('')}
      </select>`;
  };

  const generateFn5 = (match: string) => {
    if (!question_options || !Array.isArray(question_options)) return '';
    const matchFormat = match.slice(1, -1);
    const selectedValue = answers[matchFormat] || ''; // Lấy đáp án nếu có
    return `
      <select name="${matchFormat}" class="${style} w-22 pb-[5px] custom-select-input">
        <option value=""></option>
        ${question_options
          .map(
            ({ value }) =>
              `<option value="${value}" ${value === selectedValue ? 'selected' : ''}>${value}</option>`,
          )
          .join('')}
      </select>`;
  };

  const generateFn3 = (match: string) => {
    if (!question_options || Array.isArray(question_options)) return '';
    const matchFormat = match.slice(1, -1);
    const options = question_options[matchFormat] || [];
    return options
      .map(({ value, label }) => {
        const isChecked = answers[matchFormat] === value ? 'checked' : '';
        return `
          <div class="flex items-center mb-2">
            <span class="bg-gray-200 font-bold mr-[10px] w-[24px] h-[24px] rounded-full text-center line-height-[24px]">
              ${value}
            </span>
            <label class="custom-input custom-radio">
              <input type="radio" name="${matchFormat}" value="${value}" ${isChecked} />
              <span class="checkmark"></span>
              ${label}
            </label>
          </div>`;
      })
      .join('');
  };

  const generateFn4 = (match: string) => {
    if (!question_options || !Array.isArray(question_options)) return '';
    const matchFormat = match.slice(1, -1);
    const selectedAnswers = answers[matchFormat] || [];
    return question_options
      .map(({ value, label }) => {
        const isChecked =
          Array.isArray(selectedAnswers) && selectedAnswers.includes(value) ? 'checked' : '';
        return `
          <div class="flex items-center mb-2">
            <span class="bg-gray-200 font-bold mr-[10px] w-[24px] h-[24px] rounded-full text-center line-height-[24px]">
              ${value}
            </span>
            <label class="custom-input custom-checkbox">
              <input type="checkbox" name="${matchFormat}" value="${value}" ${isChecked} />
              <span class="checkmark"></span>
              ${label}
            </label>
          </div>`;
      })
      .join('');
  };

  const fnMap = {
    fill_in: generateFn,
    true_false_not_given: generateFn2,
    correct_letter: generateFn5,
    choice: generateFn3,
    multiple_choice: generateFn4,
  };

  const finalHtml = question_text.replace(regexMap[question_type], fnMap[question_type]);

  return finalHtml;
}
