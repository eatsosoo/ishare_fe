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
      message="Sau khi nhấp, vui lòng kiểm tra sự thay đổi của nút"
      show-icon
    />

    <div class="mt-4">
      Chuyển đổi quyền (Vui lòng chuyển chế độ quyền sang quyền vai trò Frontend trước):
      <Space>
        <a-button @click="changeRole(RoleEnum.SUPER)" :type="isSuper ? 'primary' : 'default'">
          {{ RoleEnum.SUPER }}
        </a-button>
        <a-button @click="changeRole(RoleEnum.TEST)" :type="isTest ? 'primary' : 'default'">
          {{ RoleEnum.TEST }}
        </a-button>
      </Space>
    </div>
    <Divider>Cách kiểm tra quyền qua thành phần (Nếu cần có thể tự đăng ký toàn cục)</Divider>
    <Authority :value="RoleEnum.SUPER">
      <a-button type="primary" class="mx-4"> Chỉ hiển thị với quyền super </a-button>
    </Authority>

    <Authority :value="RoleEnum.TEST">
      <a-button color="success" class="mx-4"> Chỉ hiển thị với quyền test </a-button>
    </Authority>

    <Authority :value="[RoleEnum.TEST, RoleEnum.SUPER]">
      <a-button color="error" class="mx-4"> Chỉ hiển thị với quyền [test, super] </a-button>
    </Authority>

    <Divider>Cách kiểm tra quyền qua hàm (Phù hợp cho việc lọc trong hàm)</Divider>
    <a-button v-if="hasPermission(RoleEnum.SUPER)" type="primary" class="mx-4">
      Chỉ hiển thị với quyền super
    </a-button>

    <a-button v-if="hasPermission(RoleEnum.TEST)" color="success" class="mx-4">
      Chỉ hiển thị với quyền test
    </a-button>

    <a-button v-if="hasPermission([RoleEnum.TEST, RoleEnum.SUPER])" color="error" class="mx-4">
      Chỉ hiển thị với quyền [test, super]
    </a-button>

    <Divider
      >Cách kiểm tra quyền qua chỉ thị (Phương pháp này không thể thay đổi quyền động.)</Divider
    >
    <a-button v-auth="RoleEnum.SUPER" type="primary" class="mx-4">
      Chỉ hiển thị với quyền super
    </a-button>

    <a-button v-auth="RoleEnum.TEST" color="success" class="mx-4">
      Chỉ hiển thị với quyền test
    </a-button>

    <a-button v-auth="[RoleEnum.TEST, RoleEnum.SUPER]" color="error" class="mx-4">
      Chỉ hiển thị với quyền [test, super]
    </a-button>
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { Alert, Divider, Space } from 'ant-design-vue';
  import CurrentPermissionMode from '../CurrentPermissionMode.vue';
  import { useUserStore } from '@/store/modules/user';
  import { RoleEnum } from '@/enums/roleEnum';
  import { usePermission } from '@/hooks/web/usePermission';
  import { Authority } from '@/components/Authority';
  import { PageWrapper } from '@/components/Page';

  const { changeRole, hasPermission } = usePermission();
  const userStore = useUserStore();

  const isSuper = computed(() => userStore.getRoleList.includes(RoleEnum.SUPER));
  const isTest = computed(() => userStore.getRoleList.includes(RoleEnum.TEST));
</script>
<style lang="less" scoped>
  .demo {
    background-color: @component-background;
  }
</style>
