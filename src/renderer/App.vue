<template>
    <div id="app">
        <jl-calendar></jl-calendar>
    </div>
</template>

<script>
  import Vue from 'vue'
  import BootstrapVue from 'bootstrap-vue'
  import 'bootstrap/dist/css/bootstrap.css'
  import 'bootstrap-vue/dist/bootstrap-vue.css'

  import jlCalendar from './components/jl-calendar'

  Vue.use(BootstrapVue)

  export default {
    name: 'remind-vue',
    components: {
      jlCalendar
    }
  }
</script>

<style>

</style>
