const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  try {
    return db.collection(event.roomNum).doc(event.name).set({
      data: {
        image: event.image,
        seat_num: event.seat_num,
        identity: event.identity
      }
    })
  } catch(e) {
    console.log(e)
    }
}