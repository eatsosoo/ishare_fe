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
          <template v-if="column.key === 'completed_at'">{{
            record.completed_at || record.status
          }}</template>
          <template v-if="column.key === 'status'">
            <Tag :color="record.completed_at ? 'green' : 'red'">
              {{ record.completed_at ? 'v' : 'x' }}
            </Tag>
          </template>
          <template v-if="column.key === 'action' && record.completed_at">
            <a-button size="small" preIcon="ant-design:edit-filled" @click="clickOpen(record)" />
          </template>
        </template>
      </BasicTable>
    </Card>

    <DetailModal
      :title="modalTitle"
      :skill-type="skillType"
      :exam-id="examIdRef"
      :student-id="studentIdRef"
      @register="registerDetailModal"
    />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { BasicTable, useTable } from '@/components/Table';
  import { getExamGradingColumns, getSearchExerciseConfig } from '@/views/classroom/tableData';
  import { useI18n } from '@/hooks/web/useI18n';
  import { Card, Tag } from 'ant-design-vue';
  import DetailModal from './DetailModal.vue';
  import { useModal } from '@/components/Modal';
  import PageWrapper from '@/components/Page/src/PageWrapper.vue';
  import BasicForm from '@/components/Form/src/BasicForm.vue';
  import { useForm } from '@/components/Form';
  import { searchGradingSchemas } from '@/views/classroom/data';
  import { ref } from 'vue';
  import { ExamGradingListItem, SkillType } from '@/api/exam/examModel';
  import { examGradingListApi } from '@/api/exam/exam';
  import { useUserStore } from '@/store/modules/user';

  const { t } = useI18n();
  const useStore = useUserStore();
  const [registerTable, { reload }] = useTable({
    api: examGradingListApi(),
    columns: getExamGradingColumns(),
    useSearchForm: false,
    formConfig: getSearchExerciseConfig(),
    tableSetting: { fullScreen: true },
    showIndexColumn: true,
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
  const skillType = ref<SkillType>('Reading');
  const modalTitle = ref('');
  const examIdRef = ref<number | undefined>(undefined);
  const studentIdRef = ref<number | undefined>(undefined);

  function clickOpen(item: ExamGradingListItem) {
    skillType.value = item.skill;
    modalTitle.value = `Học sinh: ${item.name} - Kỹ năng: ${item.skill}`;
    examIdRef.value = item.exam_id;
    studentIdRef.value = item.user_id;
    openDetailModal();
  }

  async function findExerciseOfClass() {
    try {
      const [values] = await Promise.all([validate()]);
      console.log(values);
      useStore.setClassId(values.classId);
      reload();
      showExerciseTable.value = true;
    } catch (error) {
      console.log(error);
    }
  }
</script>
