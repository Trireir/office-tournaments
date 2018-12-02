const services = require('../commands-services/services');

function cleanPlayerInfo(player) {
  return {
    name: player.values.name,
    points: player.values.points,
  };
}

async function getClassification(channel) {
  const classification = await services.getClasification(channel);
  return classification.items.map(cleanPlayerInfo);
}

module.exports = {
  getClassification
};
