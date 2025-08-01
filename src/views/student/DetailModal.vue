<template>
  <BasicModal
    v-bind="$attrs"
    default-fullscreen
    :can-fullscreen="false"
    :loading="loading"
    :show-ok-btn="false"
    :title="props.title"
  >
    <template v-if="props.skillType === 'Reading' || props.skillType === 'Listening'">
      <Row :gutter="[16, 16]" class="h-full">
        <Col
          :span="12"
          class="border-r-2 border-gray h-full overflow-auto"
          :class="isDark ? '' : 'bg-[aliceblue]'"
        >
          <div class="p-4">
            <div v-if="props.skillType !== 'Listening'" v-html="subjectRef"></div>
            <div v-else>
              <Card v-if="completedAssignment && completedAssignment.media" class="mb-4 bg-red-300">
                <audio :src="completedAssignment.media" controls class="h-8 w-full"></audio>
              </Card>
              <div v-for="(part, pIdx) in completedAssignment?.parts" :key="part.id || pIdx">
                <div
                  v-for="(group, gIdx) in part.question_groups"
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
          </div>
        </Col>
        <Col :span="12" class="border-l-2 border-gray h-full overflow-auto">
          <div class="p-4">
            <div
              v-for="(part, index) in completedAssignment?.parts"
              :key="'part' + index"
              class="mb-4"
            >
              <h2 class="font-bold">Part {{ index + 1 }}</h2>
              <div class="grid grid-cols-2 gap-4">
                <div v-for="(group, gIdx) in part.question_groups" :key="gIdx">
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
                        {{ key.split('_')[1] }}-{{ key.split('_').pop() }}
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
              v-for="(group, index) in completedAssignment.parts[0].question_groups"
              class="p-4"
              :key="index"
            >
              <h1>Task {{ index + 1 }}</h1>
              <div v-html="group.question_text"></div>
            </div>
          </template>
          <template v-else>
            <Card
              v-for="(part, index) in completedAssignment.parts"
              class="m-2 mr-0 shadow-sm"
              :title="`Part ${index + 1}`"
              :key="part.id || index"
            >
              <div v-for="(group, index) in part.question_groups" :key="index">
                <p class="text-primary text-md">Question {{ index + 1 }}</p>
                <div v-html="group.question_text"></div>
              </div>
            </Card>
          </template>
        </Col>

        <!-- Bài làm của học sinh -->
        <Col :span="12" class="border-l-2 border-gray h-full overflow-auto">
          <div v-if="props.skillType === 'Writing'" class="p-4" ref="contentWord">
            <div
              v-for="(group, index) in completedAssignment.parts[0].question_groups"
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
          <div v-else>
            <Card
              v-for="(part, index) in completedAssignment.parts"
              class="mt-2 mb-4 shadow-sm"
              :key="part.id || index"
              :title="`Part ${index + 1}`"
            >
              <audio
                v-if="part.part_answer"
                :src="part.part_answer"
                controls
                class="h-8 w-full"
              ></audio>
            </Card>
          </div>

          <!-- Feedback  -->
          <Card class="shadow-md" :title="t('common.gradingAndFeedback')">
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
                <template v-if="gradingFormData.feedback">
                  <a-button
                    v-if="props.skillType === 'Writing'"
                    type="link"
                    @click="openWindow(gradingFormData.feedback)"
                  >
                    {{ t('common.clickToView') }}
                  </a-button>
                  <span v-else class="ml-2">{{ gradingFormData.feedback }}</span>
                </template>
                <template v-else>
                  <span class="ml-2">{{ t('common.noFeedbackYet') }}</span>
                </template>
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
  import { SkillType, ResponseExamPartItem } from '@/api/exam/examModel';
  import { getDetailExamOfStudent } from '@/api/student/student';
  import Icon from '@/components/Icon/Icon.vue';
  import { openWindow } from '@/utils';
  import { useDarkModeTheme } from '@/hooks/setting/useDarkModeTheme';
  import { renderGroupQuestions } from '../take/helpers';
  import { exportHtmlToDocx } from '@/utils/exportToDocx';
  import { compareAnswers } from '@/utils/stringUtils';

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
    times: {
      type: Number,
      default: 1,
    },
    title: {
      type: String,
      default: '',
    },
  });

  const { t } = useI18n();
  const { isDark } = useDarkModeTheme();

  const gradingFormData = ref({
    score: 0,
    feedback: '',
  });
  const loading = ref(false);
  const completedAssignment = ref<ResponseExamPartItem | null>(null);
  const tabActive = ref(0);
  const subjectRef = ref('');
  const contentWord = ref<HTMLDivElement | null>(null);

  function clickTab(index: number) {
    if (!completedAssignment.value) return;
    const { subject } = completedAssignment.value.parts[index];
    subjectRef.value = subject;
    tabActive.value = index;
  }

  async function getExamOfStudent(
    studentId: number,
    examId: number,
    type: SkillType,
    times: number,
  ) {
    try {
      loading.value = true;
      const result = await getDetailExamOfStudent(studentId, examId, type, times);
      if (result && result.items) {
        completedAssignment.value = result.items;
        const explanation = completedAssignment.value.parts[0].question_groups[0].explanation;
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
    () => [props.examId, props.times],
    ([newExamId, newTimes]) => {
      if (newExamId) {
        getExamOfStudent(props.studentId, newExamId, props.skillType, newTimes);
      }
    },
  );

  watch(
    () => completedAssignment.value,
    () => {
      clickTab(0);
    },
  );
</script>
