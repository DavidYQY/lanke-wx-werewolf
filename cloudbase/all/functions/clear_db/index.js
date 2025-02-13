const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  try {
    return await db.collection(event.roomNum).where({
      _id: _.neq('logs')
    }).remove()
  } catch(e) {
    console.error(e)
  }
}