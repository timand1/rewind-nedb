const { Router } = require('express');
const router = Router();
const { getGames, addGame, updateGame, removeAll } = require('../model/gamesdb')

router.get('/', async (req, res) => {
    const resObj = {
        success: false
    }
    const gamesList = await getGames();
    if (gamesList.length > 0) {
        resObj.success = true
        resObj.matches = gamesList
    } else {
        resObj.success = true
        resObj.matches = []
    }

    res.json(resObj)
})

router.post('/', async (req, res) => {
    const gameInfo = req.body

    const resObj = {
        success: false
    }

    if (gameInfo) {
        const added = await addGame(gameInfo)
        if (added) {
            resObj.success = true
            resObj.message = `${gameInfo.gameId} added`
        } else {
            resObj.message = `Error adding game`
        }
    } else {
        resObj.success = true
    }   

    res.json(resObj)
})


router.post('/:id', async (req, res) => {
    const gameId = req.params.id
    const gameInfo = req.body
    
    const resObj = {
        success : false
    }
    
    const updatedGame = await updateGame(gameId, gameInfo)
    if(updatedGame) {
        resObj.success = true
        resObj.message = `Game ${gameId} updated`
    } else {
        resObj.message = 'Error'
    }

    res.json(resObj)
})

router.delete('/', async (req, res) => {

    const resObj = {
        success: false
    };

    const deleteAmount = await removeAll()
    if(deleteAmount > 0) {
        resObj.success = true
        resObj.message = `${deleteAmount} games removed.`
    } else if(deleteAmount === 0) {
        resObj.success = true
        resObj.message = `No games removed.`
    } else {
        resObj.message = `Error`
    }

    res.json(resObj) 
})

module.exports = router;