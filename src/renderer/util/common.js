const moment = require('moment')

const plan = function () {
  return {
    type: 'once', // once单次计划  repeat周期计划
    daysOfWeek: [],
    everyDay: false,
    indeterminate: false, // false说明daysOfWeek为空或者全选，主要用于控制样式
    date: moment().format('YYYY-MM-DD'),
    time: moment().format('HH:mm')
  }
}

module.exports = {
  task: function (title) {
    return {
      id: new Date().getTime(),
      title: title,
      finished: false,
      settingPlan: false, // 正在设置计划
      planned: false, // 该任务是否被设置为计划日程
      text: '', // 详细内容
      plan: (function () {
        return plan()
      }())
    }
  },
  plan: function () {
    return plan()
  }
}
