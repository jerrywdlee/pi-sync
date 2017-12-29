'use strict';

const assert = require('assert');
const delay = require('../bin/lib/delay');

describe('delay', () => {
  it('delay for 500ms', async () => {
    const timeStart = Date.now();
    await delay(500);
    const delayTime = Date.now() - timeStart;
    assert(delayTime <= 520 && delayTime >= 480);
  });
});
