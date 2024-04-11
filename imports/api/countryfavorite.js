import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

// Crea una nueva colección en MongoDB
export const CountryFavorite = new Mongo.Collection('countryFavorite');

Meteor.methods({
  'cityFavorite'(cityName) {
    // Verificar si el usuario está autenticado
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'Usuario no autenticado');
    }

    try {
      check(cityName, String);

      const userId = this.userId;

      CountryFavorite.insert({
        userId,
        cityName
      });

      const cityFavorites = CountryFavorite.find({ userId }).fetch();
      return cityFavorites;

    } catch (error) {
      throw new Meteor.Error('invalid-data', 'El nombre de la ciudad no es válido');
    }
  },
});


  
