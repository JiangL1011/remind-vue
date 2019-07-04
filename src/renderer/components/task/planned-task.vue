<template>
    <div>
        {{ plannedTaskList }}
    </div>
</template>

<script>
  export default {
    name: 'planned-task',
    data: function () {
      return {
        plannedTaskList: []
      }
    }
  }
</script>

<style scoped>

</style>
