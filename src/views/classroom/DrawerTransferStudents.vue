<template>
  <BasicDrawer v-bind="$attrs" title="Drawer Title" width="50%" :loading="loading" @close="reset">
    <template #title>
      <div class="flex justify-between items-center">
        <span>{{ props.title }}</span>
        <Button type="primary" :loading="loading" @click="changeClass">{{
          t('common.confirm')
        }}</Button>
      </div>
    </template>
    <div class="shadow-lg rounded-lg p-4 mx-1 mb-6">
      <p class="font-500 text-md">Học sinh</p>
      <div
        v-for="(student, index) in props.students"
        :key="student.id"
        class="p-2 border border-gray-200"
        :class="{ 'border-b-0': index !== props.students.length - 1 }"
      >
        <span>{{ student.name }}</span>
      </div>
    </div>
    <div class="shadow-lg rounded-lg p-1 mx-1 mb-6">
      <SelectClass
        :extend="false"
        :open-default="true"
        @select="newClassId = $event"
        ref="selectClassRef"
      />
    </div>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { BasicDrawer } from '@/components/Drawer';
  import SelectClass from '../exercise/SelectClass.vue';
  import { h, ref } from 'vue';
  import { transferStudentOfClassApi } from '@/api/class/class';
  import { useI18n } from '@/hooks/web/useI18n';
  import { TransferStudentsParams } from '@/api/class/classModel';
  import { useMessage } from '@/hooks/web/useMessage';
  import { Button } from 'ant-design-vue';
  import { cloneDeep } from 'lodash-es';

  const props = defineProps({
    title: {
      type: String,
      default: '',
    },
    rootClassId: {
      type: Number,
      required: true,
    },
    students: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
  });

  const { t } = useI18n();
  const newClassId = ref<number | null>(null);
  const loading = ref(false);
  const selectClassRef = ref();

  const emit = defineEmits(['success']);
  const { createConfirm, createErrorModal } = useMessage();

  const changeClass = () => {
    if (props.students.length === 0) {
      createErrorModal({
        title: t('form.selectClass'),
        content: t('common.selectStudent'),
      });
      return;
    }
    if (!newClassId.value) {
      createErrorModal({
        title: t('form.selectClass'),
        content: t('form.notSelect'),
      });
      return;
    }

    const formData: TransferStudentsParams = {
      class_id: props.rootClassId,
      students: props.students.map((student) => ({ id: student.id })),
      new_class_id: newClassId.value,
    };
    createConfirm({
      iconType: 'warning',
      title: () => h('span', t('sys.app.logoutTip')),
      content: () => h('span', t('common.warning.transferStudent')),
      onOk: async () => {
        loading.value = true;
        try {
          const res = await transferStudentOfClassApi(formData);
          if (res && res.items) {
            emit('success');
          }
        } catch (error) {
          console.error('API error:', error);
        } finally {
          loading.value = false; // Ensure loading is turned off in both success and failure cases
        }
      },
    });
  };

  const reset = () => {
    newClassId.value = null;
    selectClassRef.value?.reset();
  };
</script>
