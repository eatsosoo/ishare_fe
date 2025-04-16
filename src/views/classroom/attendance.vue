<template>
  <PageWrapper>
    <Card :title="t('form.searchClassAndDate')" :bordered="false" class="mb-4">
      <div class="shadow-lg rounded-lg p-1 mx-1 mb-6">
        <SelectClass :extend="false" @select="classId = $event" ref="selectClassRef" />
      </div>
      <div class="shadow-lg rounded-lg p-1 mx-1">
        <BasicForm
          @register="registerForm"
          @submit="getAttendanceOfClass"
          @reset="setTableData([])"
        />
      </div>
    </Card>
    <Card :title="t('common.resultList')" :bordered="false" class="mb-8">
      <BasicTable @register="registerTable">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'date'">{{ getLeftValue(record.date) }}</template>
        </template>
      </BasicTable>
    </Card>

    <template #rightFooter>
      <a-button type="primary" @click="submitAll" :loading="loading">
        {{ t('common.attendace') }}
      </a-button>
    </template>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { BasicTable, useTable } from '@/components/Table';
  import { getAttendanceColumns } from '@/views/classroom/tableData';
  import { useI18n } from '@/hooks/web/useI18n';
  import { Card } from 'ant-design-vue';
  import PageWrapper from '@/components/Page/src/PageWrapper.vue';
  import BasicForm from '@/components/Form/src/BasicForm.vue';
  import { useForm } from '@/components/Form';
  import { searchAttendanceSchemas } from '@/views/classroom/data';
  import { attendanceApi, attendanceListApi } from '@/api/class/class';
  import { getLeftValue } from '@/utils/stringUtils';
  import { ref } from 'vue';
  import SelectClass from '../exercise/SelectClass.vue';
  import { useMessage } from '@/hooks/web/useMessage';

  const { t } = useI18n();
  const loading = ref(false);

  const [registerTable, { setTableData, setLoading, getDataSource }] = useTable({
    columns: getAttendanceColumns(),
    useSearchForm: false,
    tableSetting: { fullScreen: true },
    dataSource: [],
    showIndexColumn: true,
    rowKey: 'id',
    showSelectionBar: true,
    pagination: false,
  });

  const classId = ref<number | null>(null);
  const [registerForm, { validate }] = useForm({
    // baseColProps: {
    //   span: 6,
    // },
    schemas: searchAttendanceSchemas,
    showActionButtonGroup: true,
  });
  const { createErrorModal } = useMessage();

  async function getAttendanceOfClass() {
    try {
      const [values] = await Promise.all([validate()]);
      const { date } = values;
      if (!classId.value) {
        createErrorModal({
          title: t('form.selectClass'),
          content: t('form.notSelect'),
        });
        return;
      }
      setLoading(true);
      const response = await attendanceListApi(classId.value, getLeftValue(date));

      if (response.items[0].length === 0) {
        return;
      }
      setTableData(response.items[0][0]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function submitAll() {
    try {
      loading.value = true;
      const [values] = await Promise.all([validate()]);
      const { date } = values;
      if (!classId.value) {
        createErrorModal({
          title: t('form.selectClass'),
          content: t('form.notSelect'),
        });
        return;
      }

      const dataSource = getDataSource();
      const formatData = {
        class_id: classId.value,
        date: getLeftValue(date),
        users: dataSource.map((item) => {
          return {
            id: item.user_id,
            status: item.status,
            note: item.note,
          };
        }),
      };
      if (formatData.users.find((item) => item.status === null)) {
        createErrorModal({
          title: t('common.attendace'),
          content: t('common.warning.attendanceAllStudent'),
        });
        return;
      }
      await attendanceApi(formatData);
      await getAttendanceOfClass();
    } catch (error) {
      console.log(error);
    } finally {
      loading.value = false;
    }
  }
</script>
