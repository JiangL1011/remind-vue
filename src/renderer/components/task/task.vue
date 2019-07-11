<template>
    <div id="task">
        <b-nav tabs fill>
            <b-nav-item @click="tab=1" :active="tab===1"><b>我的任务</b></b-nav-item>
            <b-nav-item @click="tab=2" :active="tab===2"><b>今日计划</b></b-nav-item>
        </b-nav>
        <task-list v-show="tab===1" :isPlannedList="false" :task-list="taskList"></task-list>
        <task-list v-show="tab===2" :isPlannedList="true" :task-list="taskList"></task-list>
    </div>
</template>

<script>
  import taskList from './task-list'

  const dbUtil = require('../../db/dbUtil')
  const moment = require('moment')

  export default {
    name: 'task',
    components: {
      taskList
    },
    data: function () {
      return {
        tab: 1,
        taskList: []
      }
    },
    mounted () {
      this.loadData(1)
    },
    methods: {
      loadData (tab) {
        const that = this
        dbUtil.listTasksByDate(moment().format('YYYYMMDD'), tab === 2, function (data) {
          that.taskList = data
        })
      },
      removeItem (index) {
        this.taskList.splice(index, 1)
      }
    },
    watch: {
      tab (newVal) {
        // 切换tab清空详情栏的内容
        this.$parent.$refs.detail.taskId = ''
        this.$parent.$refs.detail.task = null
        this.$parent.detailTab = newVal
        this.loadData(newVal)
      }
    }
  }
</script>

<style scoped>
    #task {
        padding-left: 5px;
        padding-right: 5px;
        width: 500px;
        min-width: 400px;
        flex-grow: 1.5;
    }
</style>
