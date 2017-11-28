<template>
  <div class="app-container calendar-list-container">
    <div class="el-table-container"></div>
    <div class="filter-container">
      <el-button v-if="ad_level.indexOf('1')>-1" class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column align="center" :label="$t('utils.id')" width="65">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('userManagement.level')" width="120">
        <template scope="scope">
          <span>{{scope.row.ad_level==1?'一级':'二级'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('userManagement.username')" width="120">
        <template scope="scope">
          <span>{{scope.row.ad_name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('userManagement.rel_name')" width="120">
        <template scope="scope">
          <span>{{scope.row.rel_name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('utils.creattime')" >
        <template scope="scope">
          <span>{{scope.row.creattime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('utils.handle')" width="200">
        <template scope="scope">
          <el-button v-if="ad_level.indexOf('1')>-1" size="small" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button v-if="ad_level.indexOf('1')>-1" size="small" type="danger" @click="handleDeleted(scope.row,'deleted')">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form class="small-space" :model="temp" :rules="rules" ref="user-dialogForm" label-position="left" label-width="100px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="级别">
          <el-select class="filter-item" v-model="temp.ad_level" prop="ad_level" placeholder="请选择">
            <el-option v-for="item in  leveOptions" :key="item.key" :label="item.display_name" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="用户名" prop="ad_name">
          <el-input v-model="temp.ad_name"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="rel_name">
          <el-input v-model="temp.rel_name"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="ad_pwd">
          <el-input v-model="temp.ad_pwd"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('user-dialogForm')">确 定</el-button>
        <el-button v-if="dialogStatus=='update'" type="primary" @click="update('user-dialogForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import waves from '@/directive/waves/index' // 水波纹指令
  import { parseTime } from '@/utils'
  import Qs from 'qs'
  import { mapGetters } from 'vuex'
  export default {
    name: 'table_demo',
    directives: {
      waves
    },
    data() {
      return {
        list: [],
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
        user: {},
        temp: {
          id: undefined,
          ad_level: '',
          ad_name: '',
          rel_name: '',
          ad_pwd: ''
        },
        rules: {
          ad_level: [
            { required: true, message: '请选择账号级别', trigger: 'blur' }
          ],
          ad_name: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
          ],
          rel_name: [
            { required: true, message: '请输入真实姓名', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
          ],
          ad_pwd: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
          ]
        },
        importanceOptions: [1, 2, 3],
        leveOptions: [
          { key: '1', display_name: '1' },
          { key: '2', display_name: '2' }
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
    created() {
      this.getList()
    },
    computed: {
      ...mapGetters([
        'roles',
        'ad_level'
      ])
    },
    methods: {
      getList() {
        this.listLoading = true
        this.listLoading = false
        this.$http.get('/getAdminUser').then(response => {
          this.listLoading = false
          for (const i in response.data.data) {
            const node = response.data.data[i]
            node.creattime = new Date(node.creattime).getTime()
          }
          this.list = response.data.data
        }, response => {
          this.listLoading = false
          console.log('失败：' + response)
        })
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
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },
      handleUpdate(row) {
        this.temp = Object.assign({}, row)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        console.log(this.temp)
      },
      handleDeleted(row) {
        const id = row.id
        this.$alert(this.$t('utils.deleteThis'), '', {
          confirmButtonText: this.$t('utils.confirm'),
          callback: action => {
            if (action === 'confirm') {
              this.deleted(id)
            } else {
              return false
            }
          }
        })
      },
      create(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const opt = this.temp
            this.$http({
              method: 'POST',
              url: '/addAdminUser',
              data: Qs.stringify(opt)
            }).then(response => {
              const res = response.data
              if (res.status) {
                this.getList()
//              this.list.unshift(this.temp)
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
                })
              } else {
                this.$alert(res.msg, '', {
                  confirmButtonText: this.$t('utils.confirm')
                })
              }
            }, response => {
              console.log('失败：' + response)
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      update(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const opt = this.temp
            this.$http({
              method: 'POST',
              url: '/addAdminUser',
              data: Qs.stringify(opt)
            }).then(response => {
              const res = response.data
              if (res.status) {
                this.getList()
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: '更新成功',
                  type: 'success',
                  duration: 2000
                })
              } else {
                this.$alert(res.msg, '', {
                  confirmButtonText: this.$t('utils.confirm')
                })
              }
            }, response => {
              console.log('失败：' + response)
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      deleted(id) {
        const opt = { id }
        this.$http({
          method: 'POST',
          url: '/deleteAdminUser',
          data: Qs.stringify(opt)
        }).then(response => {
          const res = response.data
          if (res.status) {
            this.getList()
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
          } else {
            this.$alert(res.msg, '', {
              confirmButtonText: this.$t('utils.confirm')
            })
          }
        }, response => {
          console.log('失败：' + response)
        })
      },
      resetTemp() {
        this.temp = {
          id: undefined,
          ad_level: '',
          ad_name: '',
          rel_name: '',
          ad_pwd: ''
        }
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
  .el-table-container{
    table{
      tr{

      }
    }
  }
</style>
