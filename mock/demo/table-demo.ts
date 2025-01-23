import { MockMethod } from 'vite-plugin-mock';
import { Random } from 'mockjs';
import { resultPageSuccess } from '../_util';

function getRandomPics(count = 10): string[] {
  const arr: string[] = [];
  for (let i = 0; i < count; i++) {
    arr.push(Random.image('800x600', Random.color(), Random.color(), Random.title()));
  }
  return arr;
}

const vietnameseCities = [
  'Hà Nội',
  'Hồ Chí Minh',
  'Đà Nẵng',
  'Hải Phòng',
  'Cần Thơ',
  'Nha Trang',
  'Huế',
  'Vũng Tàu',
  'Biên Hòa',
  'Buôn Ma Thuột',
];

function getRandomVietnameseCity(): string {
  return vietnameseCities[Math.floor(Math.random() * vietnameseCities.length)];
}

const demoList = (() => {
  const result: any[] = [];
  for (let index = 0; index < 200; index++) {
    result.push({
      id: `${index}`,
      beginTime: '@datetime',
      endTime: '@datetime',
      address: getRandomVietnameseCity(),
      name: '@name()',
      name1: '@name()',
      name2: '@name()',
      name3: '@name()',
      name4: '@name()',
      name5: '@name()',
      name6: '@name()',
      name7: '@name()',
      name8: '@name()',
      radio1: `Option ${index + 1}`,
      radio2: `Option ${index + 1}`,
      radio3: `Option ${index + 1}`,
      avatar: Random.image('400x400', Random.color(), Random.color(), Random.first()),
      imgArr: getRandomPics(Math.ceil(Math.random() * 3) + 1),
      imgs: getRandomPics(Math.ceil(Math.random() * 3) + 1),
      date: `@date('yyyy-MM-dd')`,
      time: `@time('HH:mm')`,
      'no|100000-10000000': 100000,
      'status|1': ['normal', 'enable', 'disable'],
    });
  }
  return result;
})();

const classList = (() => {
  const result: any[] = [];
  for (let index = 0; index < 200; index++) {
    result.push({
      id: `${index}`,
      created: '@datetime',
      updated: '@datetime',
      className: '@name()',
      classCode: '@guid()',
      teacher: '@name()',
      studentNum: '@integer(30, 100)',
      openingDay: `@date('yyyy-MM-dd')`,
      'status|1': ['pending', 'enable', 'finished'],
    });
  }
  return result;
})();

const studentList = (() => {
  const result: any[] = [];
  for (let index = 0; index < 40; index++) {
    result.push({
      id: `${index}`,
      name: '@name',
      reading: '@integer(0, 9)',
      listening: '@integer(0, 9)',
      speaking: '@integer(0, 9)',
      writing: '@integer(0, 9)',
      total: '@integer(0, 9)',
    });
  }
  return result;
})();

export default [
  {
    url: '/basic-api/table/getDemoList',
    timeout: 100,
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 20 } = query;
      return resultPageSuccess(page, pageSize, demoList);
    },
  },
  {
    url: '/basic-api/table/getClassList',
    timeout: 100,
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 20 } = query;
      return resultPageSuccess(page, pageSize, classList);
    },
  },
  {
    url: '/basic-api/table/getStudentList',
    timeout: 100,
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 20 } = query;
      return resultPageSuccess(page, pageSize, studentList);
    },
  },
] as MockMethod[];
