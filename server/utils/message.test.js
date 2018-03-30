const expect = require('expect');

const { generateMessage, generateLocationMessage } = require('./message');

describe('generateMessage', () => {
  it('should generate the correct message object', () => {
    const from = 'Admin';
    const text = 'This is your admin';
    const msg = generateMessage(from, text);

    expect(typeof msg.createdAt).toBe('object');
    expect(msg).toMatchObject({
      from,
      text,
    });
  });
});

describe('generateLocationMessage', () => {
  it('should generate the correct location message object', () => {
    const from = 'Admin';
    const latitude = '-21.455';
    const longitude = '-54.123';
    const msg = generateLocationMessage(from, latitude, longitude);

    const url = `https://www.google.com/maps/?q=-21.455,-54.123`;
    expect(typeof msg.createdAt).toBe('object');
    expect(msg).toMatchObject({
      from,
      url,
    });
  });
});
