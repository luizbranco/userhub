// Generated by CoffeeScript 1.3.3
(function() {
  var createUser, fetchUsers, submitUser;

  _.templateSettings = {
    interpolate: /\{\{(.+?)\}\}/g
  };

  window.User = Backbone.Model.extend({});

  window.Users = Backbone.Collection.extend({
    model: User
  });

  window.list = new Users();

  window.UserView = Backbone.View.extend({
    tagName: 'li',
    className: 'user',
    events: {
      'click img, .user-data': 'goTo'
    },
    initialize: function() {
      _.bindAll(this, 'render');
      this.model.bind('change', this.render);
      return this.template = _.template(($('#user-template')).html());
    },
    render: function() {
      var rendered;
      rendered = this.template(this.model.toJSON());
      ($(this.el)).html(rendered).hide().fadeIn().slideDown();
      return this;
    },
    goTo: function() {
      return window.location.href = this.model.get('html_url');
    }
  });

  window.ListUserView = UserView.extend({});

  window.ListView = Backbone.View.extend({
    tagName: 'section',
    className: 'list',
    initialize: function() {
      _.bindAll(this, 'render', 'addOne');
      this.template = _.template(($('#list-template')).html());
      this.collection.bind('add', this.addOne, this);
      return this.render();
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
    },
    addOne: function(user) {
      var $users, view;
      $users = this.$('.users');
      view = new ListUserView({
        model: user
      });
      $users.append(view.render().el);
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
      $container = $('.users_container');
      $container.empty();
      $container.append(this.listView.render().el);
      return fetchUsers();
    }
  });

  createUser = function(username) {
    return $.ajax({
      type: 'GET',
      dataType: 'json',
      url: "https://api.github.com/users/" + username,
      success: function(json) {
        return list.add(new User(json));
      },
      error: function() {
        return $('.alert-box').html("" + username + " is not a valid Github login").fadeIn('slow');
      }
    });
  };

  fetchUsers = function() {
    return $.ajax({
      type: 'GET',
      url: '/users.json',
      success: function(users) {
        var user, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = users.length; _i < _len; _i++) {
          user = users[_i];
          _results.push(createUser(user.username));
        }
        return _results;
      }
    });
  };

  $(submitUser = function() {
    if ($('form#new-user')) {
      return $('form#new-user').submit(function(event) {
        var $input, login;
        $input = $('form#new-user input#user-login');
        login = $input.val();
        if (login) {
          createUser(login);
          $input.val('');
          $('.alert-box').hide();
        } else {
          $('.alert-box').html('Type a github username').fadeIn('slow');
        }
        return event.preventDefault();
      });
    }
  });

  $(function() {
    window.App = new UserRouter();
    return Backbone.history.start({
      pushState: true
    });
  });

}).call(this);
