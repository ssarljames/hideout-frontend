import { Outbox } from './outbox';

describe('Outbox', () => {
  it('should create an instance', () => {
    expect(new Outbox()).toBeTruthy();
  });
});
