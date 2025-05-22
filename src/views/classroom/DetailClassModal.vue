<template>
  <BasicModal
    v-bind="$attrs"
    title="Modal Title"
    width="1100px"
    :show-ok-btn="false"
    :show-cancel-btn="false"
    :loading="loading"
    @cancel="clearSelectedRowKeys()"
  >
    <Tabs v-model:activeTab="activeTab" @change="activeKey = $event" class="max-height-[500px]">
      <TabPane v-for="tab in tabs" :key="tab.key" v-bind="omit(tab, ['content', 'key'])">
        <template v-if="tab.key === 0">
          <BasicTable
            @register="tab.register"
            ref="tableRefs"
            class="max-h-[770px]"
            @selection-change="selectIDs = $event.rows"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'action'">
                <TableAction :actions="createActions(record)" @click="activateAction(record)" />
              </template>
              <template v-else-if="column.key === 'id'">
                <span
                  class="hover:text-[#c4303a] hover:cursor-pointer hover:underline"
                  @click="activateHistory(record)"
                  >{{ record.id }}</span
                >
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
      <a-button
        v-if="activeKey === 0"
        :disabled="selectIDs.length === 0"
        type="primary"
        preIcon="ant-design:swap-outlined"
        @click="openDrawer"
        >{{ t('common.changeClass') }}</a-button
      >
    </template>

    <ExportStudyResultModal
      :title="t('common.exportExcelStudy')"
      :student="studentTarget"
      :class-id="props.classId"
      @register="registerExportModal"
    />

    <DrawerTransferStudents
      :title="t('common.transferStudent')"
      :root-class-id="props.classId"
      :students="selectIDs"
      @register="registerDrawer"
      @success="transferStudentsSuccess"
    />

    <HistoryClass
      :title="t('common.historyClass')"
      :user-id="studentTarget.id"
      @register="registerHistoryClass"
    />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { h, ref, watch } from 'vue';
  import { BasicModal, useModal } from '@/components/Modal';
  import {
    ActionItem,
    BasicTable,
    EditRecordRow,
    FormProps,
    TableAction,
    useTable,
  } from '@/components/Table';
  import { getStudentOfClassColumns } from '@/views/classroom/tableData';
  import { useI18n } from '@/hooks/web/useI18n';
  import { cloneDeep, omit } from 'lodash-es';
  import { Card, Tabs } from 'ant-design-vue';
  import {
    deleteClassApi,
    deleteStudentOfClassApi,
    getClassApi,
    getStudentsOfClassApi,
    updateClassApi,
  } from '@/api/class/class';
  import { Key } from 'ant-design-vue/es/_util/type';
  import ExportStudyResultModal from './ExportStudyResultModal.vue';
  import { useMessage } from '@/hooks/web/useMessage';
  import ShiftTable from './ShiftTable.vue';
  import { ShiftItem, UpdateClassParams } from '@/api/class/classModel';
  import { schemas } from './data';
  import { BasicForm, useForm } from '@/components/Form';
  import dayjs from 'dayjs';
  import { UpdateStudentInfoParams } from '@/api/student/studentModel';
  import { updateStudentInfoApi } from '@/api/student/student';
  import { useDrawer } from '@/components/Drawer';
  import DrawerTransferStudents from './DrawerTransferStudents.vue';
  import HistoryClass from '../sys/account/HistoryClass.vue';

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
  const selectIDs = ref<any[]>([]);

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
  const [registerHistoryClass, { openModal: openHistoryClass }] = useModal();

  const [registerDrawer, { openDrawer, closeDrawer }] = useDrawer();
  const { createConfirm, createSuccessModal, createMessage } = useMessage();

  const [register, { validate, setFieldsValue }] = useForm({
    layout: 'vertical',
    baseColProps: {
      span: 6,
    },
    schemas: schemas,
    showActionButtonGroup: false,
  });

  const [registerTable1, { reload: reload1, clearSelectedRowKeys }] = useTable({
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
    rowSelection: {
      type: 'checkbox',
    },
    showSelectionBar: true,
  });

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
  ];

  const reloadFunctions = [reload1];

  const reloadTable = () => {
    if (tableRefs.value[0]) {
      reloadFunctions[0]();
    }
  };

  const activateAction = (record: any) => {
    studentTarget.value = record;
    // openExportModal();
    clearSelectedRowKeys();
  };

  const activateHistory = (record: any) => {
    studentTarget.value = record;
    openHistoryClass();
    clearSelectedRowKeys();
  };

  const handleDelete = () => {
    createConfirm({
      iconType: 'warning',
      title: () => h('span', t('sys.app.logoutTip')),
      content: () => h('span', t('common.warning.deleteClass')),
      onOk: async () => {
        try {
          const res = await deleteClassApi(props.classId);
          if (res && res.items) {
            emit('reload');
          }
        } catch (error) {
          console.log(error);
        } finally {
          loading.value = false;
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

  const currentEditKeyRef = ref('');

  function handleEdit(record: EditRecordRow) {
    currentEditKeyRef.value = record.key;
    record.onEdit?.(true);
  }

  function handleRemoveStudent(record: EditRecordRow) {
    const formData = {
      class_id: props.classId,
      students: [{ id: record.id }],
    };
    createConfirm({
      iconType: 'warning',
      title: () => h('span', t('sys.app.logoutTip')),
      content: () => h('span', t('common.warning.deleteStudentFromClass')),
      onOk: async () => {
        try {
          const res = await deleteStudentOfClassApi(formData);
          if (res && res.items) {
            reload1();
            createMessage.success(t('common.success.deleteStudentFromClass'));
          }
        } catch (error) {
          console.log(error);
        } finally {
          loading.value = false;
        }
      },
    });
  }

  function handleCancel(record: EditRecordRow) {
    currentEditKeyRef.value = '';
    record.onEdit?.(false, false);
  }

  async function handleSave(record: EditRecordRow) {
    createMessage.loading({
      content: t('common.saving') + '...',
      duration: 0,
      key: t('common.saving'),
    });
    const valid = await record.onValid?.();
    if (valid) {
      try {
        const data = cloneDeep(record.editValueRefs);
        if (!data) {
          return;
        }
        const { id } = studentTarget.value;
        const { first_name, last_name, phone_number, dob, parent_name, parent_tel, target, plan } =
          data;
        const formData: UpdateStudentInfoParams = {
          user_id: id,
          name: `${first_name} ${last_name}`,
          first_name,
          last_name,
          phone_number,
          dob,
          parent_name,
          parent_tel,
          target,
          plan,
        };

        const result = await updateStudentInfoApi(formData);
        if (result && result.items) {
          currentEditKeyRef.value = '';
          record.onEdit?.(false, true);
        }
        createMessage.success({ content: t('common.dataSaved'), key: t('common.saving') });
      } catch (error) {
        createMessage.error({ content: t('common.saveFail'), key: t('common.saving') });
      }
    } else {
      createMessage.error({
        content: t('common.pleaseFillInCorrectData'),
        key: t('common.saving'),
      });
    }
  }

  function createActions(record: EditRecordRow): ActionItem[] {
    if (!record.editable) {
      return [
        {
          label: '✏️',
          disabled: currentEditKeyRef.value ? currentEditKeyRef.value !== record.key : false,
          onClick: handleEdit.bind(null, record),
        },
        {
          label: '❌',
          disabled: currentEditKeyRef.value ? currentEditKeyRef.value !== record.key : false,
          onClick: handleRemoveStudent.bind(null, record),
        },
        {
          label: '📊',
          disabled: currentEditKeyRef.value ? currentEditKeyRef.value !== record.key : false,
          onClick: openExportModal,
        },
      ];
    }
    return [
      {
        label: t('common.saveText'),
        onClick: handleSave.bind(null, record),
      },
      {
        label: t('common.cancelText'),
        popConfirm: {
          title: t('common.cancelEditing') + '?',
          confirm: handleCancel.bind(null, record),
        },
      },
    ];
  }

  function transferStudentsSuccess() {
    closeDrawer();
    reload1();
    clearSelectedRowKeys();
    emit('reload');
  }

  watch(
    () => props.classId,
    (newVal) => {
      if (!newVal) return;
      reloadTable();
      getClassInformation(newVal);
    },
  );
</script>
