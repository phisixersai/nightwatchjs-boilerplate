'use strict';

module.exports = {
    '@tags': [],
    before : function(browser) {
        pages.page1 = browser.page.folder1.page_a();
        pages.page2 = browser.page.folder2.page_b();
    },

    beforeEach : function(browser) {
        browser.resetBrowser();
    },

    "test case 1" : function (browser) {
        pages.page1.navigate(pages.page1.url());
    },
    "test case 2" : function (browser) {
        // Test contents
        browser.end();
    },
};
