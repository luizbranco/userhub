// Generated by CoffeeScript 1.3.3
(function() {

  _.templateSettings = {
    interpolate: /\{\{(.+?)\}\}/g
  };

  window.User = Backbone.Model.extend({});

  window.Users = Backbone.Collection.extend({
    model: User,
    url: '/users.json'
  });

  window.list = new Users();

  window.UserView = Backbone.View.extend({
    tagName: 'li',
    className: 'user',
    initialize: function() {
      _.bindAll(this, 'render');
      this.model.bind('change', this.render);
      return this.template = _.template(($('#user-template')).html());
    },
    render: function() {
      var rendered;
      rendered = this.template(this.model.toJSON());
      ($(this.el)).html(rendered);
      return this;
    }
  });

  window.ListUserView = UserView.extend({});

  window.ListView = Backbone.View.extend({
    tagName: 'section',
    className: 'list',
    initialize: function() {
      _.bindAll(this, 'render');
      this.template = _.template(($('#list-template')).html());
      this.collection.bind('reset', this.render);
      return this.collection.bind('add', this.render);
    },
    render: function() {
      var $users;
      $(this.el).html(this.template({}));
      $users = this.$('.users');
      this.collection.each(function(user) {
        var view;
        view = new ListUserView({
          model: user,
          collection: this.collection
        });
        return $users.append(view.render().el);
      });
      return this;
    }
  });

  window.UserRouter = Backbone.Router.extend({
    routes: {
      '': 'home'
    },
    initialize: function() {
      return this.listView = new ListView({
        collection: window.list
      });
    },
    home: function() {
      var $container;
      $container = $('#container');
      $container.empty();
      return $container.append(this.listView.render().el);
    }
  });

  window.createUser = function(username) {
    return $.get("https://api.github.com/users/" + username, function(data) {
      var json;
      json = JSON.parse(data);
      return list.add(new User(json));
    });
  };

  $(function() {
    window.App = new UserRouter();
    return Backbone.history.start({
      pushState: true
    });
  });

}).call(this);
