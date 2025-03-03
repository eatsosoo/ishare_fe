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
        <template v-if="column.key === 'action' && !record.completed_at">
          <a-button
            size="small"
            preIcon="ant-design:edit-filled"
            @click="clickOpen(record.exam_id, record.skill)"
          />
        </template>
      </template>
    </BasicTable>
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

  import { SkillType } from '@/api/exam/examModel';
  import { useRouter } from 'vue-router';

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

  function clickOpen(examId: number, skill: SkillType) {
    console.log(examId);
    router.push(`/take/index?id=${examId}&type=${skill}`);
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
