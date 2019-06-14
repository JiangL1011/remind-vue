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
                <div class="calendar-head-month-year-date">{{ year+'年 '+month+'月' }}</div>
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
            <div :class="'calendar-body-day '+ day.isToday" @click="selectDay" v-for="day in days">
                <span v-bind:class="day.dayType">{{ day.dayOfMonth }}</span>
            </div>
        </div>
    </div>
</template>

<script>
  import moment from 'moment'

  moment.locale('zh-cn')

  export default {
    name: 'calendar',
    data: function () {
      return {
        week: ['日', '一', '二', '三', '四', '五', '六'],
        // days中的元素是：{dayOfMonth:1,dayType:'curr'}
        days: [],
        realtime: moment().format('hh:mm:ss a'),
        realDate: moment().format('YYYY-MM-DD dddd'),
        selectedDate: moment().format('YYYYMMDD')
      }
    },
    created: function () {
      this.initCalendar()
      this.initClock()
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
            isToday: today === currLoopDate ? 'today' : ''
          }
          currLoopDay = currLoopDay.add(1, 'd')
        }
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
        width: 300px;
        border: 1px solid #CEF1FB;
    }

    .calendar-realtime {
        height: 65px;
        border-bottom: 1px solid #CEF1FB;
        padding: 3px 14px 3px 14px;
    }

    .calendar-realtime-clock {
        font-size: x-large;
        font-weight: bolder;
    }

    .calendar-realtime-date {
        font-size: small;
    }

    .calendar-head, .calendar-realtime {
        background: #3361ff;
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

    .calendar-body-day:hover {
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
        border-color: #3361ff;
        color: white;
        background: #3361ff;
    }

    .selected-day {
        border-color: #3361ff;
    }

</style>
