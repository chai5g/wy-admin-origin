<template>
  <div class="divBox">
    <el-card class="box-card">
      <div class="components-container">
        <el-form ref="pram" label-width="150px" :model="pram">
          <el-form-item label="序号" prop="title"
                        :rules="[{required:true, message:'请填写标题', trigger:['blur','change']}]"
          >
            <el-input v-model="pram.title" placeholder="标题" maxlength="100"/>
          </el-form-item>
          <el-form-item label="客户" prop="author"
                        :rules="[{required:true, message:'请填作者', trigger:['blur','change']}]"
          >
            <el-input v-model="pram.author" placeholder="作者" maxlength="20"/>
          </el-form-item>
          <el-form-item label="小区" prop="author"
                        :rules="[{required:true, message:'请填作者', trigger:['blur','change']}]"
          >
            <el-radio-group v-model="pram.isAll">
              <el-radio label="1">全部小区</el-radio>
              <el-radio label="0">限定小区</el-radio>
            </el-radio-group>
          </el-form-item>


          <el-form-item label="分段收费">
            <el-form ref="form"  >
              <div v-for="(item,key) of pram.sectionaCharge"
                   style="border: 1px dashed #cccccc;padding: 10px;margin-top: 10px;display: flex;justify-content: space-between"
              >
                <div style="display: flex;width: 100%;gap: 10px">
                  <el-form-item label="小区名称">
                    <el-input v-model="pram.sectionaCharge[key].name" placeholder="请输入小区名称"/>
                  </el-form-item>
                  <el-form-item label="小区地址">
                    <el-cascader
                        v-model="pram.sectionaCharge[key].province"
                        :options="provinceOptions"
                        placeholder="请选择省市区"
                    ></el-cascader>
                  </el-form-item>
                  <el-form-item label="小区详细地址" prop="firstMin">
                    <el-input v-model="pram.sectionaCharge[key].detailAddress" placeholder="请输入小区详细地址"/>
                  </el-form-item>
                </div>
                <div>
                  <el-button type="text" style="color: #7a0003;margin-top: 30px" @click="pram.sectionaCharge.splice(key,1)">删除
                  </el-button>
                </div>

              </div>
            </el-form>
            <el-button style="width: 100%;margin-top: 10px" type="primary"
                       @click='pram.sectionaCharge.push({ firstMin: "", money: "" })'
            >新增
            </el-button>
          </el-form-item>


          <el-form-item label="域名地址" :rules="[{required:true, message:'请选择分类', trigger:['blur','change']}]">
            <el-input v-model="pram.synopsis" maxlength="50" :rows="2" resize="none" placeholder="小程序名称"/>
          </el-form-item>

          <el-form-item label="小程序名称" prop="synopsis"
                        :rules="[{required:true, message:'请填写小程序名称', trigger:['blur','change']}]"
          >
            <el-input v-model="pram.synopsis" maxlength="50" :rows="2" resize="none" placeholder="小程序名称"/>
          </el-form-item>
          <el-form-item label="小程序LOGO" prop="imageInput"
                        :rules="[{ required: true, message: '请上传图文封面', trigger: 'change' }]"
          >
            <div class="upLoadPicBox" @click="modalPicTap('1')">
              <div v-if="pram.imageInput" class="pictrue"><img :src="pram.imageInput"></div>
              <div v-else class="upLoad">
                <i class="el-icon-camera cameraIconfont"/>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="联系方式" prop="imageInput"
                        :rules="[{ required: true, message: '请上传图文封面', trigger: 'change' }]"
          >
            <div class="upLoadPicBox" @click="modalPicTap('1')">
              <div v-if="pram.imageInput" class="pictrue"><img :src="pram.imageInput"></div>
              <div v-else class="upLoad">
                <i class="el-icon-camera cameraIconfont"/>
              </div>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="loading" @click="handerSubmit('pram')"
                       v-hasPermi="['admin:article:update']"
            >保存
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce/index'
import * as categoryApi from '@/api/categoryApi.js'
import * as articleApi from '@/api/article.js'
import { getToken } from '@/utils/auth'
import { Debounce } from '@/utils/validate'

