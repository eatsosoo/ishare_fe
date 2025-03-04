<template>
  <div>
    <BasicTable @register="registerTable" @edit-change="handleEditChange">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction :actions="createActions(record)" />
        </template>
      </template>
    </BasicTable>
    <a-button block class="mt-5" type="dashed" @click="handleAdd">
      {{ t('form.addShift') }}
    </a-button>
  </div>
</template>
<script lang="ts" setup>
  import { ShiftItem } from '@/api/class/classModel';
  import {
    BasicTable,
    useTable,
    TableAction,
    BasicColumn,
    ActionItem,
    EditRecordRow,
  } from '@/components/Table';
  import { useI18n } from '@/hooks/web/useI18n';
  import { watch } from 'vue';

  const props = defineProps({
    value: {
      type: Array as PropType<ShiftItem[]>,
      default: () => [],
    },
  });

  const emit = defineEmits(['change']);

  const { t } = useI18n();
  const columns: BasicColumn[] = [
    {
      title: t('form.shiftName'),
      dataIndex: 'title',
      editRow: true,
    },
    {
      title: t('form.shiftDay'),
      dataIndex: 'day',
      editRow: true,
      editComponent: 'Select',
      editComponentProps: {
        options: [
          { label: t('form.monday'), value: '2' },
          { label: t('form.tuesday'), value: '3' },
          { label: t('form.wednesday'), value: '4' },
          { label: t('form.thursday'), value: '5' },
          { label: t('form.friday'), value: '6' },
          { label: t('form.saturday'), value: '7' },
          { label: t('form.sunday'), value: '8' },
        ],
      },
    },
    {
      title: t('form.shiftTime'),
      dataIndex: 'hour',
      editRow: true,
      editComponent: 'Input',
    },
  ];
  const [registerTable, { getDataSource, setTableData }] = useTable({
    columns: columns,
    showIndexColumn: false,
    dataSource: props.value,
    actionColumn: {
      width: 160,
      title: t('table.action'),
      dataIndex: 'action',
      // slots: { customRender: 'action' },
    },
    scroll: { y: '100%' },
    pagination: false,
  });

  defineExpose({ getDataSource });

  function handleEdit(record: EditRecordRow) {
    record.onEdit?.(true);
  }

  function handleCancel(record: EditRecordRow) {
    record.onEdit?.(false);
  }

  function handleSave(record: EditRecordRow) {
    record.onEdit?.(false, true);
    const data = getDataSource();
    const formatData = data.map((item) => {
      return {
        title: item.title,
        day: item.day,
        hour: item.hour,
      };
    });

    emit('change', formatData);
  }

  function handleEditChange(data: Recordable) {
    console.log(data);
  }

  function handleAdd() {
    const data = getDataSource();
    const addRow: EditRecordRow = {
      title: '',
      day: '',
      hour: '',
      editable: true,
      isNew: true,
      key: `${Date.now()}`,
    };
    data.push(addRow);
  }

  function handleDelete(record: EditRecordRow) {
    const data = getDataSource();
    const index = data.findIndex((item) => item.key === record.key);
    data.splice(index, 1);
  }

  function createActions(record: EditRecordRow): ActionItem[] {
    if (!record.editable) {
      return [
        {
          label: t('table.edit'),
          onClick: handleEdit.bind(null, record),
        },
        {
          label: t('table.delete'),
          popConfirm: {
            title: t('table.delete'),
            confirm: handleDelete.bind(null, record),
          },
        },
      ];
    }
    return [
      {
        label: t('table.save'),
        onClick: handleSave.bind(null, record),
      },
      {
        label: t('table.cancel'),
        onClick: handleCancel.bind(null, record),
      },
    ];
  }

  watch(
    () => props.value,
    (newVal) => {
      console.log(newVal);
      setTableData(newVal);
    },
  );
</script>
