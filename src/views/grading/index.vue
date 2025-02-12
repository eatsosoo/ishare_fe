<template>
  <PageWrapper title="Chấm bài">
    <Card :title="t('form.gradingSearch.searchText')" :bordered="false" class="mb-4">
      <BasicForm
        @register="registerForm"
        @submit="findExerciseOfClass"
        @reset="showExerciseTable = false"
      />
    </Card>
    <Card v-if="showExerciseTable" :title="t('common.resultList')" :bordered="false">
      <BasicTable @register="registerTable">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <Tag :color="record.status === 'v' ? 'green' : 'red'">
              {{ record.status }}
            </Tag>
          </template>
          <template v-if="column.key === 'action' && record.status === 'v'">
            <a-button
              size="small"
              preIcon="ant-design:edit-filled"
              @click="clickOpen(record.skill, record.student)"
            />
          </template>
        </template>
      </BasicTable>
    </Card>

    <DetailModal :title="modalTitle" :skill-type="skillType" @register="registerDetailModal" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { BasicTable, useTable } from '@/components/Table';
  import { getExerciseColumns, getSearchExerciseConfig } from '@/views/classroom/tableData';
  import { exerciseListApi } from '@/api/demo/table';
  import { useI18n } from '@/hooks/web/useI18n';
  import { Card, Tag } from 'ant-design-vue';
  import DetailModal from './DetailModal.vue';
  import { useModal } from '@/components/Modal';
  import PageWrapper from '@/components/Page/src/PageWrapper.vue';
  import BasicForm from '@/components/Form/src/BasicForm.vue';
  import { useForm } from '@/components/Form';
  import { searchGradingSchemas } from '@/views/classroom/data';
  import { ref } from 'vue';
  import { SkillType } from '@/api/exam/examModel';

  const { t } = useI18n();
  const [registerTable] = useTable({
    api: exerciseListApi(),
    columns: getExerciseColumns(),
    useSearchForm: true,
    formConfig: getSearchExerciseConfig(),
    tableSetting: { fullScreen: true },
    showIndexColumn: false,
    rowKey: 'id',
    showSelectionBar: false,
    actionColumn: {
      title: t('table.action'),
      dataIndex: 'action',
    },
  });
  const [registerDetailModal, { openModal: openDetailModal }] = useModal();
  const [registerForm, { validate }] = useForm({
    baseColProps: {
      span: 6,
    },
    schemas: searchGradingSchemas,
    showActionButtonGroup: true,
  });

  const showExerciseTable = ref(false);
  const skillType = ref<SkillType>('reading');
  const modalTitle = ref('');

  function clickOpen(skillVal: SkillType, studentName: string) {
    skillType.value = skillVal;
    modalTitle.value = `Học sinh: ${studentName} - Kỹ năng: ${skillVal}`;
    openDetailModal();
  }

  async function findExerciseOfClass() {
    try {
      // if (tableRef.value) {
      //   console.log('table data:', tableRef.value.getDataSource());
      // }

      const [values] = await Promise.all([validate()]);
      console.log('form data:', { ...values });
      showExerciseTable.value = true;
    } catch (error) {
      console.log(error);
    }
  }
</script>
