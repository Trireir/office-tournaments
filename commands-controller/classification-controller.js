const ClassificationBusiness = require('../commands-business/classification-business');

function validateInput(channel) {
  if(!channel) {
    return 'There was a problem retrieving the channel name.'
  }
}

async function classification(channel) {
  const validationError = validateInput(channel);
  if (validationError) return validationError;

  const message = await ClassificationBusiness(channel);
  return message;
}

module.exports = classification;
