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

function stringifyTeam(team) {
  if (team.length === 1) return removeInitialAtSymbol(team[0]);
  let result = '';
  team.forEach((player, index) => {
    if(index === team.length - 1) {
      result += `and ${removeInitialAtSymbol(player)}`;
    } else {
      result += `${removeInitialAtSymbol(player)} `;
    }
  });
  return result;
}

function getTeamELO(team) {
  return team.reduce((total, player) => {
    return total + player.points;
  }, 0)
}

function calculateSimetricELO(teamA, teamB) {
  const eloTeamA = getTeamELO(teamA);
  const eloTeamB = getTeamELO(teamB);
  const expectedResultA = expectedResult(eloTeamA, eloTeamB);
  const expectedResultB = 1 - expectedResultA;
  const newEloA = updateElo(eloTeamA, expectedResultA, WIN);
  const newEloB = updateElo(eloTeamB, expectedResultB, LOOSE);
  const diffEloA = (newEloA - eloTeamA)/teamA.length;
  const diffEloB = (newEloB - eloTeamB)/teamB.length;
  return {
    teamA: Math.floor(diffEloA),
    teamB: Math.floor(diffEloB),
  };
}

function calculateHandicapELO(teamA, teamB) {

}

function calculateELO(teamA, teamB) {
  if(teamA.length === teamB.length) {
    return calculateSimetricELO(teamA, teamB);
  } else {
    return calculateHandicapELO(teamA, teamB);
  }
}

function getPlayerInfo(team, slackTeam, slackChannel) {
  return team.map((player) => {
    return getPlayer(removeInitialAtSymbol(player), slackTeam, slackChannel)
  });
}

function updatePlayerInfo(team, diffElo, slackTeam, slackChannel) {
  return team.map((player) => {
    return createOrUpdateUser(player.id, player.name, player.points + diffElo, slackTeam, slackChannel);
  });
}

async function addResult(teamA, teamB, slackTeam, slackChannel) {
  try {
    return Promise.all([
      ...getPlayerInfo(teamA, slackTeam, slackChannel),
      ...getPlayerInfo(teamB, slackTeam, slackChannel)
    ]).then((info) => {
      const teamAInfo = info.slice(0, teamA.length);
      const teamBInfo = info.slice(teamA.length)
      const newElo = calculateELO(teamAInfo, teamBInfo);

      return Promise.all([
        ...updatePlayerInfo(teamAInfo, newElo.teamA, slackTeam, slackChannel),
        ...updatePlayerInfo(teamBInfo, newElo.teamB, slackTeam, slackChannel),
      ]).then((result) => {
        return `${stringifyTeam(teamA)} won ${newElo.teamA} points from ${stringifyTeam(teamB)}`;
      })
    }).catch((err) => { throw err; });
  } catch (err) {
    return 'Something weird happened...sorry. [' + err + ']';
  }
}

module.exports = addResult;