<template>
  <PageWrapper>
    <Card :title="t('form.gradingSearch.searchText')" :bordered="false" class="mb-4">
      <div class="shadow-lg rounded-lg p-1 mx-1 mb-2">
        <SelectClass :extend="false" @select="classId = $event" ref="selectClassRef" />
      </div>
      <div class="shadow-lg rounded-lg p-1 mx-1">
        <BasicForm
          @register="registerForm"
          @submit="findExerciseOfClass"
          @reset="showExerciseTable = false"
          class="mt-6"
        />
      </div>
    </Card>
    <Card v-if="showExerciseTable" :title="t('common.resultList')" :bordered="false">
      <BasicTable @register="registerTable">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'completed_at'">{{
            record.completed_at || record.status
          }}</template>
          <template v-if="column.key === 'score'">
            {{
              record.score === -1 || record.score === null
                ? t('common.noScoreYet')
                : `${['Writing', 'Speaking'].includes(record.skill) ? record.score : `${record.score}/${record.question_count}`}`
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
    <ExeModal
      :title="modalTitle"
      :skill-type="skillType"
      :exam-id="examIdRef"
      :student-id="studentIdRef"
      :score-id="scoreIdRef"
      :times="timeRef"
      :score="scoreRef"
      :assign-at="assignAtRef"
      @register="registerExeModal"
      @submit-grading="handleSuccess"
    />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { BasicTable, useTable } from '@/components/Table';
  import { getExamGradingColumns, getSearchExerciseConfig } from '@/views/classroom/tableData';
  import { useI18n } from '@/hooks/web/useI18n';
  import { Card, Tag } from 'ant-design-vue';
  import DetailModal from './DetailModal.vue';
  import ExeModal from './ExeModal.vue';
  import { useModal } from '@/components/Modal';
  import PageWrapper from '@/components/Page/src/PageWrapper.vue';
  import BasicForm from '@/components/Form/src/BasicForm.vue';
  import { useForm } from '@/components/Form';
  import { searchGradingSchemas } from '@/views/classroom/data';
  import { ref } from 'vue';
  import { ExamGradingListItem, SkillType } from '@/api/exam/examModel';
  import { examGradingListApi } from '@/api/exam/exam';
  import { useUserStore } from '@/store/modules/user';
  import SelectClass from '../exercise/SelectClass.vue';
  import { useMessage } from '@/hooks/web/useMessage';

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
  const [registerDetailModal, { openModal: openDetailModal, closeModal: closeDetailModal }] =
    useModal();
  const [registerExeModal, { openModal: openExeModal, closeModal: closeExeModal }] = useModal();

  const [registerForm, { validate }] = useForm({
    baseColProps: {
      span: 6,
    },
    schemas: searchGradingSchemas,
    showActionButtonGroup: true,
  });
  const { createErrorModal } = useMessage();

  const classId = ref<number | null>(null);

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
    const { exam_id, skill, name, user_id, score_id, times, score, assign_at } = item;
    if (!exam_id || !user_id || !score_id) {
      return;
    }

    skillType.value = skill;
    modalTitle.value = `${t('common.student')}: ${name} - ${t('form.skill')}: ${skill}`;
    examIdRef.value = exam_id;
    studentIdRef.value = user_id;
    scoreIdRef.value = score_id;
    timeRef.value = times;
    scoreRef.value = score;
    assignAtRef.value = assign_at;

    if (assign_at === 'exam') {
      openDetailModal();
    } else {
      openExeModal();
    }
  }

  function handleSuccess() {
    reload();
    closeDetailModal();
    closeExeModal();
  }

  async function findExerciseOfClass() {
    try {
      const [values] = await Promise.all([validate()]);
      if (!classId.value) {
        createErrorModal({
          title: t('form.selectClass'),
          content: t('form.notSelect'),
        });
        return;
      }
      const { skill, type } = values;
      useStore.setClassId(classId.value);
      useStore.setGradingType(type);
      useStore.setGradingSkill(skill);
      showExerciseTable.value = true;
      reload();
    } catch (error) {
      console.log(error);
    }
  }
</script>
