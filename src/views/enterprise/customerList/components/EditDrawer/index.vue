<template>
  <ComDrawer
    ref="customDrawer"
    :customDrawer="customDrawerConfig"
    class="drawer-content"
  >
    <template v-slot:content>
      <ComForm
        :formConfig="formConfig"
        ref="drawerForm"
        v-if="$refs && $refs.customDrawer && $refs.customDrawer.drawerVisible"
        :dictionary="dictionary"
      >
        <template v-slot:customerInfo_logoUrl>
          <div>
            <p class="el-upload__tips">大小不超过5M，支持jpg、png、bmp格式</p>
            <el-upload
              ref="upload"
              name="customerFile"
              :limit="1"
              accept=".jpg, .png, .bmp"
              :headers="upload.headers"
              :action="upload.url"
              :disabled="upload.isUploading"
              :before-upload="handleBeforeUpload"
              :on-progress="handleFileUploadProgress"
              :on-success="handleFileSuccess"
              :auto-upload="true"
              drag
            >
              <img v-if="imgUrl" :src="imgUrl" class="avatar" />
              <template v-else>
                <i class="el-icon-plus"></i>
                <!-- <div class="el-upload__text">上传</div> -->
              </template>
              <!-- <div class="el-upload__tip" slot="tip">
                  大小不超过5M，支持jpg、png、bmp格式
                </div> -->
            </el-upload>
          </div>
        </template>
        <template v-slot:businessOwnership="slotProps">
          <TreeSelect
            :config="slotProps.fieldItem"
            :formModel="slotProps.formModel"
          ></TreeSelect>
        </template>
      </ComForm>
    </template>
  </ComDrawer>
</template>

