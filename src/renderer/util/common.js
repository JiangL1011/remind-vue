const moment = require('moment')

const plan = function () {
  return {
    type: 'once', // once单次计划  repeat周期计划
    daysOfWeek: [],
    everyday: false,
    indeterminate: false, // false说明daysOfWeek为空或者全选，主要用于控制样式
    date: moment().format('YYYY-MM-DD'),
    time: moment().format('HH:mm'),
    // state中key为YYYYMMDD格式的日期字符串，value默认为{finished: false, expired: false, finishTime: ''}
    state: {}
  }
}

module.exports = {
  task: function (title) {
    return {
      createTime: moment().format('YYYYMMDDHHmmss'),
      finishTime: '',
      title: title,
      finished: false, // 未设为计划任务的完成状态
      expired: false, // 未设为计划任务的过期状态
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
