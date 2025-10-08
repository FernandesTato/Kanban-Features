const { groupModel, userModel, cardModel } = require("../db/db.schema.js")

const createCard = async (req, res) => { //POST
  const userId = req.user.userId
  const groupId = req.user.groupId

  try{
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(groupId)) {
      throw new Error("userId ou groupId invalid")
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
    await groupModel.updateOne({ _id:groupId }, { $push: {cardId: cardSavedDoc._id}})
  } catch (err) {
    console.error("error: ", err.message)
    res.status(400).json({ error: err.message})
  }
}

const updatingCard = (req, res) => { //PATCH ou PUT?
  const cardUpdate = req.body
  try { 

    if(!mongoose.Types.ObjectId.isValid(cardUpdate.id) || !cardModel.findById(cardUpdate.id)){
        throw new Error("card dont exist")
    }
    const set = {}

    if (cardUpdate.state !== undefined) set.state = cardUpdate.state;
    if (cardUpdate.title !== undefined) set.title = cardUpdate.title;
    if (cardUpdate.text !== undefined) set.text = cardUpdate.text;
    if (cardUpdate.date !== undefined) set.date = cardUpdate.date;

    await cardModel.updateOne({ _id:cardUpdate.id }, {$set: set })

    } catch(err) {
    console.error("Error: ", err.message)
    res.status(400).jso({ error: err.message })
  }
}
