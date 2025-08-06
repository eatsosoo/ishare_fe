<template>
  <div>
    <Row :gutter="[16, 16]" class="h-[88vh] w-[100vw]">
      <Col
        :span="colspan"
        class="border-r-2 border-gray h-full overflow-auto"
        :class="isDark ? '' : 'bg-[aliceblue]'"
      >
        <div class="p-4">
          <div>
            <h1 class="text-2xl font-bold">Part {{ state.tabActive + 1 }}</h1>
            <h1 class="text-4xl font-bold">READING PASSAGE {{ state.tabActive + 1 }}</h1>
            <div ref="content" v-html="htmlSubject[state.tabActive].subject"></div>
          </div>

          <!-- Popup lựa chọn: highlight / note -->
          <div
            v-if="showActions"
            :style="{ top: popupY + 'px', left: popupX + 'px' }"
            class="absolute bg-white border rounded shadow-md z-50"
          >
            <button
              @click="highlightSelection"
              class="mr-2 rounded hover:bg-red hover:opacity-90 cursor-pointer hover:underline m-2 mb-0"
              >Highlight</button
            >
            <button
              @click="startNote"
              class="rounded hover:bg-red hover:opacity-90 cursor-pointer hover:underline m-2"
              >Note</button
            >
          </div>

          <!-- Popup nhập ghi chú -->
          <div
            v-if="showNotePopup"
            class="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50"
          >
            <div class="bg-white p-4 rounded shadow-lg w-80">
              <textarea
                v-model="noteText"
                class="w-full h-24 p-2 border mb-2 outline-blueGray border-gray-200 rounded-md"
                placeholder="..."
              ></textarea>
              <div class="text-right">
                <a-button @click="saveNote" class="mr-2">{{ t('common.saveText') }}</a-button>
                <a-button @click="cancelNote">{{ t('common.cancelText') }}</a-button>
              </div>
            </div>
          </div>
        </div>
      </Col>
      <Col :span="colspan" class="border-gray border-l-2 h-full overflow-auto p-4">
        <div ref="htmlContainer">
          <div
            v-for="(group, gIdx) in props.value?.parts[state.tabActive].question_groups"
            :key="group.id || gIdx"
            class="px-4 mb-12"
          >
            <h2 class="text-primary font-bold"
              >Questions
              {{
                group.question_no.length > 1
                  ? `${group.question_no[0]} - ${group.question_no.at(-1)}`
                  : group.question_no[0]
              }}</h2
            >
            <div v-html="renderGroupQuestions(group, classStyle, props.answers)"></div>
          </div>
        </div>
      </Col>
      <Col :span="4" class="border-gray border-l-2 h-full overflow-auto p-4">
        <div class="mb-4">
          <Input v-model:value="searchKeyword" class="w-50" placeholder="Search..." />
        </div>
        <div>
          <div v-for="(note, index) in fillterdNotes" :key="index" class="mb-4">
            <div class="border-gray-300 border p-2 border-b-0 flex items-center justify-between">
              <span class="underline text-[#DD1804]">{{ note.text }}</span>
              <Icon icon="ion:close" @click="deleteNote(note.id)" />
            </div>
            <div class="border-gray-300 border p-2">{{ note.note }}</div>
          </div>
        </div>
      </Col>
    </Row>

    <div
      class="absolute bottom-0 bg-white box-shadow border-t w-full border-gray-200 border-t-1 overflow-x-scroll h-[55px]"
    >
      <div class="flex gap-2 py-1 px-2">
        <div
          v-for="(p, index) in props.value?.parts"
          :key="index"
          @click="clickTab(index)"
          :class="
            state.tabActive === index
              ? 'shrink-0 border-[#e8202a]'
              : 'flex-1 cursor-pointer border-gray'
          "
          class="border-1 py-1 px-4 rounded-xl"
        >
          <div v-if="state.tabActive === index" class="flex items-center flex-nowrap">
            <div class="text-lg font-semibold mr-2">Part {{ index + 1 }}</div>
            <div class="flex gap-2">
              <div v-for="(group, gIdx) in p.question_groups" :key="gIdx" class="flex gap-2">
                <div
                  v-for="q in group.question_no"
                  :key="q"
                  class="rounded-full h-6 w-6 border flex items-center justify-center border-gray-200"
                >
                  {{ q }}
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-lg text-center text-nowrap">
            <span class="font-semibold mr-4">Part {{ index + 1 }}</span>
            <span class="font-light font-italic">
              {{ answeredCountByPart[index] }} of {{ countQuestions(p.question_groups) }} questions
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
  import { GroupQuestionItem, NewPartItem, SkillItem } from '../test/types/question';
  import { Col, Input, Row } from 'ant-design-vue';
  import { renderGroupQuestions } from './helpers';
  import { useDarkModeTheme } from '@/hooks/setting/useDarkModeTheme';
  import { useI18n } from '@/hooks/web/useI18n';
  import Icon from '@/components/Icon/Icon.vue';
  import { nanoid } from 'nanoid';

  const props = defineProps({
    value: {
      type: Object as PropType<SkillItem>,
      default: () => {},
    },
    answers: {
      type: Object as PropType<{ [key: string]: string | string[] }>,
      default: () => {},
    },
    colspan: {
      type: Number,
      default: 10,
    },
  });

  const { t } = useI18n();
  const emit = defineEmits(['sync']);
  const { isDark } = useDarkModeTheme();

  const state = reactive({
    tabActive: 0,
  });

  // highlight and note
  const content = ref<any>(null);
  const showActions = ref<Boolean>(false);
  const popupX = ref(0);
  const popupY = ref(0);
  let selectedRange: any = null;

  const showNotePopup = ref<Boolean>(false);
  const noteText = ref<string>('');
  const selectedText = ref<string>('');
  const notes = ref<{ id: string; text: string; note: string }[]>([]);
  const searchKeyword = ref<string>('');
  localStorage.setItem('notes', '');

  const htmlSubject = ref<NewPartItem[]>(props.value?.parts);
  //-- END

  const classStyle =
    'bg-white rounded-full text-center outline-red-400 outline-1 border-gray-300 border-1 p-1 shadow-md h-[32px]';

  const fillterdNotes = computed(() => {
    if (!searchKeyword.value.trim()) return notes.value;
    return notes.value.filter(
      (note) =>
        note.note.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
        note.text.toLowerCase().includes(searchKeyword.value.toLowerCase()),
    );
  });

  function clickTab(index: number) {
    state.tabActive = index;
    emit('sync');
  }

  function countQuestions(groups: GroupQuestionItem[]) {
    return groups.reduce((total, group) => {
      return (total += group.question_count);
    }, 0);
  }

  const answeredCountByPart = computed(() => {
    return props.value.parts.map((part) => {
      let answeredCount = 0;

      part.question_groups.forEach((group) => {
        Object.keys(group.question_answer).forEach((questionKey) => {
          const answer = props.answers[questionKey];

          // Nếu key có dạng `question_1_2_3_4`, tách thành từng câu riêng lẻ
          const questionNumbers = questionKey.match(/\d+/g); // Lấy tất cả số trong key
          const questionCount = questionNumbers ? questionNumbers.length : 1;

          // Nếu answer là mảng (multi-choice), kiểm tra length
          if (Array.isArray(answer) && answer.length > 0) {
            answeredCount += questionCount;
          }
          // Nếu là string hoặc số, kiểm tra có giá trị không
          else if (answer !== null && answer !== undefined && answer !== '') {
            answeredCount += questionCount;
          }
        });
      });

      return answeredCount;
    });
  });

  function handleMouseUp() {
    const selection = window.getSelection();
    if (!selection) return;

    const text = selection.toString().trim();

    if (text.length > 0) {
      selectedRange = selection.getRangeAt(0).cloneRange();
      selectedText.value = text;

      const rect = selectedRange.getBoundingClientRect();
      popupX.value = rect.left + window.scrollX;
      popupY.value = rect.top + window.scrollY - 40; // hiển thị phía trên
      showActions.value = true;
    } else {
      showActions.value = false;
    }
  }

  function updateHTML() {
    htmlSubject.value[state.tabActive].subject = content.value?.innerHTML;
  }

  function highlightSelection() {
    if (!selectedRange) return;

    const span = document.createElement('span');
    span.style.backgroundColor = 'yellow';
    span.textContent = selectedRange.toString();

    selectedRange.deleteContents();
    selectedRange.insertNode(span);

    updateHTML();

    showActions.value = false;
  }

  function startNote() {
    showNotePopup.value = true;
    showActions.value = false;
  }

  function saveNote() {
    const id = 'note-' + nanoid();
    const selected = selectedRange.toString();
    const span = document.createElement('span');
    span.textContent = selected;
    span.style.textDecoration = 'underline';
    span.style.fontWeight = '600';
    span.style.color = '#DD1804';
    span.setAttribute('data-note-id', id);
    span.setAttribute('id', id);

    selectedRange.deleteContents();
    selectedRange.insertNode(span);

    const savedNotes = JSON.parse(localStorage.getItem('notes') || '[]');
    savedNotes.push({ id, text: selected, note: noteText.value });
    localStorage.setItem('notes', JSON.stringify(savedNotes));
    notes.value = savedNotes;

    noteText.value = '';
    selectedText.value = '';
    showNotePopup.value = false;

    updateHTML();
  }

  function cancelNote() {
    noteText.value = '';
    selectedText.value = '';
    showNotePopup.value = false;
  }

  function deleteNote(id: string) {
    const el = document.getElementById(id);
    if (el && el.textContent) {
      const parent = el.parentNode;
      const textNode = document.createTextNode(el.textContent);
      parent && parent.replaceChild(textNode, el);
    }

    // Xoá khỏi localStorage
    const updatedNotes = notes.value.filter((n) => n.id !== id);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
    notes.value = updatedNotes;

    updateHTML();
  }

  onMounted(() => {
    content.value?.addEventListener('mouseup', handleMouseUp);
  });

  onBeforeUnmount(() => {
    content.value?.removeEventListener('mouseup', handleMouseUp);
  });
</script>
