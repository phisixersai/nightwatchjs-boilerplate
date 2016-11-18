const HtmlReporter = require('nightwatch-html-reporter');

var waitForConditionTimeout = 10000;

var reporter = new HtmlReporter({
    openBrowser: false,
    reportsDirectory: __dirname + '/reports',
    themeName: 'default',
    hideSuccess: false,
    uniqueFilename: false,
    relativeScreenshots: false
});

module.exports = {
    waitForConditionTimeout: waitForConditionTimeout,
    reporter: reporter.fn,

    before: function(done) {
    },
    after: function(done) {
    }
};
