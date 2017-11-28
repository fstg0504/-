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
                <template v-if="scope.row.id==1||scope.row.id==2||scope.row.id==3||scope.row.id==4||scope.row.id==5||scope.row.id==7||scope.row.id==13||scope.row.id==14">
                  <span>{{scope.row.answer}}</span>
                </template>
                <template v-if="scope.row.id==6">
                  <span>{{scope.row.answer.type}}:</span>
                  <span>{{scope.row.answer.scope}}</span>
                </template>
                <template v-if="scope.row.id==8">
                  <span>同住人数：{{scope.row.answer.num}}</span>
                  <span>同住类型：{{scope.row.answer.type}}</span>
                </template>
                <template v-if="scope.row.id==9">
                  <p v-for="item in scope.row.answer">
                    <span>年龄：{{item.age}}；</span>
                    <span>性别：{{item.sex}}；</span>
                    <span :index="item.relationIndex">关系：{{item.relation}}；</span>
                  </p>
                </template>
                <template v-if="scope.row.id==10">
                  <span>范围：{{scope.row.answer.scope}}</span>
                  <span>频率：{{scope.row.answer.hz}}</span>
                </template>
                <template v-if="scope.row.id==11">
                  <span>范围：{{scope.row.answer.scope}}</span>
                  <span>频率：{{scope.row.answer.hz}}</span>
                </template>
                <template v-if="scope.row.id==12">
                  <span>分数：{{scope.row.answer.grade}}</span>
                  <span>理由：{{scope.row.answer.reson}}</span>
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
                    <span :index="item.relationIndex">关系：{{item.relation}}；</span>
                    <span>接触类型：{{item.contactType}}；</span>
                    <span>总时间：{{item.contacttime}}；</span>
                    <span>接触地点：{{item.contactLocation}}；</span>
                    <span>平时的接触频率：{{item.contactHz}}；</span>
                  </p>
                </template>
                <template v-if="scope.row.id==5">
                  <span v-if="scope.row.answer.state=='是'">{{scope.row.answer.num}}:</span>
                  <span v-else>估计遗漏数量：{{scope.row.answer.num}}:</span>
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

  const basicList = [
    {
      id: 1,
      answer: '50',
      submitTime: new Date().getTime()
    },
    {
      id: 2,
      answer: '其他',
      answerIndex: '其他',
      submitTime: new Date().getTime()
    },
    {
      id: 3,
      answer: '兼职',
      answerIndex: '2',
      submitTime: new Date().getTime()
    },
    {
      id: 4,
      answer: '学龄前',
      answerIndex: '1',
      submitTime: new Date().getTime()
    },
    {
      id: 5,
      answer: '无',
      answerIndex: '1',
      submitTime: new Date().getTime()
    },
    {
      id: 6,
      answer: {
        type: '个人收入',
        scope: '0-1,000'
      },
      answerIndex: '1',
      submitTime: new Date().getTime()
    },
    {
      id: 7,
      answer: '< 1 ',
      answerIndex: 1,
      submitTime: new Date().getTime()
    },
    {
      id: 8,
      answer: {
        num: 5,
        type: '家庭',
        typeIndex: '1'
      },
      submitTime: new Date().getTime()
    },
    {
      id: 9,
      answer: [
        {
          age: '20-30',
          sex: '女',
          relation: '配偶',
          relationIndex: '1'
        },
        {
          age: '20-30',
          sex: '女',
          relation: '小三',
          relationIndex: '1'
        },
        {
          age: '20-30',
          sex: '男',
          relation: '基友',
          relationIndex: '1'
        }
      ],
      submitTime: new Date().getTime()
    },
    {
      id: 10,
      answer: {
        hz: '几乎每天',
        hzIndex: '1',
        scope: '社区以外',
        scopeIndex: '1'
      },
      submitTime: new Date().getTime()
    },
    {
      id: 11,
      answer: {
        hz: '几乎每天',
        hzIndex: '1',
        scope: '社区以外',
        scopeIndex: '1'
      },
      submitTime: new Date().getTime()
    },
    {
      id: 12,
      answer: {
        grade: '10',
        reson: '11111'
      },
      submitTime: new Date().getTime()
    },
    {
      id: 13,
      answer: '晴天 ',
      answerIndex: 1,
      submitTime: new Date().getTime()
    },
    {
      id: 14,
      answer: '工作日',
      answerIndex: 1,
      submitTime: new Date().getTime()
    },
    {
      id: 15,
      answer: '普通的一天',
      answerIndex: 1,
      submitTime: new Date().getTime()
    }
  ]
  const logList = [
    {
      id: 1,
      answer: '是',
      answerIndex: '是',
      submitTime: new Date().getTime()
    },
    {
      id: 2,
      answer: '50',
      submitTime: new Date().getTime()
    },
    {
      id: 3,
      answer: '0-5岁;6-11 岁',
      answerIndex: '2;3',
      submitTime: new Date().getTime()
    },
    {
      id: 4,
      answer: [
        {
          age: '50',
          sex: '男',
          relation: '家人',
          contactType: '身体接触',
          contacttime: '<5',
          contactLocation: '家庭',
          contactHz: '每天几乎每天'
        },
        {
          age: '50',
          sex: '男',
          relation: '家人',
          contactType: '身体接触',
          contacttime: '<5',
          contactLocation: '家庭',
          contactHz: '一月不足一次'
        }
      ],
      answerIndex: '1',
      submitTime: new Date().getTime()
    },
    {
      id: 5,
      answer: {
        state: '是',
        num: '20'
      },
      submitTime: new Date().getTime()
    },
    {
      id: 6,
      answer: '非常好',
      answerIndex: '1',
      submitTime: new Date().getTime()
    },
    {
      id: 7,
      answer: '是',
      answerIndex: 1,
      submitTime: new Date().getTime()
    },
    {
      id: 8,
      answer: [
        {
          type: '猫',
          num: 1
        },
        {
          type: '猫',
          num: 1
        },
        {
          type: '猫',
          num: 1
        },
        {
          type: '其他',
          name: '其他名字',
          num: 1
        }
      ],
      submitTime: new Date().getTime()
    },
    {
      id: 9,
      answer: [
        {
          type: '猫',
          hz: 1
        },
        {
          type: '猫',
          hz: 1
        },
        {
          type: '猫',
          hz: 1
        },
        {
          type: '其他',
          name: '其他名字',
          hz: 1
        }
      ],
      submitTime: new Date().getTime()
    },
    {
      id: 10,
      answer: '是',
      scopeIndex: '1',
      submitTime: new Date().getTime()
    },
    {
      id: 11,
      answer: [
        {
          type: '猫',
          typeOther: '1',
          num: '20',
          contacttime: '<5',
          contactLocation: '家庭',
          other: '1'
        },
        {
          age: '50',
          sex: '男',
          relation: '家人',
          contactType: '身体接触',
          contacttime: '<5',
          contactLocation: '家庭',
          contactHz: 'contact'
        }
      ],
      answerIndex: '1',
      submitTime: new Date().getTime()
    },
    {
      id: 12,
      answer: '非常好',
      answerIndex: '1',
      submitTime: new Date().getTime()
    },
    {
      id: 13,
      answer: '建议',
      submitTime: new Date().getTime()
    }
  ]
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
        this.getBasicList(this.userInfoFormId)
        this.getLogList(this.userInfoFormId)
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
      getBasicList(id) {
        this.listLoading = true
        setTimeout(() => {
          for (const i in basicList) {
            const node = basicList[i]
            node.question = this.$t('basicInfoQuestions.q' + (Number(i) + 1))
          }
          this.basicList = basicList
          this.listLoading = false
        }, 1500)
      },
      getLogList(id) {
        this.listLoading = true
        setTimeout(() => {
          for (const i in logList) {
            const node = logList[i]
            node.question = this.$t('logQuestions.q' + (Number(i) + 1))
          }
          this.logList = logList
          this.listLoading = false
        }, 1500)
      },
      handleDownload(sig) {
        require.ensure([], () => {
          const { export_json_to_excel } = require('vendor/Export2Excel')
          const tHeader = ['题号', '题目', '答案', '提交时间']
          const filterVal = ['id', 'question', 'answer', 'submitTime']
          if (sig === 1) {
            const basicListArr = this.basicList
            for (const i in basicListArr) {
              const node = basicListArr[i]
              node.submitTime = parseTime(node.submitTime)
            }
            const data = this.formatJson(filterVal, basicListArr)
            export_json_to_excel(tHeader, data, '基本信息填写问卷信息')
          } else {
            const logListArr = this.logList
            for (const i in logListArr) {
              const node = logListArr[i]
              node.submitTime = parseTime(node.submitTime)
            }
            const data = this.formatJson(filterVal, logListArr)
            export_json_to_excel(tHeader, data, '接触日志填写问卷信息')
          }
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'timestamp') {
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
