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
        title: 'Budget Cooking', recipe_ids: [1,2]
      },
      {
        id: 2,
        title: 'Vegetarian Recipes', recipe_ids: [3]
      },
      {
        id: 3,
        title: 'Paleo', recipe_ids: [4,5,6]
      }
    ];

    var recipes = [
      { id: 1, title: "Fast eating?", category_id: 1 },
      { id: 2, title: "Meat on a budget", category_id: 1 },
      { id: 3, title: "veggies and tofu.", category_id: 2 },
      { id: 4, title: "no more dairy", category_id: 3 },
      { id: 5, title: "chicken broth is the new milk.", category_id: 3 },
      { id: 6, title: "yummers in my caveman tummers", category_id: 3 }
    ];

    server = new Pretender(function() {
      this.get('/api/categories', function(request) {
        return [200, {"Content-Type": "application/json"}, JSON.stringify({categories: categories, recipes: recipes})];
      });

      this.get('/api/categories/:id', function(request) {
        var category = categories.find(function(category) {
          if (category.id === parseInt(request.params.id, 10)) {
            return category;
          }
        });

        return [200, {"Content-Type": "application/json"}, JSON.stringify({category: category, recipes: recipes})];
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

test('Should list all categories and number of recipes', function(assert) {
  visit('/categories').then(function() {
    assert.equal(find('a:contains("Budget Cooking (2)")').length, 1);
    assert.equal(find('a:contains("Vegetarian Recipes (1)")').length, 1);
    assert.equal(find('a:contains("Paleo (3)")').length, 1);
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
