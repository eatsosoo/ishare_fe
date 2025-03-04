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
        <template v-if="tab.key === 0">
          <BasicTable @register="tab.register" ref="tableRefs" class="max-h-[770px]">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'action'">
                <div class="flex gap-2 justify-center">
                  <Icon
                    :size="18"
                    icon="ant-design:export"
                    class="cursor-pointer hover:border-red border-1 border-gray-200 p-1 rounded-md"
                    @click="activateExportModal(record)"
                  />
                </div>
              </template>
            </template>
          </BasicTable>
        </template>
        <template v-else>
          <ShiftTable :value="props.shifts" />
        </template>
      </TabPane>
    </Tabs>

    <template #footer>
      <a-button type="dashed" @click="handleDelete">{{ t('common.deleteClass') }}</a-button>
    </template>

    <ExportStudyResultModal
      :title="t('common.exportExcelStudy')"
      :student="studentTarget"
      @register="registerExportModal"
    />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { h, ref, watch } from 'vue';
  import { BasicModal, useModal } from '@/components/Modal';
  import { BasicTable, FormProps, useTable } from '@/components/Table';
  import { getStudentOfClassColumns } from '@/views/classroom/tableData';
  import { useI18n } from '@/hooks/web/useI18n';
  import { omit } from 'lodash-es';
  import { Tabs } from 'ant-design-vue';
  import { deleteClassApi, getStudentsOfClassApi } from '@/api/class/class';
  import { Key } from 'ant-design-vue/es/_util/type';
  import Icon from '@/components/Icon/Icon.vue';
  import ExportStudyResultModal from './ExportStudyResultModal.vue';
  import { useMessage } from '@/hooks/web/useMessage';
  import ShiftTable from './ShiftTable.vue';
  import { ShiftItem } from '@/api/class/classModel';

  const props = defineProps({
    classId: {
      type: Number,
      required: true,
    },
    shifts: {
      type: Array as PropType<ShiftItem[]>,
      default: () => [],
    },
  });

  const TabPane = Tabs.TabPane;

  const { t } = useI18n();
  const activeTab = ref('1');
  const activeKey = ref<Key>('1');
  const tableRefs = ref([]);
  const studentTarget = ref<any>({});
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
            xxl: 6,
          },
        },
      ],
    };
  }

  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const { createConfirm } = useMessage();

  const [registerTable1, { reload: reload1 }] = useTable({
    canResize: true,
    api: getStudentsOfClassApi(),
    columns: getStudentOfClassColumns(),
    defSort: {
      field: 'name',
      order: 'ascend',
    },
    useSearchForm: true,
    formConfig: searchConfig(),
    rowKey: 'id',
    showTableSetting: false,
    showIndexColumn: false,
    actionColumn: {
      title: t('table.action'),
      dataIndex: 'action',
    },
  });

  // const [registerTable2, { reload: reload2 }] = useTable({
  //   canResize: true,
  //   api: getHomeworksOfClassApi(),
  //   columns: getExerciseColumns(),
  //   defSort: {
  //     field: 'name',
  //     order: 'ascend',
  //   },
  //   useSearchForm: true,
  //   formConfig: searchConfig(),
  //   rowKey: 'id',
  //   showTableSetting: false,
  //   showIndexColumn: false,
  // });

  // const [registerTable3, { reload: reload3 }] = useTable({
  //   canResize: true,
  //   api: examListApi(),
  //   columns: getExamColumns(),
  //   defSort: {
  //     field: 'name',
  //     order: 'ascend',
  //   },
  //   useSearchForm: true,
  //   formConfig: searchConfig(),
  //   rowKey: 'id',
  //   showTableSetting: false,
  //   showIndexColumn: false,
  // });

  const tabs = [
    {
      key: 0,
      tab: t('table.studentList'),
      register: registerTable1,
    },
    {
      key: 1,
      tab: t('table.shift'),
    },
    // {
    //   key: 1,
    //   tab: t('table.homeWorkList'),
    //   register: registerTable2,
    // },
    // {
    //   key: 2,
    //   tab: t('table.monthlyTestScore'),
    //   register: registerTable3,
    // },
  ];

  const reloadFunctions = [
    reload1,
    // reload2,
    // reload3
  ];

  const reloadTable = () => {
    if (tableRefs.value[0]) {
      reloadFunctions[0]();
    }
    // if (tableRefs.value[1]) {
    //   reloadFunctions[1]();
    // }
    // if (tableRefs.value[2]) {
    //   reloadFunctions[2]();
    // }
  };

  const activateExportModal = (record: any) => {
    studentTarget.value = record;
    openExportModal();
  };

  const handleDelete = () => {
    createConfirm({
      iconType: 'warning',
      title: () => h('span', t('sys.app.logoutTip')),
      content: () => h('span', t('common.warning.deleteClass')),
      onOk: () => deleteClassApi(props.classId),
    });
  };

  watch(
    () => props.classId,
    () => {
      if (!props.classId) return;
      reloadTable();
    },
  );
</script>
