const db = require('./remindDB')
const moment = require('moment')

export const listTasksByDate = function (date, planned, callback) {
  // eslint-disable-next-line handle-callback-err
  db.find({planned: planned}, function (err, docs) {
    let list = []
    const sortedDocs = docs.sort(function (a, b) {
      return parseInt(b.createTime) - parseInt(a.createTime)
    })
    if (!planned) {
      list = sortedDocs
    } else {
      // 筛选出指定日期的任务
      for (const sortedDoc of sortedDocs) {
        const createDate = parseInt(sortedDoc.createTime.substr(0, 8))
        if (parseInt(date) < createDate) {
          continue
        }
        if (sortedDoc.plan.everyday) {
          // 每日任务不用处理
          list.push(sortedDoc)
        } else {
          if (sortedDoc.plan.type === 'once') {
            // 单次任务
            const docDate = sortedDoc.plan.date
            const assignedDate = moment(date, 'YYYYMMDD').format('YYYY-MM-DD')
            if (docDate === assignedDate) {
              list.push(sortedDoc)
            }
          } else {
            // 周期任务
            let assignedDayOfWeek = moment(date, 'YYYYMMDD').day()
            // moment模块的周日为0  本项目中周日为7
            assignedDayOfWeek = assignedDayOfWeek === 0 ? 7 : assignedDayOfWeek
            if (sortedDoc.plan.daysOfWeek.indexOf(assignedDayOfWeek) > -1) {
              list.push(sortedDoc)
            }
          }
        }
      }
    }
    callback(list)
  })
}
