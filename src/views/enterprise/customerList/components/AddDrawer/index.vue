<template>
  <ComDrawer
    ref="customDrawer"
    :customDrawer="customDrawerConfig"
    v-loading="loading"
    class="drawer-content"
  >
    <template v-slot:content>
      <ComForm
        :formConfig="formConfig"
        ref="drawerForm"
        v-if="$refs && $refs.customDrawer && $refs.customDrawer.drawerVisible"
        :dictionary="dictionary"
        @handleChange="handleChange"
      >
        <template v-slot:customerInfo_businessOwnership>
          <span>深圳堡森</span>
        </template>
        <template v-slot:customerInfo_followUserId="slotProps">
          <AutoComplete
            ref="followUserIdRef"
            :formModel="slotProps.formModel"
            :fieldItem="slotProps.fieldItem"
            :additionalParam="{
              deptId: slotProps.formModel.customerInfo_businessOwnership,
            }"
          />
        </template>
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
import {
  getUserBy,
  getAccountSubject,
} from "@/api/customerManage/customerList.js";
import { getToken } from "@/utils/auth";
import {
  addCustomer,
  updateStaffList,
} from "@/api/customerManage/customerList.js";
import { config } from "./model";
import { customer, supplier, subsidiary, staff } from "./model.js";
import { mapActions, mapState } from "vuex";
import { getBusinessOwnership } from "@/api/common";
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
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
  },
  data() {
    return {
      customDrawerConfig: {
        title: "新增客户",
        width: "920px",
        customerStatus: 0,
        useFooter: "footer",
        footer: [
          {
            text: "取 消",
            plain: true,
            handleClick: () => {
              this.$refs.customDrawer.handleClose();
            },
          },
          {
            text: "保存并补充",
            type: "primary",
            handleClick: () => this.handleSubmit(true),
          },
          {
            text: "保 存",
            type: "primary",
            handleClick: () => this.handleSubmit(),
          },
        ],
        staffFooter: [
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
            handleClick: () => this.handleSubmit(),
          },
        ],
      },
      formConfig: {
        formModel: {
          customerInfo_followUserName: "",
          customerInfo_businessOwnershipName: "",
        },
        httpRequest: (row) => {
          if (this.type == "9") {
            return this.addStaff(row); //员工列表单独一个接口
          } else {
            return this.addCustomer(row); //客户列表，服务商列表，堡森列表共用一个接口
          }
        }, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        labelWidth: "125px",
        lists: config.lists, // 表单渲染列表
        formRules: config.formRules, // 表单校验规则
      },
      supplement: false,
      upload: {
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/crm/info/customerFile",
      },
      imgUrl: "",
      loading: false,
      businessOwnershipId: "", //客户归属ID
      title: "",
      type: "",
    };
  },
  created() {
    this["dictionary/getDictionary"](["businessOwnership"]);
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    addCustomer(formDate) {
      const params = {};
      const _self = this;
      let contactsData = false;
      const { salesLeadsId, ...form } = formDate;
      for (let key in form) {
        const arr = key.split("_");
        !params[arr[0]] && (params[arr[0]] = {});
        if (key === "customerInfo_contractTime" && form[key]) {
          params.customerInfo.contractStart = form[key][0];
          params.customerInfo.contractEnd = form[key][1];
        } else if (arr[1] === "isDefault") {
          params[arr[0]][arr[1]] = form[key] ? 1 : 0;
        } else {
          if (
            [2, 3, "2", "3"].includes(_self.type) &&
            key === "customerInfo_code"
          ) {
            // 客户与服务商公司编码转大写
            params[arr[0]][arr[1]] = form[key]?.toLocaleUpperCase();
          } else {
            params[arr[0]][arr[1]] = form[key];
          }
        }
        if (key === "customerInfo_clientIdentity") {
          params.customerInfo.clientIdentity =
            params.customerInfo.clientIdentity.join(",");
        } else if (key === "customerInfo_category") {
          params.customerInfo.category = form.customerInfo_category?.join(",");
        } else if (key === "customerInfo_businessOwnership") {
          params.customerInfo.businessOwnership =
            form.customerInfo_businessOwnership;
        }
        if (key.includes("customerContacts") && form[key]) {
          //如果至少填写了一项联系人数据就正常传数据，没填就传空对象
          contactsData = true;
        }
      }
      if (!contactsData) {
        params.customerContacts = undefined;
      }
      params.salesLeadsId = salesLeadsId;
      params.customerInfo.logoUrl = this.imgUrl;
      this.formConfig.formModel = params;
      this.loading = true;
      return addCustomer(params);
    },
    addStaff(form) {
      const { code, nameCn, nameEn, businessOwnership } = form;
      const params = {
        code,
        nameCn,
        nameEn,
        businessOwnership: businessOwnership.join(","),
        actionType: "A", //A新增 U 更新  D 删除 S 启用/停用状态
      };
      return updateStaffList(params);
    },
    show(type) {
      this.type = type;
      const typeLists = {
        2: customer({
          handleBusinessOwnership: () => {
            this.$refs.followUserIdRef?.querySearchAsync();
            this.$refs.drawerForm?.setFormModel({
              customerInfo_followUserId: "",
            });
          },
        }), //客户列表
        3: supplier, //服务商列表
        0: subsidiary, //堡森列表
        9: staff, //员工列表
      };
      const useFooter = {
        2: "footer", //客户列表
        3: "footer", //服务商列表
        0: "staffFooter", //堡森列表
        9: "staffFooter", //员工列表
      };
      this.customDrawerConfig.title = typeLists[type].title; //标题
      this.formConfig.lists = typeLists[type].lists; //展示字段
      this.formConfig.formRules = typeLists[type].formRules; //校验规则
      this.customDrawerConfig.useFooter = useFooter[type]; //右下角的按钮
      Promise.all([getAccountSubject()]).then(
        // , getUserBy()
        ([deptName]) => {
          // this.businessOwnershipId = deptName.data.deptId; //客户归属ID
          this.formConfig.formModel = {
            ...this.formConfig.formModel,
            customerInfo_businessOwnership: deptName.data.deptId,
            // customerInfo_followUserId: userId.data.userId,
            customerInfo_clientIdentity: [type],
            // customerInfo_ascription: type == 3 ? "1" : "", //只有供应商有归属，默认国内供应商
          };
          this.$refs.drawerForm &&
            this.$refs.drawerForm.setFormModel(this.formConfig.formModel);
          this.$refs.customDrawer.show();
        }
      );
    },
    hide() {
      this.$refs.customDrawer.hide();
    },
    handleSuccess(res) {
      let params = null;
      if (this.supplement) {
        params = this.formConfig.formModel;
        params.id = res.data;
      }
      this.loading = false;
      this.$message.success("保存成功");
      this.$emit("handleSuccess", params, this.type);
      this.hide();
    },
    handleSubmit(supplement) {
      if (supplement) {
        this.supplement = true;
      } else {
        this.supplement = false;
      }
      this.$refs.drawerForm.submitForm();
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    handleFileSuccess(response, file, fileList) {
      this.imgUrl = response.imgUrl;
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      // this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
    },
    handleBeforeUpload(file) {
      if (file.size > 5 * 1024 * 1024) {
        this.$alert("上传logo大小不超过5M", "提示");
        return false;
      }
    },
    // getSelect(rows) {
    //   //接收所属部门数据
    //   console.log("rows", rows);
    //   this.formConfig.formModel = {
    //     ...this.formConfig.formModel,
    //     UNCHARTED_TABLE_34: rows,
    //   };
    //   console.log("this.formConfig.formModel", this.formConfig.formModel);
    // },
    handleChange(row, type) {
      if (type === "salesLeadsId") {
        console.log(row);
        const {
          name: customerInfo_nameCn, // 客户名称\公司名称(CN)
          address: customerInfo_addressCn, // 地址\中文地址
          category: customerInfo_category, // 客户类别
          ownershipUserId: customerInfo_followUserId, // 归属人\负责员工
          ownershipUserName: customerInfo_followUserName, // 负责员工名称
          level: customerInfo_level, // 客户等级
          shortName: customerInfo_shortName, // 客户简称\公司简称
          contactName: customerContacts_name, // 联系人姓名
          phone: customerContacts_contactPhone, // 手机号\联系电话
          deptPosition: customerContacts_job, // 部门职务
          email: customerContacts_email, // 联系邮箱
          customerCode: customerInfo_code, //公司编码
          honorific: customerContacts_gender, // 尊称\性别
        } = row;
        this.$refs.drawerForm.setFormModel({
          customerInfo_nameCn,
          customerInfo_addressCn,
          customerInfo_category: (customerInfo_category || "").split(","),
          customerInfo_followUserId,
          customerInfo_followUserName,
          customerInfo_level: this.typeConversion(customerInfo_level),
          customerInfo_shortName,
          customerContacts_name,
          customerContacts_contactPhone,
          customerContacts_job,
          customerContacts_email,
          customerInfo_code,
          customerContacts_gender: this.typeConversion(customerContacts_gender),
        });
        if (customerInfo_followUserId) {
          getBusinessOwnership(customerInfo_followUserId).then((res) => {
            const {
              businessOwnershipId: customerInfo_businessOwnership, // 客户归属
              businessOwnershipName: customerInfo_businessOwnershipName, // 客户归属名称
            } = res.data;
            this.$refs.drawerForm.setFormModel({
              customerInfo_businessOwnership,
              customerInfo_businessOwnershipName,
            });
          });
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../style.scss";
/deep/ {
  .form-column-list {
    margin-top: 30px;
    flex-wrap: wrap;
  }
  .leftContent {
    flex: 0.95 1 0% !important;
  }
  .wrapContent {
    flex: none !important;
  }
}
</style>
