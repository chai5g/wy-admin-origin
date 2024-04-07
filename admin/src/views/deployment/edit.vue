<template>
  <div class="divBox">
    <el-card class="box-card">
      <div class="components-container">
        <el-form ref="pram" label-width="150px" :model="pram">
          <!--          <el-form-item label="序号" prop="title"-->
          <!--                        :rules="[{required:true, message:'请填写标题', trigger:['blur','change']}]"-->
          <!--          >-->
          <!--            <el-input v-model="pram.title" placeholder="标题" maxlength="100"/>-->
          <!--          </el-form-item>-->
          <el-form-item
            label="客户"
            prop="name"
            :rules="[
              {
                required: true,
                message: '请填客户',
                trigger: ['blur', 'change']
              }
            ]"
          >
            <el-input v-model="pram.name" placeholder="作者" maxlength="20" />
          </el-form-item>
          <el-form-item
            label="小区"
            prop="type"
            :rules="[
              {
                required: true,
                message: '请选择小区',
                trigger: ['blur', 'change']
              }
            ]"
          >
            <el-radio-group v-model="pram.type">
              <el-radio :label="1">全部小区</el-radio>
              <el-radio :label="2">限定小区</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label=" " v-if="pram.type === 2">
            <el-form ref="form">
              <div
                v-for="(item, key) of pram.wyAppPlotList"
                style="border: 1px dashed #cccccc;padding: 10px;margin-top: 10px;display: flex;justify-content: space-between"
              >
                <div style="display: flex;width: 100%;gap: 10px">
                  <el-form-item label="小区名称">
                    <el-input
                      v-model="pram.wyAppPlotList[key].name"
                      placeholder="请输入小区名称"
                    />
                  </el-form-item>
                  <el-form-item label="小区地址">
                    <el-cascader
                      ref="cascader"
                      :props="{ value: 'id', label: 'name', children: 'child' }"
                      v-model="pram.wyAppPlotList[key].province"
                      :options="provinceOptions"
                      placeholder="请选择省市区"
                      @change="
                        () => {
                          provinceChange(key);
                        }
                      "
                    ></el-cascader>
                  </el-form-item>
                  <el-form-item label="小区详细地址" prop="firstMin">
                    <el-input
                      v-model="pram.wyAppPlotList[key].address"
                      placeholder="请输入小区详细地址"
                    />
                  </el-form-item>
                </div>
                <div>
                  <el-button
                    type="text"
                    style="color: #7a0003;margin-top: 30px"
                    @click="pram.wyAppPlotList.splice(key, 1)"
                    >删除
                  </el-button>
                </div>
              </div>
            </el-form>
            <el-button
              style="width: 100%;margin-top: 10px"
              type="primary"
              @click="pram.wyAppPlotList.push({ firstMin: '', money: '' })"
              >新增
            </el-button>
          </el-form-item>

          <el-form-item
            label="域名地址"
            prop="dnsUrl"
            :rules="[
              {
                required: true,
                message: '请输入域名地址',
                trigger: ['blur', 'change']
              }
            ]"
          >
            <el-input
              v-model="pram.dnsUrl"
              maxlength="50"
              :rows="2"
              resize="none"
              placeholder="域名地址"
            />
          </el-form-item>

          <el-form-item
            label="小程序名称"
            prop="miniName"
            :rules="[
              {
                required: true,
                message: '请填写小程序名称',
                trigger: ['blur', 'change']
              }
            ]"
          >
            <el-input
              v-model="pram.miniName"
              maxlength="50"
              :rows="2"
              resize="none"
              placeholder="小程序名称"
            />
          </el-form-item>
          <el-form-item
            label="管理员账号"
            prop="adminAccount"
            :rules="[
              {
                required: true,
                message: '请填写小程序名称',
                trigger: ['blur', 'change']
              }
            ]"
          >
            <el-input
              v-model="pram.adminAccount"
              maxlength="50"
              :rows="2"
              resize="none"
              placeholder="管理员账号"
            />
          </el-form-item>
          <el-form-item
            label="管理员密码"
            prop="adminAccountPwd"
            :rules="[
              {
                required: true,
                message: '请填写管理员密码',
                trigger: ['blur', 'change']
              }
            ]"
          >
            <el-input
              v-model="pram.adminAccountPwd"
              maxlength="50"
              :rows="2"
              resize="none"
              type="password"
              placeholder="小程序名称"
            />
          </el-form-item>
          <el-form-item
            :rules="[
              { required: true, message: '请上传小程序LOGO', trigger: 'change' }
            ]"
            label="小程序LOGO"
            prop="miniLogoUrl"
          >
            <imageUpload v-model="pram.miniLogoUrl" :limit="1" />
            <span>为了最佳的显示效果，请上传正方形的图片</span>
          </el-form-item>
          <el-form-item
            :rules="[
              {
                required: true,
                message: '请上传联系方式图片',
                trigger: 'change'
              }
            ]"
            label="联系方式"
            prop="contactPicUrl"
          >
            <imageUpload v-model="pram.contactPicUrl" :limit="1" />
            <span>为了最佳的显示效果，请上传正方形的图片</span>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              :loading="loading"
              @click="handerSubmit('pram')"
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
import * as deployApi from "@/api/deployment.js";
import Tinymce from "@/components/Tinymce/index";
import { getToken } from "@/utils/auth";
import SettingMer from "@/utils/settingMer";
import { Debounce } from "@/utils/validate";

