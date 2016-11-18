var util = require('util');
var events = require('events');

function WaitForCount() {
    events.EventEmitter.call(this);
    this.startTimeInMilliseconds = null;
    this.selector = null;
    this.locateStrategy = this.client.locateStrategy || 'css selector';
    this.rescheduleInterval = this.client.api.globals.waitForConditionPollInterval || this.client.options.waitForConditionPollInterval || 500; //ms
    this.protocol = require('nightwatch/lib/api/protocol.js')(this.client);
}

util.inherits(WaitForCount, events.EventEmitter);

WaitForCount.prototype.command = function (selector, size, timeoutInMilliseconds) {
    this.startTimeInMilliseconds = new Date().getTime();
    this.selector = selector;
    var self = this;
    var message;

    if (typeof timeoutInMilliseconds !== 'number') {
        timeoutInMilliseconds = this.api.globals.waitForConditionTimeout;
    }

    this.check(selector, size, function (result, loadedTimeInMilliseconds) {
        if (result) {
            message = 'WaitForCount: ' + selector + ' size = ' + size + '. Expression was true after ' + (loadedTimeInMilliseconds - self.startTimeInMilliseconds) + ' ms.';
        } else {
            message = 'WaitForCount: ' + selector + ' size = ' + size + '. Expression wasn\'t true in ' + timeoutInMilliseconds + ' ms.';
        }
        self.client.assertion(result, 'expression false', 'expression true', message, true);
        self.emit('complete');
    }, timeoutInMilliseconds);

    return this;
};

WaitForCount.prototype.check = function (selector, size, callback, maxTimeInMilliseconds) {
    var self = this;
    this.getProtocolCommand(function(result) {
        var now = new Date().getTime();
        if (result.value && result.value.length === size) {
            callback(true, now);
        } else if (now - self.startTimeInMilliseconds < maxTimeInMilliseconds) {
            setTimeout(function () {
                self.check(selector, size, callback, maxTimeInMilliseconds);
            }, this.rescheduleInterval);
        } else {
            callback(false);
        }
    });
};

WaitForCount.prototype.getProtocolCommand = function(callback) {
    return this.protocol.elements(this.locateStrategy, this.selector, callback);
};

module.exports = WaitForCount;
