import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import Pretender from 'pretender';

var App, server;

module('Integration - Category Page', {
  beforeEach: function() {
    App = startApp();
    var categories = [
      {
        id: 1,
        title: 'Budget Cooking'
      },
      {
        id: 2,
        title: 'Vegetarian Recipes'
      },
      {
        id: 3,
        title: 'Paleo'
      }
    ];

    server = new Pretender(function() {
      this.get('/api/categories', function(request) {
        return [200, {"Content-Type": "application/json"}, JSON.stringify({categories: categories})];
      });

      this.get('/api/categories/:id', function(request) {
        var category = categories.find(function(category) {
          if (category.id === parseInt(request.params.id, 10)) {
            return category;
          }
        });

        return [200, {"Content-Type": "application/json"}, JSON.stringify({category: category})];
      });
    });

  },
  afterEach: function() {
    Ember.run(App, 'destroy');
    server.shutdown();
  }
});

test('Should allow navigation to the categories page from the landing page', function(assert) {
  visit('/').then(function() {
    click('a:contains("Categories")').then(function() {
      assert.equal(find('h3').text(), 'Categories');
    });
  });
});

test('Should list all categories', function(assert) {
  visit('/categories').then(function() {
    assert.equal(find('a:contains("Budget Cooking")').length, 1);
    assert.equal(find('a:contains("Vegetarian Recipes")').length, 1);
    assert.equal(find('a:contains("Paleo")').length, 1);
  });
});

test('Should be able to navigate to a category page', function(assert) {
  visit('/categories').then(function() {
    click('a:contains("Budget Cooking")').then(function() {
      assert.equal(find('h4').text(), 'Budget Cooking');
    });
  });
});

test('Should be able visit a category page', function(assert) {
  visit('/categories/1').then(function() {
    assert.equal(find('h4').text(), 'Budget Cooking');
  });
});