export default {
  computed: {
    SettingMer() {
      return SettingMer;
    }
  },
  props: {
    id: {
      type: String,
      default: ""
    },
    detailData: {
      type: Object,
      default: () => {
        return {};
      }
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    hideDialog: {
      type: Function,
      default: () => {
        return () => {};
      }
    }
  },
  // name: "edit",
  components: { Tinymce },
  data() {
    return {
      loading: false,
      constants: this.$constants,
      categoryTreeData: [],
      categoryProps: {
        value: "id",
        label: "name",
        children: "child",
        expandTrigger: "hover",
        checkStrictly: true,
        emitPath: false
      },
      pram: {
        name: null,
        dnsUrl: null,
        miniName: "", //<span>My Document\'s Title</span>
        miniLogoUrl: "",
        contactPicUrl: false,
        type: 1,
        // mediaId: null
        wyAppPlotList: [
          {
            address: "",
            name: "",
            province: ""
          }
        ]
      },
      editData: {},
      myHeaders: { "X-Token": getToken() },
      editorContentLaebl: "",
      provinceOptions: []
      // basicForm:{editorContent:""}
    };
  },
  created() {
    this.tempRoute = Object.assign({}, this.$route);
  },
  mounted() {
    if (this.$route.params.id) {
      this.getInfo();
      this.setTagsViewTitle();
    }
    if (this.isEdit) {
      this.hadlerInitEditData();
    }
    this.getProvince();
  },
  methods: {
    getInfo() {
      // categoryApi.articleInfoApi({ id: this.$route.params.id }).then(data => {
      //   this.editData = data
      //   this.hadlerInitEditData()
      // })
      // 获取省市区数据
      // this.getProvince()
    },
    provinceChange(key) { 
      this.pram.wyAppPlotList[
        key
      ].provinceName = this.$refs.cascader[key].getCheckedNodes()[0].pathLabels[0];
      this.pram.wyAppPlotList[
        key
      ].provinceId = this.$refs.cascader[key].getCheckedNodes()[0].path[0];
      this.pram.wyAppPlotList[
        key
      ].cityName = this.$refs.cascader[key].getCheckedNodes()[0].pathLabels[1];
      this.pram.wyAppPlotList[
        key
      ].cityId = this.$refs.cascader[key].getCheckedNodes()[0].path[1];
      this.pram.wyAppPlotList[
        key
      ].areaName = this.$refs.cascader[key].getCheckedNodes()[0].pathLabels[2];
      this.pram.wyAppPlotList[
        key
      ].areaId = this.$refs.cascader[key].getCheckedNodes()[0].path[2];
    },
    getProvince() {
      deployApi.getRegion().then(data => {
        this.provinceOptions = data;
      });
    },
    // modalPicTap(tit, key) {
    //   const _this = this;
    //   this.$modalUpload(
    //     function(img) {
    //       console.log(img[0]);
    //       // img[0].sattDir 从第三个/字符开始截取后面的字符串
    //       console.log(img[0].sattDir.substring(img[0].sattDir.indexOf("/", 8)));
    //       _this.pram[key] = img[0].sattDir.substring(
    //         img[0].sattDir.indexOf("/", 8)
    //       );
    //     },
    //     tit,
    //     "content"
    //   );
    // },
    hadlerInitEditData() {
      // this.param = this.detailData
      const {
        miniLogoUrl,
        contactPicUrl,
        wyAppPlotList,
        ...other
      } = this.detailData;
      wyAppPlotList &&
        wyAppPlotList.forEach(item => {
          item.province = [item.provinceId, item.cityId, item.areaId];
        });
      this.pram = {
        ...other,
        wyAppPlotList: wyAppPlotList || [],
        miniLogoUrl,
        contactPicUrl
      };
    },
    handerSubmit: Debounce(function(form) {
      this.$refs[form].validate(valid => {
        if (!valid) return;
        if (!this.$route.params.id && !this.isEdit) {
          this.handlerSave();
        } else {
          this.handlerUpdate();
        }
      });
    }),
    handlerUpdate() {
      this.loading = true;
      deployApi
        .updateDeploy({
          ...this.pram,
          id: this.detailData.id
        })
        .then(data => {
          this.$message.success("更新部署成功");
          this.loading = false;
          this.$emit("hideDialog");
        })
        .catch(() => {
          this.loading = false;
        });
    },
    handlerSave() {
      this.loading = true;
      deployApi
        .addDeploy(this.pram)
        .then(data => {
          this.$message.success("新增部署成功");
          this.loading = false;
          this.$emit("hideDialog");
        })
        .catch(() => {
          this.loading = false;
        });
    },
    setTagsViewTitle() {
      const title = "编辑客户部署";
      const route = Object.assign({}, this.tempRoute, {
        title: `${title}-${this.$route.params.id}`
      });
      this.$store.dispatch("tagsView/updateVisitedView", route);
    }
  }
};
</script>

<style scoped></style>
