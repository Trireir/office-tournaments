function about() {
  return Promise.resolve('I\'m a Slack bot that want to help you and your colleagues to keep track on which is the ' + 
  'best player in the office. \nIt doesn\'t matter the sport, you choose. Just tell me the results ' +
  'with the command `/addResult`, and check the scores with `/classification`. \nThe results will be ' +
  'calculated with an ELO system, that it\'s used in a lot of different sports where you don\'t ' +
  'have a strict schedule, like chess or in videogames. If you want to know more about this, ' +
  'check the following link: https://en.wikipedia.org/wiki/Elo_rating_system');
}

module.exports = about;
