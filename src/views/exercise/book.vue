<template>
  <PageWrapper :title="t('routes.page.manageBook')" :content="t('routes.page.bookContent')">
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="dashed" @click="activateModal()">{{ t('table.createBook') }}</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction :actions="createActions(record)" />
        </template>
      </template>
    </BasicTable>
    <CreateBookModal @register="registerModal" @success="handleOk" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { PageWrapper } from '@/components/Page';
  import { useI18n } from '@/hooks/web/useI18n';
  import { ActionItem, BasicTable, EditRecordRow, useTable, TableAction } from '@/components/Table';
  import { getBookColumns, getBookListConfig } from '@/views/classroom/tableData';
  import { useModal } from '@/components/Modal';
  import { h, ref } from 'vue';
  import { bookListApi, deleteBookApi, editBookApi } from '@/api/exercise/exercise';
  import { useMessage } from '@/hooks/web/useMessage';
  import CreateBookModal from './CreateBookModal.vue';
  import { cloneDeep } from 'lodash-es';
  import { EditBookParams } from '@/api/exercise/exerciseModel';

  const { t } = useI18n();
  const [registerTable, { reload }] = useTable({
    title: t('routes.page.bankList'),
    api: bookListApi(),
    columns: getBookColumns(),
    useSearchForm: true,
    formConfig: getBookListConfig(),
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
  const [registerModal, { openModal: openModal, closeModal }] = useModal();
  const { createConfirm, createMessage: msg } = useMessage();

  function handleOk() {
    closeModal();
    reload();
  }

  function activateModal() {
    openModal();
  }

  function deleteItem(record: EditRecordRow) {
    createConfirm({
      iconType: 'warning',
      title: () => h('span', t('sys.app.logoutTip')),
      content: () => h('span', t('common.warning.deleteBank')),
      onOk: async () => {
        try {
          const res = await deleteBookApi(record.id);
          if (res && res.items) {
            reload();
          }
        } catch (error) {
          console.error(error);
        }
      },
    });
  }

  const currentEditKeyRef = ref('');

  function handleEdit(record: EditRecordRow) {
    currentEditKeyRef.value = record.key;
    record.onEdit?.(true);
  }

  function handleCancel(record: EditRecordRow) {
    currentEditKeyRef.value = '';
    record.onEdit?.(false, false);
  }

  async function handleSave(record: EditRecordRow) {
    // 校验
    msg.loading({ content: 'Saving...', duration: 0, key: 'saving' });
    const valid = await record.onValid?.();
    if (valid) {
      try {
        const data = cloneDeep(record.editValueRefs);
        const formData: EditBookParams = {
          id: record.id,
          title: data?.title,
          type: data?.type,
          level: data?.level,
          description: data?.description,
        };
        const result = await editBookApi(formData);
        if (result && result.items) {
          currentEditKeyRef.value = '';
          record.onEdit?.(false, true);
        }
        msg.success({ content: 'Data saved', key: 'saving' });
      } catch (error) {
        msg.error({ content: 'Save failed', key: 'saving' });
      }
    } else {
      msg.error({ content: 'Please fill in the correct data', key: 'saving' });
    }
  }

  function createActions(record: EditRecordRow): ActionItem[] {
    if (!record.editable) {
      return [
        {
          label: 'Edit',
          disabled: currentEditKeyRef.value ? currentEditKeyRef.value !== record.key : false,
          onClick: handleEdit.bind(null, record),
        },
        {
          label: 'Delete',
          disabled: currentEditKeyRef.value ? currentEditKeyRef.value !== record.key : false,
          onClick: deleteItem.bind(null, record),
        },
      ];
    }
    return [
      {
        label: 'Keep',
        onClick: handleSave.bind(null, record),
      },
      {
        label: 'Cancel',
        popConfirm: {
          title: 'Cancel editing?',
          confirm: handleCancel.bind(null, record),
        },
      },
    ];
  }
</script>
