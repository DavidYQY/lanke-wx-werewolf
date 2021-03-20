const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  try {
    return db.collection(event.roomNum).doc('current_info').set({
      data: {
        current_period: event.current_period,
        locked: event.locked,
        vote_enabled: event.vote_enabled
      }
    })
  } catch(e) {
    console.log(e)
  }
}