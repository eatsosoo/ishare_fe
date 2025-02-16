<template>
  <div>
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'score'">{{
          record.score ? `${record.score}/${record.total_questions}` : t('common.noScoreYet')
        }}</template>
        <template v-if="column.key === 'status'">
          <Tag :color="record.completed_at ? 'green' : 'red'">
            {{ record.completed_at ? 'v' : 'x' }}
          </Tag>
        </template>
        <template v-if="column.key === 'action' && !record.completed_at">
          <a-button
            size="small"
            preIcon="ant-design:edit-filled"
            @click="clickOpen(record.exam_id, record.skill)"
          />
        </template>
      </template>
    </BasicTable>

    <div ref="domRef" v-show="isDomFullscreen" class="bg-white">
      <div class="mb-4 flex items-center justify-end gap-2 m-4">
        <a-button type="default">Thời gian: {{ timeLeft }}</a-button>
        <a-button type="primary" @click="submitExam"> Nộp bài </a-button>
      </div>
      <div class="px-4 h-full">
        <ExamineType1
          v-if="currentType === 'Reading' || currentType === 'Listening'"
          :value="examPart"
          @update-answer="answer = $event"
        />
        <ExamineType2
          v-else-if="currentType === 'Speaking'"
          :value="examPart"
          @update-answer="answer = $event"
        />
        <ExamineType3 v-else :value="examPart" @update-answer="answer = $event" />
      </div>
    </div>

    <BasicModal @register="register" title="Xác nhận" width="50%" @ok="submitExam">
      <p>Bạn có muốn nộp bài trước thời hạn không?</p>
    </BasicModal>
  </div>
</template>
<script lang="ts" setup>
  import { onBeforeUnmount, onMounted, ref } from 'vue';
  import { useFullscreen } from '@vueuse/core';

  import { type Nullable } from '@vben/types';
  import BasicTable from '@/components/Table/src/BasicTable.vue';
  import { useTable } from '@/components/Table';
  import { useI18n } from '@/hooks/web/useI18n';
  import {
    getExamOfStudentColumns,
    getSearchExamOfStudentConfig,
  } from '@/views/classroom/tableData';
  import { Tag } from 'ant-design-vue';
  import ExamineType1 from './ExamineType1.vue';
  import { getExamListOfStudentApi } from '@/api/student/student';
  import { examDetailApi, examSubmitApi } from '@/api/exam/exam';
  import { ExamPartItem, SkillType } from '@/api/exam/examModel';
  import { BasicModal, useModal } from '@/components/Modal';
  import { useMessage } from '@/hooks/web/useMessage';
  import ExamineType3 from './ExamineType3.vue';
  import ExamineType2 from './ExamineType2.vue';

  const domRef = ref<Nullable<HTMLElement>>(null);
  const { toggle: toggleDom, isFullscreen: isDomFullscreen } = useFullscreen(domRef);
  const { t } = useI18n();
  const [register, { openModal }] = useModal();
  const { createMessage } = useMessage();

  const timeLeft = ref('');
  const examDuration = ref(40 * 60); // Example: 1 hour in seconds
  const loading = ref(false);
  const examPart = ref<ExamPartItem[]>([]);
  const answer = ref<{ question_id: number; answer: string | string[] }[]>([]);
  const currentExamId = ref<number | null>(null);
  const currentType = ref<SkillType>('Reading');

  const interval = setInterval(() => {
    const minutes = Math.floor(examDuration.value / 60);
    const seconds = examDuration.value % 60;
    timeLeft.value = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    if (examDuration.value <= 0) {
      clearInterval(interval);
      // Handle exam end logic here
    }
    examDuration.value--;
  }, 1000);

  const [registerTable, { reload }] = useTable({
    api: getExamListOfStudentApi(),
    columns: getExamOfStudentColumns(),
    useSearchForm: true,
    formConfig: getSearchExamOfStudentConfig(),
    showTableSetting: false,
    tableSetting: { fullScreen: true },
    showIndexColumn: true,
    rowKey: 'id',
    showSelectionBar: false,
    actionColumn: {
      title: t('table.action'),
      dataIndex: 'action',
    },
  });

  function clickOpen(examId: number, skill: SkillType) {
    console.log(examId);
    currentExamId.value = examId;
    currentType.value = skill;
    getExamDetail(examId, skill);
    toggleDom();
  }

  function preventF5(event) {
    if (event.key === 'F5' || event.key === 'Escape') {
      event.preventDefault();
    }
  }

  async function getExamDetail(examId: number, skill: string) {
    try {
      loading.value = true;
      const result = await examDetailApi(examId);
      examPart.value = result[skill];
      examDuration.value = result[skill].reduce((total, part) => total + part.duration, 0) * 60;
    } catch (error) {
      console.log(error);
      // createMessage.error(t('sys.app.dataNotFound'));
    } finally {
      loading.value = false;
    }
  }

  async function submitExam() {
    if (!currentExamId.value) return;
    try {
      loading.value = true;
      const formData = {
        type: currentType.value,
        answers: answer.value,
      };
      const result = await examSubmitApi(currentExamId.value, formData);
      if (result) {
        createMessage.success('Nộp bài thành công');
        toggleDom();
        reload();
      }
    } catch (error) {
      console.log(error);
      createMessage.warning('Bạn cần hoàn thành hết câu hỏi!');

      // createMessage.error(t('sys.app.dataNotFound'));
    } finally {
      loading.value = false;
    }
  }

  // watch(
  //   () => examDuration.value,
  //   () => {
  //     if (examDuration.value === 0) {

  //       submitExam();
  //     }
  //   },
  // );

  onMounted(() => {
    window.addEventListener('keydown', preventF5);
  });

  onBeforeUnmount(() => {
    window.addEventListener('keydown', preventF5);
  });
</script>

<style lang="less" scoped>
  .box-shadow {
    box-shadow: 0 -12px 20px -22px rgb(0 0 0 / 45%);
  }

  .shadow2 {
    box-shadow:
      0 2px 4px 0 rgb(0 0 0 / 13%),
      0 1px 1px 0 rgb(0 0 0 / 11%);
  }
</style>
