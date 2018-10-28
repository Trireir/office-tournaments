const services = require('../commands-services/services');

function cleanPlayerInfo(player) {
  return {
    name: player.values.name,
    points: player.values.points,
  };
}

async function getClassification(channel) {
  return services.getClasification(channel)
    .then((classification) => {
      return classification.items.map(cleanPlayerInfo)
    });
}

module.exports = {
  getClassification
};
