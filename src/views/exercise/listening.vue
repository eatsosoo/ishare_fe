<template>
  <PageWrapper :title="t('common.listeningExercise')">
    <div class="bg-white px-4 pb-4 mb-8">
      <Tabs v-model:activeKey="activeKey" @change="questionCurrent = null">
        <TabPane
          v-for="(item, index) in listeningExercise"
          :key="item.key"
          v-bind="omit(item, ['questions', 'key'])"
        >
          <Row :gutter="[16, 16]">
            <Col :span="12">
              <div class="flex mb-4">
                <Upload
                  :beforeUpload="beforeUpload"
                  :customRequest="handleUpload"
                  :fileList="fileList"
                  @change="handleChangeFile"
                >
                  <a-button preIcon="ant-design:upload-outlined">{{
                    t('common.uploadAudio')
                  }}</a-button>
                </Upload>
                <audio v-if="audioUrl" :src="audioUrl" controls class="mt-4"></audio>
              </div>
              <div class="p-4 re-box-shadow rounded-lg">
                <h3>{{ t('common.listeningContext') }}</h3>
                <Tinymce v-model="value" @change="handleChangeTinymce" width="100%" />
              </div>
            </Col>
            <Col :span="12">
              <div class="flex gap-2 mb-2">
                <a-button
                  v-for="(question, index) in item.questions"
                  :type="
                    questionCurrent && questionCurrent.no === question.no ? 'primary' : 'default'
                  "
                  :key="`${item.key}_${index}`"
                  class="border rounded-full h-10 w-10 flex items-center justify-center cursor-pointer"
                  @click="questionCurrent = { ...question }"
                >
                  {{ question.no }}
                </a-button>
              </div>
              <div class="re-box-shadow rounded-lg pa-4 min-h-[29.2rem]">
                <template v-if="questionCurrent">
                  <Question
                    :value="questionCurrent"
                    @update:value="handleUpdateQuestion(index, $event)"
                  />
                </template>
                <template v-else>
                  <h3>{{ `${t('common.pleaseSelectQuestion')} ${item.tab}` }}</h3>
                </template>
              </div>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </div>

    <template #rightFooter>
      <a-button type="primary" @click="submitAll"> {{ t('common.saveText') }} </a-button>
    </template>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { Tinymce } from '@/components/Tinymce';
  import { PageWrapper } from '@/components/Page';
  import { Col, Row, Tabs, Upload, message } from 'ant-design-vue';
  import { useI18n } from '@/hooks/web/useI18n';
  import { listeningParts } from './data';
  import { omit } from 'lodash-es';
  import { QuestionItem, ListeningPart } from './types/question';
  import { useMessage } from '@/hooks/web/useMessage';
  import Question from '@/views/test/Question.vue';

  const TabPane = Tabs.TabPane;
  const activeKey = ref('tabs1');
  const value = ref('Reading');
  const questionCurrent = ref<QuestionItem | null>(null);
  const { t } = useI18n();
  const listeningExercise = ref<ListeningPart[]>(listeningParts);
  const { createMessage } = useMessage();
  const fileList = ref([]);
  const audioUrl = ref('');

  function handleChangeTinymce(value: string) {
    console.log(value);
  }

  function submitAll() {
    console.log('submit all');
  }

  function handleUpdateQuestion(partIdx: number, value: QuestionItem) {
    const questionIndex = listeningExercise.value[partIdx].questions.findIndex(
      (item) => item.no === questionCurrent.value?.no,
    );
    if (questionIndex !== -1) {
      listeningExercise.value[partIdx].questions[questionIndex] = value;
    }

    createMessage.success(t('common.updateSuccess'));
  }

  function handleChangeFile(info: any) {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
      audioUrl.value = URL.createObjectURL(info.file.originFileObj);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  }

  function beforeUpload(file: File) {
    const isAudio = file.type.startsWith('audio/');
    if (!isAudio) {
      message.error('You can only upload audio files!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Audio must be smaller than 2MB!');
    }
    return isAudio && isLt2M;
  }

  function handleUpload({ file, onSuccess, onError }: any) {
    // Simulate a successful upload
    setTimeout(() => {
      onSuccess('ok');
    }, 1000);
  }
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
