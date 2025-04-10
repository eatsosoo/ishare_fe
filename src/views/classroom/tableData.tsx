import { classListApi } from '@/api/class/class';
import { FormProps, FormSchema, BasicColumn } from '@/components/Table';
import { useI18n } from '@/hooks/web/useI18n';
import { getLeftValue } from '@/utils/stringUtils';

const { t } = useI18n();

export function getClassColumns(): BasicColumn[] {
  return [
    // {
    //   title: 'ID',
    //   dataIndex: 'id',
    //   fixed: 'left',
    // },
    {
      title: t('table.className'),
      dataIndex: 'title',
    },
    {
      title: t('table.key'),
      dataIndex: 'key',
    },
    {
      title: t('table.level'),
      dataIndex: 'level',
    },
    {
      title: t('table.teacher'),
      dataIndex: 'teacher',
    },
    {
      title: t('table.numberStudent'),
      dataIndex: 'students_count',
    },
    {
      title: t('table.openingDay'),
      sorter: true,
      dataIndex: 'start_date',
    },
  ];
}

export function getStudentColumns(): BasicColumn[] {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      fixed: 'left',
      width: 80,
    },
    {
      title: t('table.studentName'),
      dataIndex: 'name',
      align: 'left',
    },
    {
      title: t('table.phone'),
      dataIndex: 'phone_number',
      align: 'left',
    },
    {
      title: t('table.email'),
      dataIndex: 'email',
      align: 'left',
    },
    {
      title: t('table.birthday'),
      dataIndex: 'date_of_birth',
      align: 'left',
    },
  ];
}

export function getStudentOfClassColumns(): BasicColumn[] {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      fixed: 'left',
      width: 80,
    },
    {
      title: t('table.studentName'),
      dataIndex: 'name',
      align: 'left',
    },
    {
      title: t('table.phone'),
      dataIndex: 'phone_number',
      align: 'left',
    },
    {
      title: t('table.email'),
      dataIndex: 'email',
      align: 'left',
    },
    {
      title: t('table.birthday'),
      dataIndex: 'dob',
      align: 'left',
    },
    {
      title: t('table.parentName'),
      dataIndex: 'parent_name',
      align: 'left',
    },
    {
      title: t('table.parentTel'),
      dataIndex: 'parent_tel',
      align: 'left',
    },
    {
      title: t('table.target'),
      dataIndex: 'target',
      align: 'left',
    },
    {
      title: t('table.plan'),
      dataIndex: 'plan',
      align: 'left',
    },
  ];
}

export function getAccountColumns(): BasicColumn[] {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      fixed: 'left',
      width: 80,
    },
    {
      title: t('table.name'),
      dataIndex: 'name',
      align: 'left',
    },
    {
      title: t('table.phone'),
      dataIndex: 'phone_number',
      align: 'left',
    },
    {
      title: t('table.email'),
      dataIndex: 'email',
      align: 'left',
    },
    {
      title: t('table.birthday'),
      dataIndex: 'date_of_birth',
      align: 'left',
    },
    // {
    //   title: t('table.status'),
    //   dataIndex: 'status',
    //   align: 'left',
    // },
    {
      title: t('table.roleName'),
      dataIndex: 'role_name',
      align: 'left',
    },
    {
      title: t('table.action'),
      dataIndex: 'action',
    },
  ];
}

export function getExerciseColumns(): BasicColumn[] {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      fixed: 'left',
      width: 80,
    },
    {
      title: t('table.exerciseTable.name'),
      dataIndex: 'exam_title',
    },
    {
      title: t('table.exerciseTable.skill'),
      dataIndex: 'skill',
    },
    {
      title: t('table.exerciseTable.student'),
      dataIndex: 'student_name',
    },
    {
      title: t('table.exerciseTable.status'),
      dataIndex: 'status',
    },
    {
      title: t('table.exerciseTable.score'),
      dataIndex: 'score',
    },
    {
      title: t('table.exerciseTable.createdAt'),
      dataIndex: 'created_at',
    },
    {
      title: t('table.exerciseTable.deadline'),
      dataIndex: 'deadline',
    },
  ];
}

