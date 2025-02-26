<template>
  <BasicModal
    v-bind="$attrs"
    :title="t('form.assignHomework')"
    default-fullscreen
    :can-fullscreen="false"
    :loading="loading"
    @ok="submit"
  >
    <div class="shadow-lg rounded-lg p-1 mx-1">
      <CollapseContainer :title="t('common.basicInformation')">
        <BasicForm @register="registerForm" @field-value-change="handleFormChange" class="mt-6" />
      </CollapseContainer>
    </div>
    <div class="shadow-lg rounded-lg p-1 mx-1 mt-4">
      <CollapseContainer :title="t('common.question')">
        <template v-if="skill">
          <EditorSkill
            :skill-type="skill"
            :value="parts"
            :max="1"
            :allow-add-part="false"
            @update-parts="handleUpdateParts"
          />
        </template>
      </CollapseContainer>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { BasicModal } from '@/components/Modal';
  import { ref, watch } from 'vue';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useI18n } from '@/hooks/web/useI18n';
  import { SkillType } from '@/api/exam/examModel';
  import EditorSkill from '@/views/test/skill/EditorSkill.vue';
  import { READING_PART_DEF } from '@/views/test/data';
  import { useDesign } from '@/hooks/web/useDesign';
  import { NewPartItem } from '@/views/test/types/question';
  import { assignHomeworkFormSchemas } from '../classroom/data';
  import { useForm, BasicForm } from '@/components/Form';
  import { assignExercise } from '@/api/exercise/exercise';
  import { ClassListItem } from '@/api/class/classModel';
  import { CollapseContainer } from '@/components/Container';
  import { getLeftValue } from '@/utils/stringUtils';

  const props = defineProps({
    classList: {
      type: Array as PropType<ClassListItem[]>,
      default: () => [],
    },
  });

  const emit = defineEmits(['success']);

  const { t } = useI18n();
  const [registerForm, { validate, resetFields, updateSchema }] = useForm({
    labelWidth: 120,
    schemas: assignHomeworkFormSchemas,
    showActionButtonGroup: false,
    actionColOptions: {
      span: 24,
    },
  });
  const { createMessage, createErrorModal, createSuccessModal } = useMessage();
  const prefixCls = useDesign('assign-homework');

  const loading = ref(false);
  const skill = ref<SkillType | null>(null);
  const parts = ref<NewPartItem[]>([READING_PART_DEF]);

  function handleFormChange(key, value) {
    if (key === 'skill') {
      skill.value = value;
    } else if (key === 'class_id') {
      const shifts = value
        ? props.classList.find((cls: ClassListItem) => cls.id === value)?.shifts || []
        : [];

      updateSchema({
        field: 'shift_id',
        componentProps: {
          options: shifts.map((shift) => ({ label: shift.title, value: shift.id })),
        },
      });
    }
  }

  function handleUpdateParts(partsUpdated: NewPartItem[]) {
    parts.value = partsUpdated;
  }

  async function submit() {
    try {
      const [values] = await Promise.all([validate()]);
      const { book_name, skill, homework_name, class_id, shift_id, date, assign_at } = values;
      if (parts.value.length === 0 || parts.value[0].question_groups.length === 0) {
        createMessage.error(t('common.pleaseCreateQuestions'));
        return;
      }
      const submitForm: any = {
        book_name,
        skill,
        homework_name,
        assign_at,
        assignment: {
          class_id,
          shift_id,
          date: getLeftValue(date),
        },
        question_groups: parts.value[0].question_groups,
      };

      const result = await assignExercise(submitForm);
      if (result) {
        createSuccessModal({
          title: t('form.assignHomework'),
          content: t('common.createSuccessfully'),
          // getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
        });
        resetFields();
        emit('success');
      }
    } catch (error) {
      if (error.errorFields) {
        return;
      }
      console.log(error);
      const apiMessage = error.response.data.message;
      createErrorModal({
        title: t('sys.api.errorTip'),
        content:
          apiMessage || (error as unknown as Error).message || t('sys.api.networkExceptionMsg'),
        getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
      });
    } finally {
      loading.value = false;
    }
  }

  watch(
    () => props.classList,
    (newVal) => {
      const options = newVal.map((val) => ({ label: val.title, value: val.id }));
      console.log('op', options);
      updateSchema({
        field: 'class_id',
        componentProps: { options },
      });
    },
  );
</script>
