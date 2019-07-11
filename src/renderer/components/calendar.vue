<template>
    <div class="calendar calendar-outline">
        <div class="calendar-realtime">
            <div class="calendar-realtime-clock">{{ realtime }}</div>
            <div class="calendar-realtime-date">{{ realDate }}</div>
        </div>
        <div class="calendar-head">
            <div class="calendar-head-month-year">
                <div class="calendar-head-month-year-angle" @click="changeYear(-1)">
                    <i class="fa fa-angle-double-left"></i>
                </div>
                <div class="calendar-head-month-year-angle" @click="changeMonth(-1)">
                    <i class="fa fa-angle-left"></i>
                </div>
                <div class="calendar-head-month-year-date">{{ year+' 年 '+month+' 月' }}</div>
                <div class="calendar-head-month-year-angle" @click="changeMonth(1)">
                    <i class="fa fa-angle-right"></i>
                </div>
                <div class="calendar-head-month-year-angle" @click="changeYear(1)">
                    <i class="fa fa-angle-double-right"></i>
                </div>
            </div>
            <div class="calendar-head-week">
                <div v-for="day in week">{{ day }}</div>
            </div>
        </div>
        <div class="calendar-body">
            <div :class="'calendar-body-day '+day.isToday+' '+day.isSelected" @click="selectDay" v-for="day in days">
                <span v-bind:class="day.dayType">{{ day.dayOfMonth }}</span>
            </div>
        </div>
        <div id="calendar-task-panel" class="calendar-task"
             style="overflow-y: auto;overflow-x:hidden;padding: 4px 0;word-wrap: break-word">
            <div style="height: 28px">
                <h6 style="margin-left: 4px;float: left">{{ fromNow }}</h6>
                <b-badge variant="danger"
                         v-show="showTaskIndex!==-1&&taskList.length!==0"
                         @click="cancelPlan"
                         style="float: right;margin-right: 5px;cursor: pointer">取消计划
                </b-badge>
            </div>
            <div id="demo" v-for="(task, index) in taskList">
                <div id="task-profile">
                    <div id="task-profile-title"
                         v-on:click="showTaskIndex=(showTaskIndex===index?-1:index)"
                         @mouseenter="hoverId=task._id"
                         @mouseleave="hoverId=''"
                         style="cursor: pointer;display: flex;flex-wrap: nowrap">
                        <div style="width: 15px;font-size: 12px;margin-left: 4px" @click="switchFinish(task)">
                            <i class="fa fa-check"
                               v-show="hoverId===task._id||(task.plan.state[selectedDate]&&task.plan.state[selectedDate].finished)"
                               style="color: #00b400">
                            </i>
                        </div>
                        <div>
                            <b :style="(task.plan.state[selectedDate]&&task.plan.state[selectedDate].finished)
                                ?'text-decoration-line: line-through;':''">
                                {{ task.title }}
                            </b>
                        </div>
                    </div>
                    <div id="task-profile-detail" style="padding: 0 4px;" v-if="showTaskIndex===index">
                        <div>
                            创建时间：
                            {{ require('moment')(task.createTime, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss') }}
                        </div>
                        <div v-if="task.plan.finished">
                            计划结束：
                            {{ require('moment')(task.plan.finishDate, 'YYYYMMDD').format('YYYY-MM-DD') }}
                        </div>
                        <div v-if="task.plan.state[selectedDate]&&task.plan.state[selectedDate].finished">
                            完成时间：
                            {{ require('moment')(task.plan.state[selectedDate].finishTime,'YYYYMMDDHHmmss')
                            .format('YYYY-MM-DD HH:mm:ss') }}
                        </div>
                        <div v-if="task.plan.type==='once'">
                            计划日期：{{ task.plan.date }}
                        </div>
                        <div v-else>
                            计划周期：
                            <span v-if="task.plan.daysOfWeek.length===7">每天</span>
                            <span v-else v-for="i in task.plan.daysOfWeek">{{ week[i===7?0:i]+' ' }}</span>
                        </div>
                        <div>
                            计划时间： {{ task.plan.time }}
                        </div>
                        <div>
                            <div>计划内容：</div>
                            {{ task.text }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import moment from 'moment'

  const dbUtil = require('../db/dbUtil')
  const common = require('../util/common')
  const db = require('../db/remindDB')

  moment.locale('zh-cn')

  export default {
    name: 'calendar',
    data: function () {
      return {
        showTaskIndex: -1,
        hoverId: '',
        year: '',
        month: '',
        week: ['日', '一', '二', '三', '四', '五', '六'],
        // days中的元素是：{dayOfMonth:1,dayType:'curr'}
        days: [],
        realtime: moment().format('hh:mm:ss a'),
        realDate: moment().format('YYYY-MM-DD dddd'),
        selectedDate: moment().format('YYYYMMDD'),
        fromNow: '',
        taskList: []
      }
    },
    created: function () {
      this.initCalendar()
      this.initClock()
    },
    mounted () {
      this.getTaskList()
    },
    methods: {
      initCalendar: function (year, month) {
        clearSelectedDay()
        this.year = year || moment().format('YYYY')
        this.month = month || moment().format('MM')
        const firstDayOfMonth = moment(this.year + this.month + '01', 'YYYYMMDD')
        let currLoopDay = firstDayOfMonth.add(firstDayOfMonth.day() * -1, 'd')
        // 这三个值是calendar-body-day中的span的类，分别表示上月日期，当月日期，下月日期
        const dayType = ['pre', 'curr', 'next']
        let dayTypeIndex = 0
        const today = moment().format('YYYYMMDD')
        for (let i = 0; i < 42; i++) {
          const currLoopDate = currLoopDay.format('YYYYMMDD')
          const dayOfMonth = currLoopDay.get('date')
          if (dayOfMonth === 1) {
            dayTypeIndex++
          }
          this.days[i] = {
            dayOfMonth,
            dayType: dayType[dayTypeIndex],
            isToday: today === currLoopDate ? 'today' : '',
            isSelected: currLoopDate === this.selectedDate ? 'selected-day' : ''
          }
          currLoopDay = currLoopDay.add(1, 'd')
        }
        this.showFromNow()
      },
      changeMonth: function (direct) {
        const newMonth = moment(this.year + this.month, 'YYYYMM').add(1 * direct, 'M')
        const year = newMonth.format('YYYY')
        const month = newMonth.format('MM')
        this.initCalendar(year, month)
      },
      changeYear: function (direct) {
        const newYear = moment(this.year + this.month, 'YYYYMM').add(1 * direct, 'y')
        const year = newYear.format('YYYY')
        const month = newYear.format('MM')
        this.initCalendar(year, month)
      },
      initClock: function () {
        const that = this
        setInterval(function () {
          that.realtime = moment().format('hh:mm:ss a')
        }, 1000)
      },
      selectDay: function (event) {
        const el = event.currentTarget
        clearSelectedDay()
        el.classList.add('selected-day')
        const span = el.childNodes[0]
        const dayType = span.classList[0]
        const dayOfMonth = span.innerText > 9 ? span.innerText : ('0' + span.innerText)
        if (dayType === 'pre') {
          const temp = moment(this.year + this.month, 'YYYYMM').add(-1, 'M').format('YYYYMM')
          this.selectedDate = moment(temp + dayOfMonth).format('YYYYMMDD')
        } else if (dayType === 'next') {
          const temp = moment(this.year + this.month, 'YYYYMM').add(1, 'M').format('YYYYMM')
          this.selectedDate = moment(temp + dayOfMonth).format('YYYYMMDD')
        } else {
          this.selectedDate = moment(this.year + this.month + dayOfMonth).format('YYYYMMDD')
        }
        this.showFromNow()
      },
      showFromNow: function () {
        if (this.selectedDate === moment().format('YYYYMMDD')) {
          this.fromNow = '今天'
        } else {
          const now = moment().format('HHmmss')
          this.fromNow = moment(this.selectedDate + now, 'YYYYMMDDHHmmss').fromNow().replace('内', '后')
        }
        this.fromNow += '\xa0\xa0\xa0' + moment(this.selectedDate, 'YYYYMMDD').format('YYYY-MM-DD')
      },
      switchFinish: function (task) {
        const id = task._id
        const date = this.selectedDate
        if (!task.plan.state[date]) {
          task.plan.state[date] = common.stateDetail()
        }
        const finished = !task.plan.state[date].finished
        const r = confirm(finished ? '确定要完成任务吗？' : '确定要重新开启该任务吗？')
        if (!r) return
        // 当前时间
        const time = moment().format('HHmmss')
        const now = moment().format('YYYYMMDDHHmmss')
        const deadLine = moment(date + task.plan.time, 'YYYYMMDDHH:mm').format('YYYYMMDDHHmmss')
        const stateDetail = common.stateDetail(
          finished,
          parseInt(now) > parseInt(deadLine),
          date + time
        )
        task.plan.state[date] = stateDetail
        db.update({
          _id: id
        }, {
          $set: {
            ['plan.state.' + date]: stateDetail
          }
        })
        // 同时更新detail列表的stateKey，便于planned-detail中直接获取state内容
        this.$parent.$refs.detail.stateKey = date
        // 同时更新detail列表的数据
        const detailTask = this.$parent.$refs.detail.task
        if (detailTask && detailTask._id === task._id) {
          this.$parent.$refs.detail.task = task
        }
        // 更新主列表界面的数据
        const taskList = this.$parent.$refs.task.taskList
        for (let i = 0; i < taskList.length; i++) {
          if (taskList[i]._id === task._id) {
            taskList[i].plan.state[date].finished = finished
            break
          }
        }
      },
      getTaskList: function (date = this.selectedDate) {
        const that = this
        dbUtil.listTasksByDate(date, true, function (data) {
          that.taskList = data
        })
      },
      cancelPlan () {
        const that = this
        const canceledTask = this.taskList[this.showTaskIndex]
        const cp = this.$parent.$refs.detail.cancelPlan
        if (typeof cp === 'function') {
          cp(canceledTask)
        } else {
          const r = confirm('取消后该计划会回到‘我的任务’列表并清空该计划的所有记录。' +
            '确定要取消标题为“' + canceledTask.title + '”的计划么？')
          if (r) {
            const id = canceledTask._id
            const createTime = canceledTask.createTime
            const title = canceledTask.title
            const text = canceledTask.text
            const newTask = common.task(title)
            newTask.text = text
            newTask.createTime = createTime
            db.update({
              _id: id
            }, newTask, {}, function (err) {
              if (!err) {
                that.getTaskList()
                that.$parent.$refs.task.loadData()
              }
            })
          }
        }
      }
    },
    watch: {
      selectedDate (newVal) {
        this.getTaskList(newVal)
      }
    }
  }

  const clearSelectedDay = function () {
    const oldSelected = document.getElementsByClassName('selected-day')
    if (oldSelected[0]) {
      oldSelected[0].classList.remove('selected-day')
    }
  }
</script>

<style scoped>
    .calendar-outline {
        width: 299px;
        border: 1px solid #B2D5DF;
        border-radius: 4px;
    }

    .calendar-realtime {
        height: 80px;
        border-bottom: 1px solid #B2D5DF;
        padding: 3px 14px 3px 14px;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
    }

    .calendar-realtime-clock {
        font-size: x-large;
        font-weight: bolder;
        margin-top: 7px;
    }

    .calendar-realtime-date {
        font-size: small;
    }

    .calendar-head, .calendar-realtime {
        background: rgba(0, 115, 255, 0.89);
        color: white;
    }

    .calendar-body, .calendar-head-week, .calendar-head-month-year {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        align-content: space-around;
    }

    .calendar-body {
        margin-top: 2px;
        height: 252px;
    }

    .calendar-body-day, .calendar-head-week div {
        height: 40px;
        width: 40px;
        text-align: center;
        line-height: 36px;
        cursor: default;
    }

    .calendar-body-day {
        border: 2px solid white;
        border-radius: 20px;
    }

    .calendar-body-day:not(.today):hover {
        background: #eee6ee;
    }

    .calendar-head-month-year-angle {
        width: 28px;
        text-align: center;
        cursor: pointer;
    }

    .calendar-head-month-year-date {
        cursor: default;
    }

    .calendar-head-month-year-angle:hover {
        color: #fffb01;
    }

    .pre, .next {
        color: #adadad;
    }

    .today {
        border-color: rgba(0, 115, 255, 0.89);
        color: white;
        background: rgba(0, 115, 255, 0.89);
    }

    .selected-day {
        border-color: rgba(0, 115, 255, 0.89);
    }

    .calendar-task {
        border-top: 1px solid #B2D5DF;
    }

    #task-profile {
        border-bottom: 1px solid #B2D5DF;
        line-height: 32px;
        word-wrap: break-word;
        cursor: default;
    }

    #task-profile-title:hover {
        background: #e8eef7;
    }

    #task-profile-detail {
        line-height: 17px;
        font-size: 13px;
    }

</style>