<script>
import { getToken } from "@/utils/auth";
import {
  updateCustomer,
  getCustomerDetail,
  updateStaffList,
} from "@/api/customerManage/customerList.js";
import { customer, supplier, subsidiary, staff, config } from "./model";
import { typeConversion } from "@/utils/index";
export default {
  props: {
    dictionary: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComDrawer: () => import("_comp/ComDrawer"),
    TreeSelect: () => import("../treeSelect.vue"),
  },
  data() {
    return {
      customDrawerConfig: {
        title: "编辑客户",
        width: "920px",
        footer: [
          {
            text: "取 消",
            plain: true,
            handleClick: () => {
              this.$refs.customDrawer.handleClose();
            },
          },
          {
            text: "保 存",
            type: "primary",
            handleClick: () => {
              this.$refs.drawerForm.submitForm();
            },
          },
        ],
      },
      formConfig: {
        formModel: {},
        httpRequest: (formModel) => {
          //员工列表与其他三个列表不属于同一类的数据
          if (this.type == "9") {
            return this.updateStaff(formModel);
          } else {
            return this.updateCustomer(formModel);
          }
        }, // 表单提交接口
        successMessage: "编辑成功",
        successFunction: this.handleSuccess, // 表单提交成功回调
        labelWidth: "125px",
        lists: config.lists, // 表单渲染列表
        formRules: config.formRules, // 表单校验规则
      },
      upload: {
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/crm/info/customerFile",
      },
      imgUrl: "",
      type: "",
    };
  },
  methods: {
    updateCustomer(form) {
      const params = {};
      for (let key in form) {
        const arr = key.split("_");
        !params[arr[0]] && (params[arr[0]] = {});
        if (key === "customerInfo_contractTime" && form[key]) {
          console.log("222", form[key]);
          params.customerInfo.contractStart = form[key][0];
          params.customerInfo.contractEnd = form[key][1];
        } else if (key === "customerInfoExtend_otherSelect") {
          params.customerInfoExtend.isLocus = 0;
          params.customerInfoExtend.isEmail = 0;
          params.customerInfoExtend.isChannel = 0;
          form[key].includes(1) && (params.customerInfoExtend.isLocus = 1);
          form[key].includes(2) && (params.customerInfoExtend.isEmail = 1);
          form[key].includes(3) && (params.customerInfoExtend.isChannel = 1);
        } else if (arr[1] === "isDefault") {
          params[arr[0]][arr[1]] = form[key] ? 1 : 0;
        } else if (arr[1] === "isPrintInvoice") {
          params[arr[0]][arr[1]] = form[key] ? 1 : 0;
        } else {
          params[arr[0]][arr[1]] = form[key];
        }
        if (key === "customerInfo_clientIdentity") {
          params.customerInfo.clientIdentity =
            params.customerInfo.clientIdentity.join(",");
        } else if (key === "customerInfo_category") {
          params.customerInfo.category = form.customerInfo_category?.join(","); //服务商列表没有客户类别
        }
      }
      params.customerInfo.logoUrl = this.imgUrl;
      this.formConfig.formModel = params;
      // console.log("tttt", params);
      const { undefined, ...parObj } = params;
      return updateCustomer(parObj);
    },
    updateStaff(form) {
      console.log("form", form);
      const { customerInfo_id, code, nameCn, nameEn, businessOwnership } = form;
      const params = {
        id: customerInfo_id,
        code,
        nameCn,
        nameEn,
        businessOwnership: businessOwnership.join(","),
        actionType: "U",
      };
      return updateStaffList(params);
    },
    show(formModel, type) {
      this.type = type;
      const lists = {
        2: customer, //客户列表
        3: supplier, //服务商列表||供应商列表
        0: subsidiary, //堡森列表
        9: staff, //员工列表
      };
      this.customDrawerConfig.title = lists[type].title;
      this.formConfig.lists = lists[type].lists;
      this.formConfig.formRules = lists[type].formRules;
      getCustomerDetail(formModel.id).then((res) => {
        const params = {};
        if (res.data && res.data.customerInfo) {
          const customerInfo = res.data.customerInfo;
          for (let key in customerInfo) {
            if (key === "contractStart" || key === "contractEnd") {
              !params.customerInfo_contractTime &&
                customerInfo[key] &&
                customerInfo.contractEnd &&
                (params.customerInfo_contractTime = [
                  customerInfo[key],
                  customerInfo.contractEnd,
                ]);
            } else if (key === "clientIdentity") {
              params.customerInfo_clientIdentity =
                customerInfo[key]?.split(",");
            } else if (key === "category") {
              params.customerInfo_category = customerInfo[key]?.split(","); //服务商列表没有客户类别
            } else if (key === "ascription") {
              // params.customerInfo_ascription = typeConversion(
              //   customerInfo[key]
              // );
            } else {
              params[`customerInfo_${key}`] = customerInfo[key];
            }
          }
        }
        !params.customerInfoExtend_otherSelect &&
          (params.customerInfoExtend_otherSelect = []);
        if (res.data && res.data.customerInfoExtend) {
          const customerInfoExtend = res.data.customerInfoExtend;
          for (let key in customerInfoExtend) {
            if (key === "isLocus") {
              customerInfoExtend[key] == 1 &&
                params.customerInfoExtend_otherSelect.push(1);
            } else if (key === "isEmail") {
              customerInfoExtend[key] == 1 &&
                params.customerInfoExtend_otherSelect.push(2);
            } else if (key === "isChannel") {
              customerInfoExtend[key] == 1 &&
                params.customerInfoExtend_otherSelect.push(3);
            } else if (key === "isPrintInvoice") {
              params.customerInfoExtend_isPrintInvoice =
                customerInfoExtend[key] == 1;
            } else {
              params[`customerInfoExtend_${key}`] = customerInfoExtend[key];
            }
          }
        }
        if (res.data && type == "9") {
          const customerInfo = res.data.customerInfo;
          for (let key in customerInfo) {
            if (key === "code" || key === "nameCn" || key === "nameEn") {
              params[key] = customerInfo[key];
            } else if (key === "businessOwnership") {
              params[key] = [customerInfo[key]];
            }
          }
        }
        this.imgUrl = params.customerInfo_logoUrl;
        this.formConfig.formModel = params;
        this.$refs.customDrawer.show();
      });
    },
    hide() {
      this.$refs.customDrawer.hide();
    },
    handleSuccess() {
      this.$emit("handleSuccess");
      this.hide();
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    handleFileSuccess(response, file, fileList) {
      console.log("imgUrl", response);
      this.imgUrl = response.imgUrl;
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
    },
    handleBeforeUpload(file) {
      if (file.size > 5 * 1024 * 1024) {
        this.$alert("上传logo大小不超过5M", "提示");
        return false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../style.scss";
/deep/ {
  .form-column-list {
    margin-top:30px;
    flex-wrap: wrap;
  }
  .leftContent {
    flex: 0.95 1 0% !important;
  }
  .wrapContent {
    flex: none !important;
  }
}
/deep/ .space-nowrap .el-radio-group {
  white-space: nowrap;
}
</style>
