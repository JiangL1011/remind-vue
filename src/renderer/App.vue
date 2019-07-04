<template>
    <div id="app">
        <calendar></calendar>
        <task></task>
        <detail ref="detail"></detail>
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

  Vue.use(BootstrapVue)

  export default {
    name: 'remind-vue',
    components: {
      calendar,
      task,
      detail
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
