<template>
  <BasicModal
    v-bind="$attrs"
    :title="props.title"
    width="500px"
    :height="300"
    :can-fullscreen="false"
    :loading="loading"
  >
    <div>
      <table class="table-fixed w-full text-center">
        <thead class="sticky top-0">
          <tr class="bg-red-100 h-8">
            <th class="w-12">ID</th>
            <th>{{ t('table.className') }}</th>
            <th>{{ t('table.status') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in history"
            :key="index"
            class="h-12"
            :class="{ 'bg-gray-100': index % 2 !== 0 }"
          >
            <td>{{ item.id }}</td>
            <td>{{ item.title }}</td>
            <td>
              <Tag :color="colorMap[item.status]">{{
                item.status == 1 ? t('common.transferred') : t('common.enrolled')
              }}</Tag>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
  import { getHistoryClassApi } from '@/api/student/student';
  import { BasicModal } from '@/components/Modal';
  import { useI18n } from '@/hooks/web/useI18n';
  import { Tag } from 'ant-design-vue';
  import { ref, watch } from 'vue';

  const props = defineProps({
    title: {
      type: String,
      default: '',
    },
    userId: {
      type: [Number, null] as PropType<number | null>,
      default: null,
    },
  });

  type HistoryClassItem = {
    id: number;
    title: string;
    status: number;
  };

  const { t } = useI18n();
  const loading = ref(false);
  const history = ref<HistoryClassItem[]>([]);

  const colorMap = {
    0: 'green',
    1: 'orange',
  };

  const getHistoryClass = async (userId: number) => {
    try {
      loading.value = true;
      // Call API to get history class data
      const result = await getHistoryClassApi(userId);
      if (result && result.items) {
        history.value = [...result.items].sort();
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
