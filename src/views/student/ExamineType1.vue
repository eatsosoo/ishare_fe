<template>
  <Row :gutter="[16, 16]">
    <Col :span="12">
      <Card>
        <div v-html="sample"></div>
      </Card>
    </Col>
    <Col :span="12">
      <Card>
        <Quiz
          v-for="question in questionsSample"
          :key="question.no"
          class="mb-4"
          :question="question"
        />
      </Card>
    </Col>
  </Row>
</template>

<script lang="ts" setup>
  import { Card, Col, Row } from 'ant-design-vue';
  import Quiz from './Quiz.vue';
  import { SelectQuestionType } from '@/views/test/data';

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
      type: SelectQuestionType.SingleChoice,
      options: [
        { id: 'A', text: 'Option A' },
        { id: 'B', text: 'Option B' },
        { id: 'C', text: 'Option C' },
        { id: 'D', text: 'Option D' },
      ],
      answer: 'A',
    },
    {
      no: 2,
      content: 'What is the capital of Germany?',
      type: SelectQuestionType.SingleChoice,
      options: [
        { id: 'A', text: 'Option A' },
        { id: 'B', text: 'Option B' },
        { id: 'C', text: 'Option C' },
        { id: 'D', text: 'Option D' },
      ],
      answer: 'B',
    },
    {
      no: 3,
      content: 'What is the capital of Italy?',
      type: SelectQuestionType.SingleChoice,
      options: [
        { id: 'A', text: 'Option A' },
        { id: 'B', text: 'Option B' },
        { id: 'C', text: 'Option C' },
        { id: 'D', text: 'Option D' },
      ],
      answer: 'C',
    },
  ];
</script>
