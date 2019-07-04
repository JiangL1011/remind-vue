<template>
    <div id="detail">
        <my-task-detail :task="task"></my-task-detail>
    </div>
</template>

<script>
  import myTaskDetail from './my-task-detail'

  export default {
    name: 'detail',
    components: {
      myTaskDetail
    },
    data: function () {
      return {
        task: {}
      }
    }
  }
</script>

<style scoped>
    #detail {
        width: 250px;
        min-width: 200px;
        flex-grow: 1;
        word-wrap: break-word;
    }
</style>