export function getExamGradingColumns(): BasicColumn[] {
  return [
    {
      title: t('table.title'),
      dataIndex: 'assignment_title',
    },
    {
      title: t('table.exeName'),
      dataIndex: 'exam_title',
      customRender: ({ record }) => {
        if (record.assign_at === 'exam') {
          return record.exam_title;
        }
        return record.book_name;
      },
    },
    {
      title: t('table.exerciseTable.skill'),
      dataIndex: 'skill',
    },
    {
      title: t('table.exerciseTable.student'),
      dataIndex: 'name',
    },
    {
      title: t('table.exerciseTable.status'),
      dataIndex: 'status',
    },
    {
      title: t('table.exerciseTable.score'),
      dataIndex: 'score',
    },
    {
      title: t('table.exerciseTable.createdAt'),
      dataIndex: 'completed_at',
    },
    {
      title: t('table.exerciseTable.deadline'),
      dataIndex: 'deadline',
    },
  ];
}

export function getExamColumns(): BasicColumn[] {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      fixed: 'left',
      width: 80,
    },
    {
      title: t('table.examTable.name'),
      dataIndex: 'name',
    },
    {
      title: t('table.examTable.type'),
      dataIndex: 'type',
    },
    {
      title: t('table.examTable.student'),
      dataIndex: 'student',
    },
    {
      title: t('table.examTable.status'),
      dataIndex: 'status',
    },
    {
      title: t('table.examTable.score'),
      dataIndex: 'score',
    },
    {
      title: t('table.examTable.createdAt'),
      dataIndex: 'created_at',
    },
  ];
}

export function getExamOfStudentColumns(): BasicColumn[] {
  return [
    {
      title: t('table.examTable.assignmentTitle'),
      dataIndex: 'assignment_title',
    },
    {
      title: t('table.examTable.name'),
      dataIndex: 'exam_title',
    },
    {
      title: t('table.examTable.type'),
      dataIndex: 'skill',
    },
    // {
    //   title: t('table.examTable.student'),
    //   dataIndex: 'student_name',
    // },
    {
      title: t('table.examTable.status'),
      dataIndex: 'status',
    },
    {
      title: t('table.examTable.score'),
      dataIndex: 'score',
    },
    {
      title: t('table.completedAt'),
      dataIndex: 'completed_at',
      customRender: ({ text }) => {
        return text || 'Chưa nộp';
      },
    },
  ];
}

export function getExeOfStudentColumns(): BasicColumn[] {
  return [
    {
      title: t('table.exerciseName'),
      dataIndex: 'homework_name',
    },
    {
      title: t('table.bookName'),
      dataIndex: 'book_name',
    },
    {
      title: t('table.exeType'),
      dataIndex: 'assign_at',
      customRender: ({ text }) => {
        return text === 'home' ? t('common.assignAtHome') : t('common.assignAtClass');
      },
    },
    {
      title: t('table.skill'),
      dataIndex: 'skill',
    },
    {
      title: t('table.examTable.status'),
      dataIndex: 'status',
    },
    {
      title: t('table.examTable.score'),
      dataIndex: 'score',
    },
    {
      title: t('table.deadline'),
      dataIndex: 'deadline',
      customRender: ({ text }) => {
        return getLeftValue(text);
      },
    },
    {
      title: t('table.completedAt'),
      dataIndex: 'completed_at',
      customRender: ({ text }) => {
        return text || 'Chưa nộp';
      },
    },
  ];
}

export function getTestColumns(): BasicColumn[] {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      fixed: 'left',
      width: 80,
    },
    {
      title: t('table.examTable.name'),
      dataIndex: 'title',
    },
    {
      title: t('table.examTable.teacher'),
      dataIndex: 'teacher',
    },
    {
      title: t('table.level'),
      dataIndex: 'level',
    },
    {
      title: t('table.examTable.createdAt'),
      dataIndex: 'created_at',
    },
  ];
}

export function getHomeworkColumns(): BasicColumn[] {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      fixed: 'left',
      width: 80,
    },
    {
      title: t('table.exerciseTable.name'),
      dataIndex: 'title',
    },
    {
      title: t('table.examTable.teacher'),
      dataIndex: 'teacher',
    },
    {
      title: t('table.examTable.createdAt'),
      dataIndex: 'created_at',
    },
    {
      title: t('table.examTable.deadline'),
      dataIndex: 'deadline',
    },
  ];
}

