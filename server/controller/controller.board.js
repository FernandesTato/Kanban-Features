const { groupModel, userModel, cardModel } = require("../db/db.schema.js")

const createCard = async (req, res) => { //POST
  const userId = req.user.userId
  const groupId = req.params.groupId

  try{
    const findUser = userModel.findById({_id: userId}).lean()
    const findGroup = groupMode.findById({ _id: groupId}).lean()

    if(!findUser || !findGroup){
      return res.status(400).json({ error: "Invalid Credentials"})
    } 
    const card = req.body
    const date = new Date(card.date)

    if(!card.title || !card.text || !card.date || !card.state || !card.groupId) {
      throw new Error("ERROR AT THE CARD")
    }

    if(Number.isNaN(date.getTime())){
      throw new Erro("date is invalid")
    }
    const cardDoc = new cardModel({
      title: card.title,
      text: card.text,
      date: date,
      state: card.state,
      groupId: groupId
    })

    const cardSavedDoc = await cardDoc.save()
    const cardObj = cardSavedDoc.toObject()
    await groupModel.updateOne({ _id:groupId }, { $push: {cardId: cardObj._id}})
    res.status(200).json({ card: cardObj})
  } catch (err) {
    console.error("error: ", err.message)
    res.status(400).json({ error: err.message})
  }
}

const updatingCard = (req, res) => { //PATCH ou PUT?
  const cardUpdate = req.body
  try { 
    if(!mongoose.Types.ObjectId.isValid(cardUpdate.id) || !cardModel.findById(cardUpdate.id)){
        throw new Error("card don't exist")
    }
    const set = {}

    if (cardUpdate.state !== undefined) set.state = cardUpdate.state;
    if (cardUpdate.title !== undefined) set.title = cardUpdate.title;
    if (cardUpdate.text !== undefined) set.text = cardUpdate.text;
    if (cardUpdate.date !== undefined) set.date = cardUpdate.date;

    const cardUpdateObj = await cardModel.updateOne({ _id:cardUpdate.id }, {$set: set }).lean()
    res.status(200).json({card: cardUpdateObj})
    } catch(err) {
    console.error("Error: ", err.message)
    res.status(400).jso({ error: err.message })
  }
}

module.exports = { createCard, updatingCard}
