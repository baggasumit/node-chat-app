const expect = require('expect');

const { isRealString } = require('./validation');

describe('isRealString', () => {
  it('should reject non-string values', () => {
    const str = 32;
    const isReal = isRealString(str);

    expect(isReal).toBe(false);
  });
  it('should reject string with only spaces', () => {
    const str = '    ';
    const isReal = isRealString(str);

    expect(isReal).toBe(false);
  });
  it('should allow string with non-space chars', () => {
    const str = ' as dfd ';
    const isReal = isRealString(str);

    expect(isReal).toBe(true);
  });
});
