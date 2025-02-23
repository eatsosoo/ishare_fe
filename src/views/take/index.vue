<template>
  <div class="bg-white">
    <div class="bg-white p-4 flex justify-between border-gray-200 border-b-1 border-b">
      <a-button type="primary" ghost>{{ timeLeft }}</a-button>
      <a-button type="primary">Submit</a-button>
    </div>

    <Row :gutter="[16, 16]" class="h-[84vh] w-[100vw]">
      <Col :span="12" class="bg-[aliceblue] border-r-2 border-gray h-full overflow-auto">
        <div class="p-4">
          <audio
            v-if="skillExam?.media"
            :src="skillExam?.media"
            controls
            class="h-8"
            autoplay
          ></audio>
          <div>
            <div v-html="skillExam?.parts[state.tabActive].subject"></div>
          </div>
        </div>
      </Col>
      <Col :span="12" class="border-gray border-l-2 h-full overflow-auto p-4">
        <div
          v-for="group in skillExam?.parts[state.tabActive].question_groups"
          :key="group.id"
          class="px-4"
        >
          <h2 class="text-primary"
            >Questions
            {{
              group.question_no.length > 1
                ? `${group.question_no[0]} - ${group.question_no.at(-1)}`
                : group.question_no[0]
            }}</h2
          >
          <div v-html="renderGroupQuestions(group)"></div>
        </div>
      </Col>
    </Row>

    <div class="absolute bottom-0 bg-white box-shadow border-t w-full border-gray-200 border-t-1">
      <div class="flex gap-4 py-2 px-2">
        <div
          v-for="(p, index) in skillExam?.parts"
          :key="index"
          @click="clickTab(index)"
          :class="
            state.tabActive === index
              ? 'shrink-0 border-[#e8202a]'
              : 'flex-1 cursor-pointer border-gray'
          "
          class="border-1 py-4 px-6 rounded-xl"
        >
          <div v-if="state.tabActive === index" class="flex items-center">
            <div class="text-xl font-semibold mr-2">Part {{ index + 1 }}</div>
            <div class="flex gap-2">
              <div v-for="(group, gIdx) in p.question_groups" :key="gIdx" class="flex gap-2">
                <div
                  v-for="q in group.question_no"
                  :key="q"
                  class="rounded-full h-8 w-8 border flex items-center justify-center border-gray-200"
                >
                  {{ q }}
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-lg text-center">
            <span class="font-semibold mr-4">Part {{ index + 1 }}</span>
            <span class="font-light font-italic"
              >of {{ countQuestions(p.question_groups) }} questions</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue';
  import { GroupQuestionItem, SkillItem } from '@/views/test/types/question';
  import { examDetailApi } from '@/api/exam/exam';
  import { useRoute, useRouter } from 'vue-router';
  import { SkillType } from '@/api/exam/examModel';
  import { isArray, toNumber } from 'lodash-es';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useI18n } from '@/hooks/web/useI18n';
  import { Col, Row } from 'ant-design-vue';
  import { classStyle } from '../test/data';
  import { useLoading } from '@/components/Loading';

  const route = useRoute();
  const router = useRouter();

  if (!route.query.id || !route.query.type) {
    router.push('/dashboard');
  }

  const state = reactive({
    examId: toNumber(route.query.id),
    type: route.query.type as SkillType,
    tabActive: 0,
    loading: false,
    duration: 0,
  });
  const skillExam = ref<SkillItem | null>(null);
  const loading = ref(false);

  // time left
  const timeLeft = ref('');
  const interval = setInterval(() => {
    const minutes = Math.floor(state.duration / 60);
    const seconds = state.duration % 60;
    timeLeft.value = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    if (state.duration <= 0) {
      clearInterval(interval);
      // Handle exam end logic here
    }
    state.duration--;
  }, 1000);
  // end time left

  const { t } = useI18n();
  const { createMessage } = useMessage();
  const [openFullLoading, closeFullLoading] = useLoading({
    tip: 'Loading...',
  });

  function clickTab(index: number) {
    state.tabActive = index;
  }

  function countQuestions(groups: GroupQuestionItem[]) {
    return groups.reduce((total, group) => {
      return (total += group.question_count);
    }, 0);
  }

  async function getExamDetail(examId: number) {
    try {
      openFullLoading();
      const result = await examDetailApi(examId);
      skillExam.value = result[state.type];
      state.duration = result[state.type].duration * 60;
    } catch (error) {
      createMessage.error(t('sys.app.dataNotFound'));
    } finally {
      closeFullLoading();
    }
  }

  function renderGroupQuestions(group: GroupQuestionItem) {
    const { question_text, question_options, question_type } = group;
    const regexMap = {
      fill_in: /\[question_(\d+)]/g,
      true_false_not_given: /\[question_(\d+)]/g,
      correct_letter: /\[question_(\d+)]/g,
      choice: /\[question_(\d+)]/g,
      multiple_choice: /\[question_(\d+(?:_\d+)*)]/g,
    };

    const generateFn = (match: string) => {
      const matchFormat = match.slice(1, -1);
      return `<input type="text" value="" name="${matchFormat}" class="${classStyle} w-38" />`;
    };

    const generateFn2 = (match: string) => {
      if (!isArray(question_options)) return '';
      const matchFormat = match.slice(1, -1);
      return `<select value="" name="${matchFormat}" class="${classStyle} w-22 pb-[5px]" >
        <option value=""></option>
          ${question_options.map((option) => `<option value="${option.value}" }>${option.label}</option>`)}
      </select>`;
    };

    const generateFn3 = (match: string) => {
      if (isArray(question_options) || !question_options) return '';
      const matchFormat = match.slice(1, -1);
      const html = question_options[matchFormat].map(
        (option) =>
          `<div class="flex items-center mb-2">
            <span class="bg-gray-200 font-bold mr-[10px] w-[24px] rounded-full text-center">
              ${option.value}
            </span>
            <label class="custom-input custom-radio">
              <input type="radio" name="${matchFormat}" value="${option.value}" />
              <span class="checkmark"></span>
              ${option.label}
            </label>
          </div>`,
      );

      return html.join('\n');
    };

    const generateFn4 = (match: string) => {
      if (!isArray(question_options)) return '';
      const matchFormat = match.slice(1, -1);
      const html = question_options.map(
        (option) => `<div class="flex items-center mb-2">
            <span class="bg-gray-200 font-bold mr-[10px] w-[24px] rounded-full text-center">
              ${option.value}
            </span>
            <label class="custom-input custom-checkbox">
              <input type="checkbox" name="${matchFormat}" value="${option.value}" />
              <span class="checkmark"></span>
              ${option.label}
            </label>
          </div>`,
      );
      return html.join('\n');
    };

    const fnMap = {
      fill_in: generateFn,
      true_false_not_given: generateFn2,
      correct_letter: generateFn2,
      choice: generateFn3,
      multiple_choice: generateFn4,
    };

    const finalHtml = question_text.replace(regexMap[question_type], fnMap[question_type]);

    return finalHtml;
  }

  getExamDetail(state.examId);
</script>
