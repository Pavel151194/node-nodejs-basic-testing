import { mockOne, mockTwo, mockThree, unmockedFunction } from './index';

jest.mock('./index', () => {
  const originalModule = jest.requireActual<typeof import('./index')>('./index');

  return { ...originalModule, mockOne: jest.fn(), mockTwo: jest.fn(), mockThree: jest.fn() };
});

describe('partial mocking', () => {
  afterAll(() => {
    jest.unmock('./index');
  });

  test('mockOne, mockTwo, mockThree should not log into console', () => {
    const spyLog = jest.spyOn(console, 'log');

    mockOne();
    expect(spyLog).not.toHaveBeenCalled();

    mockTwo();
    expect(spyLog).not.toHaveBeenCalled();

    mockThree();
    expect(spyLog).not.toHaveBeenCalled();
  });

  test('unmockedFunction should log into console', () => {
    const spyLog = jest.spyOn(console, 'log');

    unmockedFunction();
    expect(spyLog).toBeCalled();
  });
});
