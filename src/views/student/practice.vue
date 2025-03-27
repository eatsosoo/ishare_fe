<template>
  <div>
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action' && !record.completed_at">
          <Tooltip title="Reading" placement="bottom">
            <a-button
              size="small"
              preIcon="ant-design:read-outlined"
              @click="clickOpen(record.id, 'Reading')"
            />
          </Tooltip>
          <Tooltip title="Listening" placement="bottom">
            <a-button
              size="small"
              preIcon="ant-design:customer-service-outlined"
              @click="clickOpen(record.id, 'Listening')"
            />
          </Tooltip>
          <Tooltip title="Writing" placement="bottom">
            <a-button
              size="small"
              preIcon="ant-design:edit-outlined"
              @click="clickOpen(record.id, 'Writing')"
            />
          </Tooltip>
          <Tooltip title="Speaking" placement="bottom">
            <a-button
              size="small"
              preIcon="ant-design:audio-outlined"
              @click="clickOpen(record.id, 'Speaking')"
            />
          </Tooltip>
        </template>
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts" setup>
  import BasicTable from '@/components/Table/src/BasicTable.vue';
  import { useTable } from '@/components/Table';
  import { useI18n } from '@/hooks/web/useI18n';
  import { getExamListConfig, getTestColumns } from '@/views/classroom/tableData';
  import { Tooltip } from 'ant-design-vue';

  import { SkillType } from '@/api/exam/examModel';
  import { useRouter } from 'vue-router';
  import { practiceExamListApi } from '@/api/exam/exam';

  const { t } = useI18n();
  const router = useRouter();
  const [registerTable] = useTable({
    title: t('routes.page.practiceTestList'),
    api: practiceExamListApi(),
    columns: getTestColumns(),
    useSearchForm: true,
    formConfig: getExamListConfig(),
    showTableSetting: true,
    tableSetting: { fullScreen: true },
    showIndexColumn: false,
    rowKey: 'id',
    showSelectionBar: false,
    actionColumn: {
      title: t('table.action'),
      dataIndex: 'action',
    },
  });

  function clickOpen(examId: number, skill: SkillType) {
    router.push(`/take/practice?id=${examId}&type=${skill}`);
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
