const { getClassification } = require('../commands-repository/classification-repository');

function generateSpace(name) {
  const SPACE = 30;
  const spaceNeeded = (SPACE - name.length);
  let i = 0;
  let spaces = '';
  while(i < spaceNeeded) {
    spaces += ' ';
    i++;
  }
  return spaces;
}

async function classification(team, channel) {
  try {
    const classification = await getClassification(team, channel);
    let message = `\`\`\`======= Classification of ${channel} =======\n`;
    classification.forEach((player, position) => {
      message += `${position + 1}. ${player.name} ${generateSpace(player.name)} ${player.points} \n`;
    });
    message += '\`\`\`';
    return message;
  } catch (err) {
    return 'We are having some problems retrieving stored data... (' + err + ')'
  }
}

module.exports = classification;