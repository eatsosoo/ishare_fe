<template>
  <BasicModal
    v-bind="$attrs"
    :title="props.titleEditor"
    default-fullscreen
    :can-fullscreen="false"
    :loading="loading"
  >
    <Card class="mx-2">
      <div class="flex gap-4">
        <div>
          <Select v-model:value="skillSelected" :options="SKILL_OPTIONS" class="w-30" />
        </div>
        <div class="w-25">
          <InputNumber v-model:value="duration" :min="10">
            <template #addonBefore>
              <FieldTimeOutlined />
            </template>
          </InputNumber>
        </div>
        <div v-if="skillSelected === 'Listening'" class="flex items-center gap-2">
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
      </div>
    </Card>
    <Reading :value="computedT" :skill-type="skillSelected" @update-parts="handleUpdateParts" />

    <template #footer>
      <a-button type="primary" @click="submitAll"
        >{{ t('common.saveText') }} {{ skillSelected }}</a-button
      >
    </template>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { BasicModal } from '@/components/Modal';
  import { computed, ref, watch } from 'vue';
  import { examDetailApi, examSkillApi, uploadAudioApi } from '@/api/exam/exam';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useI18n } from '@/hooks/web/useI18n';
  import { ExamDetailItem, ExamSkillForm, SkillType } from '@/api/exam/examModel';
  import { Card, InputNumber, Select, Upload } from 'ant-design-vue';
  import Reading from '@/views/test/skill/Reading2.vue';
  import { SKILL_OPTIONS } from '@/views/test/data';
  import { useDesign } from '@/hooks/web/useDesign';
  import { useGlobSetting } from '@/hooks/setting';
  import { getToken } from '@/utils/auth';
  import { NewPartItem } from './types/question';
  import { FieldTimeOutlined } from '@ant-design/icons-vue';

  const props = defineProps({
    examId: {
      type: Number,
      default: null,
    },
    titleEditor: {
      type: String,
      default: '',
    },
  });
  const detail = ref<ExamDetailItem | null>(null);
  const loading = ref(false);
  const skillSelected = ref<SkillType>('Reading');
  const duration = ref<number>(60);

  // audio
  const uploading = ref(false);
  const audioUrl = ref<string | null>(null);
  const fileList = ref([]);
  const headers = {
    Authorization: `Bearer ${getToken()}`,
  };

  const computedT = computed(() => {
    if (detail.value && detail.value[skillSelected.value]) {
      return detail.value[skillSelected.value].parts;
    }
    return [];
  });

  const { t } = useI18n();
  const { prefixCls } = useDesign('editor-skill-exam');
  const { createMessage, createErrorModal, createSuccessModal } = useMessage();
  const { uploadUrl } = useGlobSetting();

  function handleUpdateParts(partsUpdated: NewPartItem[]) {
    console.log(partsUpdated);
    if (!detail.value) return;

    detail.value[skillSelected.value] ??= {
      id: null,
      duration: duration.value,
      media: audioUrl.value,
      type: skillSelected.value,
      parts: [],
    };

    detail.value[skillSelected.value].parts = partsUpdated;
  }

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
    console.log(status);
    if (status === 'done') {
      createMessage.success(t('common.uploadFileSuccess', { name }));
      audioUrl.value = url;
    } else if (status === 'error') {
      createMessage.error(t('common.uploadFileFail', { name }));
    }
    console.log(audioUrl.value);
  }

  async function getExamDetail(examId: number) {
    try {
      loading.value = true;
      const result = await examDetailApi(examId);
      detail.value = result;
      audioUrl.value = result.Listening.media;
    } catch (error) {
      createMessage.error(t('sys.app.dataNotFound'));
    } finally {
      loading.value = false;
    }
  }

  async function submitAll() {
    if (!detail.value) {
      return;
    }
    try {
      loading.value = true;
      const submitForm: ExamSkillForm = {
        ...detail.value[skillSelected.value],
        duration: duration.value,
        type: skillSelected.value,
        media: skillSelected.value === 'Listening' ? audioUrl.value : null,
      };
      console.log(submitForm);
      const result = await examSkillApi(props.examId, submitForm);
      if (result) {
        createSuccessModal({
          title: t('form.exam.editSkill', { skill: skillSelected.value }),
          content: t('common.createSuccessfully'),
          getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
        });
      }
    } catch (error) {
      const apiMessage = error.response?.data.message;
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
    () => skillSelected.value,
    (newVal) => {
      if (detail.value) {
        duration.value = detail.value[newVal] ? detail.value[newVal].duration : 10;
      }
      // console.log(detail.value?.Listening, newVal);
    },
  );

  watch(
    () => props.examId,
    (value) => {
      getExamDetail(value);
    },
  );
</script>
