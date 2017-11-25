<template>
  <div class="app-container calendar-list-container">
    <div class="userInfo-container">
      <span>用户ID： {{userInfoFormId}}</span>
    </div>
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="标题" v-model="listQuery.title">
      </el-input>

      <el-select clearable style="width: 90px" class="filter-item" v-model="listQuery.importance" placeholder="重要性">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>

      <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.type" placeholder="人群类型">
        <el-option v-for="item in  calendarTypeOptions" :key="item.key" :label="$t(item.display_name)" :value="item.key">
        </el-option>
      </el-select>

      <el-select @change='handleFilter' style="width: 120px" class="filter-item" v-model="listQuery.sort" placeholder="排序">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key">
        </el-option>
      </el-select>

      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="primary" icon="document" @click="handleDownload">导出</el-button>
    </div>
    <div class="el-table-container">
      <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">
        <el-table-column align="center" :label="'题号'" width="65">
          <template scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="'题目'">
          <template scope="scope">
            <span>{{scope.row.assign}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" :label="'答案'" >
          <template scope="scope">
            <span>{{scope.row.basicInfoTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="'提交答案时间'" >
          <template scope="scope">
            <span>{{scope.row.logTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { fetchList } from '@/api/article'
import waves from '@/directive/waves/index' // 水波纹指令
import { parseTime } from '@/utils'

Vue.use(VueI18n)
const list = [
  {
    id: 1,
    assign: 0,
    basicInfoTime: new Date().getTime() + 1256,
    logTime: new Date().getTime() + 25475,
    participantId: 5555,
    locationStart: new Date().getTime() + 25475,
    locationEnd: new Date().getTime() + 25475
  },
  {
    id: 2,
    assign: 1,
    basicInfoTime: new Date().getTime() + 1256,
    logTime: new Date().getTime() + 25475,
    participantId: 5555,
    locationStart: new Date().getTime() + 25475,
    locationEnd: new Date().getTime() + 25475
  },
  {
    id: 3,
    assign: 0,
    basicInfoTime: new Date().getTime() + 1256,
    logTime: new Date().getTime() + 25475,
    participantId: 5555,
    locationStart: new Date().getTime() + 25475,
    locationEnd: new Date().getTime() + 25475
  },
  {
    id: 4,
    assign: 1,
    basicInfoTime: new Date().getTime() + 1256,
    logTime: new Date().getTime() + 25475,
    participantId: 5555,
    locationStart: new Date().getTime() + 25475,
    locationEnd: new Date().getTime() + 25475
  },
  {
    id: 5,
    assign: 1,
    basicInfoTime: new Date().getTime() + 1256,
    logTime: new Date().getTime() + 25475,
    participantId: 5555,
    locationStart: new Date().getTime() + 25475,
    locationEnd: new Date().getTime() + 25475
  }
]
export default {
  name: 'table_demo',
  directives: {
    waves
  },
  data() {
    return {
      list: [],
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
      tableKey: 0
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
      this.getList(this.userInfoFormId)
    } else {
      this.$router.push({
        path: '/userManagement/index'
      })
    }
  },
  methods: {
    getList(id) {
      this.listLoading = true
      this.listLoading = false
//      fetchList(this.listQuery).then(response => {
//        this.list = response.data.items
//        this.total = response.data.total
//        this.listLoading = false
//      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    timeFilter(time) {
      if (!time[0]) {
        this.listQuery.start = undefined
        this.listQuery.end = undefined
        return
      }
      this.listQuery.start = parseInt(+time[0] / 1000)
      this.listQuery.end = parseInt((+time[1] + 3600 * 1000 * 24) / 1000)
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    update() {
      this.temp.timestamp = +this.temp.timestamp
      for (const v of this.list) {
        if (v.id === this.temp.id) {
          const index = this.list.indexOf(v)
          this.list.splice(index, 1, this.temp)
          break
        }
      }
      this.dialogFormVisible = false
      this.$notify({
        title: '成功',
        message: '更新成功',
        type: 'success',
        duration: 2000
      })
    },
    handleDownload() {
      require.ensure([], () => {
        const { export_json_to_excel } = require('vendor/Export2Excel')
        const tHeader = ['序号', '是否指定人群', '基本信息填写时间', '提交接触日志时间', '参与者ID', '定位开始时间', '定位结束时间']
        const filterVal = ['id', 'assign', 'basicInfoTime', 'logTime', 'participantId', 'locationStart', 'locationEnd']
        const data = this.formatJson(filterVal, this.list)
        export_json_to_excel(tHeader, data, 'table数据')
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
   table{
     tr{

     }
   }
 }
</style>
