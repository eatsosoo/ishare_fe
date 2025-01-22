<template>
  <PageWrapper contentBackground title="Kiểm soát quyền nút bấm" contentClass="p-4">
    <CurrentPermissionMode />
    <p>
      Danh sách code hiện tại có quyền: <a> {{ permissionStore.getPermCodeList }} </a>
    </p>
    <Divider />
    <Alert
      class="mt-4"
      type="info"
      message="Nhấn vào để xem sự thay đổi của nút (Chức năng này chỉ có thể được kiểm tra khi ở chế độ quyền quản trị viên)"
      show-icon
    />
    <Divider />
    <a-button type="primary" class="mr-2" @click="switchToken(2)" :disabled="!isBackPermissionMode">
      Nhấn để thay đổi quyền nút (Người dùng có id là 2)
    </a-button>
    <a-button type="primary" @click="switchToken(1)" :disabled="!isBackPermissionMode">
      Nhấn để thay đổi quyền nút (Người dùng có id là 1, mặc định)
    </a-button>

    <template v-if="isBackPermissionMode">
      <Divider>Xác định quyền bằng thành phần</Divider>
      <Authority :value="'1000'">
        <a-button type="primary" class="mx-4"> Chỉ hiển thị khi có quyền code ['1000'] </a-button>
      </Authority>

      <Authority :value="'2000'">
        <a-button color="success" class="mx-4"> Chỉ hiển thị khi có quyền code ['2000'] </a-button>
      </Authority>

      <Authority :value="['1000', '2000']">
        <a-button color="error" class="mx-4">
          Chỉ hiển thị khi có quyền code ['1000','2000']
        </a-button>
      </Authority>

      <Divider>Xác định quyền bằng hàm</Divider>
      <a-button v-if="hasPermission('1000')" type="primary" class="mx-4">
        Chỉ hiển thị khi có quyền code ['1000']
      </a-button>

      <a-button v-if="hasPermission('2000')" color="success" class="mx-4">
        Chỉ hiển thị khi có quyền code ['2000']
      </a-button>

      <a-button v-if="hasPermission(['1000', '2000'])" color="error" class="mx-4">
        Chỉ hiển thị khi có quyền code ['1000','2000']
      </a-button>

      <Divider>Xác định quyền bằng chỉ thị (Phương pháp này không thể thay đổi quyền động)</Divider>
      <a-button v-auth="'1000'" type="primary" class="mx-4">
        Chỉ hiển thị khi có quyền code ['1000']
      </a-button>

      <a-button v-auth="'2000'" color="success" class="mx-4">
        Chỉ hiển thị khi có quyền code ['2000']
      </a-button>

      <a-button v-auth="['1000', '2000']" color="error" class="mx-4">
        Chỉ hiển thị khi có quyền code ['1000','2000']
      </a-button>
    </template>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { computed } from 'vue';
  import { Alert, Divider } from 'ant-design-vue';
  import CurrentPermissionMode from '../CurrentPermissionMode.vue';
  import { usePermission } from '@/hooks/web/usePermission';
  import { Authority } from '@/components/Authority';
  import { usePermissionStore } from '@/store/modules/permission';
  import { PermissionModeEnum } from '@/enums/appEnum';
  import { PageWrapper } from '@/components/Page';
  import { useAppStore } from '@/store/modules/app';
  import { useUserStore } from '@/store/modules/user';

  const { hasPermission } = usePermission();
  const permissionStore = usePermissionStore();
  const appStore = useAppStore();
  const userStore = useUserStore();

  const isBackPermissionMode = computed(
    () => appStore.getProjectConfig.permissionMode === PermissionModeEnum.BACK,
  );

  async function switchToken(userId: number) {
    // 本函数切换用户登录Token的部分仅用于演示，实际生产时切换身份应当重新登录
    const token = 'fakeToken' + userId;
    userStore.setToken(token);

    // 重新获取用户信息和菜单
    userStore.getUserInfoAction();
    permissionStore.changePermissionCode();
  }
</script>
<style lang="less" scoped>
  .demo {
    background-color: @component-background;
  }
</style>
