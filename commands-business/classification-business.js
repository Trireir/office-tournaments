const { getClassification } = require('../commands-repository/classification-repository');

function getPosition(position, last) {
  switch(position) {
    case 0:
      return ':first_place_medal:';
    case 1:
      return ':second_place_medal:';
    case 2:
      return ':third_place_medal:';
    case last - 1:
      return ':poop:';
    default:
      return `  ${position + 1}.\t`;
  }
}

function generateSpace(name) {
  const SPACE = 30;
  const spaceNeeded = (SPACE - name.length)/ 3;
  let i = 0;
  let spaces = '';
  while(i < spaceNeeded) {
    spaces += '\t';
    i++;
  }
  return spaces;
}

async function addResult(channel) {
  try {
    const classification = await getClassification(channel);
    let message = `*=== Classification of ${channel} ===*\n`;
    classification.forEach((player, position) => {
      message += `${getPosition(position, classification.length)} ${player.name} ${generateSpace(player.name)} \t ${player.points} \n`;
    });
    return message;
  } catch (err) {
    return 'We are having some problems retrieving stored data... (' + err + ')'
  }
}

module.exports = addResult;