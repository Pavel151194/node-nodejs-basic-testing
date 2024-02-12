import { getBankAccount, InsufficientFundsError, TransferFailedError, SynchronizationFailedError } from '.';

describe('BankAccount', () => {
  const balance1 = 100;
  const balance2 = 200;
  const account1 = getBankAccount(balance1);
  const account2 = getBankAccount(balance2);

  test('should create account with initial balance', () => {
    expect(account1.getBalance()).toBe(balance1);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    expect(() => account1.withdraw(balance1 + 1)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    const error = new InsufficientFundsError(balance1);
    expect(() => account1.transfer(balance1 + 1, account2)).toThrow(error.message);
  });

  test('should throw error when transferring to the same account', () => {
    expect(() => account1.transfer(balance1, account1)).toThrow(TransferFailedError);
  });

  test('should deposit money', () => {
    const depositValue = 10;
    const balanceBoforeDeposit = account1.getBalance();
    expect(account1.deposit(depositValue).getBalance()).toBe(balanceBoforeDeposit + depositValue);
  });

  test('should withdraw money', () => {
    const withdrawValue = 20;
    const balanceBoforewithdraw = account1.getBalance();
    expect(account1.withdraw(withdrawValue).getBalance()).toBe(balanceBoforewithdraw - withdrawValue);
  });

  test('should transfer money', () => {
    const transferValue = 30;
    const balanceBoforeTransfer1 = account1.getBalance();
    const balanceBoforeTransfer2 = account2.getBalance();
    account1.transfer(transferValue, account2);
    expect(account1.getBalance()).toBe(balanceBoforeTransfer1 - transferValue);
    expect(account2.getBalance()).toBe(balanceBoforeTransfer2 + transferValue);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    jest.spyOn(account1, 'fetchBalance').mockResolvedValue(balance1);
    expect(await account1.fetchBalance()).toEqual(expect.any(Number));
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const balance = 40;
    jest.spyOn(account1, 'fetchBalance').mockResolvedValue(balance);
    await account1.synchronizeBalance();
    expect(account1.getBalance()).toBe(balance);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    jest.spyOn(account1, 'fetchBalance').mockResolvedValue(null);
    await expect(account1.synchronizeBalance()).rejects.toThrow(SynchronizationFailedError);
  });
});
