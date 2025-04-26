<template>
  <PageWrapper :title="t('routes.page.practiceGrading')">
    <Card :title="t('form.searchPracticeTest')" :bordered="false" class="mb-4">
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
          <template v-if="column.key === 'score'">
            {{
              record.score === -1 || record.score === null || record.score === '-1.0'
                ? t('common.noScoreYet')
                : `${['Writing', 'Speaking'].includes(record.skill) ? record.score : `${parseInt(record.score)}/${record.question_count}`}`
            }}
          </template>
          <template v-if="column.key === 'status'">
            <Tag :color="record.completed_at ? 'green' : 'red'">
              {{ record.completed_at ? 'v' : 'x' }}
            </Tag>
          </template>
          <template v-if="column.key === 'action' && record.completed_at">
            <a-button
              size="small"
              preIcon="ant-design:edit-filled"
              @click="clickOpen(record as ExamGradingListItem)"
            />
          </template>
        </template>
      </BasicTable>
    </Card>

    <DetailModal
      :title="modalTitle"
      :skill-type="skillType"
      :exam-id="examIdRef"
      :student-id="studentIdRef"
      :score-id="scoreIdRef"
      :times="timeRef"
      :score="scoreRef"
      :assign-at="assignAtRef"
      @register="registerDetailModal"
      @submit-grading="handleSuccess"
    />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { BasicTable, useTable } from '@/components/Table';
  import { getPracticeGradingColumns, getSearchExerciseConfig } from '@/views/classroom/tableData';
  import { useI18n } from '@/hooks/web/useI18n';
  import { Card, Tag } from 'ant-design-vue';
  import DetailModal from './DetailModal.vue';
  import { useModal } from '@/components/Modal';
  import PageWrapper from '@/components/Page/src/PageWrapper.vue';
  import BasicForm from '@/components/Form/src/BasicForm.vue';
  import { useForm } from '@/components/Form';
  import { searchGradingPracticeTestSchemas } from '@/views/classroom/data';
  import { ref } from 'vue';
  import { ExamGradingListItem, SkillType } from '@/api/exam/examModel';
  import { practiceGradingListApi } from '@/api/exam/exam';
  import { useUserStore } from '@/store/modules/user';

  const { t } = useI18n();
  const useStore = useUserStore();
  const [registerTable, { reload }] = useTable({
    api: practiceGradingListApi(),
    columns: getPracticeGradingColumns(),
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
  const [registerDetailModal, { openModal: openDetailModal, closeModal: closeDetailModal }] =
    useModal();

  const [registerForm, { validate }] = useForm({
    baseColProps: {
      span: 6,
    },
    schemas: searchGradingPracticeTestSchemas,
    showActionButtonGroup: true,
  });

  const showExerciseTable = ref(false);
  const skillType = ref<SkillType>('Reading');
  const modalTitle = ref('');
  const examIdRef = ref<number | undefined>(undefined);
  const studentIdRef = ref<number | undefined>(undefined);
  const scoreIdRef = ref<number | undefined>(undefined);
  const timeRef = ref<number | undefined>(undefined);
  const scoreRef = ref<number | undefined>(undefined);
  const assignAtRef = ref<string | undefined>(undefined);

  function clickOpen(item: ExamGradingListItem) {
    const { exam_id, skill, user_name, user_id, score_id, times, score } = item;
    if (!exam_id || !user_id || !score_id) {
      return;
    }

    skillType.value = skill;
    modalTitle.value = `${t('common.student')}: ${user_name} - ${t('form.skill')}: ${skill}`;
    examIdRef.value = exam_id;
    studentIdRef.value = user_id;
    scoreIdRef.value = score_id;
    timeRef.value = times;
    scoreRef.value = score;
    assignAtRef.value = 'exam';

    openDetailModal();
  }

  function handleSuccess() {
    reload();
    closeDetailModal();
  }

  async function findExerciseOfClass() {
    try {
      const [values] = await Promise.all([validate()]);
      const { examId, skill } = values;
      console.log('examId', examId);
      useStore.setPracticeTestId(examId);
      useStore.setGradingSkill(skill);
      showExerciseTable.value = true;
      reload();
    } catch (error) {
      console.log(error);
    }
  }
</script>
