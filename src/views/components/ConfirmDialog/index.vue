<template>
  <div>
    <ComDialog
      v-if="dialogShow"
      ref="myDialog"
      :customDialog="dialogConfig"
      @onClose="handleClose"
      :confirmClose="false"
      :dialogBoxCenter="true"
    >
      <template v-slot:content>
        <slot name="tip-top" />
        <div :class="formConfig.className">
          <ComForm
            :formConfig="formConfig"
            ref="myComForm"
            :dictionary="dictionary"
            @handleChange="handleChange"
          >
            <template v-slot:reminder="slotProps">
              <div class="reminder">
                <i class="iconfont icon-tishi"></i>
                <span>
                  {{ slotProps.fieldItem.content }}
                </span>
              </div>
            </template>
          </ComForm>
        </div>
        <slot name="tip-bottom" />
      </template>
    </ComDialog>
  </div>
</template>

<script>
import { msgBox } from "@/utils/confirmBox.js";
import { dialogOptions, USER_COL_FN_5 } from "./model";
import { clone } from "@/utils/ruoyi";
export default {
  props: {
    dictionary: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComDialog: () => import("_comp/ComDialog"),
  },
  data() {
    return {
      dialogShow: false,
      dialogConfig: {
        title: "联系人信息",
        width: "850px",
        footer: [
          {
            text: this.overseaLangObj.qr_confirm() || "确定",
            type: "primary",
            handleClick: () => {
              this.$refs.myComForm.submitForm();
            },
          },
          {
            text: this.overseaLangObj.qx_cancel() || "取消",
            plain: true,
            handleClick: () => {
              this.$refs.myDialog.hide();
              this.dialogShow = false;
            },
          },
        ],
      },
      formConfig: {},
      typeConf: null,
    };
  },
  methods: {
    delete() {
      return new Promise((resolve) => {
        const title = "删除提示";
        const className = "el-icon-warning text-warning";
        const msg = "删除操作不可逆！";
        msgBox(this, { title, className, msg, showCancelButton: true }, () => {
          resolve();
        });
      });
    },
    enable() {
      return new Promise((resolve) => {
        const title = "启用提示";
        const className = "el-icon-success text-success";
        const msg = "启用账号后该客户正常登录系统！";
        msgBox(this, { title, className, msg, showCancelButton: true }, () => {
          resolve();
        });
      });
    },
    disable() {
      return new Promise((resolve) => {
        const title = "禁用提示";
        const className = "el-icon-warning text-warning";
        const msg = "禁用账号后该客户无法登录系统！";
        msgBox(this, { title, className, msg, showCancelButton: true }, () => {
          resolve();
        });
      });
    },
    audit() {
      return new Promise((resolve) => {
        const title = "审核提示";
        const className = "el-icon-warning text-warning";
        const msg = "变为“待审核”状态业务自动提交！";
        msgBox(this, { title, className, msg, showCancelButton: true }, () => {
          resolve();
        });
      });
    },
    upgrade(row = {}) {
      const { msgInfo } = row;
      return new Promise((resolve) => {
        const title = "升级提示";
        const className = "el-icon-warning text-warning";
        const msg = msgInfo ? msgInfo : "是否进入编辑页面？";
        msgBox(this, { title, className, msg, showCancelButton: true }, () => {
          resolve();
        });
      });
    },

    handleClose() {
      this.dialogShow = false;
    },
    handleFormDialog(
      type,
      {
        dialogTitle,
        httpRequest = () => {},
        successFunction,
        formModel = {},
        successMessage,
        timeConfig = {},
        confObj = {},
        customFormConfig,
        tip,
        formRules,
      }
    ) {
      if (!dialogOptions[type] && !customFormConfig) return;
      let config = {};
      switch (type) {
        case "customConfirmModel": // 自定义模板
          config = customFormConfig;
          break;
        case "timeConfirm":
          config = dialogOptions[type](timeConfig);
          break;
        case "bankAccount":
        case "textareaDialog":
          config = dialogOptions[type](confObj);
          if (formRules) {
            config = {
              ...config,
              formRules,
            };
          }
          break;
        case "changeBelong":
          config = dialogOptions[type](
            {
              deptId: formModel.businessOwnership,
              userId: formModel.userId,
            },
            (val) => {
              // 改变客户归属重置员工信息
              let col_arr = this.formConfig.lists[0].fieldList[0].rows[0].cols;
              const fIdx = col_arr.findIndex((e) => e.id === "followUserId");
              col_arr[fIdx] = USER_COL_FN_5(val);
              this.$nextTick(() => {
                this.$refs.myComForm?.$refs.followUserIdRef[0]?.changeFocusRequest(); // 重置员工接口
                this.$refs.myComForm?.setFormModel({
                  followUserId: null,
                  userNickName: "",
                });
              });
            }
          );
          break;
        default:
          config = dialogOptions[type];
      }
      this.typeConf = type;
      this.dialogConfig.title = dialogTitle || config.title;
      this.dialogConfig.width = config.width;
      this.formConfig = {
        tip,
        size: config.size || "small",
        formModel: {
          ...formModel,
          currency: formModel?.currencyId,
          isCabinRelease: formModel.isCabinRelease
            ? formModel.isCabinRelease
            : 0, //新增舱位专用，需要将新增舱位与修改舱位单独抽成一个组件2022/10/28
        },
        httpRequest,
        isAttachFileId: config.isAttachFileId || false,
        labelPosition: config.labelPosition && config.labelPosition,
        successFunction: () => {
          this.$refs.myDialog.hide();
          this.dialogShow = false;
          successFunction && successFunction();
        },
        successMessage,
        className: config.className,
        labelWidth: config.labelWidth || "85px",
        lists: config.lists,
        formRules: config.formRules,
      };
      this.dialogShow = true;
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.myDialog.show();
        });
      });

      if (type === "bankAccount") {
        this.changeData(formModel);
      }
    },
    handleChange(e, type) {
      if (type !== "status") return;
      if (this.typeConf !== "verify") {
        return;
      }
      if (e === 3) {
        this.formConfig.lists[0].fieldList[0].rows[0].cols[3].label = "说明：";
        this.formConfig.formRules.auditingRemark[0].required = false;
      } else {
        this.formConfig.lists[0].fieldList[0].rows[0].cols[3].label =
          "驳回原因：";
        this.formConfig.formRules.auditingRemark[0].required = true;
      }
      this.$refs.myComForm?.setFormModel({ auditingRemark: "" });
    },
    changeData(formModel) {
      //解决完BUG我把这个银行信息的新增与编辑单独提出去写
      const {cols}=this.formConfig.lists[0].fieldList[0].rows[0]
      const index=cols.findIndex((e)=>e.id=="currency")
      if(index!=-1){
        this.formConfig.lists[0].fieldList[0].rows[0].cols[index].getSearchOptions = (
        e
      ) => {
        //银行开票信息币种为人民币时，Swift code与目的地址非必填，否则为必填
        if (formModel?.currencyId === 1) {
          this.formConfig.formRules.invoiceTitle[0].required = false;
          this.formConfig.formRules.openAddress[0].required = false;
        } else {
          this.formConfig.formRules.invoiceTitle[0].required = true;
          this.formConfig.formRules.openAddress[0].required = true;
        }
      };
      this.formConfig.lists[0].fieldList[0].rows[0].cols[index].handle = (e) => {
        if (e === 1) {
          this.formConfig.formRules.invoiceTitle[0].required = false;
          this.formConfig.formRules.openAddress[0].required = false;
        } else {
          this.formConfig.formRules.invoiceTitle[0].required = true;
          this.formConfig.formRules.openAddress[0].required = true;
        }
      };
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.content-padding-20 {
  padding: 0 20px;
}
.reminder {
  font-size: 13px;
  color: #bcbcbc;
  display: flex;
  line-height: 18px;
  .icon-tishi {
    color: #ff985c;
    margin-right: 3px;
  }
}
</style>
