<template>
  <PageWrapper :title="t('routes.page.bankTitle')" :content="t('routes.page.bankContent')">
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="dashed" @click="activateModal">{{ t('table.createBank') }}</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <Icon
            icon="ant-design:eye-outlined"
            :size="18"
            class="cursor-pointer hover:border-red border-1 border-gray-200 p-1 rounded-md mr-2"
            @click="previewItem(record.id)"
          />
          <Icon
            icon="ant-design:delete-outlined"
            :size="18"
            class="cursor-pointer hover:border-red border-1 border-gray-200 p-1 rounded-md"
            @click="deleteItem(record.id)"
          />
        </template>
      </template>
    </BasicTable>
    <QuestionBankModal @register="registerModal" @success="handleOk" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { PageWrapper } from '@/components/Page';
  import { useI18n } from '@/hooks/web/useI18n';
  import { BasicTable, useTable } from '@/components/Table';
  import { bankListApi } from '@/api/teacher/teacher';
  import { getBankColumns, getBankListConfig } from '@/views/classroom/tableData';
  import { useModal } from '@/components/Modal';
  import { h } from 'vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { deleteBankApi, getBankApi } from '@/api/exercise/exercise';
  import { useMessage } from '@/hooks/web/useMessage';
  import QuestionBankModal from './QuestionBankModal.vue';

  const { t } = useI18n();
  const [registerTable, { reload }] = useTable({
    title: t('routes.page.bankList'),
    api: bankListApi(),
    columns: getBankColumns(),
    useSearchForm: true,
    formConfig: getBankListConfig(),
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
        const res = await deleteBankApi(id);
        if (res && res.items) {
          reload();
        }
      },
    });
  }

  async function previewItem(id: number) {
    const res = await getBankApi(id);
    if (res && res.items) {
      console.log(res.items);
    }
  }
</script>
