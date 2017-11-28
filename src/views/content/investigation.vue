<template>
  <div class="app-container">
    <div class="wrapper">
      <div class="components-container">
        <p>研究介绍富文本</p>
        <div>
          <div class="typeFilter">
            <template>
              <el-radio v-model="language" label="1">中文</el-radio>
              <el-radio v-model="language" label="2">英文</el-radio>
            </template>
          </div>
          <tinymce :height='200' v-model="content"></tinymce>
          <div class="btn-save"><el-button type="primary" @click="save()">保存</el-button></div>
        </div>
        <div class="preview-con">
          <p class="preview-title">实时预览</p>
          <div class='editor-content' v-html='content'></div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  import Tinymce from '@/components/Tinymce'
  import Qs from 'qs'
  import Cookies from 'js-cookie'

  export default {
    components: { Tinymce },
    data() {
      return {
        contentObj: {},
        content: '',
        contentId: '',
        language: '1',
        contentType: 1
      }
    },
    created() {
      this.getContent()
    },
    methods: {
      save() {
        const opt = {
          crowd: 0,
          type: this.contentType,
          language: this.getLang(),
          content: this.content,
          id: this.contentId
        }
        this.$http({
          method: 'post',
          url: '/updateContent',
          data: Qs.stringify(opt)
        }).then(response => {
          this.$notify({
            title: '成功',
            message: '保存成功',
            type: 'success',
            duration: 2000
          })
          this.getContent()
        }, response => {
          console.log('失败：' + response)
        })
      },
      getContent() {
        const opt = {
          crowd: 0,
          type: this.contentType,
          language: this.language
        }
        this.$http.get('/getContent', { params: opt }).then(response => {
          const contentObj = response.data.data[0]
          this.contentObj = contentObj
          this.content = contentObj.content
          this.contentId = contentObj.id
        }, response => {
          console.log('失败：' + response)
        })
      },
      getLang() {
        if (Cookies.get('lang') === 'zh') {
          return 1
        } else {
          return 2
        }
      }
    },
    watch: {
      language() {
        this.getContent()
      }
    }
  }
</script>

<style lang="less" scoped>
  .wrapper{
    width: 100%;
    margin: 30px auto;
    .editor-content{
      padding: 10px;
      background-color: #eef1f6;
    }
    .btn-save{
      margin: 10px 0;
      float: right;
    }
    .typeFilter{margin: 10px 0;}
  }
  .editor-content{
  }

</style>
