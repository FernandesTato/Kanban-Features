const { groupModel, userModel } = require("../db/db.js")

const postCards = async (req, res) => {
  try{
    const cardsArrays = req.body.cards;

    if(!Array.isArray(cardsArrays) || cardsArrays.length === 0){
      return res.status(400).json({ error: "lista de cards vazia"})
    }

    res.status(201).json({ message: "cards created"})
  } catch(error){
    res.status(500).json({ error: error.message})
  }
}

const getCards = async (req, res) => {
 try{
    const cards = await cardModel.find()
    res.status(200).json({ card: cards })
  } catch(err){
    console.error(err)
    return res.status(500).json({ message: err.message })
  }
}

module.exports = { postCards, getCards }
