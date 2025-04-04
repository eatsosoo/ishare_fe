<template>
  <BasicModal
    v-bind="$attrs"
    :title="t('form.assignFromBank')"
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
  </BasicModal>
</template>
<script lang="ts" setup>
  import { BasicModal } from '@/components/Modal';
  import { ref, watch } from 'vue';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useI18n } from '@/hooks/web/useI18n';
  import { SkillType } from '@/api/exam/examModel';
  import { useDesign } from '@/hooks/web/useDesign';
  import { assignByBankSchemas } from '../classroom/data';
  import { useForm, BasicForm } from '@/components/Form';
  import { assignExerciseByBank, studyDateListApi } from '@/api/exercise/exercise';
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
    schemas: assignByBankSchemas,
    showActionButtonGroup: false,
    actionColOptions: {
      span: 24,
    },
  });
  const { createErrorModal, createSuccessModal } = useMessage();
  const prefixCls = useDesign('assign-homework');

  const loading = ref(false);
  const skill = ref<SkillType | null>(null);

  async function handleFormChange(key, value) {
    if (key === 'skill') {
      skill.value = value;
    } else if (key === 'class_id') {
      const shifts = value
        ? props.classList.find((cls: ClassListItem) => cls.id === value)?.shifts || []
        : [];

      const res = await studyDateListApi(value);
      const studyDateList = res.items || [];

      updateSchema([
        {
          field: 'shift_id',
          componentProps: {
            options: shifts.map((shift) => ({ label: shift.title, value: shift.id })),
          },
        },
        {
          field: 'study_date',
          componentProps: {
            options: studyDateList.map((date) => ({ label: date, value: date })),
          },
        },
      ]);
    }
  }

  async function submit() {
    try {
      const [values] = await Promise.all([validate()]);
      const { exam_bank_id, class_id, shift_id, date, assign_at, study_date, title } = values;

      const submitForm: any = {
        exam_bank_id,
        assign_at,
        assignments: {
          class_id,
          shift_id,
          study_date,
          title,
        },
        deadline: getLeftValue(date),
      };

      const result = await assignExerciseByBank(submitForm);
      if (result) {
        createSuccessModal({
          title: t('form.assignFromBank'),
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
      updateSchema([
        {
          field: 'class_id',
          componentProps: { options },
        },
      ]);
    },
  );
</script>
