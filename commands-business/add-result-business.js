const { getPlayer, createOrUpdateUser } = require('../commands-repository/add-result-repository');

const WIN = 1;
const LOOSE = 0;
const K = 320;

function expectedResult (eloA, eloB) {
  return 1 / (1 + Math.pow(10, (eloB - eloA)/400));
}

function updateElo(elo, expectedResult, result) {
  return Math.round(elo + K * (result - expectedResult));
}

function removeInitialAtSymbol(name) {
  return name.substring(1);
}

async function addResult(player1, player2, player3, player4, channel) {
  try {
    return Promise.all([
      getPlayer(removeInitialAtSymbol(player1), channel),
      getPlayer(removeInitialAtSymbol(player2), channel),
      getPlayer(removeInitialAtSymbol(player3), channel),
      getPlayer(removeInitialAtSymbol(player4), channel),
    ]).then(([player1Info, player2Info, player3Info, player4Info]) => {
      const eloTeamA = player1Info.points + player2Info.points;
      const eloTeamB = player3Info.points + player4Info.points
      const expectedResultA = expectedResult(eloTeamA, eloTeamB);
      const expectedResultB = 1 - expectedResultA;
      const newEloA = updateElo(eloTeamA, expectedResultA, WIN);
      const newEloB = updateElo(eloTeamB, expectedResultB, LOOSE);
      const diffEloA = newEloA - eloTeamA;
      const diffEloB = newEloB - eloTeamB;

      return Promise.all([
        createOrUpdateUser(player1Info.id, player1Info.name, player1Info.points + diffEloA, channel),
        createOrUpdateUser(player2Info.id, player2Info.name, player2Info.points + diffEloA, channel),
        createOrUpdateUser(player3Info.id, player3Info.name, player3Info.points + diffEloB, channel),
        createOrUpdateUser(player4Info.id, player4Info.name, player4Info.points + diffEloB, channel),
      ]).then((result) => {
        return player1Info.name + ' and ' + player2Info.name + ' won ' + diffEloA + ' points from ' + player3Info.name + ' and ' + player4Info.name;
      });
    })
  } catch (err) {
    return 'Something weird happened...sorry. [' + err + ']';
  }
}

module.exports = addResult;