'use strict';

class DelayFlag {
  constructor(delayTime) {
    this.delayTime = delayTime;
    this.flag = false;
    this.timer = null;
  }

  trigger() {
    this.flag = true;
    if(this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      this.flag = false;
    }, this.delayTime);
  }
}

module.exports = DelayFlag;