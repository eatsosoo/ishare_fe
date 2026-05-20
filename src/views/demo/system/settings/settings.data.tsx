import { BasicColumn, FormProps } from '@/components/Table';
import { FormSchema } from '@/components/Form';

export function getSystemSettingColumns(): BasicColumn[] {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      fixed: 'left',
    },
    {
      title: 'Key',
      dataIndex: 'key',
      width: 180,
    },
    {
      title: 'Value',
      dataIndex: 'value',
      width: 220,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      width: 120,
    },
    {
      title: 'Group',
      dataIndex: 'group',
      width: 140,
    },
    {
      title: 'Description',
      dataIndex: 'description',
    },
    {
      title: 'Public',
      dataIndex: 'is_public',
      width: 100,
      customRender: ({ text }) => (text ? 'Yes' : 'No'),
    },
  ];
}

export function getSystemSettingSearchConfig(): Partial<FormProps> {
  return {
    labelWidth: 100,
    schemas: [
      {
        field: 'keyword',
        label: 'Tu khoa',
        component: 'Input',
        colProps: {
          xl: 6,
          xxl: 4,
        },
      },
      {
        field: 'group',
        label: 'Group',
        component: 'Input',
        colProps: {
          xl: 6,
          xxl: 4,
        },
      },
      {
        field: 'is_public',
        label: 'Public',
        component: 'Select',
        componentProps: {
          options: [
            { label: 'Co', value: 'true' },
            { label: 'Khong', value: 'false' },
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

export const systemSettingFormSchema: FormSchema[] = [
  {
    field: 'key',
    component: 'Input',
    label: 'Key',
    rules: [{ required: true }],
    colProps: {
      span: 20,
    },
  },
  {
    field: 'value',
    component: 'InputTextArea',
    label: 'Value',
    rules: [{ required: true }],
    componentProps: {
      rows: 3,
    },
    colProps: {
      span: 20,
    },
  },
  {
    field: 'type',
    component: 'Input',
    label: 'Type',
    rules: [{ required: true }],
    colProps: {
      span: 20,
    },
  },
  {
    field: 'group',
    component: 'Input',
    label: 'Group',
    rules: [{ required: true }],
    colProps: {
      span: 20,
    },
  },
  {
    field: 'description',
    component: 'InputTextArea',
    label: 'Mo ta',
    componentProps: {
      rows: 3,
    },
    colProps: {
      span: 20,
    },
  },
  {
    field: 'is_public',
    component: 'Switch',
    label: 'Public',
    defaultValue: true,
    colProps: {
      span: 20,
    },
  },
];
