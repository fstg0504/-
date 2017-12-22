<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" v-model="listQuery.actorid" style="width: 150px;" class="filter-item" :placeholder="$t('userManagement.enterId')">
      </el-input>
      <div class="block filter-item filter-date">
        <span class="demonstration">{{$t('userManagement.basicInfoTime')}}：</span>
        <el-date-picker
          v-model="filterDate1"
          type="daterange"
          :range-separator="$t('utils.to')"
          :start-placeholder="$t('utils.startTime')"
          :end-placeholder="$t('utils.endTime')">
        </el-date-picker>
      </div>
      <div class="block filter-item filter-date">
        <span class="demonstration">{{$t('userManagement.logTime')}}：</span>
        <el-date-picker
          v-model="filterDate2"
          type="daterange"
          :range-separator="$t('utils.to')"
          :start-placeholder="$t('utils.startTime')"
          :end-placeholder="$t('utils.endTime')">
        </el-date-picker>
      </div>
      <div class="block filter-item filter-date">
        <span class="demonstration">定位开始时间：</span>
        <el-date-picker
          v-model="filterDate3"
          type="daterange"
          :range-separator="$t('utils.to')"
          :start-placeholder="$t('utils.startTime')"
          :end-placeholder="$t('utils.endTime')">
        </el-date-picker>
      </div>
      <div class="block filter-item filter-date">
        <span class="demonstration">定位结束时间：</span>
        <el-date-picker
          v-model="filterDate4"
          type="daterange"
          :range-separator="$t('utils.to')"
          :start-placeholder="$t('utils.startTime')"
          :end-placeholder="$t('utils.endTime')">
        </el-date-picker>
      </div>
      <div class="block filter-item filter-date">
        <span class="demonstration">接触日志开始时间：</span>
        <el-date-picker
          v-model="filterDate5"
          type="daterange"
          :range-separator="$t('utils.to')"
          :start-placeholder="$t('utils.startTime')"
          :end-placeholder="$t('utils.endTime')">
        </el-date-picker>
      </div>

      <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.crowd" :placeholder="$t('userManagement.crowdtype')">
        <el-option v-for="item in  calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">{{$t('utils.search')}}</el-button>
      <el-button class="filter-item" type="primary" icon="document" @click="handleDownload">导出当前页数据</el-button>
      <el-button class="filter-item" type="primary" icon="document" @click="handleDownloadByAnswer">根据题目导出数据</el-button>
      <el-button class="filter-item" type="primary" icon="document" @click="handleBatchDownloadByGetLocalLog(3)">批量导出定位信息</el-button>
    </div>

    <el-table :key='tableKey' height="450" :data="list" v-loading="listLoading" :element-loading-text="$t('utils.loadText')" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" type="index" width="55"></el-table-column>
      <el-table-column align="center" label="ID" width="65">
        <template scope="scope">
          <router-link class='inlineBlock' @click.native="setSessionStorage(scope.row)" :to="{path:'/userManagement/userFormDetails'}" title="点击查看用户表单详情">
            {{scope.row.id}}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('userManagement.assign')" width="100">
        <template scope="scope">
          <span>{{scope.row.crowd==1?$t('utils.yes'):$t('utils.no')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="设备信息" width="120">
        <template scope="scope">
          <span>{{scope.row.phoneinfo}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('userManagement.basicInfoTime')" >
        <template scope="scope">
          <span v-if="scope.row.registertime">{{new Date(scope.row.registertime).getTime() | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          <span v-else>暂无</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="接触日志开始时间" >
        <template scope="scope">
          <span v-if="scope.row.touchlog">{{new Date(scope.row.touchlog).getTime() | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          <span v-else>无</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="接触日志提交时间" >
        <template scope="scope">
          <span v-if="scope.row.sublogtime">{{new Date(scope.row.sublogtime).getTime() | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          <span v-else>无</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('userManagement.participantId')" width="120">
        <template scope="scope">
          <span>{{scope.row.actorid}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('userManagement.locationStart')" >
        <template scope="scope">
          <span>{{new Date(scope.row.locationstarttime).getTime() | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('userManagement.locationEnd')" >
        <template scope="scope">
          <span>{{new Date(scope.row.locationendtime).getTime() | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="1"
          :page-sizes="[10, 20, 50, 100, total]"
          :page-size="listQuery.length"
          layout="total, sizes, prev, pager, next"
          :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import waves from '@/directive/waves/index' // 水波纹指令
  import { parseTime } from '@/utils'
  import { isJSON, getIndexInArrayByObject } from '@/utils'

  const calendarTypeOptions = [
    { key: '2', display_name: '非指定人群' },
    { key: '1', display_name: '指定人群' }
  ]

  // arr to obj
  const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
    acc[cur.key] = cur.display_name
    return acc
  }, {})

  export default {
    name: 'user_management_list',
    directives: {
      waves
    },
    data() {
      return {
        list: [],
        filterDate1: ['', ''],
        filterDate2: ['', ''],
        filterDate3: ['', ''],
        filterDate4: ['', ''],
        filterDate5: ['', ''],
        total: null,
        listLoading: true,
        listQuery: {
          start: 0,
          length: 10,
          actorid: '',
          basicInfoTimeStart: '0-0-0 0:0:0',
          basicInfoTimeEnd: '0-0-0 0:0:0',
          logTimeStart: '0-0-0 0:0:0',
          logTimeEnd: '0-0-0 0:0:0',
          locationTime1Start: '0-0-0 0:0:0',
          locationTime1End: '0-0-0 0:0:0',
          locationTime2Start: '0-0-0 0:0:0',
          locationTime2End: '0-0-0 0:0:0',
          crowd: ''
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
        calendarTypeOptions,
        tableKey: 0
      }
    },
    filters: {
      typeFilter(type) {
        return calendarTypeKeyValue[type]
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        this.listQuery.basicInfoTimeStart = this.filterDate1[0] ? parseTime(this.filterDate1[0]).toString() : '0-0-0 0:0:0'
        this.listQuery.basicInfoTimeEnd = this.filterDate1[1] ? parseTime(this.filterDate1[1]).toString() : '0-0-0 0:0:0'
        this.listQuery.logTimeStart = this.filterDate2[0] ? parseTime(this.filterDate2[0]).toString() : '0-0-0 0:0:0'
        this.listQuery.logTimeEnd = this.filterDate2[1] ? parseTime(this.filterDate2[1]).toString() : '0-0-0 0:0:0'
        this.listQuery.locationTime1Start = this.filterDate3[0] ? parseTime(this.filterDate3[0]).toString() : '0-0-0 0:0:0'
        this.listQuery.locationTime1End = this.filterDate3[1] ? parseTime(this.filterDate3[1]).toString() : '0-0-0 0:0:0'
        this.listQuery.locationTime2Start = this.filterDate4[0] ? parseTime(this.filterDate4[0]).toString() : '0-0-0 0:0:0'
        this.listQuery.locationTime2End = this.filterDate4[1] ? parseTime(this.filterDate4[1]).toString() : '0-0-0 0:0:0'
        this.listQuery.touchlogstart = this.filterDate5[0] ? parseTime(this.filterDate5[0]).toString() : '0-0-0 0:0:0'
        this.listQuery.touchlogend = this.filterDate5[1] ? parseTime(this.filterDate5[1]).toString() : '0-0-0 0:0:0'
        this.$http.get('/getUserInfo', { params: this.listQuery }).then(response => {
          this.listLoading = false
          const data = response.data
          if (data.status === 1) {
            for (const i in data.data) {
              const node = data.data[i]
              if (node.answerlog === '') {
                node.answerlog = JSON.stringify([])
              }
            }
            this.list = data.data
            this.total = data.recordsFiltered
          } else {
            this.$message({
              message: data.msg,
              type: 'warning'
            })
          }
        }, response => {
          this.$message({
            message: response,
            type: 'warning'
          })
          this.$message.error({ message: `错误信息：${response}` })
        })
      },
      handleFilter() {
        this.getList()
      },
      handleSizeChange(val) {
        this.listQuery.start = 0
        this.listQuery.length = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.start = 0
        this.listQuery.start = this.listQuery.length * (val - 1)
        this.getList()
      },
      handleDownload() {
        require.ensure([], () => {
          const { export_json_to_excel } = require('vendor/Export2Excel')
          const tHeader = ['序号', '用户ID', '是否指定人群', '设备信息', '基本信息填写时间', '接触日志开始时间', '提交接触日志时间', '参与者ID', '定位开始时间', '定位结束时间']
          const filterVal = ['index', 'id', 'crowd', 'phoneinfo', 'registertime', 'touchlog', 'sublogtime', 'actorid', 'locationstarttime', 'locationendtime']
          const listArr = this.list.concat()
          const resultArr = []
          for (const i in listArr) {
            const node = JSON.parse(JSON.stringify(listArr[i]))
            resultArr.push({
              index: Number(i) + 1,
              id: node.id,
              crowd: Number(node.crowd) === 1 ? '是' : '否',
              phoneinfo: node.phoneinfo,
              registertime: node.registertime,
              touchlog: node.touchlog,
              actorid: node.actorid,
              locationstarttime: node.locationstarttime,
              locationendtime: node.locationendtime,
            })
          }
          const data = this.formatJson(filterVal, resultArr)
          export_json_to_excel(tHeader, data, '用户列表')
        })
      },
      handleDownloadByAnswer() {
        require.ensure([], () => {
          const { export_json_to_excel } = require('vendor/Export2Excel')
          const rowOpt = [
            { tHeader: '序号', filterVal: 'index' },
            { tHeader: 'ID', filterVal: 'userID' },
            { tHeader: '参与者ID', filterVal: 'actorid' },
            { tHeader: '年龄', filterVal: 'age' },
            { tHeader: '性别', filterVal: 'sex' },
            { tHeader: '工作学习状态', filterVal: 'workStatus' },
            { tHeader: '工作类型', filterVal: 'workType' },
            { tHeader: '其他工作', filterVal: 'otherWorkType' },
            { tHeader: '学历', filterVal: 'education' },
            { tHeader: '其它学历', filterVal: 'otherEducation' },
            { tHeader: '收入类型', filterVal: 'incomeType' },
            { tHeader: '收入', filterVal: 'income' },
            { tHeader: '居住年数', filterVal: 'LivingYears' },
            { tHeader: '同住人数', filterVal: 'WithNumber' },
            { tHeader: '同住类型', filterVal: 'LivingType' },
            { tHeader: '其它类型', filterVal: 'otherType' },
            { tHeader: '同住人年龄1', filterVal: 'LivingAge1' },
            { tHeader: '同住人性别1', filterVal: 'LivingSex1' },
            { tHeader: '同住人关系1', filterVal: 'LivingRelation1' },
            { tHeader: '其它关系1', filterVal: 'otherRelation1' },
            { tHeader: '同住人年龄2', filterVal: 'LivingAge2' },
            { tHeader: '同住人性别2', filterVal: 'LivingSex2' },
            { tHeader: '同住人关系2', filterVal: 'LivingRelation2' },
            { tHeader: '其它关系2', filterVal: 'otherRelation2' },
            { tHeader: '同住人年龄3', filterVal: 'LivingAge3' },
            { tHeader: '同住人性别3', filterVal: 'LivingSex3' },
            { tHeader: '同住人关系3', filterVal: 'LivingRelation3' },
            { tHeader: '其它关系3', filterVal: 'otherRelation3' },
            { tHeader: '同住人年龄4', filterVal: 'LivingAge4' },
            { tHeader: '同住人性别4', filterVal: 'LivingSex4' },
            { tHeader: '同住人关系4', filterVal: 'LivingRelation4' },
            { tHeader: '其它关系4', filterVal: 'otherRelation4' },
            { tHeader: '同住人年龄5', filterVal: 'LivingAge5' },
            { tHeader: '同住人性别5', filterVal: 'LivingSex5' },
            { tHeader: '同住人关系5', filterVal: 'LivingRelation5' },
            { tHeader: '其它关系5', filterVal: 'otherRelation5' },
            { tHeader: '同住人年龄6', filterVal: 'LivingAge6' },
            { tHeader: '同住人性别6', filterVal: 'LivingSex6' },
            { tHeader: '同住人关系6', filterVal: 'LivingRelation6' },
            { tHeader: '其它关系6', filterVal: 'otherRelation6' },
            { tHeader: '同住人年龄7', filterVal: 'LivingAge7' },
            { tHeader: '同住人性别7', filterVal: 'LivingSex7' },
            { tHeader: '同住人关系7', filterVal: 'LivingRelation7' },
            { tHeader: '其它关系7', filterVal: 'otherRelation7' },
            { tHeader: '同住人年龄8', filterVal: 'LivingAge8' },
            { tHeader: '同住人性别8', filterVal: 'LivingSex8' },
            { tHeader: '同住人关系8', filterVal: 'LivingRelation8' },
            { tHeader: '其它关系8', filterVal: 'otherRelation8' },
            { tHeader: '同住人年龄9', filterVal: 'LivingAge9' },
            { tHeader: '同住人性别9', filterVal: 'LivingSex9' },
            { tHeader: '同住人关系9', filterVal: 'LivingRelation9' },
            { tHeader: '其它关系9', filterVal: 'otherRelation9' },
            { tHeader: '同住人年龄10', filterVal: 'LivingAge10' },
            { tHeader: '同住人性别10', filterVal: 'LivingSex10' },
            { tHeader: '同住人关系10', filterVal: 'LivingRelation10' },
            { tHeader: '其它关系10', filterVal: 'otherRelation10' },
            { tHeader: '村频率1', filterVal: 'villageHZ1' },
            { tHeader: '街道频率1', filterVal: 'streetHZ1' },
            { tHeader: '区频率1', filterVal: 'zoneHZ1' },
            { tHeader: '省频率1', filterVal: 'provincesHZ1' },
            { tHeader: '国外频率1', filterVal: 'abroadHZ1' },
            { tHeader: '村频率2', filterVal: 'villageHZ2' },
            { tHeader: '街道频率2', filterVal: 'streetHZ2' },
            { tHeader: '区频率2', filterVal: 'zoneHZ2' },
            { tHeader: '省频率2', filterVal: 'provincesHZ2' },
            { tHeader: '国外频率2', filterVal: 'abroadHZ2' },
            { tHeader: '接触人数', filterVal: 'ContactNumber' },
            { tHeader: '健康状态', filterVal: 'healthyState' },
            { tHeader: '状态不好理由', filterVal: 'stateReason' },
            { tHeader: '天气', filterVal: 'weather' },
            { tHeader: '普通特殊天', filterVal: 'specialDay' },
            { tHeader: '专业接触', filterVal: 'ProfContact' },
            { tHeader: '专业接触数', filterVal: 'ProfContactNum' },
            { tHeader: '专业接触年龄1', filterVal: 'ProfContactAge1' },
            { tHeader: '专业接触年龄2', filterVal: 'ProfContactAge2' },
            { tHeader: '专业接触年龄3', filterVal: 'ProfContactAge3' },
            { tHeader: '专业接触年龄4', filterVal: 'ProfContactAge4' },
            { tHeader: '专业接触年龄5', filterVal: 'ProfContactAge5' },
            { tHeader: '专业接触年龄不知道', filterVal: 'ProfContactAgeUnknown' },
//            这里有插入
            { tHeader: '是否包含所有接触', filterVal: 'allContacts' },
            { tHeader: '遗漏人数', filterVal: 'missingNum' },
            { tHeader: '接触人记录准确性', filterVal: 'ContactAccuracy' },
            { tHeader: '是否喂养动物', filterVal: 'feedAnimals' },
//            { tHeader: '动物1', filterVal: 'animal1' },
//            { tHeader: '数量1', filterVal: 'animalNum1' },
            { tHeader: '其它动物', filterVal: 'OtherAnimal' },
            { tHeader: '其它动物名称', filterVal: 'OtherAnimalName' },
            { tHeader: '其它动物数量', filterVal: 'OtherAnimalNum' },
//            { tHeader: '日常接触动物1', filterVal: 'DailyContactAnimal' },
//            { tHeader: '日常接触动物频率1', filterVal: 'DailyContactAnimalHZ' },
            { tHeader: '日常接触其它动物', filterVal: 'DailyContactOtherAnimal' },
            { tHeader: '日常接触其它动物名称', filterVal: 'DailyContactOtherAnimalName' },
            { tHeader: '日常接触其它动物频率', filterVal: 'DailyContactOtherAnimalHZ' },
            { tHeader: '接触活的动物', filterVal: 'ContactLiveAnimal' },
//            { tHeader: '接触动物种类1', filterVal: 'ContactAnimalSpecies' }, // 10次循环
//            { tHeader: '接触动物数量1', filterVal: 'ContactNumberOfAnimals' },
//            { tHeader: '接触动物时间1', filterVal: 'ContactAnimalTime' },
//            { tHeader: '接触动物地点1', filterVal: 'ContactAnimalLocation' },
//            { tHeader: '接触动物频率1', filterVal: 'ContactAnimalHZ' },
            { tHeader: '动物接触记录准确性', filterVal: 'ContactAnimalAccuracy' },
            { tHeader: '建议', filterVal: 'suggest' },
          ]
          const allContacts = []
          const allContactsIndex = getIndexInArrayByObject(rowOpt, { tHeader: '是否包含所有接触', filterVal: 'allContacts' })
          for (let i = 0; i < 40; i++) {
            allContacts.push({ tHeader: `接触时间${Number(i) + 1}`, filterVal: `ContactTime${Number(i) + 1}` })
            allContacts.push({ tHeader: `接触者年龄${Number(i) + 1}`, filterVal: `ContactAge${Number(i) + 1}` })
            allContacts.push({ tHeader: `接触者性别${Number(i) + 1}`, filterVal: `ContactSex${Number(i) + 1}` })
            allContacts.push({ tHeader: `接触者关系${Number(i) + 1}`, filterVal: `ContactRelation${Number(i) + 1}` })
            allContacts.push({ tHeader: `接触类型${Number(i) + 1}`, filterVal: `ContactType${Number(i) + 1}` })
            allContacts.push({ tHeader: `接触总时间${Number(i) + 1}`, filterVal: `ContactTotalTime${Number(i) + 1}` })
            allContacts.push({ tHeader: `接触地点${Number(i) + 1}`, filterVal: `ContactLocation${Number(i) + 1}` })
            allContacts.push({ tHeader: `接触频率${Number(i) + 1}`, filterVal: `ContactHZ${Number(i) + 1}` })
            allContacts.push({ tHeader: `提交时间${Number(i) + 1}`, filterVal: `SubmitTime${Number(i) + 1}` })
          }
          rowOpt.splice(allContactsIndex[0], 0, ...allContacts)
          const OtherAnima = []
          const OtherAnimalIndex = getIndexInArrayByObject(rowOpt, { tHeader: '其它动物', filterVal: 'OtherAnimal' })
          for (let i = 0; i < 15; i++) {
            OtherAnima.push({ tHeader: `动物${Number(i) + 1}`, filterVal: `animal${Number(i) + 1}` })
            OtherAnima.push({ tHeader: `数量${Number(i) + 1}`, filterVal: `animalNum${Number(i) + 1}` })
          }
          rowOpt.splice(OtherAnimalIndex[0], 0, ...OtherAnima)
          const DailyContactOtherAnimal = []
          const DailyContactOtherAnimalIndex = getIndexInArrayByObject(rowOpt, { tHeader: '日常接触其它动物', filterVal: 'DailyContactOtherAnimal' })
          for (let i = 0; i < 9; i++) {
            DailyContactOtherAnimal.push({ tHeader: `日常接触动物${Number(i) + 1}`, filterVal: `DailyContactAnimal${Number(i) + 1}` })
            DailyContactOtherAnimal.push({ tHeader: `日常接触动物频率${Number(i) + 1}`, filterVal: `DailyContactAnimalHZ${Number(i) + 1}` })
          }
          rowOpt.splice(DailyContactOtherAnimalIndex[0], 0, ...DailyContactOtherAnimal)
          const ContactAnimalAccuracy = []
          const ContactAnimalAccuracyIndex = getIndexInArrayByObject(rowOpt, { tHeader: '动物接触记录准确性', filterVal: 'ContactAnimalAccuracy' })
          for (let i = 0; i < 10; i++) {
            ContactAnimalAccuracy.push({ tHeader: `接触动物种类${Number(i) + 1}`, filterVal: `ContactAnimalSpecies${Number(i) + 1}` })
            ContactAnimalAccuracy.push({ tHeader: `接触动物数量${Number(i) + 1}`, filterVal: `ContactNumberOfAnimals${Number(i) + 1}` })
            ContactAnimalAccuracy.push({ tHeader: `接触动物时间${Number(i) + 1}`, filterVal: `ContactAnimalTime${Number(i) + 1}` })
            ContactAnimalAccuracy.push({ tHeader: `接触动物地点${Number(i) + 1}`, filterVal: `ContactAnimalLocation${Number(i) + 1}` })
            ContactAnimalAccuracy.push({ tHeader: `接触动物频率${Number(i) + 1}`, filterVal: `ContactAnimalHZ${Number(i) + 1}` })
          }
          rowOpt.splice(ContactAnimalAccuracyIndex[0], 0, ...ContactAnimalAccuracy)
          const IDArr = this.list.map((item) => {
            return item.id
          })
          const actoridArr = this.list.map((item) => {
            return item.actorid || ''
          })
          const tHeader = rowOpt.map((item) => {
            return item.tHeader
          })
          const filterVal = rowOpt.map((item) => {
            return item.filterVal
          })
          const locanswerArr = this.list.map((item, i) => {
            let locanswer = item.locanswer
            if (isJSON(locanswer)) {
              locanswer = JSON.parse(locanswer)
              return locanswer
            } else {
              console.log(`用户id为${IDArr[i]}，接触中日志数据格式不对，可能会影响Excel的下载`)
            }
          })
          const answerlogArr = this.list.map((item, i) => {
            let answerlog = item.answerlog
            if (isJSON(answerlog)) {
              answerlog = JSON.parse(answerlog)
              return answerlog
            } else {
              console.log(`用户id为${IDArr[i]}，接触中日志数据格式不对，可能会影响Excel的下载`)
              return []
            }
          })
          const resultArr1 = []
          const resultArr2 = []
          for (const i in locanswerArr) {
            const item = locanswerArr[i]
            const result = {}
            item.forEach((node, j) => {
              result.index = Number(i) + 1
              result.userID = IDArr[i]
              result.actorid = actoridArr[i]
              switch (node.id) {
                case 1: {
                  result.age = node.answer
                  break
                }
                case 2: {
                  result.sex = node.answer || ''
                  break
                }
                case 3: {
                  result.workStatus = node.answer || ''
                  break
                }
                case 4: {
                  node.answer = node.answer || ''
                  if (node.answer.indexOf('其他') > -1) {
                    result.workType = '其他'
                    result.otherWorkType = node.answer.split(':')[1] || ''
                  } else {
                    result.workType = node.answer || ''
                    result.otherWorkType = ''
                  }
                  break
                }
                case 5: {
                  if (node.answer.indexOf('其他') > -1) {
                    result.education = '其他'
                    result.otherEducation = node.answer.split(':')[1] || ''
                  } else {
                    result.education = node.answer || ''
                    result.otherEducation = ''
                  }
                  break
                }
                case 6: {
                  result.incomeType = node.answer.type || ''
                  result.income = node.answer.scope || ''
                  break
                }
                case 7: {
                  result.LivingYears = node.answer || ''
                  break
                }
                case 8: {
                  node.answer.type = node.answer.type || ''
                  if (node.answer.type.indexOf('其他') > -1) {
                    result.LivingType = '其他'
                    result.otherType = node.answer.type.split(':')[1] || ''
                  } else {
                    result.LivingType = node.answer.type || ''
                    result.otherType = ''
                  }
                  result.WithNumber = node.answer.num
                  break
                }
                case 9: {
                  node.answer.forEach((item, index) => {
                    result[`LivingAge${index + 1}`] = item.age
                    result[`LivingSex${index + 1}`] = item.sex
                    if (item.relation) {
                      if (item.relation.indexOf('其他') > -1) {
                        result[`LivingRelation${index + 1}`] = '其他'
                        result[`otherRelation${index + 1}`] = item.relation.split(':')[item.relation.split(':').length - 1] || ''
                      } else {
                        result[`LivingRelation${index + 1}`] = item.relation
                        result[`otherRelation${index + 1}`] = ''
                      }
                    } else {
                      result[`LivingRelation${index + 1}`] = ''
                      result[`otherRelation${index + 1}`] = ''
                    }
                  })
                  break
                }
                case 10: {
                  node.answer.forEach((item, index) => {
                    item.scope = item.scope.replace('\\', '')
                    if (item.scopeIndex || Number(item.scopeIndex) === 0) {
                      switch (Number(item.scopeIndex)) {
                        case 0: {
                          result.villageHZ1 = item.hz
                          break
                        }
                        case 1: {
                          result.streetHZ1 = item.hz
                          break
                        }
                        case 2: {
                          result.zoneHZ1 = item.hz
                          break
                        }
                        case 3: {
                          result.provincesHZ1 = item.hz
                          break
                        }
                        case 4: {
                          result.abroadHZ1 = item.hz
                          break
                        }
                        default:
                          this.$message({ message: `id为10的{scope:${item.scope}}数据格式不对，可能会影响Excel的下载`, type: 'warning' })
                          console.log(`用户id为${IDArr[i]}，题目id为10的{scope:${item.scope}}数据格式不对，可能会影响Excel的下载`)
                      }
                    } else {
                      switch (item.scope) {
                        case '村以外': {
                          result.villageHZ1 = item.hz
                          break
                        }
                        case '街道/乡镇以外': {
                          result.streetHZ1 = item.hz
                          break
                        }
                        case '区/县以外': {
                          result.zoneHZ1 = item.hz
                          break
                        }
                        case '省/市以外': {
                          result.provincesHZ1 = item.hz
                          break
                        }
                        case '国外': {
                          result.abroadHZ1 = item.hz
                          break
                        }
                        case 'Outside Village': {
                          result.villageHZ1 = item.hz
                          break
                        }
                        case 'Outside Town': {
                          result.streetHZ1 = item.hz
                          break
                        }
                        case 'Outside District/County': {
                          result.zoneHZ1 = item.hz
                          break
                        }
                        case 'Outside City/Province': {
                          result.provincesHZ1 = item.hz
                          break
                        }
                        case 'Abroad': {
                          result.abroadHZ1 = item.hz
                          break
                        }
                        default:
                          this.$message({ message: `id为10的{scope:${item.scope}}数据格式不对，可能会影响Excel的下载`, type: 'warning' })
                          console.log(`用户id为${IDArr[i]}，题目id为10的{scope:${item.scope}}数据格式不对，可能会影响Excel的下载`)
                      }
                    }
                  })
                  break
                }
                case 11: {
                  node.answer.forEach((item, index) => {
                    item.scope = item.scope.replace('\\', '')
                    if (item.scopeIndex || Number(item.scopeIndex) === 0) {
                      switch (Number(item.scopeIndex)) {
                        case 0: {
                          result.villageHZ2 = item.hz || ''
                          break
                        }
                        case 1: {
                          result.streetHZ2 = item.hz || ''
                          break
                        }
                        case 2: {
                          result.zoneHZ2 = item.hz || ''
                          break
                        }
                        case 3: {
                          result.provincesHZ2 = item.hz || ''
                          break
                        }
                        case 4: {
                          result.abroadHZ2 = item.hz || ''
                          break
                        }
                        default:
                          this.$message({ message: `id为11的{scope:${item.scope}}数据格式不对，可能会影响Excel的下载`, type: 'warning' })
                          console.log(`用户id为${IDArr[i]}，题目id为11的{scope:${item.scope}}数据格式不对，可能会影响Excel的下载`)
                      }
                    } else {
                      switch (item.scope) {
                        case '村以外': {
                          result.villageHZ2 = item.hz || ''
                          break
                        }
                        case 'Outside Village': {
                          result.villageHZ2 = item.hz || ''
                          break
                        }
                        case '街道/乡镇以外': {
                          result.streetHZ2 = item.hz || ''
                          break
                        }
                        case 'Outside Town': {
                          result.streetHZ2 = item.hz || ''
                          break
                        }
                        case '区/县以外': {
                          result.zoneHZ2 = item.hz || ''
                          break
                        }
                        case 'Outside District/County': {
                          result.zoneHZ2 = item.hz || ''
                          break
                        }
                        case '省/市以外': {
                          result.provincesHZ2 = item.hz || ''
                          break
                        }
                        case 'Outside City/Province': {
                          result.provincesHZ2 = item.hz || ''
                          break
                        }
                        case '国外': {
                          result.abroadHZ2 = item.hz || ''
                          break
                        }
                        case 'Abroad': {
                          result.abroadHZ2 = item.hz || ''
                          break
                        }
                        default:
                          this.$message({ message: `id为11的{scope:${item.scope}}数据格式不对，可能会影响Excel的下载`, type: 'warning' })
                          console.log(`用户id为${IDArr[i]}，题目id为11的{scope:${item.scope}}数据格式不对，可能会影响Excel的下载`)
                      }
                    }
                  })
                  break
                }
                case 12: {
                  result.ContactNumber = node.answer || ''
                  break
                }
                case 13: {
                  result.healthyState = node.answer.grade || ''
                  result.stateReason = node.answer.reson || ''
                  break
                }
                case 14: {
                  result.weather = node.answer || ''
                  break
                }
                case 15: {
                  result.specialDay = node.answer || ''
                  break
                }
                default:
                  this.$message({ message: `用户id为${IDArr[i]}的数据格式不对，可能会影响Excel的下载`, type: 'warning' })
                  console.log(`用户id为${IDArr[i]}的数据格式不对，可能会影响Excel的下载`)
              }
            })
            resultArr1.push(result)
          }
          for (const i in answerlogArr) {
            const item = answerlogArr[i]
            const result = {}
            item.forEach((node, j) => {
              switch (node.id) {
                case 1: {
                  result.ProfContact = node.answer || ''
                  break
                }
                case 2: {
                  result.ProfContactNum = node.answer || ''
                  break
                }
                case 3: {
                  node.answer.forEach((item, i) => {
                    if (item.index === 5) {
                      result[`ProfContactAgeUnknown`] = item.age
                    } else {
                      result[`ProfContactAge${item.index + 1}`] = item.age
                    }
                  })
                  break
                }
                case 4: {
                  node.answer.forEach((item, i) => {
                    result[`ContactTime${Number(i) + 1}`] = item.cTime || ''
                    result[`ContactAge${Number(i) + 1}`] = (item.age || item.age === 0) ? item.age : ''
                    result[`ContactSex${Number(i) + 1}`] = item.sex || ''
                    result[`ContactRelation${Number(i) + 1}`] = item.relation || ''
                    result[`ContactType${Number(i) + 1}`] = item.contactType || ''
                    result[`ContactTotalTime${Number(i) + 1}`] = item.contacttime ? item.contacttime.replace('&gt;', '>') || '' : ''
                    result[`ContactLocation${Number(i) + 1}`] = item.contactLocation || ''
                    result[`ContactHZ${Number(i) + 1}`] = item.contactHz || ''
                    result[`SubmitTime${Number(i) + 1}`] = parseTime(item.submitTime, '{y}-{m}-{d} {h}:{i}') || ''
                  })
                  break
                }
                case 5: {
                  if (node.answer.index === 1) {
                    result.allContacts = '否'
                    result.missingNum = node.answer.num || ''
                  } else {
                    result.allContacts = '是'
                    result.missingNum = ''
                  }
                  break
                }
                case 6: {
                  result.ContactAccuracy = node.answer || ''
                  break
                }
                case 7: {
                  result.feedAnimals = node.answer || ''
                  break
                }
                case 8: {
                  node.answer.forEach((item, i) => {
                    if (item.type === '其他' || item.type === 'Others') {
                      result.OtherAnimal = '是'
                      result.OtherAnimalName = item.name || ''
                      result.OtherAnimalNum = item.num || ''
                    } else {
                      result[`animal${Number(i) + 1}`] = item.type || ''
                      result[`animalNum${Number(i) + 1}`] = item.num || ''
                      result.OtherAnimal = ''
                    }
                  })
                  break
                }
                case 9: {
                  node.answer.forEach((item, i) => {
                    if (item.type === '其他' || item.type === 'Others') {
                      result.DailyContactOtherAnimal = '是'
                      result.DailyContactOtherAnimalName = item.name || ''
                      result.DailyContactOtherAnimalHZ = item.hz || ''
                    } else {
                      result[`DailyContactAnimal${Number(i) + 1}`] = item.type || ''
                      result[`DailyContactAnimalHZ${Number(i) + 1}`] = item.hz || ''
                      result.DailyContactOtherAnimal = ''
                    }
                  })
                  break
                }
                case 10: {
                  result.ContactLiveAnimal = node.answer || ''
                  break
                }
                case 11: {
                  node.answer.forEach((item, i) => {
                    result[`ContactAnimalSpecies${Number(i) + 1}`] = item.type || ''
                    result[`ContactNumberOfAnimals${Number(i) + 1}`] = item.num || ''
                    result[`ContactAnimalTime${Number(i) + 1}`] = item.contacttime || ''
                    result[`ContactAnimalLocation${Number(i) + 1}`] = item.contactLocation || ''
                    result[`ContactAnimalHZ${Number(i) + 1}`] = item.contactHz || ''
                  })
                  break
                }
                case 12: {
                  result.ContactAnimalAccuracy = node.answer || ''
                  break
                }
                case 13: {
                  result.suggest = node.answer || ''
                  break
                }
                default:
                  this.$message({ message: `用户id为${IDArr[i]}的数据格式不对，可能会影响Excel的下载`, type: 'warning' })
                  console.log(`用户id为${IDArr[i]}的数据格式不对，可能会影响Excel的下载`)
              }
            })
            resultArr2.push(result)
          }
          const resultArrAll = resultArr1.map((item, index) => {
            return Object.assign(item, resultArr2[index])
          })
          const data = this.formatJson(filterVal, resultArrAll)
          export_json_to_excel(tHeader, data, '根据题目导出数据')
        })
      },
      handleBatchDownloadByGetLocalLog(sig) {
        const IDArr = this.list.map((item) => {
          return item.id
        })
        switch (sig) {
          case 1: {
            this.list.map((item, index) => {
              const DATA = JSON.parse(item.locanswer)
              for (const i in DATA) {
                const node = DATA[i]
                node.question = this.$t('basicInfoQuestions.q' + (node.id))
              }
              this.LocationInformationDownload(DATA, IDArr[index], sig)
            })
            break
          }
          case 3: {
            Promise.all(this.list.map((item) => {
              return this.$http.get('/getLocalLog', { params: { phoneid: item.phoneinfo, id: item.id, start: 0 }})
            })).then((res) => {
              for (const i in res) {
                const node = res[i]
                const DATA = node.data.data
                this.LocationInformationDownload(DATA, IDArr[i], sig)
              }
            }).catch((err) => {
              this.$message.error(`错误信息：${err}`)
            })
            break
          }
          default:
            this.$message.error(`错误信息：下载失败`)
        }
      },
      LocationInformationDownload(DATA, userId, sig) {
        require.ensure([], () => {
          const { export_json_to_excel } = require('vendor/Export2Excel')
          switch (sig) {
            case 1: {
              const tHeader = ['题号', '题目', '答案']
              const filterVal = ['id', 'question', 'answer']
              const basicListArr = DATA
              const resultArr = []
              for (const i in basicListArr) {
                const node = JSON.parse(JSON.stringify(basicListArr[i]))
                const id = node.id
                let answer = node.answer
                if (typeof (answer) === 'object') {
                  answer = JSON.parse(JSON.stringify(node.answer))
                }
                let answerStr = ''
                if (answer) {
                  switch (id) {
                    case 6: {
                      answerStr = `${answer.type || ''}:${answer.scope || ''}`
                      break
                    }
                    case 8: {
                      answerStr = `同住人数：${(answer.num || answer.num === 0) ? answer.num : ''}；\r\n同住类型：${answer.type || ''}`
                      break
                    }
                    case 9: {
                      for (const i in answer) {
                        const node = answer[i]
                        answerStr += `年龄：${(node.age || node.age === 0) ? node.age : ''}；性别：${node.sex || ''}; 关系：${node.relation || ''}\r\n`
                      }
                      break
                    }
                    case 10: {
                      for (const i in answer) {
                        const node = answer[i]
                        answerStr += `范围：${node.scope || ''}；频率：${node.hz || ''}\r\n`
                      }
                      break
                    }
                    case 11: {
                      for (const i in answer) {
                        const node = answer[i]
                        answerStr += `范围：${node.scope || ''}；频率：${node.hz || ''}\r\n`
                      }
                      break
                    }
                    case 13: {
                      answerStr = `分数：${(answer.grade || answer.grade === 0) ? answer.grade : ''}；\r\n 理由：${answer.reson || ''}`
                      break
                    }
                    default:
                      answerStr = answer.toString()
                  }
                } else {
                  answerStr = `未填写`
                }
                resultArr.push({
                  id: node.id,
                  question: node.question,
                  answer: answerStr,
                })
              }
              const data = this.formatJson(filterVal, resultArr)
              export_json_to_excel(tHeader, data, `基本信息填写问卷信息-${userId}`)
              break
            }
            case 2: {
              const tHeader2 = ['题号', '题目', '答案', '提交时间']
              const filterVal2 = ['id', 'question', 'answer', 'submitTime']
              const logListArr = DATA
              const resultArr = []
              for (const i in logListArr) {
                const node = JSON.parse(JSON.stringify(logListArr[i]))
                const id = node.id
                const answer = node.answer
                let answerStr = ''
                if (answer) {
                  switch (id) {
                    case 4:
                      for (const i in answer) {
                        const node = answer[i]
                        answerStr += `年龄：${(node.age || node.age === 0) ? node.age : ''}；性别：${node.sex || ''}；接触时间：${node.cTime || ''}；关系：${node.relation || ''}；接触类型：${node.contactType || ''}；总时间：${node.contacttime || ''}；接触地点：${node.contactLocation || ''}；平时的接触频率:${node.contactHz || ''}；提交时间:${node.submitTime || ''}\r\n`
                      }
                      break
                    case 5:
                      if (answer.state === '是') {
                        answerStr = node.num || ''
                      } else {
                        answerStr = `估计遗漏数量：${node.num || ''}`
                      }
                      break
                    case 8:
                      answerStr = `种类：${node.type || ''}；数量：${node.num || ''}`
                      break
                    case 9:
                      for (const i in answer) {
                        const node = answer[i]
                        answerStr += `种类：${node.type || ''}；频率：${node.hz || ''}\r\n`
                      }
                      break
                    case 11:
                      for (const i in answer) {
                        const node = answer[i]
                        answerStr += `动物种类：${node.type || ''}；数量：${node.num || ''}；接触时间：${node.contacttime || ''}；接触地点：${node.contactLocation || ''}；\r\n`
                      }
                      break
                    default:
                      answerStr = answer.toString()
                  }
                } else {
                  answerStr = `未填写`
                }
                resultArr.push({
                  id: node.id,
                  question: node.question,
                  answer: answerStr,
                  submitTime: node.submitTime,
                })
              }
              const data2 = this.formatJson(filterVal2, resultArr)
              export_json_to_excel(tHeader2, data2, `接触日志填写问卷信息-${userId}`)
              break
            }
            case 3: {
              const tHeader3 = ['INDEX', 'DATE', 'TIME', 'LATITUDE', 'LONGITUDE']
              const filterVal3 = ['index', 'date1', 'date2', 'lat', 'lon']
              const localLogListArr = DATA
              const resultArr = []
              for (const i in localLogListArr) {
                const node = JSON.parse(JSON.stringify(localLogListArr[i]))
                node.locationlog = JSON.parse(node.locationlog)
                resultArr.push({
                  index: Number(i) + 1,
                  date1: node.nowtime ? this.fomentDateYMD(node.nowtime) : `无`,
                  date2: node.nowtime ? this.fomentDateHIS(node.nowtime) : `无`,
                  lon: node.locationlog.lon,
                  lat: node.locationlog.lat
                })
              }
              const data3 = this.formatJson(filterVal3, resultArr)
              export_json_to_excel(tHeader3, data3, `定位数据记录信息-${userId}`)
              break
            }
            default: {
              this.$message.error(`错误信息：生成表格失败，错误的参数`)
            }
          }
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'registertime' || j === 'touchlog' || j === 'locationstarttime' || j === 'locationendtime') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
      },
      fomentDateYMD(value) {
        if (value) {
          const date = new Date(value)
          const formatObj = {
            y: date.getFullYear(),
            m: date.getMonth() + 1,
            d: date.getDate().toString().length > 1 ? date.getDate() : `0${date.getDate()}`,
            h: date.getHours().toString().length > 1 ? date.getHours() : `0${date.getHours()}`,
            i: date.getMinutes().toString().length > 1 ? date.getMinutes() : `0${date.getMinutes()}`,
            s: date.getSeconds().toString().length > 1 ? date.getSeconds() : `0${date.getSeconds()}`,
          }
          return `${formatObj.y}${formatObj.m}${formatObj.d}`
        } else {
          return `无`
        }
      },
      fomentDateHIS(value) {
        if (value) {
          const date = new Date(value)
          const formatObj = {
            y: date.getFullYear(),
            m: date.getMonth() + 1,
            d: date.getDate().toString().length > 1 ? date.getDate() : `0${date.getDate()}`,
            h: date.getHours().toString().length > 1 ? date.getHours() : `0${date.getHours()}`,
            i: date.getMinutes().toString().length > 1 ? date.getMinutes() : `0${date.getMinutes()}`,
            s: date.getSeconds().toString().length > 1 ? date.getSeconds() : `0${date.getSeconds()}`,
          }
          return `${formatObj.h}${formatObj.i}${formatObj.s}`
        } else {
          return `无`
        }
      },
      setSessionStorage(row) {
        sessionStorage.setItem('userInfoForm', JSON.stringify(row))
      }
    }
  }
</script>
<style lang="less" scoped>
  .filter-item{
    float: left;
    margin-right: 15px;
  }
  .filter-date{
    float: left;
  }
  table{
    .inlineBlock{
      color: blue;
      &:hover{
        color: red;
      }
    }
  }
</style>
