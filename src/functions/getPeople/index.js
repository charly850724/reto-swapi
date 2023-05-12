const DynamoDb = require('../../libs/dynamo');
const Constants = require('../../constants/app.constants');

module.exports.getPeople = async (event) => {
  const people = await DynamoDb.getAll(Constants.Lambda.PEOPLE_TABLE);

  return {
    status: 200,
    body: {
      people: people,
    },
  };
};