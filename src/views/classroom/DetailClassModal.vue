<template>
  <BasicModal
    v-bind="$attrs"
    title="Modal Title"
    width="1100px"
    :show-ok-btn="false"
    :show-cancel-btn="false"
    :can-fullscreen="false"
    :loading="loading"
  >
    <Tabs v-model:activeTab="activeTab" @change="activeKey = $event" class="max-height-[500px]">
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
          <Card>
            <BasicForm @register="register" />
          </Card>
          <ShiftTable :value="detail?.shifts" @change="handleUpdateShifts" />
        </template>
      </TabPane>
    </Tabs>

    <template #footer>
      <a-button
        type="dashed"
        preIcon="ant-design:delete-twotone"
        @click="handleDelete"
        class="bg-orange"
        >{{ t('common.deleteClass') }}</a-button
      >
      <a-button
        v-if="activeKey === 1"
        type="primary"
        preIcon="ant-design:save-twotone"
        @click="updateClass"
        >{{ t('common.updatedText') }}</a-button
      >
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
  import { Card, Tabs } from 'ant-design-vue';
  import {
    deleteClassApi,
    getClassApi,
    getStudentsOfClassApi,
    updateClassApi,
  } from '@/api/class/class';
  import { Key } from 'ant-design-vue/es/_util/type';
  import Icon from '@/components/Icon/Icon.vue';
  import ExportStudyResultModal from './ExportStudyResultModal.vue';
  import { useMessage } from '@/hooks/web/useMessage';
  import ShiftTable from './ShiftTable.vue';
  import { ShiftItem, UpdateClassParams } from '@/api/class/classModel';
  import { schemas } from './data';
  import { BasicForm, useForm } from '@/components/Form';
  import dayjs from 'dayjs';

  const props = defineProps({
    classId: {
      type: Number,
      required: true,
    },
  });

  const emit = defineEmits(['reload']);

  const TabPane = Tabs.TabPane;

  const { t } = useI18n();
  const activeTab = ref('1');
  const activeKey = ref<Key>(1);
  const tableRefs = ref([]);
  const studentTarget = ref<any>({});
  const detail = ref<UpdateClassParams | null>(null);
  const loading = ref(false);
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
  const { createConfirm, createSuccessModal, createMessage } = useMessage();

  const [register, { validate, setFieldsValue }] = useForm({
    layout: 'vertical',
    baseColProps: {
      span: 6,
    },
    schemas: schemas,
    showActionButtonGroup: false,
  });

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
      key: 1,
      tab: t('common.infoClass'),
    },
    {
      key: 0,
      tab: t('table.studentList'),
      register: registerTable1,
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
      onOk: async () => {
        const res = await deleteClassApi(props.classId);
        if (res && res.items) {
          emit('reload');
        }
      },
    });
  };

  const getClassInformation = async (classId: number) => {
    try {
      loading.value = true;
      const res = await getClassApi(classId);
      if (res && res.items) {
        detail.value = res.items;
        const { title, description, start_date, key, level } = detail.value;
        setFieldsValue({
          title,
          description,
          start_date: dayjs(start_date, 'YYYY-MM-DD'),
          key,
          level,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      loading.value = false;
    }
  };

  const handleUpdateShifts = (newVal: ShiftItem[]) => {
    console.log(newVal);
    if (detail.value) {
      detail.value.shifts = newVal;
    }
  };

  const updateClass = async () => {
    try {
      loading.value = true;
      if (!detail.value) {
        return;
      }

      const { shifts } = detail.value;
      if (shifts.length === 0) {
        createMessage.error(t('common.shiftEmpty'));
      }
      const { title, key, level, description, start_date } = await validate();
      const submitData: UpdateClassParams = {
        id: props.classId,
        title,
        key,
        level,
        description,
        start_date,
        shifts,
      };
      const res = await updateClassApi(props.classId, submitData);
      if (res && res.items) {
        createSuccessModal({
          title: t('layout.setting.operatingTitle'),
          content: t('common.updateSuccess'),
        });
        emit('reload');
      }
    } catch (error) {
      console.log(error);
    } finally {
      loading.value = false;
    }
  };

  watch(
    () => props.classId,
    (newVal) => {
      if (!newVal) return;
      reloadTable();
      getClassInformation(newVal);
    },
  );
</script>
