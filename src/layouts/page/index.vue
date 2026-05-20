<template>
  <RouterView>
    <template #default="{ Component, route }">
      <transition
        :name="
          getTransitionName({
            route,
            openCache,
            enableTransition: getEnableTransition,
            cacheTabs: getCaches,
            def: getBasicTransition,
          })
        "
        mode="out-in"
        appear
      >
        <keep-alive v-if="openCache" :include="getCaches">
          <component :is="Component" :key="route.fullPath" />
        </keep-alive>
        <component v-else :is="Component" :key="route.fullPath" />
      </transition>
    </template>
  </RouterView>
  <FrameLayout v-if="getCanEmbedIFramePage" />
  <a
    v-if="zaloPhone"
    class="zalo-floating-button"
    :href="`https://zalo.me/${zaloPhone}`"
    target="_blank"
    rel="noopener noreferrer"
    :aria-label="`Lien he Zalo ${zaloPhone}`"
  >
    <span class="zalo-floating-button__pulse"></span>
    <span class="zalo-floating-button__icon">
      <Icon icon="simple-icons:zalo" :size="28" />
    </span>
  </a>
</template>

<script lang="ts" setup>
  import { computed, onMounted, ref, unref } from 'vue';

  import Icon from '@/components/Icon/Icon.vue';
  import FrameLayout from '@/layouts/iframe/index.vue';
  import { getPublicSystemSettingByKeyApi } from '@/api/system-settings/systemSettings';

  import { useRootSetting } from '@/hooks/setting/useRootSetting';

  import { useTransitionSetting } from '@/hooks/setting/useTransitionSetting';
  import { useMultipleTabSetting } from '@/hooks/setting/useMultipleTabSetting';
  import { getTransitionName } from './transition';

  import { useMultipleTabStore } from '@/store/modules/multipleTab';

  defineOptions({ name: 'PageLayout' });

  const { getShowMultipleTab } = useMultipleTabSetting();
  const tabStore = useMultipleTabStore();

  const { getOpenKeepAlive, getCanEmbedIFramePage } = useRootSetting();

  const { getBasicTransition, getEnableTransition } = useTransitionSetting();

  const openCache = computed(() => unref(getOpenKeepAlive) && unref(getShowMultipleTab));
  const zaloPhone = ref('0123456789');

  const getCaches = computed((): string[] => {
    if (!unref(getOpenKeepAlive)) {
      return [];
    }
    return tabStore.getCachedTabList;
  });

  onMounted(async () => {
    try {
      const result = await getPublicSystemSettingByKeyApi('ZALO');
      const zaloSetting = result?.items?.find((item) => item.key === 'ZALO') || result?.items?.[0];
      if (zaloSetting?.value) {
        zaloPhone.value = zaloSetting.value;
      }
    } catch (error) {
      console.error(error);
    }
  });
</script>

<style lang="scss" scoped>
  .zalo-floating-button {
    display: inline-flex;
    position: fixed;
    z-index: 999;
    bottom: 24px;
    left: 24px;
    align-items: center;
    justify-content: center;
    width: 58px;
    height: 58px;
    transition:
      transform 0.25s ease,
      box-shadow 0.25s ease,
      filter 0.25s ease;
    animation: zalo-float 3s ease-in-out infinite;
    border-radius: 50%;
    background: linear-gradient(135deg, #0b8ff4 0%, #0068ff 100%);
    box-shadow: 0 12px 28px rgb(0 104 255 / 32%);
    color: #fff;

    &::after {
      content: '';
      position: absolute;
      transform: translateX(-120%) rotate(18deg);
      animation: zalo-shine 4.2s ease-in-out infinite;
      border-radius: inherit;
      background: linear-gradient(
        120deg,
        transparent 18%,
        rgb(255 255 255 / 34%) 42%,
        transparent 66%
      );
      inset: 0;
    }

    &:hover {
      transform: translateY(-4px) scale(1.06);
      box-shadow: 0 18px 34px rgb(0 104 255 / 38%);
      color: #fff;
      filter: saturate(1.08);
    }

    &:focus-visible {
      outline: 3px solid rgb(0 104 255 / 28%);
      outline-offset: 4px;
    }
  }

  .zalo-floating-button__pulse {
    position: absolute;
    animation: zalo-pulse 2.4s ease-out infinite;
    border: 2px solid rgb(0 104 255 / 34%);
    border-radius: inherit;
    inset: -8px;
  }

  .zalo-floating-button__icon {
    display: inline-flex;
    position: relative;
    z-index: 1;
    align-items: center;
    justify-content: center;
    animation: zalo-breath 2.6s ease-in-out infinite;
  }

  @keyframes zalo-float {
    0%,
    100% {
      transform: translateY(0);
    }

    50% {
      transform: translateY(-5px);
    }
  }

  @keyframes zalo-pulse {
    0% {
      transform: scale(0.9);
      opacity: 0.58;
    }

    72%,
    100% {
      transform: scale(1.35);
      opacity: 0;
    }
  }

  @keyframes zalo-breath {
    0%,
    100% {
      transform: scale(1);
    }

    50% {
      transform: scale(1.08);
    }
  }

  @keyframes zalo-shine {
    0%,
    58% {
      transform: translateX(-120%) rotate(18deg);
    }

    78%,
    100% {
      transform: translateX(120%) rotate(18deg);
    }
  }
</style>