export function getAssignmentColumns(): BasicColumn[] {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      fixed: 'left',
      width: 80,
    },
    {
      title: t('table.assignmentTable.title'),
      dataIndex: 'title',
    },
    {
      title: t('table.assignmentTable.className'),
      dataIndex: 'class_name',
    },
    {
      title: t('table.shift'),
      dataIndex: 'shift_title',
    },
    {
      title: t('table.exeType'),
      dataIndex: 'assign_at',
    },
    {
      title: t('table.assignmentTable.teacher'),
      dataIndex: 'teacher',
    },
    {
      title: t('table.assignmentTable.deadline'),
      dataIndex: 'deadline',
    },
    {
      title: t('table.createdAt'),
      dataIndex: 'created_at',
      customRender: ({ text }) => {
        const dateUTC = new Date(text);
        const localDate = dateUTC.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
        return localDate;
      },
    },
  ];
}

export function getAssignmentExamColumns(): BasicColumn[] {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      fixed: 'left',
      width: 80,
    },
    {
      title: t('table.assignmentTable.title'),
      dataIndex: 'title',
    },
    {
      title: t('table.assignmentTable.examTitle'),
      dataIndex: 'exam_title',
    },
    {
      title: t('table.assignmentTable.className'),
      dataIndex: 'class_name',
    },
    {
      title: t('table.assignmentTable.teacher'),
      dataIndex: 'teacher',
    },
    {
      title: t('table.assignmentTable.deadline'),
      dataIndex: 'deadline',
    },
    {
      title: t('table.createdAt'),
      dataIndex: 'created_at',
      customRender: ({ text }) => {
        const dateUTC = new Date(text);
        const localDate = dateUTC.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
        return localDate;
      },
    },
  ];
}

export const getAdvanceSchema = (itemNumber = 6): FormSchema[] => {
  const arr: FormSchema[] = [];
  for (let index = 0; index < itemNumber; index++) {
    arr.push({
      field: `field${index}`,
      label: `${t('table.field')} ${index}`,
      component: 'Input',
      colProps: {
        xl: 12,
        xxl: 8,
      },
    });
  }
  return arr;
};

export function getFormConfig(): Partial<FormProps> {
  return {
    labelWidth: 100,
    schemas: [
      ...getAdvanceSchema(5),
      {
        field: `field11`,
        label: `VD Slot`,
        slot: 'custom',
        colProps: {
          xl: 12,
          xxl: 8,
        },
      },
    ],
  };
}

export function getFormSearchClassConfig(): Partial<FormProps> {
  return {
    labelWidth: 150,
    schemas: [
      {
        field: 'class_name',
        component: 'Input',
        label: t('form.newClassForm.name'),
        colProps: {
          xl: 5,
          xxl: 5,
        },
      },
      {
        field: 'teacher',
        label: t('form.newClassForm.teacher'),
        component: 'Input',
        colProps: {
          xl: 5,
          xxl: 5,
        },
      },
      {
        field: 'key',
        label: t('form.classType'),
        component: 'Select',
        componentProps: {
          options: [
            {
              label: 'HS',
              value: 'HS',
            },
            {
              label: 'CT',
              value: 'CT',
            },
            {
              label: 'LHP',
              value: 'LHP',
            },
            {
              label: 'TL',
              value: 'TL',
            },
            {
              label: 'JU',
              value: 'JU',
            },
          ],
        },
        colProps: {
          xl: 5,
          xxl: 5,
        },
      },
    ],
  };
}

export function getSearchFormConfig(): Partial<FormProps> {
  return {
    labelWidth: 100,
    schemas: [
      {
        field: 'classId',
        component: 'ApiSelect',
        label: t('form.exerciseSearch.className'),
        componentProps: {
          // more details see /src/components/Form/src/components/ApiSelect.vue
          api: classListApi(),
          params: {
            id: 1,
          },

          resultField: 'items',
          // use name as label
          labelField: 'className',
          // use id as value
          valueField: 'id',
          // not request untill to select
          immediate: true,
        },
      },
      {
        field: 'typeExercise',
        label: t('form.exerciseSearch.typeExercise'),
        component: 'Select',
        componentProps: {
          options: [
            {
              label: 'Reading',
              value: '1',
            },
            {
              label: 'Listening',
              value: '2',
            },
            {
              label: 'Speaking',
              value: '3',
            },
            {
              label: 'Writing',
              value: '4',
            },
          ],
        },
      },
    ],
  };
}

