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
  import {
    BasicTable,
    useTable,
    TableAction,
    BasicColumn,
    ActionItem,
    EditRecordRow,
  } from '@/components/Table';
  import { useI18n } from '@/hooks/web/useI18n';

  const data: any[] = [];
  const { t } = useI18n();
  const columns: BasicColumn[] = [
    {
      title: t('form.shiftName'),
      dataIndex: 'title',
      editRow: true,
    },
    {
      title: t('form.shiftDescription'),
      dataIndex: 'no',
      editRow: true,
    },
  ];
  const [registerTable, { getDataSource }] = useTable({
    columns: columns,
    showIndexColumn: false,
    dataSource: data,
    actionColumn: {
      width: 160,
      title: t('table.action'),
      dataIndex: 'action',
      // slots: { customRender: 'action' },
    },
    scroll: { y: '100%' },
    pagination: false,
  });
  // 暴露getDataSource 供父组件使用
  defineExpose({ getDataSource });

  function handleEdit(record: EditRecordRow) {
    record.onEdit?.(true);
  }

  function handleCancel(record: EditRecordRow) {
    record.onEdit?.(false);
    if (record.isNew) {
      const data = getDataSource();
      const index = data.findIndex((item) => item.key === record.key);
      data.splice(index, 1);
    }
  }

  function handleSave(record: EditRecordRow) {
    record.onEdit?.(false, true);
  }

  function handleEditChange(data: Recordable) {
    console.log(data);
  }

  function handleAdd() {
    const data = getDataSource();
    const addRow: EditRecordRow = {
      title: '',
      description: '',
      editable: true,
      isNew: true,
      key: `${Date.now()}`,
    };
    data.push(addRow);
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
        popConfirm: {
          title: t('table.cancelEditing'),
          confirm: handleCancel.bind(null, record),
        },
      },
    ];
  }
</script>
