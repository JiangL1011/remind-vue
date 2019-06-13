<template>
    <div class="calendar calendar-outline">
        <div class="calendar-head">
            <div class="calendar-head-month-year">
                <div class="calendar-head-month-year-angle">
                    <i class="fa fa-angle-double-left"></i>
                </div>
                <div class="calendar-head-month-year-angle">
                    <i class="fa fa-angle-left"></i>
                </div>
                <div>{{ year+'年 '+month+'月' }}</div>
                <div class="calendar-head-month-year-angle">
                    <i class="fa fa-angle-right"></i>
                </div>
                <div class="calendar-head-month-year-angle">
                    <i class="fa fa-angle-double-right"></i>
                </div>
            </div>
            <div class="calendar-head-week">
                <div v-for="day in week">{{ day }}</div>
            </div>
        </div>
        <div class="calendar-body">
            <div class="calendar-body-day" v-for="day in days">
                <span>{{ day }}</span>
            </div>
        </div>
    </div>
</template>

<script>
  import moment from 'moment'

  export default {
    name: 'calendar',
    data: function () {
      return {
        year: '',
        month: '',
        week: ['日', '一', '二', '三', '四', '五', '六'],
        days: []
      }
    },
    created: function () {
      this.initCalendar()
    },
    methods: {
      initCalendar () {
        this.year = moment().format('YYYY')
        this.month = moment().format('MM')
        const firstDayOfMonth = moment(this.year + this.month + '01', 'YYYYMMDD')
        let currLoopDay = firstDayOfMonth.add(firstDayOfMonth.day() * -1, 'd')
        for (let i = 0; i < 42; i++) {
          this.days[i] = currLoopDay.get('date')
          currLoopDay = currLoopDay.add(1, 'd')
        }
      }
    }
  }
  // 00B8EC
  // CEF1FB
</script>

<style scoped>
    /*@import "../assets/font-awesome-4.7.0/css/font-awesome.min.css";*/
    .calendar-outline {
        height: 305px;
        width: 300px;
        border: 1px solid #CEF1FB;
        padding-top: 2px;
        padding-bottom: 2px;
    }

    .calendar-head-week li {
        list-style: none;
        float: left;
        margin-left: 0;
        display: block;
    }

    .calendar-head-week {
        padding: 0;
    }

    .calendar-body, .calendar-head-week, .calendar-head-month-year {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
    }

    .calendar-body-day, .calendar-head-week div {
        height: 38px;
        width: 40px;
        margin: 1px;
        text-align: center;
        line-height: 38px;
    }

    .calendar-head-month-year-angle{
        width: 28px;
        text-align: center;
        cursor: pointer;
    }
    .calendar-head-month-year-angle:hover{
        color: #3361ff;
    }
</style>
