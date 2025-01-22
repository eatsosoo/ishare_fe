<template>
  <PageWrapper
    title="Ví dụ về quyền quản trị viên (Backend Permission Example)"
    contentBackground
    contentClass="p-4"
    content="Hiện tại, đã mock sẵn hai bộ dữ liệu có id là 1 và 2. Các menu được trả về có thể xem chi tiết trong file mock/sys/menu.ts."
  >
    <CurrentPermissionMode />

    <Alert class="mt-4" type="info" message="Nhấn để xem sự thay đổi menu bên trái" show-icon />

    <div class="mt-4">
      Chuyển đổi quyền (Vui lòng chuyển sang chế độ quyền quản trị viên trước):
      <Space>
        <a-button @click="switchToken(1)" :disabled="!isBackPermissionMode">
          Lấy menu của người dùng có id là 1
        </a-button>
        <a-button @click="switchToken(2)" :disabled="!isBackPermissionMode">
          Lấy menu của người dùng có id là 2
        </a-button>
      </Space>
    </div>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { computed } from 'vue';
  import { usePermission } from '@/hooks/web/usePermission';
  import { useUserStore } from '@/store/modules/user';
  import { PageWrapper } from '@/components/Page';
  import { PermissionModeEnum } from '@/enums/appEnum';
  import { useAppStore } from '@/store/modules/app';
  import { Alert, Space } from 'ant-design-vue';
  import CurrentPermissionMode from '../CurrentPermissionMode.vue';

  const { refreshMenu } = usePermission();
  const userStore = useUserStore();
  const appStore = useAppStore();

  const isBackPermissionMode = computed(
    () => appStore.getProjectConfig.permissionMode === PermissionModeEnum.BACK,
  );

  async function switchToken(userId: number) {
    // 本函数切换用户登录Token的部分仅用于演示，实际生产时切换身份应当重新登录
    const token = 'fakeToken' + userId;
    userStore.setToken(token);

    // 重新获取用户信息和菜单
    userStore.getUserInfoAction();
    refreshMenu();
  }
</script>
<style lang="less" scoped>
  .demo {
    background-color: @component-background;
  }
</style>
