const axios = require("axios");
const Constants = require('../constants/app.constants');

module.exports.getResource = async (resource, id) => {
  const url = `${Constants.Swapi.ULR_BASE}${resource}${id}`;
  response = await axios.get(url);
  return response.data;
};
