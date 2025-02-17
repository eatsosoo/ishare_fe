import { defineStore } from 'pinia';
import { store } from '@/store';
import { SkillType } from '@/api/exam/examModel';

interface ClassState {
  classId: number | null;
  gradingType: SkillType;
}

export const useClassStore = defineStore({
  id: 'app-user',
  state: (): ClassState => ({
    classId: null,
    gradingType: 'Reading',
  }),
  getters: {
    getClassId(state): number | null {
      return state.classId;
    },
    getGradingType(state): string {
      return state.gradingType;
    },
  },
  actions: {
    setClassId(id: number | null) {
      this.classId = id;
      console.log(this.classId);
    },
  },
});

// Need to be used outside the setup
export function useClassStoreWithOut() {
  return useClassStore(store);
}
