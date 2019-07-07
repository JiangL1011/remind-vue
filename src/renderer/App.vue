<template>
    <div id="app">
        <calendar></calendar>
        <task ref="task"></task>
        <detail ref="detail" v-if="detailTab===1"></detail>
        <planned-detail ref="detail" v-else></planned-detail>
    </div>
</template>

<script>
  import Vue from 'vue'
  import BootstrapVue from 'bootstrap-vue'
  import 'bootstrap/dist/css/bootstrap.css'
  import 'bootstrap-vue/dist/bootstrap-vue.css'

  import calendar from './components/calendar'
  import task from './components/task/task'
  import detail from './components/detail/detail'
  import plannedDetail from './components/detail/planned-detail'

  Vue.use(BootstrapVue)

  export default {
    name: 'remind-vue',
    components: {
      calendar,
      task,
      detail,
      plannedDetail
    },
    data: function () {
      return {
        detailTab: 1
      }
    },
    mounted () {
      resize()
    }
  }

  window.onresize = function () {
    resize()
  }

  // 自适应各个组件高度，使其充满整个窗口并防止出现空白和滚动条
  const resize = function () {
    const clientHeight = document.documentElement.clientHeight

    const taskPanel = document.getElementById('calendar-task-panel')
    taskPanel.style.height = clientHeight - 408 + 'px'

    const taskOutline = document.getElementById('task-outline')
    taskOutline.style.height = clientHeight - 48 + 'px'
  }
</script>

<style>
    #app {
        margin: 3px;
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
    }
</style>
