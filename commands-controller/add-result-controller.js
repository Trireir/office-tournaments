const AddResultBusiness = require('../commands-business/add-result-business');

const VALID_ACTIONS = ['won', 'win', 'wins'];

function intersection(a, b) {
  let index = -1;
  a.forEach(function (e) {
    if(b.indexOf(e) > -1) {
      index = b.indexOf(e);
    }
  });
  return index;
}

function checkPlayer(player) {
  if(!player.startsWith('@')) {
    return 'Are you sure that ' + player + ' is an user? Should start with a @';
  }
  return;
}

function transformInput(attributes) {
  const actionIndex = intersection(VALID_ACTIONS, attributes);
  if(actionIndex === -1) {
    return {
      error: 'Sorry, but I did not understand it propperly. It should be something like the following\n' +
    '*/addResult @player1 @player2 won @player3 @player4*'
    };
  }

  if(actionIndex === 0 || actionIndex === attributes.length - 1) {
    return {
      error: 'Each team should have some members :sweat_smile:'
    };
  }

  let playerValidation;
  attributes.forEach((player, index) => {
    if(index === actionIndex) return;
    const playerError = checkPlayer(player);
    if(playerError) playerValidation = playerError;
  })
  if(playerValidation) return { error: playerValidation };

  return {
    teamA: attributes.slice(0, actionIndex),
    teamB: attributes.slice(actionIndex + 1),
  }
}

async function addResult(attributes, slackTeam, channel) {
  const transformedAttributes = transformInput(attributes);
  if (transformedAttributes.error) return transformedAttributes.error;
  const message = await AddResultBusiness(transformedAttributes.teamA, transformedAttributes.teamB, slackTeam, channel);
  return message;
}

module.exports = addResult;
