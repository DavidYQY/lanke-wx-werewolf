const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  try {
    return db.collection(event.roomNum).where({
      period: event.period
    }).get()
  } catch(e) {
    console.log(e)
  }
}