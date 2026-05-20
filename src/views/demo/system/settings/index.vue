<template>
  <PageWrapper title="Cấu hình hệ thống" content="Quản lý các key sử dụng trong cấu hình hệ thống">
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate">Thêm cấu hình</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction :actions="createActions(record)" />
        </template>
      </template>
    </BasicTable>
    <SettingModal @register="registerModal" @success="handleSuccess" />
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { h } from 'vue';
  import { PageWrapper } from '@/components/Page';
  import { ActionItem, BasicTable, TableAction, useTable } from '@/components/Table';
  import { useModal } from '@/components/Modal';
  import { useMessage } from '@/hooks/web/useMessage';
  import {
    deleteSystemSettingApi,
    systemSettingListApi,
  } from '@/api/system-settings/systemSettings';
  import { getSystemSettingColumns, getSystemSettingSearchConfig } from './settings.data';
  import SettingModal from './SettingModal.vue';

  defineOptions({ name: 'SystemSettings' });

  const [registerModal, { openModal }] = useModal();
  const { createConfirm, createMessage } = useMessage();

  const [registerTable, { reload }] = useTable({
    title: 'Danh sách cấu hình',
    api: systemSettingListApi(),
    columns: getSystemSettingColumns(),
    useSearchForm: true,
    formConfig: getSystemSettingSearchConfig(),
    showTableSetting: true,
    tableSetting: { fullScreen: true },
    showIndexColumn: false,
    rowKey: 'id',
    showSelectionBar: false,
    actionColumn: {
      width: 160,
      title: 'Action',
      dataIndex: 'action',
      fixed: 'right',
    },
  });

  function handleCreate() {
    openModal(true, {
      isUpdate: false,
    });
  }

  function handleEdit(record: Recordable) {
    openModal(true, {
      isUpdate: true,
      record,
    });
  }

  function handleSuccess() {
    createMessage.success('Lưu cấu hình hệ thống');
    reload();
  }

  function handleDelete(record: Recordable) {
    createConfirm({
      iconType: 'warning',
      title: () => h('span', 'Xác nhận xoá'),
      content: () => h('span', `Xoá cấu hình "${record.key}"?`),
      onOk: async () => {
        await deleteSystemSettingApi(record.id);
        createMessage.success('Xoá cấu hình thành công');
        reload();
      },
    });
  }

  function createActions(record: Recordable): ActionItem[] {
    return [
      {
        label: 'Edit',
        onClick: handleEdit.bind(null, record),
      },
      {
        label: 'Delete',
        color: 'error',
        onClick: handleDelete.bind(null, record),
      },
    ];
  }
</script>
