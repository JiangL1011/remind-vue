<template>
    <div id="detail">
        <template v-if="task">
            <h2 :style="task.plan.state[stateKey].finished?'text-decoration-line: line-through;':''">{{ task.title
                }}</h2>
            <h6>{{ '创建时间：'+ require('moment')(task.createTime,'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss') }}</h6>
            <h6 v-if="task.plan.state[stateKey].finished">
                {{'完成时间：'
                + require('moment')(task.plan.state[stateKey].finishTime,'YYYYMMDDHHmmss')
                .format('YYYY-MM-DD HH:mm:ss')}}
            </h6>
            <b-button variant="danger"
                      size="sm"
                      @click="cancelPlan"
                      v-if="!task.plan.state[stateKey].finished">
                取消计划
            </b-button>

            <b-button variant="warning"
                      size="sm"
                      @click="finishPlan"
                      v-if="task.plan.type==='repeat'">
                {{ task.plan.finished?'计划已结束':'结束周期计划' }}
            </b-button>

            <div style="margin: 3px 5px">
                <div v-if="task.plan.type==='once'">
                    <b>计划日期：</b>
                    <span>{{ task.plan.date }}</span>
                </div>
                <div v-else style="display: flex;flex-wrap: wrap">
                    <div style="width: 83px">
                        <b>计划周期：</b>
                    </div>
                    <div>
                        <span v-if="task.plan.everyday">每天</span>
                        <span v-else>
                            <span v-for="(day, index) in task.plan.daysOfWeek">
                                {{ index===0?'':'、' }}{{ daysOfWeek[day-1] }}
                            </span>
                        </span>
                    </div>
                </div>
                <div>
                    <b>计划时间：</b>
                    <span>{{ task.plan.time }}</span>
                </div>
            </div>


            <b-form style="margin-top: 10px">
                <b-form-textarea
                        id="textarea"
                        v-model="task.text"
                        placeholder="详细内容..."
                        rows="8"
                        style="margin-top: 10px;"
                        :readonly="task.plan.state[stateKey].finished">
                </b-form-textarea>

                <b-button variant="primary"
                          size="sm"
                          style="display:block;margin:3px auto"
                          v-model="task.text"
                          @click="editText"
                          v-if="!task.plan.state[stateKey].finished">
                    保存任务详细内容
                </b-button>
            </b-form>
        </template>
    </div>
</template>

<script>
  const db = require('../../db/remindDB')
  const common = require('../../util/common')
  const moment = require('moment')

  export default {
    name: 'detail',
    data: function () {
      return {
        taskId: '',
        taskIndex: 0,
        task: null,
        stateKey: '',
        daysOfWeek: [
          '周一',
          '周二',
          '周三',
          '周四',
          '周五',
          '周六',
          '周日'
        ]
      }
    },
    methods: {
      editText () {
        const that = this
        db.update({
          _id: that.task._id
        }, {
          $set: {
            text: that.task.text
          }
        }, {}, function (err) {
          if (!err) {
            alert('保存成功')
          } else {
            alert('保存失败，程序内部错误')
          }
        })
      },
      cancelPlan () {
        const r = confirm('取消后该计划会回到‘我的任务’列表并清空该计划的所有记录。确定要取消计划么？')
        if (r) {
          const id = this.task._id
          const createTime = this.task.createTime
          const title = this.task.title
          const text = this.task.text
          const newTask = common.task(title)
          newTask.text = text
          newTask.createTime = createTime
          db.update({
            _id: id
          }, newTask)
          // 取消计划后从我的任务列表中删除
          this.$parent.$refs.task.removeItem(this.taskIndex)
          this.task = null
          this.reloadCalendarTaskList()
        }
      },
      finishPlan () {
        const finished = this.task.plan.finished
        const r = confirm(finished ? '是否重新开启计划？' : '结束计划后，只能在今天重新开启，是否确定结束？')
        if (r) {
          this.task.plan.finished = !finished
        }
        const id = this.task._id
        db.update({
          _id: id
        }, {
          $set: {
            'plan.finished': !finished,
            'plan.finishDate': moment().format('YYYYMMDD')
          }
        })
        this.reloadCalendarTaskList()
      },
      reloadCalendarTaskList () {
        this.$parent.$refs.calendar.getTaskList()
      }
    },
    watch: {
      taskId (newVal) {
        const that = this
        db.findOne({_id: newVal}, function (err, doc) {
          if (!err) {
            that.task = doc
          } else {
            alert('程序内部错误')
          }
        })
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
