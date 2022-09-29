const nedb = require('nedb-promise');
const database = new nedb({ filename: 'games.db', autoload: true });

async function getGames() {
    const result = await database.find({})
    return result
}

async function addGame(gameInfo) {
    const result = await database.insert(gameInfo);
    return result;
}

async function updateGame(gameId, gameInfo) {    
    const result = await database.update({gameId: gameId}, {$set: {team1: gameInfo.team1, team2: gameInfo.team2, win: gameInfo.win, lost: gameInfo.lost, duration: gameInfo.duration, date: gameInfo.date, image: gameInfo.image }})
    return result
}

async function removeAll() {
    const result = await database.remove({}, { multi: true });
    return result;
}

async function findGame(id) {
    const result = await database.find({ gameId: id })
    return result
}

module.exports = { getGames, addGame, updateGame, removeAll, findGame }