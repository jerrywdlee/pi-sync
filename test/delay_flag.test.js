'use strict';

const assert = require('assert');
const delay = require('../bin/lib/delay');
const DelayFlag = require('../bin/lib/delay_flag');

const delayTime = 500;
describe('delay_flag', () => {
  let df = null;
  before(() => {
    df = new DelayFlag(delayTime);
  });
  it('Delay flag should be false for init', async () => {
    assert(df.flag === false);
  });
  it('Delay flag should be true after trigger', async () => {
    df.trigger();
    assert(df.flag === true);
  });
  it('Delay flag should be false after delay time', async () => {
    await delay(delayTime + 10);
    assert(df.flag === false);
  });
  it('Delay flag should be true after triggered multi', async () => {
    df.trigger();
    assert(df.flag === true);
    await delay(delayTime - 100);
    assert(df.flag === true);
    df.trigger();
    await delay(delayTime - 100);
    assert(df.flag === true);
    await delay(100);
    assert(df.flag === false);
  });
});