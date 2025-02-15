import { classListApi } from '@/api/class/class';
import { FormProps, FormSchema, BasicColumn } from '@/components/Table';
import { useI18n } from '@/hooks/web/useI18n';

const { t } = useI18n();

export function getClassColumns(): BasicColumn[] {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      fixed: 'left',
    },
    {
      title: t('table.className'),
      dataIndex: 'title',
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
      title: t('table.status'),
      dataIndex: 'status',
    },
    {
      title: t('table.hour'),
      dataIndex: 'hour',
    },
    {
      title: t('table.openingDay'),
      sorter: true,
      dataIndex: 'start_date',
    },
    {
      title: t('table.endDay'),
      sorter: true,
      dataIndex: 'end_date',
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
    },
    {
      title: 'Reading',
      dataIndex: 'reading',
    },
    {
      title: 'Listening',
      dataIndex: 'listening',
    },
    {
      title: 'Speaking',
      dataIndex: 'speaking',
    },
    {
      title: 'Writing',
      dataIndex: 'writing',
    },
    {
      title: 'Total',
      dataIndex: 'total',
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
    },
    {
      title: t('table.email'),
      dataIndex: 'email',
      align: 'left',
    },
    {
      title: t('table.birthday'),
      dataIndex: 'date_of_birth',
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
    {
      title: t('table.status'),
      dataIndex: 'status',
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
      title: t('table.examTable.name'),
      dataIndex: 'exam_title',
    },
    {
      title: t('table.examTable.type'),
      dataIndex: 'skill',
    },
    {
      title: t('table.examTable.student'),
      dataIndex: 'student_name',
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
      title: t('table.examTable.createdAt'),
      dataIndex: 'created_at',
    },
    {
      title: t('table.examTable.deadline'),
      dataIndex: 'deadline',
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
      title: t('table.assignmentTable.examTitle'),
      dataIndex: 'exam_title',
    },
    {
      title: t('table.assignmentTable.teacher'),
      dataIndex: 'teacher',
    },
    {
      title: t('table.assignmentTable.deadline'),
      dataIndex: 'deadline',
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
    labelWidth: 100,
    schemas: [
      {
        field: 'class_name',
        component: 'Input',
        label: t('form.newClassForm.name'),
        colProps: {
          xl: 12,
          xxl: 12,
        },
      },
      {
        field: 'teacher',
        label: t('form.newClassForm.teacher'),
        component: 'Input',
        colProps: {
          xl: 12,
          xxl: 12,
        },
      },
      {
        field: 'start_date',
        label: t('form.newClassForm.openingDay'),
        component: 'DatePicker',
        colProps: {
          xl: 12,
          xxl: 12,
        },
      },
      {
        field: 'end_date',
        label: t('form.newClassForm.endDay'),
        component: 'DatePicker',
        colProps: {
          xl: 12,
          xxl: 12,
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
          onChange: (e, v) => {
            console.log('ApiSelect====>:', e, v);
          },
          // atfer request callback
          onOptionsChange: (options) => {
            console.log('get options', options.length, options);
          },
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
          xxl: 4,
        },
      },
      {
        field: 'phone',
        label: t('form.exerciseSearch.phone'),
        component: 'Input',
        colProps: {
          xl: 6,
          xxl: 4,
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
              value: 'done',
            },
            {
              label: t('form.exam.incomplete'),
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
        label: t('form.exam.createdAt'),
        component: 'DatePicker',
        colProps: {
          xl: 6,
          xxl: 4,
        },
      },
      {
        field: 'deadline',
        label: t('form.exam.deadline'),
        component: 'DatePicker',
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
        field: 'exam_title',
        label: t('table.assignmentTable.examTitle'),
        component: 'Input',
        colProps: {
          xl: 6,
          xxl: 4,
        },
      },
      {
        field: 'deadline',
        label: t('table.assignmentTable.deadline'),
        component: 'DatePicker',
        colProps: {
          xl: 6,
          xxl: 4,
        },
      },
    ],
  };
}
