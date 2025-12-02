<template>
  <div>
    <Card class="m-4">
      <Tabs v-model:activeTab="activeTab" @change="activeKey = $event">
        <TabPane v-for="tab in tabs" :key="tab.key" v-bind="omit(tab, ['content', 'key'])">
          <template v-if="tab.key === 0">
            <div class="shadow-md rounded-md mt-1">
              <BasicTable @register="registerListTable">
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'score'">
                    {{
                      record.score === -1 || record.score === null
                        ? t('common.noScoreYet')
                        : `${['Writing', 'Speaking'].includes(record.skill) ? record.score : `${record.score}/${record.question_count}`}`
                    }}
                  </template>
                  <template v-if="column.key === 'action' && !record.completed_at">
                    <Tooltip title="Reading" placement="bottom">
                      <a-button
                        size="small"
                        preIcon="ant-design:read-outlined"
                        @click="clickOpen(record.id, 'Reading')"
                      />
                    </Tooltip>
                    <Tooltip title="Listening" placement="bottom">
                      <a-button
                        size="small"
                        preIcon="ant-design:customer-service-outlined"
                        @click="clickOpen(record.id, 'Listening')"
                      />
                    </Tooltip>
                    <Tooltip title="Writing" placement="bottom">
                      <a-button
                        size="small"
                        preIcon="ant-design:edit-outlined"
                        @click="clickOpen(record.id, 'Writing')"
                      />
                    </Tooltip>
                    <Tooltip title="Speaking" placement="bottom">
                      <a-button
                        size="small"
                        preIcon="ant-design:audio-outlined"
                        @click="clickOpen(record.id, 'Speaking')"
                      />
                    </Tooltip>
                  </template>
                </template>
              </BasicTable>
            </div>
          </template>
          <template v-else>
            <div class="shadow-md rounded-md mt-1">
              <BasicTable @register="registerDoneTable">
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'status'">
                    <Tag :color="tagColorWork(record.completed_at, record.times, record.retake)">
                      {{ statusWork(record.completed_at, record.times, record.retake) }}
                    </Tag>
                  </template>
                  <template v-if="column.key === 'action'">
                    <a-button
                      v-if="record.completed_at"
                      size="small"
                      preIcon="ant-design:eye-outlined"
                      @click="clickView(record)"
                    />
                    <a-button
                      v-if="record.retake === 1 && !record.retake_score"
                      size="small"
                      preIcon="ant-design:rollback-outlined"
                      class="ml-2"
                      @click="clickRetake(record.exam_id, record.skill)"
                    />
                  </template>
                </template>
              </BasicTable>
            </div>
          </template>
        </TabPane>
      </Tabs>
    </Card>

    <DetailModal
      :title="modalTitle"
      :skill-type="skillType"
      :exam-id="examIdRef"
      :student-id="studentIdRef"
      :score="scoreRef"
      :times="timeRef"
      @register="registerExeModal"
    />
  </div>
</template>
<script lang="ts" setup>
  import BasicTable from '@/components/Table/src/BasicTable.vue';
  import { useTable } from '@/components/Table';
  import { useI18n } from '@/hooks/web/useI18n';
  import {
    getExamListConfig,
    getPracticeDoneColumns,
    getPracticeDoneConfig,
    getTestColumns,
  } from '@/views/classroom/tableData';
  import { Card, TabPane, Tabs, Tag, Tooltip } from 'ant-design-vue';

  import { SkillType } from '@/api/exam/examModel';
  import { useRouter } from 'vue-router';
  import { practiceDoneListApi, practiceExamListApi } from '@/api/exam/exam';
  import { ref } from 'vue';
  import { Key } from 'ant-design-vue/es/_util/type';
  import { omit } from 'lodash-es';
  import { useUserStore } from '@/store/modules/user';
  import DetailModal from './DetailModal.vue';
  import { useModal } from '@/components/Modal';
  import { statusWork, tagColorWork } from '@/utils/stringUtils';

  const { t } = useI18n();

  const activeTab = ref('0');
  const activeKey = ref<Key>(1);
  const tabs = [
    {
      key: 0,
      tab: t('common.practiceTestList'),
    },
    {
      key: 1,
      tab: t('common.practiceTestDone'),
    },
  ];

  const modalTitle = ref('');
  const examIdRef = ref(0);
  const studentIdRef = ref(0);
  const skillType = ref<SkillType>('Reading');
  const scoreRef = ref(0);
  const timeRef = ref<number | undefined>(undefined);
  const [registerExeModal, { openModal: openExeModal }] = useModal();

  const router = useRouter();
  const useStore = useUserStore();

  const [registerListTable] = useTable({
    title: t('common.resultList'),
    api: practiceExamListApi(),
    columns: getTestColumns(),
    useSearchForm: true,
    formConfig: getExamListConfig(),
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
  const [registerDoneTable] = useTable({
    title: t('common.resultList'),
    api: practiceDoneListApi(useStore.userInfo?.id),
    columns: getPracticeDoneColumns(),
    useSearchForm: true,
    formConfig: getPracticeDoneConfig(),
    showTableSetting: true,
    tableSetting: { fullScreen: true },
    showIndexColumn: true,
    rowKey: 'id',
    showSelectionBar: false,
    actionColumn: {
      title: t('table.action'),
      dataIndex: 'action',
    },
  });

  function clickOpen(examId: number, skill: SkillType) {
    router.push(`/take/practice?id=${examId}&type=${skill}`);
  }

  function clickView(item: any) {
    const userId = useStore.userInfo?.id;
    if (!userId) {
      return;
    }
    const { user_name, skill, exam_id, score, times } = item;
    modalTitle.value = `Học sinh: ${user_name} - Kỹ năng: ${skill}`;
    examIdRef.value = exam_id;
    studentIdRef.value = userId;
    timeRef.value = times;
    skillType.value = skill;
    scoreRef.value = parseInt(score);

    openExeModal();
  }

  function clickRetake(homeworkId: number, skill: SkillType) {
    router.push(`/take/practice?id=${homeworkId}&type=${skill}&retake=1`); // take/practice?id=37&type=Reading
  }
</script>

<style lang="less" scoped>
  .box-shadow {
    box-shadow: 0 -12px 20px -22px rgb(0 0 0 / 45%);
  }

  .shadow2 {
    box-shadow:
      0 2px 4px 0 rgb(0 0 0 / 13%),
      0 1px 1px 0 rgb(0 0 0 / 11%);
  }
</style>
