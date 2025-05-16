<template>
  <BasicModal
    v-bind="$attrs"
    :title="props.title"
    width="500px"
    :height="300"
    :can-fullscreen="false"
    :loading="loading"
  >
    <template #body>
      <div v-for="(item, index) in history" :key="index">
        <div class="flex items-center mb-2">
          <span class="text-lg font-semibold">{{ item.class_id }}</span>
        </div>
        <div class="text-sm text-gray-700">
          <p>{{ t('common.classType') }}: {{ item.class_name }}</p>
          <p>{{ t('common.classStatus') }}: {{ item.status }}</p>
        </div>
      </div>
    </template>
  </BasicModal>
</template>

<script setup lang="ts">
  import { BasicModal } from '@/components/Modal';
  import { ref, watch } from 'vue';

  const props = defineProps({
    title: {
      type: String,
      default: '',
    },
    userId: {
      type: Number,
      required: true,
    },
  });

  const loading = ref(false);
  const history = ref([]);

  const getHistoryClass = async (userId: number) => {
    try {
      loading.value = true;
      // Call API to get history class data
      const result = await getHistoryClassApi(userId);
      if (result && result.items) {
        history.value = result.items;
      }
    } catch (error) {
      console.error(error);
    } finally {
      loading.value = false;
    }
  };

  watch(
    () => props.userId,
    () => {
      if (props.userId) {
        getHistoryClass(props.userId);
      }
    },
    { immediate: true, deep: true },
  );
</script>
