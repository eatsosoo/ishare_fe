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
        <template v-if="column.key === 'status'">
          <Tag :color="record.completed_at ? 'green' : 'red'">
            {{ record.completed_at ? 'v' : 'x' }}
          </Tag>
        </template>
        <template v-if="column.key === 'action'">
          <a-button
            v-if="!record.completed_at"
            size="small"
            preIcon="ant-design:edit-filled"
            @click="clickOpen(record.exam_id, record.skill)"
          />
          <a-button
            v-if="record.completed_at"
            size="small"
            preIcon="ant-design:eye-outlined"
            @click="clickView(record)"
          />
        </template>
      </template>
    </BasicTable>

    <DetailModal
      :title="modalTitle"
      :skill-type="skillType"
      :exam-id="examIdRef"
      :student-id="studentIdRef"
      :score="scoreRef"
      @register="registerExeModal"
    />
  </div>
</template>
<script lang="ts" setup>
  import BasicTable from '@/components/Table/src/BasicTable.vue';
  import { useTable } from '@/components/Table';
  import { useI18n } from '@/hooks/web/useI18n';
  import {
    getExamOfStudentColumns,
    getSearchExamOfStudentConfig,
  } from '@/views/classroom/tableData';
  import { Tag } from 'ant-design-vue';
  import { getExamListOfStudentApi } from '@/api/student/student';

  import { SkillType } from '@/api/exam/examModel';
  import { useRouter } from 'vue-router';
  import DetailModal from './DetailModal.vue';
  import { useModal } from '@/components/Modal';
  import { ref } from 'vue';

  const { t } = useI18n();
  const router = useRouter();
  const [registerTable] = useTable({
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

  const [registerExeModal, { openModal: openExeModal }] = useModal();

  const modalTitle = ref('');
  const examIdRef = ref(0);
  const studentIdRef = ref(0);
  const skillType = ref('');
  const scoreRef = ref(0);

  function clickOpen(examId: number, skill: SkillType) {
    router.push(`/take/index?id=${examId}&type=${skill}`);
  }

  function clickView(item: any) {
    const { user_name, skill, user_id, exam_id, score } = item;
    modalTitle.value = `Học sinh: ${user_name} - Kỹ năng: ${skill}`;
    examIdRef.value = exam_id;
    studentIdRef.value = user_id;
    skillType.value = skill;
    scoreRef.value = score;

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
