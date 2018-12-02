const AddResultBusiness = require('../commands-business/add-result-business');

function validateInput(player1, player2, action, player3, player4) {
  if(!player1 || !player2 || !action || !player3 || !player4) {
    return 'Sorry, but I did not understand it propperly. It should be something like the following\n' +
    '*/addResult @player1 @player2 won @player3 @player4*';
  }

  if(!player1.startsWith('@')) {
    return 'Are you sure that ' + player1 + ' is an user? Should start with a @';
  }
  if(!player2.startsWith('@')) {
    return 'Are you sure that ' + player2 + ' is an user? Should start with a @';
  }
  if(!player3.startsWith('@')) {
    return 'Are you sure that ' + player3 + ' is an user? Should start with a @';
  }
  if(!player4.startsWith('@')) {
    return 'Are you sure that ' + player4 + ' is an user? Should start with a @';
  }

  const validActions = ['won', 'win', 'wins'];
  if(!validActions.includes(action)) {
    return 'Sorry, but I did not understand that action. It should be something like the following\n' +
    '*/addResult @player1 @player2 won @player3 @player4*';
  }
}

async function addResult([player1, player2, action, player3, player4], team, channel) {
  const validationError = validateInput(player1, player2, action, player3, player4);
  if (validationError) return validationError;

  const message = await AddResultBusiness(player1, player2, player3, player4, team, channel);
  return message;
}

module.exports = addResult;
