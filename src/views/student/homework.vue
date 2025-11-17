<template>
  <div>
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'score'">
          {{
            record.score === -1 || record.score === null
              ? t('common.noScoreYet')
              : `${['Writing', 'Speaking'].includes(record.skill) ? record.score : `${record.score}/${record.question_count}`}`
          }}
        </template>
        <template v-if="column.key === 'deadline'">{{
          record.times > 1 ? '_' : getLeftValue(record.deadline)
        }}</template>
        <template v-if="column.key === 'status'">
          <Tag :color="tagColorWork(record.completed_at, record.times, record.retake)">
            {{ statusWork(record.completed_at, record.times, record.retake) }}
          </Tag>
        </template>
        <template v-if="column.key === 'action'">
          <a-button
            v-if="!record.completed_at"
            size="small"
            preIcon="ant-design:edit-filled"
            @click="clickOpen(record.homework_id)"
          />
          <a-button
            v-if="record.completed_at"
            size="small"
            preIcon="ant-design:eye-outlined"
            @click="clickView(record)"
          />
          <a-button
            v-if="record.retake === 1 && !record.retake_score"
            size="small"
            preIcon="ant-design:rollback-outlined"
            class="ml-2"
            @click="clickRetake(record.homework_id)"
          />
        </template>
      </template>
    </BasicTable>
    <ExeModal
      :title="modalTitle"
      :skill-type="skillType"
      :exam-id="examIdRef"
      :student-id="studentIdRef"
      :score="scoreRef"
      :times="timesRef"
      @register="registerExeModal"
    />
  </div>
</template>
<script lang="ts" setup>
  import BasicTable from '@/components/Table/src/BasicTable.vue';
  import { useTable } from '@/components/Table';
  import { useI18n } from '@/hooks/web/useI18n';
  import {
    getExeOfStudentColumns,
    getSearchExamOfStudentConfig,
  } from '@/views/classroom/tableData';
  import { Tag } from 'ant-design-vue';
  import { getHomeworkListOfStudentApi } from '@/api/student/student';
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useModal } from '@/components/Modal';
  import ExeModal from './ExeModal.vue';
  import { getLeftValue, statusWork, tagColorWork } from '@/utils/stringUtils';

  const { t } = useI18n();
  const router = useRouter();
  const [registerTable] = useTable({
    api: getHomeworkListOfStudentApi(),
    columns: getExeOfStudentColumns(),
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

  const [registerExeModal, { openModal: openExeModal }] = useModal();

  const modalTitle = ref('');
  const examIdRef = ref(0);
  const studentIdRef = ref(0);
  const skillType = ref('');
  const scoreRef = ref(0);
  const timesRef = ref(1);

  function clickOpen(homeworkId: number) {
    router.push(`/take/exercise?id=${homeworkId}`);
  }

  function clickRetake(homeworkId: number) {
    router.push(`/take/exercise?id=${homeworkId}&retake=1`);
  }

  function clickView(item: any) {
    const { user_name, skill, user_id, homework_id, score, times } = item;
    modalTitle.value = `Học sinh: ${user_name} - Kỹ năng: ${skill}`;
    examIdRef.value = homework_id;
    studentIdRef.value = user_id;
    skillType.value = skill;
    scoreRef.value = score;
    timesRef.value = times;

    openExeModal();
  }
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
