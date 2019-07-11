const moment = require('moment')

const plan = function () {
  return {
    type: 'once', // once单次计划  repeat周期计划
    // 整个计划是否结束，如果选择结束，则今后不会再出现该计划但是可以看到之前的完成情况
    // 仅作用于周期计划
    finished: false,
    finishDate: '0', // 整个计划结束的日期 YYYYMMDD格式 初始为0是防止转数字的时候报错
    daysOfWeek: [],
    everyday: false,
    indeterminate: false, // false说明daysOfWeek为空或者全选，主要用于控制样式
    date: moment().format('YYYY-MM-DD'), // 单次计划的日期
    time: moment().format('HH:mm'), // 单次计划和周期计划的时间
    // state中key为YYYYMMDD格式的日期字符串，value默认为{finished: false, expired: false, finishTime: ''}
    state: {}
  }
}

const stateDetail = function (finished, expired, finishTime) {
  return {
    finished: finished,
    expired: expired,
    finishTime: finishTime
  }
}

module.exports = {
  task: function (title) {
    return {
      createTime: moment().format('YYYYMMDDHHmmss'),
      finishTime: '',
      title: title,
      finished: false, // 未设为计划任务的完成状态
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
  },
  stateDetail: function (finished = false, expired = false, finishTime = '') {
    return stateDetail(finished, expired, finishTime)
  }
}