export function getSearchStudentConfig(): Partial<FormProps> {
  return {
    labelWidth: 100,
    schemas: [
      {
        field: 'studentName',
        component: 'Input',
        label: t('form.exerciseSearch.studentName'),
        colProps: {
          xl: 6,
          xxl: 6,
        },
      },
      {
        field: 'phone',
        label: t('form.exerciseSearch.phone'),
        component: 'Input',
        colProps: {
          xl: 6,
          xxl: 6,
        },
      },
    ],
  };
}

export function getSearchUserConfig(): Partial<FormProps> {
  return {
    labelWidth: 100,
    schemas: [
      {
        field: 'name',
        component: 'Input',
        label: t('table.name'),
        colProps: {
          xl: 6,
          xxl: 4,
        },
      },
      {
        field: 'phone',
        label: t('table.phone'),
        component: 'Input',
        colProps: {
          xl: 6,
          xxl: 4,
        },
      },
      {
        field: 'email',
        label: t('table.email'),
        component: 'Input',
        colProps: {
          xl: 6,
          xxl: 4,
        },
      },
    ],
  };
}

export function getSearchExerciseConfig(): Partial<FormProps> {
  return {
    labelWidth: 100,
    schemas: [
      {
        field: 'studentName',
        component: 'Input',
        label: t('form.exerciseSearch.studentName'),
        colProps: {
          xl: 6,
          xxl: 4,
        },
      },
      {
        field: 'status',
        label: t('form.exerciseSearch.completeStatus'),
        component: 'Select',
        componentProps: {
          options: [
            {
              label: t('form.exerciseSearch.done'),
              value: 'done',
            },
            {
              label: t('form.exerciseSearch.incomplete'),
              value: 'incomplete',
            },
          ],
        },
        colProps: {
          xl: 6,
          xxl: 4,
        },
      },
      {
        field: 'type',
        label: t('form.exerciseSearch.typeGrading'),
        component: 'Select',
        componentProps: {
          options: [
            {
              label: 'Bài về nhà',
              value: '1',
            },
            {
              label: 'Bài kiểm tra',
              value: '2',
            },
          ],
        },
        colProps: {
          xl: 6,
          xxl: 4,
        },
      },
      {
        field: 'createdAt',
        label: t('form.exerciseSearch.createdAt'),
        component: 'DatePicker',
        colProps: {
          xl: 6,
          xxl: 4,
        },
      },
    ],
  };
}

export function getSearchExamOfStudentConfig(): Partial<FormProps> {
  return {
    labelWidth: 100,
    schemas: [
      {
        field: 'skill',
        component: 'Select',
        componentProps: {
          options: [
            {
              label: 'Reading',
              value: 'Reading',
            },
            {
              label: 'Listening',
              value: 'Listening',
            },
            {
              label: 'Speaking',
              value: 'Speaking',
            },
            {
              label: 'Writing',
              value: 'Writing',
            },
            {
              label: 'Vocabulary',
              value: 'Vocabulary',
            },
          ],
        },
        label: t('form.exam.skill'),
        colProps: {
          xl: 6,
          xxl: 4,
        },
      },
      {
        field: 'status',
        label: t('form.exam.completeStatus'),
        component: 'Select',
        componentProps: {
          options: [
            {
              label: t('form.exam.done'),
              value: '1',
            },
            {
              label: t('form.exam.incomplete'),
              value: '0',
            },
          ],
        },
        colProps: {
          xl: 6,
          xxl: 4,
        },
      },
    ],
  };
}

