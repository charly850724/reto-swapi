const { v5: uuidv5 } = require('uuid');
const Swapi = require('../../libs/swapi');
const DynamoDb = require('../../libs/dynamo');
const personModel = require('../../models/person');
const Constants = require('../../constants/app.constants');

module.exports.createPerson = async (event) => {
  try {
    const { id } = event.pathParameters;
    uuid = uuidv5(id, Constants.Lambda.NAMESPACE_ID);

    // evalúo si ya existe el personaje en dynamodb para no agregarlo de nuevo
    const validatePerson = getPerson(uuid);
    if (validatePerson.length > 0) {
      return {
        status: 200,
        body: {
          person: validatePerson[0],
        },
      };
    }

    // evalúo si el id devuelve algún personaje desde swapi
    const personData = await Swapi.getResource(Constants.Swapi.PEOPLE_PATH, id);

    // traducción de atributos
    const translatedPerson = await translatePersonAttributes(personData, uuid);
    await setPerson(translatedPerson);

    return {
      status: 200,
      body: {
        person: translatedPerson
      },
    };
  } catch (error) {
    return {
      code: error.code,
      message: error.message,
      stack: error.stack
    };
  }
};

const getPerson = async (id) => {
  return await DynamoDb.getItem(id, Constants.Lambda.PEOPLE_TABLE);
};

const setPerson = async (data) => {
  return await DynamoDb.setItem(data, Constants.Lambda.PEOPLE_TABLE);
};

const translatePersonAttributes = async (data, id) => {
  const result = [];
  result.push(data);

  return result.map((p) => {
    return new personModel({
      id: id,
      nombre: p.name,
      altura: p.height,
      peso: p.mass,
      color_cabello: p.hair_color,
      color_piel: p.skin_color,
      color_ojos: p.eye_color,
      anio_nacimiento: p.birth_year,
      genero: p.gender,
      planeta_natal: p.homeworld,
      peliculas: p.films,
      especies: p.species,
      vehiculos: p.vehicles,
      naves_estelares: p.starships,
      creado: p.created,
      modificado: p.edited,
      url: p.url,
    });
  })[0];
}
