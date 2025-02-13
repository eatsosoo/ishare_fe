import { defineStore } from 'pinia';
import { store } from '@/store';

interface ClassState {
  classId: number | null;
}

export const useClassStore = defineStore({
  id: 'app-user',
  state: (): ClassState => ({
    classId: 1,
  }),
  getters: {
    getClassId(state): number | null {
      return state.classId;
    },
  },
  actions: {
    setClassId(id: number | null) {
      this.classId = id;
    },
  },
});

// Need to be used outside the setup
export function useClassStoreWithOut() {
  return useClassStore(store);
}
