const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  try {
    return db.collection(event.roomNum).doc('basic_info').set({
      data: {
        god: event.god,
        board: event.board
      }
    })
  } catch(e) {
    console.log(e)
  }
}