import { generateLinkedList } from './index';

describe('generateLinkedList', () => {
  const elements = ['element1', 'element2', 'element3'];
  const result = {
    value: 'element1',
    next: {
      value: 'element2',
      next: {
        value: 'element3',
        next: { value: null, next: null },
      },
    },
  };

  // Check match by expect(...).toStrictEqual(...)
  test('should generate linked list from values 1', () => {
    expect(generateLinkedList(elements)).toStrictEqual(result);
  });

  // Check match by comparison with snapshot
  test('should generate linked list from values 2', () => {
    expect(generateLinkedList(elements)).toMatchSnapshot();
  });
});
