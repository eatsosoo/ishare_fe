<template>
  <PageWrapper>
    <Card :title="t('form.searchClassAndDate')" :bordered="false" class="mb-4">
      <BasicForm
        @register="registerForm"
        @submit="getAttendaceOfClass"
        @reset="showAttendaceTable = false"
      />
    </Card>
    <Card v-if="showAttendaceTable" :title="t('common.resultList')" :bordered="false" class="mb-8">
      <BasicTable @register="registerTable">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'completed_at'">{{
            record.completed_at || record.status
          }}</template>
          <template v-if="column.key === 'status'">
            <Tag :color="record.status ? 'green' : 'red'">
              {{ record.status ? t('common.present') : t('common.absent') }}
            </Tag>
          </template>
        </template>
      </BasicTable>
    </Card>

    <template #rightFooter>
      <a-button type="primary" @click="submitAll"> {{ t('common.attendace') }} </a-button>
    </template>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { BasicTable, useTable } from '@/components/Table';
  import { getAttendaceColumns, getSearchAttendaceConfig } from '@/views/classroom/tableData';
  import { useI18n } from '@/hooks/web/useI18n';
  import { Card, Tag } from 'ant-design-vue';
  import PageWrapper from '@/components/Page/src/PageWrapper.vue';
  import BasicForm from '@/components/Form/src/BasicForm.vue';
  import { useForm } from '@/components/Form';
  import { searchAttendaceSchemas } from '@/views/classroom/data';
  import { ref } from 'vue';
  import { useUserStore } from '@/store/modules/user';
  import { attendanceListApi } from '@/api/class/class';

  const { t } = useI18n();
  const useStore = useUserStore();
  const [registerTable, { reload }] = useTable({
    api: attendanceListApi(),
    columns: getAttendaceColumns(),
    useSearchForm: false,
    formConfig: getSearchAttendaceConfig(),
    tableSetting: { fullScreen: true },
    showIndexColumn: true,
    rowKey: 'id',
    showSelectionBar: true,
  });
  const [registerForm, { validate }] = useForm({
    // baseColProps: {
    //   span: 6,
    // },
    schemas: searchAttendaceSchemas,
    showActionButtonGroup: true,
  });

  const showAttendaceTable = ref(false);

  async function getAttendaceOfClass() {
    try {
      const [values] = await Promise.all([validate()]);
      const { classId, date } = values;
      useStore.setClassId(classId);
      reload();
      showAttendaceTable.value = true;
    } catch (error) {
      console.log(error);
    }
  }
</script>
