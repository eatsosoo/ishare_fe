<template>
  <BasicModal
    v-bind="$attrs"
    :title="'Chỉnh sửa lựa chọn câu hỏi'"
    width="1000px"
    :can-fullscreen="false"
    :show-ok-btn="false"
  >
    <div>
      <component :is="renderPreviewComponent" />
    </div>
  </BasicModal>
</template>

<script setup lang="tsx">
  import { defineComponent, h, computed } from 'vue';
  import { SelectQuestionType } from '@/views/test/types/question';
  import BasicModal from '@/components/Modal/src/BasicModal.vue';

  const props = defineProps({
    content: {
      type: String,
      default: '',
    },
    answers: {
      type: Object as PropType<{ [key: string]: string }>,
      default: () => ({}),
    },
    answerOptions: {
      type: Array as PropType<{ label: string; value: string }[]>,
      default: () => [],
    },
    typeAnswer: {
      type: String as PropType<SelectQuestionType>,
      default: 'fill_in',
    },
  });

  const emit = defineEmits(['update:answers']);

  const classStyle =
    'bg-white rounded-full text-center outline-red-400 outline-1 border-gray-300 border-1 p-1 shadow-md h-[32px]';

  // ✅ Component inline để render input/select/radio
  const renderPreviewComponent = computed(() =>
    defineComponent({
      render() {
        const handleInputChange = (match: string, event: Event) => {
          emit('update:answers', {
            ...props.answers,
            [match]: (event.target as HTMLInputElement).value,
          });
        };

        const regex = /\[question_(\d+)]/g;

        const generateInput = (match: string) =>
          h('input', {
            type: 'text',
            value: props.answers[match] || '',
            name: match,
            class: `${classStyle} w-38`,
            onInput: (event: Event) => handleInputChange(match, event),
          });

        const generateSelect = (match: string) =>
          h(
            'select',
            {
              name: match,
              class: `${classStyle} w-22 pb-[5px]`,
              onChange: (event: Event) => handleInputChange(match, event),
            },
            props.answerOptions.map((option) =>
              h(
                'option',
                {
                  value: option.value,
                  selected: props.answers[match] === option.value,
                },
                option.label,
              ),
            ),
          );

        const generateRadio = (match: string) =>
          h(
            'div',
            {},
            props.answerOptions.map((option) =>
              h('div', { class: 'flex items-center mb-2' }, [
                h(
                  'span',
                  { class: 'bg-gray-400 font-bold mr-[10px] w-[24px] rounded-full text-center' },
                  option.value,
                ),
                h('label', { class: 'custom-radio' }, [
                  h('input', {
                    type: 'radio',
                    name: match,
                    value: option.value,
                    checked: props.answers[match] === option.value,
                    onChange: (event: Event) => handleInputChange(match, event),
                  }),
                  h('span', { class: 'checkmark' }),
                  option.label,
                ]),
              ]),
            ),
          );

        const fnMap = {
          fill_in: generateInput,
          true_false_not_given: generateSelect,
          correct_letter: generateSelect,
          choice: generateRadio,
        };

        if (!fnMap[props.typeAnswer]) {
          console.warn(`Invalid typeAnswer: ${props.typeAnswer}`);
          return h('div', 'Lỗi: Không xác định loại câu hỏi');
        }

        const contentNodes = [];
        let lastIndex = 0;
        props.content.replace(regex, (match, _, index) => {
          // ✨ **Thêm text trước input**
          if (index > lastIndex) {
            contentNodes.push(h('span', {}, props.content.substring(lastIndex, index)));
          }

          // ✨ **Thêm input/select/radio vào**
          contentNodes.push(fnMap[props.typeAnswer](match));

          lastIndex = index + match.length;
        });

        // ✨ **Thêm phần text còn lại**
        if (lastIndex < props.content.length) {
          contentNodes.push(h('span', {}, props.content.substring(lastIndex)));
        }
        return h('div', {}, contentNodes);
      },
    }),
  );
</script>
