const expect = require('expect');

const { generateMessage } = require('./message');

describe('generateMessage', () => {
  it('should generate the correct message object', () => {
    const from = 'Admin';
    const text = 'This is your admin';
    const msg = generateMessage(from, text);

    expect(typeof msg.createdAt).toBe('number');
    expect(msg).toMatchObject({
      from,
      text,
    });
  });
});
