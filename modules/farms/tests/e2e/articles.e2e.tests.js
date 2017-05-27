'use strict';

describe('Farms E2E Tests:', function () {
  describe('Test farms page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3000/farms');
      expect(element.all(by.repeater('farm in farms')).count()).toEqual(0);
    });
  });
});
