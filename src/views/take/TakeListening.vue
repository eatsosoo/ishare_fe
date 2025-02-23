<template>
  <div>
    <Row :gutter="[16, 16]" class="w-[100vw] p-4">
      <Col :span="24">
        <audio v-if="props.value?.media" :src="props.value?.media" controls class="h-8"></audio>
      </Col>
    </Row>
    <Row :gutter="[16, 16]" class="h-[84vh] w-[100vw] border-t-1 border-gray-200">
      <Col :span="24" class="border-gray border-l-2 h-full overflow-auto p-6">
        <div ref="htmlContainer">
          <div
            v-for="(group, gIdx) in props.value?.parts[state.tabActive].question_groups"
            :key="group.id || gIdx"
            class="px-6 mb-12"
          >
            <h2 class="text-primary"
              >Questions
              {{
                group.question_no.length > 1
                  ? `${group.question_no[0]} - ${group.question_no.at(-1)}`
                  : group.question_no[0]
              }}</h2
            >
            <div v-html="renderGroupQuestions(group, classStyle)"></div>
          </div>
        </div>
      </Col>
    </Row>

    <div class="absolute bottom-0 bg-white box-shadow border-t w-full border-gray-200 border-t-1">
      <div class="flex gap-4 py-2 px-2">
        <div
          v-for="(p, index) in props.value?.parts"
          :key="index"
          @click="clickTab(index)"
          :class="
            state.tabActive === index
              ? 'shrink-0 border-[#e8202a]'
              : 'flex-1 cursor-pointer border-gray'
          "
          class="border-1 py-4 px-6 rounded-xl"
        >
          <div v-if="state.tabActive === index" class="flex items-center">
            <div class="text-xl font-semibold mr-2">Part {{ index + 1 }}</div>
            <div class="flex gap-2">
              <div v-for="(group, gIdx) in p.question_groups" :key="gIdx" class="flex gap-2">
                <div
                  v-for="q in group.question_no"
                  :key="q"
                  class="rounded-full h-8 w-8 border flex items-center justify-center border-gray-200"
                >
                  {{ q }}
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-lg text-center">
            <span class="font-semibold mr-4">Part {{ index + 1 }}</span>
            <span class="font-light font-italic"
              >of {{ countQuestions(p.question_groups) }} questions</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive } from 'vue';
  import { GroupQuestionItem, SkillItem } from '../test/types/question';
  import { Col, Row } from 'ant-design-vue';
  import { renderGroupQuestions } from './helpers';

  const props = defineProps({
    value: {
      type: Object as PropType<SkillItem>,
      default: () => {},
    },
  });

  const state = reactive({
    tabActive: 0,
  });

  const classStyle =
    'bg-white rounded-full text-center outline-red-400 outline-1 border-gray-300 border-1 p-1 shadow-md h-[32px]';

  function clickTab(index: number) {
    state.tabActive = index;
    // getInputValues();
  }

  function countQuestions(groups: GroupQuestionItem[]) {
    return groups.reduce((total, group) => {
      return (total += group.question_count);
    }, 0);
  }
</script>
