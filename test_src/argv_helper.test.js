'use strict';

const assert = require('assert');
const _argv = process.argv;

describe('argv_helper', () => {
  beforeEach(() => {
    process.argv = _argv;
  })

  it('-H myPi2@192.168.1.3:1122', () => {
    const argv = '-H myPi2@192.168.1.3:1122 -P myPass'.split(' ');
    process.argv.push(...argv);
    const { connect_opt } = require('../bin/lib/argv_helper');
    assert(connect_opt.host === '192.168.1.3');
    assert(connect_opt.port === 1122);
    assert(connect_opt.username === 'myPi2');
    assert(connect_opt.password === 'myPass');
  });
});

