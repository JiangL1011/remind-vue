<template>
    <div id="task-outline">
        <div id="add-task">
            <b-button @click="showAddTaskForm" block variant="primary" :disabled="allowAdd">添加任务</b-button>
        </div>
        <div id="task-list">
            <table id="task-table">
                <tr class="task-item" v-for="(task, index) in taskList">
                    <td>
                        <i class="fa fa-check"></i>
                    </td>
                    <td class="task-content" :contenteditable="allowAdd && index===0">
                        {{ task.content }}
                    </td>
                    <td>
                        <i class="fa fa-plus" v-if="index===0 && allowAdd" @click="addTask"></i>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'my-task',
    data: function () {
      return {
        taskList: [],
        allowAdd: false
      }
    },
    methods: {
      showAddTaskForm () {
        this.allowAdd = true
        const taskListTag = document.getElementById('task-list')
        taskListTag.scrollTop = 0
        this.taskList.unshift({content: 'test task'})
        // 触发一个异步操作，保证能获取到task-content
        setTimeout(function () {
          const currContentInput = document.getElementsByClassName('task-content')[0]
          currContentInput.focus()
        })
      },
      addTask (event) {
        const el = event.currentTarget
        const editableEl = el.parentNode.previousSibling.previousSibling
        this.taskList[0].content = editableEl.innerHTML

        this.allowAdd = false
      }
    }
  }
</script>

<style scoped>
    #task-outline {
        border-bottom: 1px solid black;
        display: flex;
        flex-wrap: nowrap;
        flex-direction: column;
    }

    #add-task {
        text-align: center;
        padding: 3px 0 3px 0;
    }

    #task-list {
        overflow: auto;
    }

    .fa-plus {
        color: #3361ff;
    }

    .task-content {
        word-wrap: break-word;
    }

    #task-table {
        width: 100%;
    }

    .task-item td:first-child, .task-item td:last-child {
        width: 25px;
        text-align: center;
    }

</style>
