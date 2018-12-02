const services = require('../commands-services/services');

function cleanPlayerInfo(player) {
  return {
    name: player.values.name,
    points: player.values.points,
  };
}

async function getClassification(team, channel) {
  const classification = await services.getClasification(team, channel);
  return classification.items.map(cleanPlayerInfo);
}

module.exports = {
  getClassification
};
