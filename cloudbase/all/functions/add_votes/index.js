const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  try {
    return db.collection(event.roomNum).doc(event.period + event.from).set({
      data: {
        period: event.period,
        from: event.from,
        to: event.to
      }
    })
  } catch(e) {
    console.log(e)
    }
}