<template>
    <div v-show="Object.keys(task).length>0">
        <h2 :style="task.finished?'text-decoration-line: line-through;':''">{{ task.title }}</h2>
        <b-form-checkbox
                v-model="prePlanned[task.id]"
                checked="false"
                :disabled="task.finished">
            添加到计划日程
        </b-form-checkbox>
        <b-form v-show="prePlanned[task.id]">
            123
        </b-form>
    </div>
</template>

<script>
  export default {
    name: 'my-task-detail',
    props: ['task'],
    data: function () {
      return {
        prePlanned: {}
      }
    }
  }
</script>

<style scoped>

</style>
