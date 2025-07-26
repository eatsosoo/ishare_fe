<template>
  <BasicModal
    v-bind="$attrs"
    :title="t('form.assignHomework')"
    default-fullscreen
    :can-fullscreen="false"
    :loading="loading"
    @ok="submit"
    @cancel="reset"
  >
    <div class="shadow-lg rounded-lg p-1 mx-1">
      <CollapseContainer :title="t('common.basicInformation')">
        <BasicForm @register="registerForm" @field-value-change="handleFormChange" class="mt-6" />
        <div v-if="skill === 'Listening'" class="flex items-center gap-2">
          <Upload
            name="media"
            :beforeUpload="beforeUpload"
            :fileList="fileList"
            :action="uploadUrl"
            :headers="headers"
            :showUploadList="false"
            :customRequest="handleCustomUpload"
            @change="handleChangeFile"
          >
            <a-button preIcon="ant-design:upload-outlined" :loading="uploading">{{
              t('common.uploadAudio')
            }}</a-button>
          </Upload>
          <audio v-if="audioUrl" :src="audioUrl" controls class="h-8"></audio>
        </div>
      </CollapseContainer>
    </div>

    <div class="shadow-lg rounded-lg p-1 mx-1 mt-4">
      <SelectClass @select="attendanceTarget = $event" ref="selectClassRef" />
    </div>

    <div class="shadow-lg rounded-lg p-1 mx-1 mt-4">
      <CollapseContainer :title="t('common.question')">
        <template v-if="skill">
          <EditorSkill
            :skill-type="skill"
            :value="parts"
            :max="1"
            :allow-add-part="false"
            :show-duration="false"
            :mode="'exercise'"
            @update-parts="handleUpdateParts"
          />
        </template>
      </CollapseContainer>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { BasicModal } from '@/components/Modal';
  import { h, ref } from 'vue';
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
  import { CollapseContainer } from '@/components/Container';
  import { getLeftValue } from '@/utils/stringUtils';
  import { uploadAudioApi } from '@/api/exam/exam';
  import { getToken } from '@/utils/auth';
  import { useGlobSetting } from '@/hooks/setting';
  import { Upload } from 'ant-design-vue';
  import { cloneDeep } from 'lodash-es';
  import SelectClass from './SelectClass.vue';

  const emit = defineEmits(['success']);

  const { t } = useI18n();
  const [registerForm, { validate, resetFields, updateSchema, setFieldsValue }] = useForm({
    labelWidth: 120,
    schemas: assignHomeworkFormSchemas,
    showActionButtonGroup: false,
    actionColOptions: {
      span: 24,
    },
  });
  const { createMessage, createConfirm, createErrorModal, createSuccessModal } = useMessage();
  const prefixCls = useDesign('assign-homework');
  const { uploadUrl } = useGlobSetting();

  const loading = ref(false);
  const skill = ref<SkillType | null>(null);
  const parts = ref<NewPartItem[]>([cloneDeep(READING_PART_DEF)]);

  const selectClassRef = ref();
  const attendanceTarget = ref({
    class_id: 0,
    shift_id: 0,
    study_date: '',
  });

  // audio
  const uploading = ref(false);
  const audioUrl = ref<string | null>(null);
  const fileList = ref([]);
  const headers = {
    Authorization: `Bearer ${getToken()}`,
  };

  async function handleFormChange(key, value) {
    if (key === 'skill') {
      updateSchema([
        {
          field: 'duration',
          componentProps: {
            disabled: value === 'Speaking',
          },
        },
      ]);

      if (!skill.value) {
        skill.value = value;
        return;
      }
      createConfirm({
        iconType: 'warning',
        title: () => h('span', t('sys.app.logoutTip')),
        content: () => h('span', t('common.warning.changeSkill')),
        onOk: () => {
          skill.value = value;
          parts.value = [cloneDeep(READING_PART_DEF)];
        },
        onCancel: () => {
          setFieldsValue({ skill: skill.value });
        },
      });
    }
  }

  function handleUpdateParts(partsUpdated: NewPartItem[]) {
    parts.value = partsUpdated;
    if (skill.value !== 'Speaking') {
      return;
    }
    const totalDuration = partsUpdated[0].question_groups.reduce((total, item) => {
      return total + item.question_duration;
    }, 0);
    setFieldsValue({
      duration: totalDuration,
    });
  }

  async function submit() {
    try {
      const [values] = await Promise.all([validate()]);
      const { book_name, skill, homework_name, date, assign_at, duration } = values;
      const { class_id, shift_id, study_date } = attendanceTarget.value;
      if (parts.value.length === 0 || parts.value[0].question_groups.length === 0) {
        createMessage.error(t('common.pleaseCreateQuestions'));
        return;
      }

      if (skill === 'Listening' && !audioUrl.value) {
        createMessage.error(t('common.error.pleaseUploadAudio'));
        return;
      }

      if (!class_id || !shift_id || !study_date) {
        createErrorModal({
          title: t('form.assignHomework'),
          content: t('form.selectClass'),
        });
        return;
      }

      const submitForm: any = {
        book_name,
        skill,
        homework_name,
        assign_at,
        duration,
        assignment: {
          class_id,
          shift_id,
          date: getLeftValue(date),
          study_date,
        },
        subject: parts.value[0].subject,
        media: skill === 'Listening' ? audioUrl.value : null,
        question_groups: parts.value[0].question_groups,
      };

      const result = await assignExercise(submitForm);
      if (result) {
        createSuccessModal({
          title: t('form.assignHomework'),
          content: t('common.createSuccessfully'),
          // getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
        });
        reset();
        emit('success');
      }
    } catch (error) {
      if (error.errorFields) {
        return;
      }
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

  // Upload audio
  function beforeUpload(file: File) {
    const isAudio = file.type.startsWith('audio/');
    if (!isAudio) {
      createMessage.error(t('sys.validate.uploadOnlyAudio'));
    }
    // const isLt2M = file.size / 1024 / 1024 < 2;
    // if (!isLt2M) {
    //   createMessage.error(t('sys.validate.minFileSize', { size: '2MB' }));
    // }
    // return isAudio && isLt2M;
    return isAudio;
  }

  const handleCustomUpload = async ({
    file,
    onSuccess,
    onError,
  }: {
    file: any;
    onSuccess?: any;
    onError?: any;
  }) => {
    const formData = new FormData();
    formData.append('media', file);

    try {
      uploading.value = true;
      const result = await uploadAudioApi(formData);
      if (result) {
        audioUrl.value = result.items;
      }
      onSuccess(result);
    } catch (error) {
      console.error('Upload failed:', error);
      onError(error);
    } finally {
      uploading.value = false;
    }
  };

  // processing upload file
  function handleChangeFile(info: Record<string, any>) {
    const file = info.file;
    const status = file?.status;
    const url = file?.response?.result.items;
    const name = file?.name;

    if (status === 'done') {
      createMessage.success(t('common.uploadFileSuccess', { name }));
      audioUrl.value = url;
    } else if (status === 'error') {
      createMessage.error(t('common.uploadFileFail', { name }));
    }
  }

  function reset() {
    resetFields();
    skill.value = null;
    parts.value = [cloneDeep(READING_PART_DEF)];
    audioUrl.value = null;
    fileList.value = [];
    attendanceTarget.value = {
      class_id: 0,
      shift_id: 0,
      study_date: '',
    };
    selectClassRef.value.reset();
  }
</script>
