<template>
  <div class="bg-white px-2 mb-8">
    <Tabs v-model:activeKey="activeKey" @change="handleChangeTab">
      <TabPane v-for="(item, index) in tabs" :key="item.key" :tab="item.tab">
        <Row :gutter="[16, 16]">
          <Col :span="24" class="flex">
            <div class="re-box-shadow rounded-lg pa-4 w-full">
              <template v-if="groupActive">
                <GroupQuestions :group="groupActive" @update-group="handleUpdateGroup" />
              </template>
              <template v-else>
                <div class="flex flex-col items-center justify-center h-full min-h-30">
                  <img src="@/assets/svg/empty.svg" />
                  <p class="text-gray">{{ t('common.empty') }}</p>
                </div>
              </template>
            </div>
            <div class="ml-4">
              <div
                v-for="(question_group, idx) in readingParts[index].question_groups"
                :key="`${item.key}_${idx}`"
                :class="
                  groupActive?.question_no === question_group.question_no
                    ? 'border-red'
                    : 'border-gray'
                "
                class="border rounded-lg p-2 flex flex-col items-center gap-2 mb-4 cursor-pointer"
                @click="groupActive = question_group"
              >
                <div
                  v-for="no in question_group.question_no"
                  :key="no"
                  class="bg-gray rounded-full h-6 w-6 flex items-center justify-center text-white"
                >
                  {{ no }}
                </div>
              </div>
              <a-button type="dashed" preIcon="ant-design:plus-outlined" @click="openModal" />
            </div>
          </Col>
        </Row>
      </TabPane>

      <template v-if="readingParts.length <= max && allowAddPart" #rightExtra>
        <a-button type="default" @click="handleAddTab">{{ t('common.add') }} Part</a-button>
      </template>
    </Tabs>

    <GroupCreate @register="registerModal" @ok="handleAddGroup" />
  </div>
</template>
<script lang="ts" setup>
  import { computed, reactive, ref } from 'vue';
  import { Col, Row, Tabs } from 'ant-design-vue';
  import { useI18n } from '@/hooks/web/useI18n';
  import { handleAnswerOptions, READING_PART_DEF } from '@/views/test/data';
  import {
    ExtendOptionAnswerType,
    GroupQuestionItem,
    NewPartItem,
    OptionAnswerType,
    SelectQuestionType,
  } from '@/views/test/types/question';
  import GroupQuestions from '@/views/test/form-question/GroupQuestions.vue';
  import GroupCreate from '@/views/test/form-question/GroupCreate.vue';
  import { useModal } from '@/components/Modal';
  import { useMessage } from '@/hooks/web/useMessage';
  import { cloneDeep } from 'lodash-es';

  const props = defineProps({
    value: {
      type: Array as PropType<NewPartItem[]>,
      default: () => [],
    },
    max: {
      type: Number,
      default: 3,
    },
    allowAddPart: {
      type: Boolean,
      default: true,
    },
  });

  const TabPane = Tabs.TabPane;

  const activeKey = ref(0);
  const groupActive = ref<GroupQuestionItem | null>(null);
  const readingParts = reactive<NewPartItem[]>(props.value);
  const tabs = computed(() => {
    return Array.from({ length: readingParts.length }, (_, i) => ({
      key: i,
      tab: `Part ${i + 1}`,
    }));
  });

  const { t } = useI18n();
  const [registerModal, { openModal: openModal, closeModal }] = useModal();
  const { createMessage } = useMessage();

  function handleAddTab() {
    readingParts.push(cloneDeep(READING_PART_DEF));
  }

  function handleAddGroup({
    group_type,
    total,
  }: {
    group_type: SelectQuestionType;
    total: number;
  }) {
    // console.log(group_type, total);
    const part = readingParts[activeKey.value];
    if (!part) {
      createMessage.warning('Không tìm thấy part!');
      return;
    }

    const maxItem = part.question_groups.length
      ? part.question_groups.reduce(
          (max, item) => (item.group_no > max.group_no ? item : max),
          part.question_groups[0],
        )
      : null;
    const lastQuestionNo = maxItem?.question_no.at(-1) || 0;
    const orders = Array.from({ length: total }, (_, i) => i + lastQuestionNo + 1);
    const answerDefault = Object.fromEntries(orders.map((num) => [`question_${num}`, '']));

    const newGroup: GroupQuestionItem = {
      id: null,
      group_no: maxItem ? maxItem.group_no + 1 : 1,
      question_type: group_type,
      question_text: '',
      question_no: orders,
      question_options: handleAnswerOptions(group_type, orders),
      question_answer: answerDefault,
      question_count: total,
    };
    console.log('new', newGroup);
    part.question_groups.push({ ...newGroup });
    groupActive.value = { ...newGroup };
    closeModal();
  }

  function handleChangeTab() {
    console.log(activeKey.value, readingParts);
    groupActive.value = readingParts[activeKey.value].question_groups[0];
  }

  function handleUpdateGroup(updated: {
    question_type: SelectQuestionType;
    question_text: string;
    question_answer: { [key: string]: string };
    question_options: OptionAnswerType[] | ExtendOptionAnswerType;
  }) {
    if (!groupActive.value) return;
    const { question_type, question_text, question_answer, question_options } = updated;
    const clone = {
      ...groupActive.value,
      question_type,
      question_text,
      question_answer,
      question_options,
    };

    const part = readingParts[activeKey.value];
    const index = part?.question_groups?.findIndex((item) => item.group_no === clone.group_no);

    if (index !== -1 && index !== undefined) {
      part.question_groups[index] = clone;
    }

    console.log('parts', part.question_groups);
  }

  function submitAll() {
    console.log('fianl', readingParts);
  }

  defineExpose({
    submitAll,
  });
</script>

<style lang="less" scoped>
  .reading-exercise-card {
    padding: 10px;
    border-radius: 8px;
    background-color: white;
  }

  .re-box-shadow {
    box-shadow:
      rgb(50 50 93 / 25%) 0 2px 5px -1px,
      rgb(0 0 0 / 30%) 0 1px 3px -1px;
  }
</style>
