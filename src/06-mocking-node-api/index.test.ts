import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const timeout = 1000;
    const spyTimeout = jest.spyOn(global, 'setTimeout');
    const callback = jest.fn();

    doStuffByTimeout(callback, timeout);
    expect(spyTimeout).toHaveBeenCalledWith(callback, timeout);
  });

  test('should call callback only after timeout', () => {
    const timeout = 1000;
    const callback = jest.fn();

    doStuffByTimeout(callback, timeout);
    expect(callback).not.toHaveBeenCalled();

    jest.runOnlyPendingTimers();
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const timeout = 1000;
    const spyInterval = jest.spyOn(global, 'setInterval');
    const callback = jest.fn();

    doStuffByInterval(callback, timeout);
    expect(spyInterval).toHaveBeenCalledWith(callback, timeout);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const timeout = 1000;
    const times = 42;
    const callback = jest.fn();

    doStuffByInterval(callback, timeout);
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(times * timeout);
    expect(callback).toHaveBeenCalledTimes(times);
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    const destination = 'path/to/destination';
    const spyJoin = jest.spyOn(path, 'join');

    await readFileAsynchronously(destination);
    expect(spyJoin).toHaveBeenCalledWith(__dirname, destination);
  });

  test('should return null if file does not exist', async () => {
    const destination = 'path/to/destination';
    const spyExists = jest.spyOn(fs, 'existsSync');

    spyExists.mockReturnValue(false);
    expect(await readFileAsynchronously(destination)).toBeNull();
  });

  test('should return file content if file exists', async () => {
    const destination = 'path/to/destination';
    const fileContent = 'file content';
    const spyExists = jest.spyOn(fs, 'existsSync');
    const spyReadFile = jest.spyOn(fsPromises, 'readFile');

    spyExists.mockReturnValue(true);
    spyReadFile.mockResolvedValue(fileContent);

    expect(await readFileAsynchronously(destination)).toEqual(fileContent);
  });
});
