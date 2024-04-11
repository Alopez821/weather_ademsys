// En el lado del servidor
import { Meteor } from 'meteor/meteor';

Meteor.methods({
  'users.register'(userData) {
    try {
      const { username, email, password } = userData;
      const userId = Accounts.createUser({ username, email, password });
      return userId;
    } catch (error) {
      throw new Meteor.Error('registration-failed', 'No se pudo crear la cuenta de usuario');
    }
  },

  'users.login'(username, password) {
    try {
      const userId = Meteor.loginWithPassword(username, password);
      return userId;
    } catch (error) {
      throw new Meteor.Error('login-failed', 'Inicio de sesión fallido');
    }
  }
});
