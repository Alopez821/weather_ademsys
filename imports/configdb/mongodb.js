import { Mongo } from 'meteor/mongo';

// Crea una nueva colección en MongoDB
export const WeatherData = new Mongo.Collection('weatherData');



Meteor.startup(() => {
  const weatherData = WeatherData.find().fetch();
  console.log('Datos del clima:', weatherData);
});

// Meteor.startup(() => {
//   // Eliminar todos los documentos de la colección WeatherData
//   WeatherData.remove({});

//   // Agrega aquí más líneas para eliminar documentos de otras colecciones si es necesario
// });
