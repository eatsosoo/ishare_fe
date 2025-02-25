<template>
  <div class="bg-white">
    <div class="bg-white p-4 flex justify-between border-gray-200 border-b-1 border-b">
      <a-button type="primary" ghost>{{ timeLeft }}</a-button>
      <a-button type="primary" @click="submitExam">Submit</a-button>
    </div>

    <div ref="htmlContainer" class="custom-html">
      <template v-if="state.type === 'Reading'">
        <TakeReading v-if="skillExam" :value="skillExam" />
      </template>
      <template v-else-if="state.type === 'Listening'">
        <TakeListening v-if="skillExam" :value="skillExam" />
      </template>
      <template v-else-if="state.type === 'Writing'">
        <TakeWriting v-if="skillExam" :value="skillExam" />
      </template>
      <template v-else-if="state.type === 'Speaking'">
        <TakeSpeaking v-if="skillExam" :value="skillExam" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue';
  import { SkillItem } from '@/views/test/types/question';
  import { examDetailApi } from '@/api/exam/exam';
  import { useRoute, useRouter } from 'vue-router';
  import { SkillType } from '@/api/exam/examModel';
  import { toNumber } from 'lodash-es';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useLoading } from '@/components/Loading';
  import TakeReading from './TakeReading.vue';
  import TakeListening from './TakeListening.vue';
  import TakeWriting from './TakeWriting.vue';
  import TakeSpeaking from './TakeSpeaking.vue';

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
  const htmlContainer = ref<any>(null);

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

  const getInputValues = () => {
    if (!htmlContainer.value) return;

    const inputs = htmlContainer.value.querySelectorAll(
      'input[name^="question_"], select[name^="question_"]',
    );

    const values: Record<string, string | string[]> = {};

    inputs.forEach((input) => {
      const name = input.getAttribute('name') || '';

      if (input.type === 'radio') {
        if ((input as HTMLInputElement).checked) {
          values[name] = (input as HTMLInputElement).value;
        }
      } else if (input.type === 'checkbox') {
        if ((input as HTMLInputElement).checked) {
          values[name] = values[name]
            ? [...(values[name] as string[]), input.value]
            : [input.value];
        }
      } else {
        values[name] = (input as HTMLInputElement | HTMLSelectElement).value;
      }
    });

    console.log(values);
  };

  function submitExam() {
    getInputValues();
  }

  getExamDetail(state.examId);
</script>

<style lang="scss">
  .custom-html {
    table {
      width: 100%;
      border-collapse: collapse;
    }

    table,
    th,
    td {
      border: 1px solid black;
    }

    th,
    td {
      padding: 8px;
      text-align: left;
    }

    /* ======= 📌 Custom Radio & Checkbox ======= */
    .custom-input {
      display: flex;
      align-items: center;
      font-size: 16px;
      cursor: pointer;
      gap: 10px;
    }

    .custom-text-input::placeholder {
      opacity: 1; /* Đảm bảo không bị mờ */
      color: #e8202a;
      font-size: 18px;
      font-weight: bold;
    }

    .custom-select-input {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    /* Ẩn input mặc định */
    .custom-input input {
      display: none;
    }

    /* 🎯 Radio Style */
    .custom-radio .checkmark {
      display: flex;
      position: relative;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      transition: all 0.3s ease;
      border: 1px solid gray;
      border-radius: 50%;
    }

    /* Khi radio được chọn */
    .custom-radio input:checked + .checkmark::before {
      content: '';
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #e8202a;
    }

    /* 🔲 Checkbox Style */
    .custom-checkbox .checkmark {
      display: flex;
      position: relative;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      transition: all 0.3s ease;
      border: 1px solid gray;
      border-radius: 4px; /* 🛑 Vuông thay vì tròn */
    }

    /* Khi checkbox được chọn -> Thêm dấu tick */
    .custom-checkbox input:checked + .checkmark::before {
      content: '✔';
      color: white;
      font-size: 14px;
      font-weight: bold;
    }

    .custom-checkbox input:checked + .checkmark {
      border-color: #e8202a;
      background: #e8202a;
    }
  }
</style>
