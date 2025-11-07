<template>
  <div class="p-4 h-[95%] pb-12">
    <h1 class="mb-8">Welcome back iShare LMS</h1>
    <!-- <GrowCard :loading="loading" class="enter-y" />
    <SiteAnalysis class="!my-4 enter-y" :loading="loading" />
    <div class="md:flex enter-y">
      <VisitRadar class="md:w-1/3 w-full" :loading="loading" />
      <VisitSource class="md:w-1/3 !md:mx-4 !md:my-0 !my-4 w-full" :loading="loading" />
      <SalesProductPie class="md:w-1/3 w-full" :loading="loading" />
    </div> -->
    <div class="h-full grid grid-cols-2 grid-row-2 gap-6">
      <div class="rounded-lg border-1 p-4 btn-raise btn-card text-center">
        <img src="@/assets/svg/dashboard/1.svg" class="w-50 h-50" />
      </div>
      <div class="rounded-lg border-1 p-4 btn-raise btn-card text-center">
        <img src="@/assets/svg/dashboard/2.svg" class="w-50 h-50" />
      </div>
      <div class="rounded-lg border-1 p-4 btn-raise btn-card text-center">
        <img src="@/assets/svg/dashboard/3.svg" class="w-50 h-50" />
      </div>
      <div class="rounded-lg border-1 p-4 btn-raise btn-card text-center">
        <img src="@/assets/svg/dashboard/4.svg" class="w-50 h-50" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  // import GrowCard from './components/GrowCard.vue';
  // import SiteAnalysis from './components/SiteAnalysis.vue';
  // import VisitSource from './components/VisitSource.vue';
  // import VisitRadar from './components/VisitRadar.vue';
  // import SalesProductPie from './components/SalesProductPie.vue';

  const loading = ref(true);

  setTimeout(() => {
    loading.value = false;
  }, 1500);
</script>

<style lang="scss" scoped>
  .btn-card {
    background-color: var(--component-background-color);
  }

  .btn-raise {
    display: inline-block;
    padding: 12px 22px;

    /* tạo "khối" bằng nhiều shadow */
    transform: translateY(0);
    transition:
      transform 0.12s ease,
      box-shadow 0.12s ease,
      filter 0.12s ease;
    border: none;
    border-radius: 10px;
    box-shadow:
      0 6px 0 rgb(0 0 0 / 15%),
      0 12px 24px rgb(0 0 0 / 15%);
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    appearance: none;
    will-change: transform, box-shadow;
  }

  /* hover nâng nhẹ */
  .btn-raise:hover {
    transform: translateY(-4px);
    filter: brightness(1.03);
    box-shadow:
      0 10px 0 rgb(0 0 0 / 16%),
      0 18px 36px rgb(0 0 0 / 18%);
  }

  /* active: ấn xuống (như 1 khối thật) */
  .btn-raise:active {
    transform: translateY(4px);
    transition-duration: 0.06s;
    box-shadow:
      0 2px 0 rgb(0 0 0 / 12%),
      0 4px 8px rgb(0 0 0 / 12%);
  }

  /* keyboard accessible focus */
  .btn-raise:focus {
    outline-offset: 3px;
  }
</style>
