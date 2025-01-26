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
