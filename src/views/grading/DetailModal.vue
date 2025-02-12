<template>
  <BasicModal
    v-bind="$attrs"
    default-fullscreen
    :show-cancel-btn="false"
    :show-ok-btn="false"
    :can-fullscreen="false"
  >
    <Row :gutter="[16, 16]">
      <Col :span="12">
        <div class="shadow-lg rounded-md p-4 mb-4">
          <h1>Đề bài</h1>
          <div v-html="sample"></div>
        </div>
      </Col>
      <Col :span="12">
        <div class="shadow-lg rounded-md p-4 mb-4">
          <h1>Bài làm của học sinh</h1>
          <template v-if="props.skillType === 'reading' || props.skillType === 'listening'">
            <div v-for="question in questionsSample" :key="question.no" class="mb-4">
              <h2 class="text-primary mb-0">Question {{ question.no }}</h2>
              <h3 class="mb-0">{{ question.no }}. {{ question.content }}</h3>
              <ul class="mb-0">
                <li v-for="option in question.options" :key="option.id">
                  <template
                    v-if="
                      option.id === question.actualAnswer &&
                      question.actualAnswer === question.studentAnswer
                    "
                  >
                    <span class="text-green-500">{{ option.id + '. ' + option.text }}</span>
                  </template>
                  <template
                    v-else-if="
                      option.id === question.actualAnswer &&
                      question.actualAnswer !== question.studentAnswer
                    "
                  >
                    <span class="text-red-500">{{ option.id + '. ' + option.text }}</span>
                  </template>
                  <template v-else>
                    <span class="text-danger">{{ option.id + '. ' + option.text }}</span>
                  </template>
                </li>
              </ul>
              <h4>Đáp án đúng: {{ question.actualAnswer }}</h4>
            </div>
          </template>
          <template v-else>
            <div v-html="sample2" class="mb-4"></div>
            <h3>Chấm điểm và nhận xét</h3>
            <Form :model="gradingFormData">
              <FormItem label="Điểm" name="score" :label-col="{ span: 3 }" label-align="left">
                <InputNumber v-model:value="gradingFormData.score" :min="0" :max="10" required />
              </FormItem>
              <FormItem
                label="Nhận xét"
                name="feedback"
                :label-col="{ span: 3 }"
                label-align="left"
              >
                <InputTextArea v-model:value="gradingFormData.feedback" />
              </FormItem>
              <div class="flex justify-end">
                <a-button type="primary" @click="submitForm">{{ t('common.confirm') }}</a-button>
              </div>
            </Form>
          </template>
        </div>
      </Col>
    </Row>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { BasicModal } from '@/components/Modal';
  import { Row, Col, InputNumber, Form, FormItem, Input } from 'ant-design-vue';
  import { ref, type PropType } from 'vue';
  import { useI18n } from '@/hooks/web/useI18n';
  import { SkillType } from '@/api/exam/examModel';

  const InputTextArea = Input.TextArea;
  const props = defineProps({
    skillType: {
      type: String as PropType<SkillType>,
      default: '',
    },
  });
  const { t } = useI18n();
  const gradingFormData = ref({
    score: 0,
    feedback: '',
  });

  const sample = `
    <h2>Welcome to Our Platform</h2>
    <p>
      Thank you for visiting our website! We are dedicated to providing you with the best experience possible. 
      Whether you are here to explore new opportunities, learn something new, or simply browse, we have something for everyone.
    </p>
    
    <h3>Our Features</h3>
    <p>
      Our platform is designed with user-friendliness in mind. Here are some of the key features you can enjoy:
    </p>
    <ul>
      <li><strong>Fast and Secure:</strong> We prioritize security while ensuring smooth and fast performance.</li>
      <li><strong>Responsive Design:</strong> Enjoy a seamless experience on any device, whether mobile, tablet, or desktop.</li>
      <li><strong>24/7 Customer Support:</strong> Our support team is always ready to assist you.</li>
      <li><strong>Regular Updates:</strong> We continuously improve our platform based on user feedback.</li>
    </ul>

    <h3>Why Choose Us?</h3>
    <p>
      There are many platforms available, but here’s why our service stands out:
    </p>
    <ol>
      <li><strong>Reliability:</strong> We have built a strong reputation for delivering quality service.</li>
      <li><strong>Innovation:</strong> We stay ahead by implementing the latest technologies.</li>
      <li><strong>Community:</strong> Join thousands of satisfied users who trust our platform.</li>
    </ol>

    <h3>Get Started Today</h3>
    <p>
      Signing up is quick and easy. Click <a href="#" style="color: blue; text-decoration: underline;">here</a> to create an account and start exploring the amazing features we offer. 
      If you have any questions, feel free to <a href="#" style="color: blue; text-decoration: underline;">contact us</a>.
    </p>

    <p>We look forward to serving you!</p>
    <h2>Welcome to Our Website</h2>
    <p>
      We are thrilled to have you here! Our platform offers a variety of features 
      to enhance your experience. Explore our latest updates and discover new possibilities.
    </p>
    <ul>
      <li>✔ Fast and secure services</li>
      <li>✔ User-friendly interface</li>
      <li>✔ 24/7 customer support</li>
    </ul>
    <p>
      Stay connected and enjoy seamless browsing. If you have any questions, feel free 
      to <a href='#' style='color: blue; text-decoration: underline;'>contact us</a>.
    </p>
  `;
  const questionsSample = [
    {
      no: 1,
      content: 'What is the capital of France?',
      options: [
        { id: 'A', text: 'Option A' },
        { id: 'B', text: 'Option B' },
        { id: 'C', text: 'Option C' },
        { id: 'D', text: 'Option D' },
      ],
      actualAnswer: 'A',
      studentAnswer: 'A',
    },
    {
      no: 2,
      content: 'What is the capital of Germany?',
      options: [
        { id: 'A', text: 'Option A' },
        { id: 'B', text: 'Option B' },
        { id: 'C', text: 'Option C' },
        { id: 'D', text: 'Option D' },
      ],
      actualAnswer: 'B',
      studentAnswer: 'B',
    },
    {
      no: 3,
      content: 'What is the capital of Italy?',
      options: [
        { id: 'A', text: 'Option A' },
        { id: 'B', text: 'Option B' },
        { id: 'C', text: 'Option C' },
        { id: 'D', text: 'Option D' },
      ],
      actualAnswer: 'C',
      studentAnswer: 'D',
    },
  ];

  // writing sample
  const sample2 =
    'We are thrilled to have you here! Our platform offers a variety of features to enhance your experience. Explore our latest updates and discover new possibilities.';

  function submitForm() {
    console.log('submit form');
  }
</script>
