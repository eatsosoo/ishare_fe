<template>
  <PageWrapper :title="t('routes.page.bankTitle')" :content="t('routes.page.bankContent')">
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="dashed" @click="activateModal()">{{ t('table.createBook') }}</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <Icon
            icon="ant-design:delete-outlined"
            :size="18"
            class="cursor-pointer hover:border-red border-1 border-gray-200 p-1 rounded-md"
            @click="deleteItem(record.id)"
          />
        </template>
      </template>
    </BasicTable>
    <CreateBookModal @register="registerModal" @success="handleOk" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { PageWrapper } from '@/components/Page';
  import { useI18n } from '@/hooks/web/useI18n';
  import { BasicTable, useTable } from '@/components/Table';
  import { getBookColumns, getBookListConfig } from '@/views/classroom/tableData';
  import { useModal } from '@/components/Modal';
  import { h } from 'vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { bookListApi, deleteBookApi } from '@/api/exercise/exercise';
  import { useMessage } from '@/hooks/web/useMessage';
  import CreateBookModal from './CreateBookModal.vue';

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
  const { createConfirm } = useMessage();

  function handleOk() {
    closeModal();
    reload();
  }

  function activateModal() {
    openModal();
  }

  function deleteItem(id: number) {
    createConfirm({
      iconType: 'warning',
      title: () => h('span', t('sys.app.logoutTip')),
      content: () => h('span', t('common.warning.deleteBank')),
      onOk: async () => {
        const res = await deleteBookApi(id);
        if (res && res.items) {
          reload();
        }
      },
    });
  }
</script>
