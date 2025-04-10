<template>
  <BasicModal
    v-bind="$attrs"
    default-fullscreen
    :can-fullscreen="false"
    :loading="loading"
    :show-ok-btn="false"
  >
    <template v-if="props.skillType === 'Reading' || props.skillType === 'Listening'">
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
                <Icon
                  :icon="
                    compareAnswers(value, JSON.parse(group.student_answer)[key])
                      ? 'ant-design:check-outlined'
                      : 'ant-design:close-outlined'
                  "
                  :color="
                    compareAnswers(value, JSON.parse(group.student_answer)[key]) ? 'green' : 'red'
                  "
                  class="ml-4"
                />
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
                <span>{{
                  props.score === -1 || props.score === null ? t('common.noScoreYet') : props.score
                }}</span>
              </FormItem>
              <FormItem
                :label="t('common.feedback')"
                name="feedback"
                :label-col="{ span: 3 }"
                label-align="left"
              >
                <a-button
                  v-if="gradingFormData.feedback"
                  type="link"
                  @click="openWindow(gradingFormData.feedback)"
                >
                  {{ t('common.clickToView') }}
                </a-button>
                <span v-else class="ml-2">{{ t('common.noFeedbackYet') }}</span>
              </FormItem>
            </Form>
          </Card>
        </Col>
      </Row>
    </template>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { BasicModal } from '@/components/Modal';
  import { Row, Col, Form, FormItem, Card } from 'ant-design-vue';
  import { ref, type PropType, watch } from 'vue';
  import { useI18n } from '@/hooks/web/useI18n';
  import { SkillType } from '@/api/exam/examModel';
  import { getResExercise } from '@/api/student/student';
  import Icon from '@/components/Icon/Icon.vue';
  import { isArray } from 'lodash-es';
  import { saveAs } from 'file-saver';
  import { openWindow } from '@/utils';
  import { ExerciseResultItem } from '@/api/exercise/exerciseModel';
  import { useDarkModeTheme } from '@/hooks/setting/useDarkModeTheme';
  import { renderGroupQuestions } from '../take/helpers';

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
    score: {
      type: Number,
      default: 0,
    },
  });

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

  async function getExamOfStudent(studentId: number, examId: number) {
    try {
      loading.value = true;
      const result = await getResExercise(studentId, examId);
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

  const compareAnswers = (correctAnswer: string | string[], studentAnswer: string) => {
    if (!correctAnswer || !studentAnswer) return false;
    if (!isArray(correctAnswer)) {
      return correctAnswer.toLowerCase() === studentAnswer.toLowerCase();
    } else {
      const value2Array = studentAnswer.split(',');

      // Kiểm tra xem tất cả phần tử của value2Array có trong value1 không
      const isContained = value2Array.every((val) => correctAnswer.includes(val));
      return isContained;
    }
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

    const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
    saveAs(blob, `${props.title}.doc`);
  };

  watch(
    () => [props.examId],
    ([newExamId]) => {
      if (newExamId) {
        getExamOfStudent(props.studentId, newExamId);
      }
    },
  );
</script>
