<template>
  <div class="app-container calendar-list-container">
    <div class="userInfo-container">
      <span>用户ID： {{userInfoFormId}}</span>
    </div>
    <el-tabs type="border-card">
      <el-tab-pane :label="$t('userFormDetails.basicInfoContent')">
        <!--基本信息填写内容-->
        <div class="filter-container">
          <el-button v-if="ad_level.indexOf('1')>-1" class="filter-item" type="primary" icon="document" @click="handleDownload(1)">导出</el-button>
        </div>
        <div class="el-table-container">
          <el-table :key='tableKey1' :data="basicList" v-loading="listLoading" :element-loading-text="$t('utils.loadText')" border fit highlight-current-row style="width: 100%">
            <el-table-column align="center" type="index" width="55"></el-table-column>
            <el-table-column align="center" :label="$t('userManagement.questionNumber')" width="65">
              <template scope="scope">
                <span>{{scope.row.id}}</span>
              </template>
            </el-table-column>
            <el-table-column align="left" :label="$t('userManagement.question')">
              <template scope="scope">
                <span >{{scope.row.question}}</span>
              </template>
            </el-table-column>
            <el-table-column align="left" :label="$t('userManagement.answer')">
              <template scope="scope">
                <template v-if="scope.row.id==1||scope.row.id==2||scope.row.id==3||scope.row.id==4||scope.row.id==5||scope.row.id==7||scope.row.id==12||scope.row.id==14||scope.row.id==15">
                  <span>{{scope.row.answer}}</span>
                </template>
                <template v-if="scope.row.id==6">
                  <span>{{scope.row.answer.type}}:</span>
                  <span>{{scope.row.answer.scope}}</span>
                </template>
                <template v-if="scope.row.id==8">
                  <span>同住人数：{{scope.row.answer.num}}；</span>
                  <span>同住类型：{{scope.row.answer.type}}</span>
                </template>
                <template v-if="scope.row.id==9">
                  <p v-for="item in scope.row.answer">
                    <span>年龄：{{item.age}}；</span>
                    <span>性别：{{item.sex}}；</span>
                    <span>关系：{{item.relation}}；</span>
                  </p>
                </template>
                <template v-if="scope.row.id==10">
                  <p v-for="item in scope.row.answer">
                    <span>范围：{{item.scope}}；</span>
                    <span>频率：{{item.hz}}</span>
                  </p>
                </template>
                <template v-if="scope.row.id==11">
                  <p v-for="item in scope.row.answer">
                    <span>范围：{{item.scope}}；</span>
                    <span>频率：{{item.hz}}</span>
                  </p>
                </template>
                <template v-if="scope.row.id==13">
                  <span>分数：{{scope.row.answer.grade}}；</span>
                  <span>理由：{{scope.row.answer.reson}}</span>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('userFormDetails.logInfoContent')">
        <!--接触日志填写内容-->
        <div class="filter-container">
          <el-button v-if="ad_level.indexOf('1')>-1" class="filter-item" type="primary" icon="document" @click="handleDownload(2)">导出</el-button>
        </div>
        <div class="el-table-container">
          <el-table :key='tableKey2' :data="logList" v-loading="listLoading" :element-loading-text="$t('utils.loadText')" border fit highlight-current-row style="width: 100%">
            <el-table-column type="index" width="55"></el-table-column>
            <el-table-column align="center" :label="$t('userManagement.questionNumber')" width="65">
              <template scope="scope">
                <span>{{scope.row.id}}</span>
              </template>
            </el-table-column>
            <el-table-column align="left" :label="$t('userManagement.question')">
              <template scope="scope">
                <span>{{scope.row.question}}</span>
              </template>
            </el-table-column>
            <el-table-column align="left" :label="$t('userManagement.answer')" >
              <template scope="scope">
                <template v-if="scope.row.id==1||scope.row.id==2||scope.row.id==3||scope.row.id==6||scope.row.id==7||scope.row.id==10||scope.row.id==12||scope.row.id==13">
                  <span>{{scope.row.answer}}</span>
                </template>
                <template v-if="scope.row.id==4">
                  <p v-for="item in scope.row.answer">
                    <span>年龄：{{item.age}}；</span>
                    <span>性别：{{item.sex}}；</span>
                    <span>接触时间：{{item.cTime}}；</span>
                    <span :index="item.relationIndex">关系：{{item.relation}}；</span>
                    <span>接触类型：{{item.contactType}}；</span>
                    <span>总时间：{{item.contacttime}}；</span>
                    <span>接触地点：{{item.contactLocation}}；</span>
                    <span>平时的接触频率：{{item.contactHz}}；</span>
                    <span>提交时间：{{item.submitTime | parseTime('{y}-{m}-{d} {h}:{i}')}}；</span>
                  </p>
                </template>
                <template v-if="scope.row.id==5">
                  <span v-if="scope.row.answer.state=='是'">{{scope.row.answer.num}}:</span>
                  <span v-else>估计遗漏数量：{{scope.row.answer.num}}；</span>
                </template>
                <template v-if="scope.row.id==8">
                  <p v-for="item in scope.row.answer">
                    <span>种类：{{item.type}}；</span>
                    <span>数量：{{item.num}}；</span>
                  </p>
                </template>
                <template v-if="scope.row.id==9">
                  <p v-for="item in scope.row.answer">
                    <span>种类：{{item.type}}；</span>
                    <span>频率：{{item.hz}}；</span>
                  </p>
                </template>
                <template v-if="scope.row.id==11">
                  <p v-for="item in scope.row.answer">
                    <span>动物种类：{{item.type}}；</span>
                    <span>数量：{{item.num}}；</span>
                    <span>接触时间：{{item.contacttime}}；</span>
                    <span>接触地点：{{item.contactLocation}}；</span>
                  </p>
                </template>
              </template>
            </el-table-column>
            <el-table-column align="center" :label="$t('utils.submitTime')" >
              <template scope="scope">
                <span>{{scope.row.submitTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
  import waves from '@/directive/waves/index' // 水波纹指令
  import { parseTime } from '@/utils'
  import { mapGetters } from 'vuex'

  export default {
    name: 'userFormDetails',
    directives: {
      waves
    },
    data() {
      return {
        basicList: [],
        logList: [],
        userInfoFormId: '',
        userInfoForm: {},
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          importance: undefined,
          title: undefined,
          type: undefined,
          sort: '+id'
        },
        temp: {
          id: undefined,
          importance: 0,
          remark: '',
          timestamp: 0,
          title: '',
          type: '',
          status: 'published'
        },
        importanceOptions: [1, 2, 3],
        calendarTypeOptions: [
          { key: '0', display_name: 'userManagement.assignCrowdNot' },
          { key: '1', display_name: 'userManagement.assignCrowd' }
        ],
        sortOptions: [{ label: '按ID升序列', key: '+id' }, { label: '按ID降序', key: '-id' }],
        statusOptions: ['published', 'draft', 'deleted'],
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '创建'
        },
        dialogPvVisible: false,
        pvData: [],
        showAuditor: false,
        tableKey1: 1,
        tableKey2: 2
      }
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'gray',
          deleted: 'danger'
        }
        return statusMap[status]
      }
    },
    created() {
      const userInfoForm = JSON.parse(sessionStorage.getItem('userInfoForm'))
      if (userInfoForm) {
        this.userInfoForm = userInfoForm
        this.userInfoFormId = userInfoForm.id
        this.getAnswer()
      } else {
        this.$router.push({
          path: '/userManagement/index'
        })
      }
    },
    computed: {
      ...mapGetters([
        'roles',
        'ad_level'
      ])
    },
    methods: {
      getAnswer() {
        this.$http.get('/getAnswer', { params: { id: this.userInfoFormId }}).then(response => {
          this.listLoading = false
          const data = response.data
          if (data.status) {
            const locanswer = data.data[0].locanswer
            let answerlog = data.data[0].answerlog
            if (locanswer) {
              const locanswerArr = JSON.parse(locanswer)
              for (const i in locanswerArr) {
                const node = locanswerArr[i]
                node.question = this.$t('basicInfoQuestions.q' + (node.id))
              }
              this.basicList = locanswerArr
            }
            if (answerlog) {
              answerlog = JSON.parse(answerlog)
              for (const i in answerlog) {
                const node = answerlog[i]
                node.question = this.$t('logQuestions.q' + (node.id))
              }
              this.logList = answerlog
            }
          }
        }, response => {
          this.listLoading = false
          console.log('失败：' + response)
        })
      },
      handleDownload(sig) {
        require.ensure([], () => {
          const { export_json_to_excel } = require('vendor/Export2Excel')
          if (sig === 1) {
            const tHeader = ['题号', '题目', '答案']
            const filterVal = ['id', 'question', 'answer']
            const basicListArr = this.basicList.concat()
            for (const i in basicListArr) {
              const node = JSON.parse(JSON.stringify(basicListArr[i]))
              const id = node.id
              const answer = node.answer
              let answerStr = ''
              switch (id) {
                case 6:
                  answerStr = `${answer.type}:${answer.scope}`
                  break
                case 8:
                  answerStr = `同住人数：${answer.num}；\r\n同住类型：${answer.num}`
                  break
                case 9:
                  for (const i in answer) {
                    const node = answer[i]
                    answerStr += `年龄：${node.age}；性别：${node.sex}; 关系：${node.relation}\r\n`
                  }
                  break
                case 10:
                  for (const i in answer) {
                    const node = answer[i]
                    answerStr += `范围：${node.scope}；频率：${node.hz}\r\n`
                  }
                  break
                case 11:
                  for (const i in answer) {
                    const node = answer[i]
                    answerStr += `范围：${node.scope}；频率：${node.hz}\r\n`
                  }
                  break
                case 13:
                  answerStr = `分数：${answer.grade}；\r\n 理由：${answer.reson}`
                  break
                default:
                  answerStr = answer
                  break
              }
              node.answer = answerStr
            }
            const data = this.formatJson(filterVal, basicListArr)
            export_json_to_excel(tHeader, data, '基本信息填写问卷信息')
          } else {
            const tHeader = ['题号', '题目', '答案', '提交时间']
            const filterVal = ['id', 'question', 'answer', 'submitTime']
            const logListArr = this.logList.concat()
            for (const i in logListArr) {
              const node = JSON.parse(JSON.stringify(logListArr[i]))
              const id = node.id
              const answer = node.answer
              let answerStr = ''
              switch (id) {
                case 4:
                  for (const i in answer) {
                    const node = answer[i]
                    answerStr += `年龄：${node.age}；性别：${node.sex}；接触时间：${node.cTime}；关系：${node.relation}；接触类型：${node.contactType}；总时间：${node.contacttime}；接触地点：${node.contactLocation}；平时的接触频率:${node.contactHz}；提交时间:${node.submitTime}\r\n`
                  }
                  break
                case 5:
                  if (answer.state === '是') {
                    answerStr = node.num
                  } else {
                    answerStr = `估计遗漏数量：${node.num}`
                  }
                  break
                case 8:
                  answerStr = `种类：${node.type}；数量：${node.num}`
                  break
                case 9:
                  for (const i in answer) {
                    const node = answer[i]
                    answerStr += `种类：${node.type}；频率：${node.hz}\r\n`
                  }
                  break
                case 11:
                  for (const i in answer) {
                    const node = answer[i]
                    answerStr += `动物种类：${node.type}；数量：${node.num}；接触时间：${node.contacttime}；接触地点：${node.contactLocation}；\r\n`
                  }
                  break
                default:
                  answerStr = answer
                  break
              }
              node.answer = answerStr
            }
            const data = this.formatJson(filterVal, logListArr)
            export_json_to_excel(tHeader, data, '接触日志填写问卷信息')
          }
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'submitTime') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
      }
    }
  }
</script>
<style lang="less" scoped>
  .userInfo-container{padding-bottom: 10px;}
 .el-table-container{
   .el-table .cell span{text-align: left}
   table{
   }
 }
</style>
