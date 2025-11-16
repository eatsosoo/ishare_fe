<template>
  <BasicModal
    v-bind="$attrs"
    default-fullscreen
    :can-fullscreen="false"
    :loading="loading"
    :show-ok-btn="false"
    :title="props.title"
  >
    <template
      v-if="
        props.skillType === 'Reading' ||
        props.skillType === 'Listening' ||
        props.skillType === 'Vocabulary'
      "
    >
      <Row :gutter="[16, 16]" class="h-full">
        <Col
          :span="12"
          class="border-r-2 border-gray h-full overflow-auto"
          :class="isDark ? '' : 'bg-[aliceblue]'"
        >
          <div class="p-4">
            <div v-if="props.skillType !== 'Listening'" v-html="completedAssignment?.subject"></div>
            <div v-else>
              <Card v-if="completedAssignment && completedAssignment.media" class="mb-4 bg-red-300">
                <audio :src="completedAssignment.media" controls class="h-8 w-full"></audio>
              </Card>
              <div
                v-for="(group, gIdx) in completedAssignment?.question_groups"
                :key="group.id || gIdx"
                class="p-4 mb-4 bg-white rounded-lg shadow-md"
              >
                <h2 class="text-primary"
                  >Questions
                  {{
                    group.question_no.length > 1
                      ? `${group.question_no[0]} - ${group.question_no.at(-1)}`
                      : group.question_no[0]
                  }}</h2
                >
                <div v-html="renderGroupQuestions(group, classStyle, [])"></div>
              </div>
            </div>
          </div>
        </Col>
        <Col :span="12" class="border-l-2 border-gray h-full overflow-auto">
          <div class="p-4">
            <div v-for="(group, gIdx) in completedAssignment?.question_groups" :key="gIdx">
              <div
                v-for="(value, key) in group.question_answer"
                :key="key"
                class="flex items-center mb-4"
              >
                <!-- Xử lý multiple_choice -->
                <template v-if="group.question_type === 'multiple_choice'">
                  <div
                    class="w-8 h-8 bg-[#c4303a] text-white font-bold flex items-center justify-center rounded-full mr-2 text-[11px]"
                  >
                    {{ typeof key === 'string' ? key.split('_')[1] : '' }}-{{
                      typeof key === 'string' ? key.split('_').pop() : ''
                    }}
                  </div>
                </template>
                <template v-else>
                  <div
                    class="w-8 h-8 bg-[#c4303a] text-white font-bold text-sm flex items-center justify-center rounded-full mr-2"
                  >
                    {{ key.split('_')[1] }}
                  </div>
                </template>

                <span class="text-[#c4303a]">{{
                  group.question_type === 'multiple_choice' ? value.join(',') : value
                }}</span
                >:
                {{ JSON.parse(group.student_answer)[key] }}

                <!-- So sánh đúng/sai và hiển thị icon -->
                <template v-if="group.question_type !== 'multiple_choice'">
                  <Icon
                    :icon="
                      compareAnswers(
                        value,
                        JSON.parse(group.student_answer)[key],
                        group.question_type,
                      )
                        ? 'ant-design:check-outlined'
                        : 'ant-design:close-outlined'
                    "
                    :color="
                      compareAnswers(
                        value,
                        JSON.parse(group.student_answer)[key],
                        group.question_type,
                      )
                        ? 'green'
                        : 'red'
                    "
                    class="ml-4"
                  />
                </template>
                <template v-else>
                  <span class="ml-2"
                    >{{ countMultiAnswer(value, JSON.parse(group.student_answer)[key]) }}/{{
                      value.length
                    }}</span
                  >
                </template>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </template>
    <template v-else>
      <Row v-if="completedAssignment" :gutter="[16, 16]" class="h-full">
        <!-- Questions -->
        <Col
          :span="12"
          class="border-r-2 border-gray h-full overflow-auto"
          :class="isDark ? '' : 'bg-[aliceblue]'"
        >
          <template v-if="props.skillType === 'Writing'">
            <div
              v-for="(group, index) in completedAssignment.question_groups"
              class="p-4"
              :key="index"
            >
              <h1>Task {{ index + 1 }}</h1>
              <div v-html="group.question_text"></div>
            </div>
          </template>
          <template v-else>
            <Card class="m-4">
              <div v-for="(group, index) in completedAssignment.question_groups" :key="index">
                <p class="text-primary text-md font-500">Question {{ index + 1 }}</p>
                <div v-html="group.question_text"></div>
              </div>
            </Card>
          </template>
        </Col>

        <!-- Bài làm của học sinh -->
        <Col :span="12" class="border-l-2 border-gray h-full overflow-auto">
          <div v-if="props.skillType === 'Writing'" class="p-4" ref="contentWord">
            <div
              v-for="(group, index) in completedAssignment.question_groups"
              :key="'answer' + index"
              class="mb-4"
            >
              <h2>Task {{ index + 1 }}</h2>
              <div v-html="Object.values(JSON.parse(group.student_answer))[0]"></div>
            </div>
            <a-button
              preIcon="ant-design:file-word-twotone"
              @click="exportToWord"
              class="mt-4 mr-2"
              >{{ t('common.download') }}</a-button
            >
          </div>
          <Card :title="t('common.audioOfStudent')" class="m-4" v-else>
            <audio
              v-if="completedAssignment.part_answer"
              :src="completedAssignment.part_answer"
              controls
              class="h-8 w-full"
            ></audio>
          </Card>

          <!-- Feedback  -->
          <Card class="m-4" :title="t('common.gradingAndFeedback')">
            <Form :model="gradingFormData">
              <FormItem
                :label="t('common.score')"
                name="score"
                :label-col="{ span: 3 }"
                label-align="left"
              >
                <InputNumber v-model:value="gradingFormData.score" :min="0" :max="10" required />
              </FormItem>
              <FormItem
                :label="t('common.feedback')"
                name="feedback"
                :label-col="{ span: 3 }"
                label-align="left"
              >
                <template v-if="props.skillType === 'Writing'">
                  <Upload
                    name="media"
                    :beforeUpload="beforeUpload"
                    :fileList="fileList"
                    :action="gradingFormData.feedback"
                    :headers="headers"
                    :showUploadList="false"
                    :customRequest="handleCustomUpload"
                    class="mb-4"
                    @change="handleChangeFile"
                  >
                    <a-button preIcon="ant-design:upload-outlined" :loading="uploading">{{
                      t('common.uploadFeedback')
                    }}</a-button>
                  </Upload>
                  <a-button
                    v-if="gradingFormData.feedback"
                    type="link"
                    @click="openWindow(gradingFormData.feedback)"
                  >
                    {{ t('common.clickToView') }}
                  </a-button>
                  <span v-else class="ml-2">{{ t('common.noFeedbackYet') }}</span>
                </template>
                <template v-else>
                  <Textarea v-model:value="gradingFormData.feedback" required :rows="10" />
                </template>
              </FormItem>
              <div class="flex justify-end">
                <a-button type="primary" @click="submitAll">{{ t('common.confirm') }}</a-button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </template>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { BasicModal } from '@/components/Modal';
  import { Row, Col, InputNumber, Form, FormItem, Upload, Card, Textarea } from 'ant-design-vue';
  import { ref, type PropType, watch } from 'vue';
  import { useI18n } from '@/hooks/web/useI18n';
  import { SkillType } from '@/api/exam/examModel';
  import { getResExercise } from '@/api/student/student';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useDesign } from '@/hooks/web/useDesign';
  import { GradingForm } from '@/api/teacher/teacherModel';
  import { submitGradingHomeworkApi } from '@/api/teacher/teacher';
  import Icon from '@/components/Icon/Icon.vue';
  import { getToken } from '@/utils/auth';
  import { uploadAudioApi } from '@/api/exam/exam';
  import { openWindow } from '@/utils';
  import { ExerciseResultItem } from '@/api/exercise/exerciseModel';
  import { useDarkModeTheme } from '@/hooks/setting/useDarkModeTheme';
  import { renderGroupQuestions } from '../take/helpers';
  import { exportHtmlToDocx } from '@/utils/exportToDocx';
  import { compareAnswers } from '@/utils/stringUtils';
  import PropsPanel from '../form-design/components/VFormDesign/modules/PropsPanel.vue';

  const classStyle =
    'bg-white rounded-full text-center outline-red-400 outline-1 border-gray-300 border-1 p-1 shadow-md h-[32px]';

  const props = defineProps({
    skillType: {
      type: String as PropType<SkillType>,
      default: 'Reading',
    },
    // id của đề thi
    examId: {
      type: Number,
    },
    studentId: {
      type: Number,
    },
    // id của bài làm
    scoreId: {
      type: Number,
    },
    times: {
      type: Number,
      default: 1,
    },
    title: {
      type: String,
    },
    score: {
      type: Number,
    },
    assignAt: {
      type: String,
    },
  });

  const emit = defineEmits(['submit-grading']);

  const { t } = useI18n();
  const { isDark } = useDarkModeTheme();
  const gradingFormData = ref({
    score: 0,
    feedback: '',
  });
  const loading = ref(false);
  const completedAssignment = ref<ExerciseResultItem | null>(null);
  const contentWord = ref<HTMLDivElement | null>(null);

  // uploadfile
  const uploading = ref(false);
  const fileList = ref([]);
  const headers = {
    Authorization: `Bearer ${getToken()}`,
  };
  // end upload file

  const { createMessage, createSuccessModal, createErrorModal } = useMessage();
  const { prefixCls } = useDesign('register');

  async function submitAll() {
    try {
      const { examId, studentId, scoreId, times, skillType } = props;
      if (!examId || !studentId || !scoreId) return;

      loading.value = true;
      const answerW = completedAssignment.value?.question_groups.map((group) => {
        return {
          id: group.id,
          is_correct: true,
          explanation: gradingFormData.value.feedback,
          question_count: 1,
        };
      });
      const submitForm: GradingForm = {
        exam_id: examId,
        user_id: studentId,
        score_id: scoreId,
        times: times ?? 1,
        type: skillType,
        answers: answerW,
        score: gradingFormData.value.score,
      };

      const result = await submitGradingHomeworkApi(submitForm);
      if (result) {
        createSuccessModal({
          title: t('form.exam.editSkill', { skill: 'Reading' }),
          content: t('common.completedGrading'),
          getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
        });
        emit('submit-grading');
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

  async function getExamOfStudent(studentId: number, examId: number, times: number) {
    try {
      loading.value = true;
      const result = await getResExercise(studentId, examId, times);
      if (result && result.items) {
        completedAssignment.value = result.items;
        const explanation = completedAssignment.value.question_groups[0].explanation;
        gradingFormData.value = {
          score: props.score && props.score > 0 ? props.score : 0,
          feedback: explanation || '',
        };
      }
    } catch (error) {
      console.log(error);
    } finally {
      loading.value = false;
    }
  }

  const countMultiAnswer = (correctAnswer: string[], studentAnswer: string) => {
    if (!correctAnswer || !studentAnswer) return 0;
    const value2Array = studentAnswer.split(',');
    let count = 0;
    for (let i = 0; i < correctAnswer.length; i++) {
      if (value2Array.includes(correctAnswer[i])) {
        count++;
      }
    }
    return count;
  };

  // const countCorrectAnswers = (group) => {
  //   let correctCount = 0;
  //   const studentAnswers = JSON.parse(group.student_answer);
  //   for (let key in group.question_answer) {
  //     if (group.question_answer[key].toLowerCase() === studentAnswers[key]?.toLowerCase()) {
  //       correctCount++;
  //     }
  //   }
  //   return correctCount;
  // };

  const exportToWord = async () => {
    const htmlContent = `
    <html>
      <head><meta charset="UTF-8"></head>
      <body>${contentWord.value?.innerHTML}</body>
    </html>
  `;

    exportHtmlToDocx(htmlContent, `${props.title}.docx`);
  };

  watch(
    () => [props.examId, props.studentId, props.scoreId, props.times],
    ([newExamId, newStudentId, newScoreId, newTimes]) => {
      if (newExamId && newStudentId && newScoreId && newTimes) {
        if (props.assignAt !== 'exam') {
          console.log(newTimes);
          getExamOfStudent(newStudentId, newExamId, newTimes);
        }
      }
    },
  );

  function beforeUpload(file: File) {
    const isAudioOrWord =
      file.type.startsWith('audio/') ||
      file.type === 'application/msword' ||
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    if (!isAudioOrWord) {
      createMessage.error(t('sys.validate.uploadOnlyAudioOrWord'));
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      createMessage.error(t('sys.validate.minFileSize', { size: '2MB' }));
    }
    return isAudioOrWord && isLt2M;
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
        gradingFormData.value.feedback = result.items;
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
      gradingFormData.value.feedback = url;
    } else if (status === 'error') {
      createMessage.error(t('common.uploadFileFail', { name }));
    }
  }
</script>
