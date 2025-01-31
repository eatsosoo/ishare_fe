<template>
  <BasicModal v-bind="$attrs" title="Modal Title" width="1100px" @fullscreen="onFullscreen">
    <Tabs v-model:activeKey="activeKey">
      <TabPane v-for="tab in tabs" :key="tab.key" v-bind="omit(tab, ['content', 'key'])">
        <BasicTable @register="registerTable" ref="selectTable" />
      </TabPane>
    </Tabs>
    <template #footer></template>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, nextTick } from 'vue';
  import { BasicModal } from '@/components/Modal';
  import { BasicTable, ColumnChangeParam, useTable } from '@/components/Table';
  import { getStudentOfClassColumns } from '@/views/classroom/tableData';
  import { studentListApi } from '@/api/demo/table';
  import { useI18n } from '@/hooks/web/useI18n';
  import { omit } from 'lodash-es';
  import { Tabs } from 'ant-design-vue';

  const TabPane = Tabs.TabPane;
  const { t } = useI18n();
  const tabs = [
    {
      key: '1',
      tab: t('table.studentList'),
    },
    {
      key: '2',
      tab: t('table.homeWorkList'),
    },
    {
      key: '3',
      tab: t('table.monthlyTestScore'),
    },
  ];
  const activeKey = ref('1');
  const [registerTable] = useTable({
    canResize: true,
    api: studentListApi(),
    columns: getStudentOfClassColumns(),
    defSort: {
      field: 'name',
      order: 'ascend',
    },
    rowKey: 'id',
    showTableSetting: false,
    showIndexColumn: false,
    onColumnsChange: (data: ColumnChangeParam[]) => {
      console.log('ColumnsChanged', data);
    },
  });

  const selectTable = ref<InstanceType<typeof BasicTable> | undefined>();

  const onFullscreen = async () => {
    await nextTick();
    selectTable.value?.redoHeight();
  };
</script>
