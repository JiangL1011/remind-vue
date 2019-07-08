<template>
    <div id="detail">
        <div v-if="Object.keys(task).length>0">
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
        </div>
    </div>
</template>

<script>
  const moment = require('moment')
  const db = require('../../db/remindDB')
  const common = require('../../util/common')

  export default {
    name: 'detail',
    data: function () {
      return {
        taskId: '',
        taskIndex: 0,
        task: {},
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
      toggleAll (checked) {
        this.task.plan.daysOfWeek = []
        if (checked) {
          for (const day of this.dayOfWeek) {
            this.task.plan.daysOfWeek.push(day.value)
          }
        }
      },
      addToPlan () {
        if (this.task.plan.type === 'once') {
          // 单次计划
          if (this.task.plan.date === '' || this.task.plan.time === '') {
            alert('日期和时间不可为空或填写错误')
          } else {
            const selectDateTime =
              moment(this.task.plan.date + ' ' + this.task.plan.time, 'YYYY-MM-DD HH:mm').format('YYYYMMDDHHmm')
            const currDateTime = moment().format('YYYYMMDDHHmm')
            if (parseInt(currDateTime) >= parseInt(selectDateTime)) {
              alert('不能选择过去的日期和时间')
            } else {
              const id = this.task._id
              const date = this.task.plan.date
              const time = this.task.plan.time
              db.update({
                _id: id
              }, {
                $set: {
                  planned: true,
                  'plan.type': 'once',
                  'plan.date': date,
                  'plan.time': time
                }
              })
              this.task = {}
            }
          }
        } else {
          // 周期计划
          if (this.task.plan.daysOfWeek.length === 0 || this.task.plan.time === '') {
            alert('计划周期和时间不可为空或填写错误')
          } else {
            const id = this.task._id
            const daysOfWeek = this.task.plan.daysOfWeek
            const time = this.task.plan.time
            const indeterminate = this.task.plan.indeterminate
            const everyday = this.task.plan.everyday
            db.update({
              _id: id
            }, {
              $set: {
                planned: true,
                'plan.type': 'repeat',
                'plan.daysOfWeek': daysOfWeek,
                'plan.time': time,
                'plan.indeterminate': indeterminate,
                'plan.everyday': everyday
              }
            })
            this.task = {}
          }
        }
      },
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
        const r = confirm('取消后该计划会回到‘我的任务’列表。确定要取消计划么？')
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
          this.task = {}
        }
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

    .b-row {
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
    }
</style>
