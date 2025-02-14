<template>
  <div class="bg-white px-2 mb-8">
    <Tabs v-model:activeKey="activeKey" @change="handleChangeTab">
      <TabPane v-for="(item, index) in tabs" :key="item.key" :tab="item.tab">
        <Row :gutter="[16, 16]">
          <Col :span="12">
            <div class="flex items-center gap-2 mb-4">
              <Upload
                name="media"
                :beforeUpload="beforeUpload"
                :fileList="fileList"
                :action="uploadUrl"
                :headers="headers"
                :showUploadList="false"
                @change="handleChangeFile"
              >
                <a-button preIcon="ant-design:upload-outlined" :loading="uploading">{{
                  t('common.uploadAudio')
                }}</a-button>
              </Upload>
              <audio
                src="https://api-gateway.danda.vn/uploads/uploads/2025/02/1739288105_file_example_MP3_700KB.mp3"
                controls
                class="h-8"
              ></audio>
            </div>
            <div class="p-4 re-box-shadow rounded-lg">
              <Tinymce v-model="listeningParts[index].subject" :height="550" />
            </div>
          </Col>
          <Col :span="12">
            <div class="flex gap-2 ml-4 mb-2">
              <div
                v-for="(question, idx) in listeningParts[index].questions"
                :key="`${item.key}_${idx}`"
                class="border rounded-full h-10 w-10 flex items-center justify-center cursor-pointer"
                :class="
                  questionCurrent.question_no === question.question_no
                    ? 'border-blue text-blue'
                    : 'border-gray text-gray'
                "
                @click="questionCurrent = { ...question }"
              >
                {{ question.question_no }}
              </div>
              <a-button
                v-if="listeningParts[index].questions.length <= 10"
                class="border rounded-full h-10 w-10 flex items-center justify-center cursor-pointer"
                @click="handleAddQuestion(index)"
                >+</a-button
              >
            </div>
            <div class="re-box-shadow rounded-lg pa-4 w-full">
              <template v-if="questionCurrent">
                <Question
                  :value="questionCurrent"
                  @update:value="handleUpdateQuestion(index, $event)"
                />
              </template>
              <template v-else>
                <h3>{{ `${t('common.pleaseSelectQuestion')} ${item.tab}` }}</h3>
              </template>
            </div>
          </Col>
        </Row>
      </TabPane>

      <template v-if="listeningParts.length < 3 && !isHomework" #rightExtra>
        <a-button type="default" @click="handleAddTab">{{ t('common.add') }} Section</a-button>
      </template>
    </Tabs>
  </div>
</template>
<script lang="ts" setup>
  import { computed, ref, watch } from 'vue';
  import { Tinymce } from '@/components/Tinymce';
  import { Col, Row, Tabs, Upload } from 'ant-design-vue';
  import { useI18n } from '@/hooks/web/useI18n';
  import { LISTENING_DEFAULT } from './data';
  import { QuestionItem } from './types/question';
  import Question from './Question.vue';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useDesign } from '@/hooks/web/useDesign';
  import { examPartApi } from '@/api/exam/exam';
  import { ExamPartForm, ExamPartItem, ExtendedQuestionItem } from '@/api/exam/examModel';
  import { useGlobSetting } from '@/hooks/setting';
  import { getToken } from '@/utils/auth';

  const props = defineProps({
    value: {
      type: Array as PropType<ExamPartItem[]>,
      default: LISTENING_DEFAULT,
    },
    isHomework: {
      type: Boolean,
      default: false,
    },
  });

  const TabPane = Tabs.TabPane;
  const headers = {
    Authorization: `Bearer ${getToken()}`,
  };

  const activeKey = ref(0);
  const questionCurrent = ref<ExtendedQuestionItem>(props.value[0].questions[0]);
  const listeningParts = ref<ExamPartItem[]>(props.value);
  const loading = ref(false);
  const uploading = ref(false);
  const fileList = ref([]);
  const audioUrl = ref('');

  const tabs = computed(() => {
    return Array.from({ length: listeningParts.value.length }, (_, i) => ({
      key: i,
      tab: `Section ${i + 1}`,
    }));
  });

  const { t } = useI18n();
  const { createMessage, createErrorModal, createSuccessModal } = useMessage();
  const { prefixCls } = useDesign('register');
  const { uploadUrl } = useGlobSetting();

  function handleUpdateQuestion(partIdx: number, value: QuestionItem) {
    const questionIndex = listeningParts.value[partIdx].questions.findIndex(
      (item) => item.question_no === questionCurrent.value?.question_no,
    );
    if (questionIndex !== -1) {
      listeningParts.value[partIdx].questions[questionIndex] = value;
    }

    createMessage.success(t('common.updateSuccess'));
  }

  function handleAddQuestion(partIdx: number) {
    const questions = listeningParts.value[partIdx].questions;
    const lastEl = questions.at(-1); // Lấy phần tử cuối cùng mà không xóa

    const questionNo = lastEl ? lastEl.question_no + 1 : 1; // Nếu rỗng, bắt đầu từ 1

    questions.push({
      question_no: questionNo,
      content: `Question ${questionNo} ?`,
      type: 'choice',
      options: ['A', 'B', 'C', 'D'].map((id) => ({ id, text: '' })),
      answer: null,
    });
  }

  function handleAfterSubmit(result: ExamPartItem) {
    listeningParts.value[activeKey.value] = result;
  }

  function handleAddTab() {
    listeningParts.value.push({ ...LISTENING_DEFAULT[0] });
  }

  function handleChangeTab() {
    questionCurrent.value = listeningParts.value[activeKey.value].questions[0];
  }

  // upload file
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

  function beforeUpload(file: File) {
    const isAudio = file.type.startsWith('audio/');
    if (!isAudio) {
      createMessage.error(t('sys.validate.uploadOnlyAudio'));
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      createMessage.error(t('sys.validate.minFileSize', { size: '2MB' }));
    }
    return isAudio && isLt2M;
  }

  async function submitAll(examId: number) {
    try {
      loading.value = true;
      const { subject, questions } = listeningParts.value[activeKey.value];
      const submitForm: ExamPartForm = {
        exam_id: examId,
        type: 'Listening',
        subject,
        questions,
        duration: 40,
        media: audioUrl.value,
        questions_count: questions.length,
      };
      console.log(submitForm);
      const result = await examPartApi(submitForm);
      if (result) {
        createSuccessModal({
          title: t('form.exam.title', { skill: 'Reading' }),
          content: t('common.createSuccessfully'),
          getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
        });
        handleAfterSubmit(result);
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
    () => props.value,
    (value) => {
      listeningParts.value = value.length === 0 ? LISTENING_DEFAULT : value;
      questionCurrent.value = listeningParts.value[0].questions[0];
      activeKey.value = 0;
    },
  );

  defineExpose({
    submitAll,
  });
</script>

<style lang="less" scoped>
  .listening-exercise-card {
    padding: 10px;
    border-radius: 8px;
    background-color: white;
  }

  .re-box-shadow {
    box-shadow:
      rgb(50 50 93 / 25%) 0 2px 5px -1px,
      rgb(0 0 0 / 30%) 0 1px 3px -1px;
  }
</style>