export default {
  // name: "edit",
  components: { Tinymce },
  data() {
    return {
      loading: false,
      constants: this.$constants,
      categoryTreeData: [],
      categoryProps: {
        value: 'id',
        label: 'name',
        children: 'child',
        expandTrigger: 'hover',
        checkStrictly: true,
        emitPath: false
      },
      pram: {
        author: null,
        cid: null,
        content: '', //<span>My Document\'s Title</span>
        imageInput: '',
        isBanner: false,
        isHot: null,
        shareSynopsis: null,
        shareTitle: null,
        sort: 0,
        synopsis: null,
        title: null,
        url: null,
        id: null,
        // mediaId: null
        sectionaCharge: [
          {
            detailAddress: '',
            name: '',
            province: '',
          }
        ]
      },
      editData: {},
      myHeaders: { 'X-Token': getToken() },
      editorContentLaebl: '',
      provinceOptions: [
        {
          value: 'zhinan',
          label: '指南',
          children: [
            {
              value: 'shejiyuanze',
              label: '设计原则',
              children: [
                {
                  value: 'yizhi',
                  label: '一致'
                },
                {
                  value: 'fankui',
                  label: '反馈'
                },
                {
                  value: 'xiaolv',
                  label: '效率'
                },
                {
                  value: 'kekong',
                  label: '可控'
                }
              ]
            },
            {
              value: 'daohang',
              label: '导航',
              children: [
                {
                  value: 'cexiangdaohang',
                  label: '侧向导航'
                },
                {
                  value: 'dingbudaohang',
                  label: '顶部导航'
                }
              ]
            }
          ]
        },
        {
          value: 'zujian',
          label: '组件',
          children: [
            {
              value: 'basic',
              label: 'Basic',
              children: [
                {
                  value: 'layout',
                  label: 'Layout 布局'
                },
                {
                  value: 'color',
                  label: 'Color 色彩'
                },
                {
                  value: 'typography',
                  label: 'Typography 字体'
                },
                {
                  value: 'icon',
                  label: 'Icon 图标'
                },
                {
                  value: 'button',
                  label: 'Button 按钮'
                }
              ]
            },
            {
              value: 'form',
              label: 'Form',
              children: [
                {
                  value: 'radio',
                  label: 'Radio 单选框'
                },
                {
                  value: 'checkbox',
                  label: 'Checkbox 多选框'
                },
                {
                  value: 'input',
                  label: 'Input 输入框'
                },
                {
                  value: 'input-number',
                  label: 'InputNumber 计数器'
                },
                {
                  value: 'select',
                  label: 'Select 选择器'
                },
                {
                  value: 'cascader',
                  label: 'Cascader 级联选择器'
                },
                {
                  value: 'switch',
                  label: 'Switch 开关'
                },
                {
                  value: 'slider',
                  label: 'Slider 滑块'
                },
                {
                  value: 'time-picker',
                  label: 'TimePicker 时间选择器'
                },
                {
                  value: 'date-picker',
                  label: 'DatePicker 日期选择器'
                },
                {
                  value: 'datetime-picker',
                  label: 'DateTimePicker 日期时间选择器'
                },
                {
                  value: 'upload',
                  label: 'Upload 上传'
                },
                {
                  value: 'rate',
                  label: 'Rate 评分'
                },
                {
                  value: 'form',
                  label: 'Form 表单'
                }
              ]
            },
            {
              value: 'data',
              label: 'Data',
              children: [
                {
                  value: 'table',
                  label: 'Table 表格'
                },
                {
                  value: 'tag',
                  label: 'Tag 标签'
                },
                {
                  value: 'progress',
                  label: 'Progress 进度条'
                },
                {
                  value: 'tree',
                  label: 'Tree 树形控件'
                },
                {
                  value: 'pagination',
                  label: 'Pagination 分页'
                },
                {
                  value: 'badge',
                  label: 'Badge 标记'
                }
              ]
            }
          ]
        }
      ]
      // basicForm:{editorContent:""}
    }
  },
  created() {
    this.tempRoute = Object.assign({}, this.$route)
  },
  mounted() {
    if (this.$route.params.id) {
      this.getInfo()
      this.setTagsViewTitle()
    }
    this.handlerGetCategoryTreeData()
  },
  methods: {
    getInfo() {
      categoryApi.articleInfoApi({ id: this.$route.params.id }).then(data => {
        this.editData = data
        this.hadlerInitEditData()
      })
    },
    modalPicTap(tit) {
      const _this = this
      this.$modalUpload(function(img) {
        _this.pram.imageInput = img[0].sattDir
      }, tit, 'content')
    },
    hadlerInitEditData() {
      if (!this.$route.params.id) return
      const {
        author, cid, content, imageInput,
        isBanner, isHot, shareSynopsis, shareTitle, sort, synopsis, title, url, id
      } = this.editData
      this.pram.author = author
      this.pram.cid = Number.parseInt(cid)
      this.pram.content = content
      this.pram.imageInput = imageInput
      this.pram.isBanner = isBanner
      this.pram.isHot = isHot
      this.pram.shareSynopsis = shareSynopsis
      this.pram.shareTitle = shareTitle
      this.pram.sort = sort
      this.pram.synopsis = synopsis
      this.pram.title = title
      this.pram.url = url
      this.pram.id = id
      // this.pram.mediaId = mediaId
    },
    handlerGetCategoryTreeData() {
      categoryApi.listCategroy({ type: 3, status: '' }).then(data => {
        this.categoryTreeData = data.list
        localStorage.setItem('articleClass', JSON.stringify(data.list))
      })
    },
    handerSubmit: Debounce(function(form) {
      this.$refs[form].validate(valid => {
        if (!valid) return
        if (!this.$route.params.id) {
          this.handlerSave()
        } else {
          this.handlerUpdate()
        }
      })
    }),
    handlerUpdate() {
      this.loading = true
      this.pram.cid = Array.isArray(this.pram.cid) ? this.pram.cid[0]:this.pram.cid
      this.pram.shareTitle = this.pram.title
      this.pram.shareSynopsis = this.pram.synopsis
      articleApi.UpdateArticle(this.pram).then(data => {
        this.$message.success('编辑文章成功')
        this.loading = false
        this.$router.push({ path: '/content/articleManager' })
      }).catch(() => {
        this.loading = false
      })
    },
    handlerSave() {
      this.loading = true
      this.pram.cid = Array.isArray(this.pram.cid) ? this.pram.cid[0]:this.pram.cid
      this.pram.shareTitle = this.pram.title
      this.pram.shareSynopsis = this.pram.synopsis
      articleApi.AddArticle(this.pram).then(data => {
        this.$message.success('新增文章成功')
        this.loading = false
        this.$router.push({ path: '/content/articleManager' })
      }).catch(() => {
        this.loading = false
      })
    },
    setTagsViewTitle() {
      const title = '编辑文章'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.$route.params.id}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    }
  }
}
</script>

<style scoped>

</style>
