<template>
  <BasicModal
    v-bind="$attrs"
    title="Modal Title"
    width="1100px"
    :show-ok-btn="false"
    :show-cancel-btn="false"
    :can-fullscreen="false"
  >
    <Tabs v-model:activeTab="activeTab" @change="activeKey = $event">
      <TabPane v-for="tab in tabs" :key="tab.key" v-bind="omit(tab, ['content', 'key'])">
        <BasicTable @register="tab.register" ref="tableRefs" class="max-h-[770px]" />
      </TabPane>
    </Tabs>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { BasicModal } from '@/components/Modal';
  import { BasicTable, FormProps, useTable } from '@/components/Table';
  import {
    getExamColumns,
    getExerciseColumns,
    getStudentColumns,
  } from '@/views/classroom/tableData';
  import { useI18n } from '@/hooks/web/useI18n';
  import { omit } from 'lodash-es';
  import { Tabs } from 'ant-design-vue';
  import { examListApi } from '@/api/exam/exam';
  import { getHomeworksOfClassApi, getStudentsOfClassApi } from '@/api/class/class';
  import { Key } from 'ant-design-vue/es/_util/type';

  const props = defineProps({
    classId: {
      type: Number,
      required: true,
    },
  });

  const TabPane = Tabs.TabPane;

  const { t } = useI18n();
  const activeTab = ref('1');
  const activeKey = ref<Key>('1');
  const tableRefs = ref([]);
  function searchConfig(): Partial<FormProps> {
    return {
      labelWidth: 100,
      schemas: [
        {
          field: 'student_name',
          component: 'Input',
          label: t('form.exerciseSearch.studentName'),
          colProps: {
            xl: 6,
            xxl: 4,
          },
        },
      ],
    };
  }

  const [registerTable1, { reload: reload1 }] = useTable({
    canResize: true,
    api: getStudentsOfClassApi(),
    columns: getStudentColumns(),
    defSort: {
      field: 'name',
      order: 'ascend',
    },
    useSearchForm: true,
    formConfig: searchConfig(),
    rowKey: 'id',
    showTableSetting: false,
    showIndexColumn: false,
  });

  const [registerTable2, { reload: reload2 }] = useTable({
    canResize: true,
    api: getHomeworksOfClassApi(),
    columns: getExerciseColumns(),
    defSort: {
      field: 'name',
      order: 'ascend',
    },
    useSearchForm: true,
    formConfig: searchConfig(),
    rowKey: 'id',
    showTableSetting: false,
    showIndexColumn: false,
  });

  const [registerTable3, { reload: reload3 }] = useTable({
    canResize: true,
    api: examListApi(),
    columns: getExamColumns(),
    defSort: {
      field: 'name',
      order: 'ascend',
    },
    useSearchForm: true,
    formConfig: searchConfig(),
    rowKey: 'id',
    showTableSetting: false,
    showIndexColumn: false,
  });

  const tabs = [
    {
      key: '1',
      tab: t('table.studentList'),
      register: registerTable1,
    },
    {
      key: '2',
      tab: t('table.homeWorkList'),
      register: registerTable2,
    },
    {
      key: '3',
      tab: t('table.monthlyTestScore'),
      register: registerTable3,
    },
  ];

  const reloadFunctions = [reload1, reload2, reload3];

  const reloadTable = () => {
    const activeIndex = parseInt(activeKey.value) - 1;
    if (tableRefs.value[activeIndex]) {
      reloadFunctions[activeIndex]();
    }
  };

  watch(
    () => props.classId,
    () => {
      if (!props.classId) return;
      reloadTable();
    },
  );
</script>
