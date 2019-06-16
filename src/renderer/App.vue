<template>
    <div id="app">
        <calendar></calendar>
        <task></task>
    </div>
</template>

<script>
  import Vue from 'vue'
  import BootstrapVue from 'bootstrap-vue'
  import 'bootstrap/dist/css/bootstrap.css'
  import 'bootstrap-vue/dist/bootstrap-vue.css'

  import calendar from './components/calendar'
  import task from './components/task'

  Vue.use(BootstrapVue)

  export default {
    name: 'remind-vue',
    components: {
      calendar,
      task
    }
  }
</script>

<style>
#app{
    margin: 3px;
    display: flex;
    flex-wrap: nowrap;
}
</style>
