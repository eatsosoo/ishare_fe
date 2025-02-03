import { classListApi } from '@/api/demo/table';
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
      dataIndex: 'className',
    },
    {
      title: t('table.classCode'),
      dataIndex: 'classCode',
    },
    {
      title: t('table.teacher'),
      dataIndex: 'teacher',
    },
    {
      title: t('table.numberStudent'),
      dataIndex: 'studentNum',
    },
    {
      title: t('table.status'),
      dataIndex: 'status',
    },
    {
      title: t('table.openingDay'),
      sorter: true,
      dataIndex: 'openingDay',
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
    },
    {
      title: t('table.phone'),
      dataIndex: 'phone',
    },
    {
      title: t('table.email'),
      dataIndex: 'email',
    },
    {
      title: t('table.birthday'),
      dataIndex: 'birthday',
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
      dataIndex: 'name',
    },
    {
      title: t('table.exerciseTable.skill'),
      dataIndex: 'type',
    },
    {
      title: t('table.exerciseTable.student'),
      dataIndex: 'student',
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
