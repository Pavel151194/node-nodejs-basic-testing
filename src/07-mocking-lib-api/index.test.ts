import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');

describe('throttledGetDataFromApi', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  const baseURL = 'https://jsonplaceholder.typicode.com';
  const data = { data: 'any data' };
  const relativePath = 'relative/path';

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    mockedAxios.create.mockImplementation(() => mockedAxios);
    mockedAxios.get.mockImplementation(() => Promise.resolve(data));
    jest.runOnlyPendingTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should create instance with provided base url', async () => {
    await throttledGetDataFromApi(relativePath);
    expect(mockedAxios.create).toHaveBeenCalledWith({ baseURL });
  });

  test('should perform request to correct provided url', async () => {
    await throttledGetDataFromApi(relativePath);
    expect(mockedAxios.get).toHaveBeenCalledWith(relativePath);
  });

  test('should return response data', async () => {
    expect(await throttledGetDataFromApi(relativePath)).toBe(data.data);
  });
});
