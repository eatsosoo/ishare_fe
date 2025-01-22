<template>
  <PageWrapper
    title="Ví dụ nút quyền Frontend"
    contentBackground
    contentClass="p-4"
    content="Do khi refresh sẽ yêu cầu giao diện lấy thông tin người dùng và thiết lập lại thông tin vai trò, nên sau khi refresh giao diện sẽ trở về trạng thái ban đầu. Nếu không cần thiết, bạn có thể bỏ ghi chú phần lấy thông tin người dùng trong src/layout/default/index"
  >
    <CurrentPermissionMode />

    <p>
      Vai trò hiện tại: <a> {{ userStore.getRoleList }} </a>
    </p>
    <Alert
      class="mt-4"
      type="info"
      message="Vui lòng xem menu thay đổi ở bên trái sau khi nhấp vào"
      show-icon
    />

    <div class="mt-4">
      Chuyển đổi quyền (vui lòng chuyển chế độ quyền sang chế độ quyền vai trò front-end trước):
      <Space>
        <a-button @click="changeRole(RoleEnum.SUPER)" :type="isSuper ? 'primary' : 'default'">
          {{ RoleEnum.SUPER }}
        </a-button>
        <a-button @click="changeRole(RoleEnum.TEST)" :type="isTest ? 'primary' : 'default'">
          {{ RoleEnum.TEST }}
        </a-button>
      </Space>
    </div>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { computed } from 'vue';
  import { Alert, Space } from 'ant-design-vue';
  import { useUserStore } from '@/store/modules/user';
  import { RoleEnum } from '@/enums/roleEnum';
  import { usePermission } from '@/hooks/web/usePermission';
  import { PageWrapper } from '@/components/Page';
  import CurrentPermissionMode from '../CurrentPermissionMode.vue';

  const { changeRole } = usePermission();
  const userStore = useUserStore();

  const isSuper = computed(() => userStore.getRoleList.includes(RoleEnum.SUPER));
  const isTest = computed(() => userStore.getRoleList.includes(RoleEnum.TEST));
</script>
<style lang="less" scoped>
  .demo {
    background-color: @component-background;
  }
</style>