export function getSearchExerciseOfStudentConfig(): Partial<FormProps> {
  return {
    labelWidth: 100,
    schemas: [
      {
        field: 'skill',
        component: 'Select',
        componentProps: {
          options: [
            {
              label: 'Reading',
              value: '1',
            },
            {
              label: 'Listening',
              value: '2',
            },
            {
              label: 'Speaking',
              value: '3',
            },
            {
              label: 'Writing',
              value: '4',
            },
          ],
        },
        label: t('form.exerciseOfStudentSearch.skill'),
        colProps: {
          xl: 6,
          xxl: 4,
        },
      },
      {
        field: 'status',
        label: t('form.exerciseOfStudentSearch.completeStatus'),
        component: 'Select',
        componentProps: {
          options: [
            {
              label: t('form.exerciseOfStudentSearch.done'),
              value: 'done',
            },
            {
              label: t('form.exerciseOfStudentSearch.incomplete'),
              value: 'incomplete',
            },
          ],
        },
        colProps: {
          xl: 6,
          xxl: 4,
        },
      },
      {
        field: 'createdAt',
        label: t('form.exerciseOfStudentSearch.createdAt'),
        component: 'DatePicker',
        colProps: {
          xl: 6,
          xxl: 4,
        },
      },
      {
        field: 'deadline',
        label: t('form.exerciseOfStudentSearch.deadline'),
        component: 'DatePicker',
        colProps: {
          xl: 6,
          xxl: 4,
        },
      },
    ],
  };
}

export function getExamListConfig(): Partial<FormProps> {
  return {
    labelWidth: 100,
    schemas: [
      {
        field: 'title',
        label: t('form.exam.name'),
        component: 'Input',
        colProps: {
          xl: 6,
          xxl: 4,
        },
      },
      {
        field: 'level',
        label: t('form.level'),
        component: 'Select',
        componentProps: {
          options: [
            {
              label: '1',
              value: '1',
            },
            {
              label: '2',
              value: '2',
            },
            {
              label: '3',
              value: '3',
            },
          ],
        },
        colProps: {
          xl: 6,
          xxl: 4,
        },
      },
    ],
  };
}

export function getAssignmentListConfig(): Partial<FormProps> {
  return {
    labelWidth: 100,
    schemas: [
      {
        field: 'title',
        label: t('table.assignmentTable.title'),
        component: 'Input',
        colProps: {
          xl: 6,
          xxl: 4,
        },
      },
      {
        field: 'class_name',
        label: t('table.assignmentTable.className'),
        component: 'Input',
        colProps: {
          xl: 6,
          xxl: 4,
        },
      },
      {
        field: 'exe_type',
        label: t('form.exeType'),
        component: 'Select',
        componentProps: {
          options: [
            {
              label: t('common.assignAtClass'),
              value: 'class',
            },
            {
              label: t('common.assignAtHome'),
              value: 'home',
            },
          ],
        },
        colProps: {
          xl: 6,
          xxl: 4,
        },
      },
    ],
  };
}

export function getAssignmentExamListConfig(): Partial<FormProps> {
  return {
    labelWidth: 100,
    schemas: [
      {
        field: 'title',
        label: t('table.assignmentTable.title'),
        component: 'Input',
        colProps: {
          xl: 6,
          xxl: 4,
        },
      },
      {
        field: 'class_name',
        label: t('table.assignmentTable.className'),
        component: 'Input',
        colProps: {
          xl: 6,
          xxl: 4,
        },
      },
    ],
  };
}

export function getSearchAttendanceConfig(): Partial<FormProps> {
  return {
    labelWidth: 100,
    schemas: [
      {
        field: 'classId',
        component: 'ApiSelect',
        label: t('form.exerciseSearch.className'),
        componentProps: {
          // more details see /src/components/Form/src/components/ApiSelect.vue
          api: classListApi(),
          params: {
            id: 1,
          },

          resultField: 'items',
          // use name as label
          labelField: 'className',
          // use id as value
          valueField: 'id',
          // not request untill to select
          immediate: true,
        },
      },
      {
        field: 'date',
        label: t('form.exerciseSearch.createdAt'),
        component: 'DatePicker',
        colProps: {
          xl: 6,
          xxl: 4,
        },
      },
    ],
  };
}

export function getAttendanceColumns(): BasicColumn[] {
  return [
    {
      title: t('table.studentName'),
      dataIndex: 'user_name',
    },
    {
      title: t('table.className'),
      dataIndex: 'class_title',
    },
    {
      title: t('table.studyDate'),
      dataIndex: 'date',
    },
    {
      title: t('table.status'),
      dataIndex: 'status',
      edit: true,
      editComponent: 'Select',
      editComponentProps: {
        options: [
          {
            label: t('common.present'),
            value: 1,
          },
          {
            label: t('common.absent'),
            value: 0,
          },
        ],
      },
    },
    {
      title: t('table.note'),
      dataIndex: 'note',
      edit: true,
      editComponent: 'Input',
    },
  ];
}

