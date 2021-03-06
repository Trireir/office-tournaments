const services = require('../commands-services/services');

function cleanPlayerInfo(player, username) {
  if (player) {
    return {
      id: player.id,
      name: player.values.name,
      points: player.values.points,
    };
  }
  return {
    name: username,
    points: 500,
  };
}

async function getPlayer(username, team, channel) {
  const playerInfo = await services.getPlayer(username, team, channel);
  return cleanPlayerInfo(playerInfo.items[0], username);
}

async function createOrUpdateUser(id, username, points, team, channel) {
  try {
    let playerInfo;
    if (id) {
      playerInfo = await services.updateUser(id, username, points, team, channel);
    } else {
      playerInfo = await services.createUser(username, points, team, channel);
    }
    return cleanPlayerInfo(playerInfo, username);
  } catch (err) {
    return 'We are having some problems collecting data... (' + err + ')';
  }
}

module.exports = {
  getPlayer,
  createOrUpdateUser,
};
