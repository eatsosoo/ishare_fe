<template>
  <div class="mt-2">
    Chế độ phân quyền hiện tại:
    <a-button type="link">
      {{
        permissionMode === PermissionModeEnum.BACK
          ? 'Chế độ phân quyền backend'
          : 'Chế độ phân quyền role frontend'
      }}
    </a-button>
    <a-button class="ml-4" @click="togglePermissionMode" type="primary">
      Chuyển đổi chế độ phân quyền
    </a-button>
    <Divider />
  </div>
</template>
<script lang="ts" setup>
  import { computed } from 'vue';
  import { useAppStore } from '@/store/modules/app';
  import { PermissionModeEnum } from '@/enums/appEnum';
  import { Divider } from 'ant-design-vue';
  import { usePermission } from '@/hooks/web/usePermission';

  defineOptions({ name: 'CurrentPermissionMode' });

  const appStore = useAppStore();
  const permissionMode = computed(() => appStore.getProjectConfig.permissionMode);
  const { togglePermissionMode } = usePermission();
</script>