export function getBankColumns(): BasicColumn[] {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      fixed: 'left',
      width: 80,
    },
    {
      title: t('table.bookName'),
      dataIndex: 'book_name',
    },
    {
      title: t('table.bankTitle'),
      dataIndex: 'homework_name',
    },
    {
      title: t('form.skill'),
      dataIndex: 'skill',
    },
  ];
}

export function getBankListConfig(): Partial<FormProps> {
  return {
    labelWidth: 100,
    schemas: [
      {
        field: 'homework_name',
        label: t('table.bankTitle'),
        component: 'Input',
        colProps: {
          xl: 6,
          xxl: 4,
        },
      },
      {
        field: 'book_name',
        label: t('table.bookName'),
        component: 'Input',
        colProps: {
          xl: 6,
          xxl: 4,
        },
      },
      {
        field: 'skill',
        label: t('form.skill'),
        component: 'Select',
        componentProps: {
          options: [
            {
              label: 'Reading',
              value: 'Reading',
            },
            {
              label: 'Listening',
              value: 'Listening',
            },
            {
              label: 'Speaking',
              value: 'Speaking',
            },
            {
              label: 'Writing',
              value: 'Writing',
            },
          ],
        },
        colProps: {
          xl: 6,
          xxl: 4,
        },
      },
    ],
  };
}

export function getPracticeGradingColumns(): BasicColumn[] {
  return [
    {
      title: t('table.exeName'),
      dataIndex: 'exam_title',
    },
    {
      title: t('table.exerciseTable.skill'),
      dataIndex: 'skill',
    },
    {
      title: t('table.exerciseTable.student'),
      dataIndex: 'user_name',
    },
    {
      title: t('table.takeTimes'),
      dataIndex: 'times',
    },
    {
      title: t('table.exerciseTable.score'),
      dataIndex: 'score',
      // customRender: ({ text }) => {
      //   if (isString(text)) {
      //     return parseInt(text);
      //   }
      //   return text;
      // },
    },
    {
      title: t('table.exerciseTable.createdAt'),
      dataIndex: 'completed_at',
    },
  ];
}

export function getPracticeDoneColumns(): BasicColumn[] {
  return [
    // {
    //   title: 'ID',
    //   dataIndex: 'id',
    //   fixed: 'left',
    //   width: 80,
    // },
    {
      title: t('table.examTable.name'),
      dataIndex: 'exam_title',
    },
    {
      title: t('table.skill'),
      dataIndex: 'skill',
    },
    {
      title: t('table.score'),
      dataIndex: 'score',
    },
    {
      title: t('table.takeTimes'),
      dataIndex: 'times',
    },
    {
      title: t('table.completedAt'),
      dataIndex: 'completed_at',
    },
  ];
}

export function getPracticeDoneConfig(): Partial<FormProps> {
  return {
    labelWidth: 100,
    schemas: [
      {
        field: 'title',
        label: t('form.exam.name'),
        component: 'Input',
        colProps: {
          xl: 6,
          xxl: 4,
        },
      },
      {
        field: 'skill',
        label: t('form.skill'),
        component: 'Select',
        componentProps: {
          options: [
            {
              label: 'Reading',
              value: 'Reading',
            },
            {
              label: 'Listening',
              value: 'Listening',
            },
            {
              label: 'Speaking',
              value: 'Speaking',
            },
            {
              label: 'Writing',
              value: 'Writing',
            },
          ],
        },
        colProps: {
          xl: 6,
          xxl: 4,
        },
      },
    ],
  };
}

export function getBookColumns(): BasicColumn[] {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      fixed: 'left',
      width: 80,
    },
    {
      title: t('table.bookName'),
      dataIndex: 'title',
      editRow: true,
    },
    {
      title: t('table.bookType'),
      dataIndex: 'type',
      editRow: true,
    },
    {
      title: t('table.bookLevel'),
      dataIndex: 'level',
      editRow: true,
    },
    {
      title: t('table.bookDescription'),
      dataIndex: 'description',
      editRow: true,
      editRule: false,
    },
  ];
}

export function getBookListConfig(): Partial<FormProps> {
  return {
    labelWidth: 100,
    schemas: [
      {
        field: 'title',
        label: t('table.bookName'),
        component: 'Input',
        colProps: {
          xl: 6,
          xxl: 4,
        },
      },
    ],
  };
}
