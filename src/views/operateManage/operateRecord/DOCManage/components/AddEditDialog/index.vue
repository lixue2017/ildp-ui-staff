<template>
  <ComDialog
    ref="customDialog"
    :customDialog="customDialogConfig"
    class="airline-dialog"
    @onClose="closeSusess()"
  >
    <template v-slot:content>
      <ComForm
        ref="dialogForm"
        :formConfig="formConfig"
        class="dialog-form"
        v-if="$refs.customDialog && $refs.customDialog.dialogVisible"
      >
        <template v-slot:agent="slotProps">
          <!-- <span v-if="slotProps.formModel.operationOrderId">
            {{
              slotProps.formModel.operationOrderId.bookingSpaceProxyName
                ? slotProps.formModel.operationOrderId.bookingSpaceProxyName
                : "--"
            }}
          </span>-->
          <span v-if="slotProps.formModel.agent">{{ slotProps.formModel.agent }}</span>
          <span v-else-if="slotProps.formModel.operationOrderId">
            {{
            slotProps.formModel.operationOrderId.bookingSpaceProxyName
            ? slotProps.formModel.operationOrderId.bookingSpaceProxyName
            : "--"
            }}
          </span>
        </template>
        <template v-slot:shipCompany="slotProps">
          <span v-if="slotProps.formModel.shipCompany">
            {{
            slotProps.formModel.shipCompany
            }}
          </span>
          <span v-else-if="slotProps.formModel.operationOrderId">
            {{
            slotProps.formModel.operationOrderId.shipCompany
            ? slotProps.formModel.operationOrderId.shipCompany
            : "--"
            }}
          </span>
        </template>
      </ComForm>
    </template>
  </ComDialog>
</template>


<script>
import { config } from "./model";
import { parseTime } from "@/utils/ruoyi";
import { addPopDetain, editDetain } from "@/api/operateRecord/DOCManage";
import { mapState } from "vuex";
export default {
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComDialog: () => import("_comp/ComDialog")
  },
  props: {
    appendToBody: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState(["dictionary"])
  },
  data() {
    return {
      status: 0,
      customDialogConfig: {
        title: "航次信息",
        width: "850px",
        dataStatus: 0,
        appendToBody: this.appendToBody,
        footer: [
          {
            text: "取 消",
            plain: true,
            handleClick: () => {
              this.hide();
            }
          },
          {
            text: "保 存",
            type: "primary",
            handleClick: () => {
              this.$refs.dialogForm.submitForm();
            }
          }
        ],
        footerSpare: [
          {
            text: "取 消",
            plain: true,
            handleClick: () => {
              this.$refs.customDialog.handleClose();
            }
          },
          {
            text: "保 存",
            type: "primary",
            handleClick: () => {
              // this.customDialogConfig.dataStatus = 1;
              this.$refs.dialogForm.submitForm();
            }
          }
        ],
        type: ""
      },
      formConfig: {
        formModel: {},
        httpRequest: this.addPopDetain, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        isAttachFileId: true,
        size: "small",
        labelWidth: "90px",
        lists: config.lists, // 表单渲染列表
        formRules: config.formRules // 表单校验规则
      },
      dataId: ""
    };
  },
  created() {},
  mounted() {},
  methods: {
    changeAirline() {
      const that = this;
      config.lists[0].fieldList[0].rows[0].cols[2].handle = e => {
        // delete e.id;
        that.$refs.dialogForm.setFormModel({
          followUserid: e.operator,
          busUserid: e.salesman
        });
      };
    },
    show(row, type) {
      if (type === "editStatus") {
        this.customDialogConfig.title = "扣放货信息(编辑)";
        this.type = "edit";
        this.customDialogConfig.useFooter = "footerSpare";
        this.formConfig.formModel = {
          ...row,
          operationOrderId: row.operationOrderNum,
          opId: row.operationOrderId
        };
      } else {
        this.customDialogConfig.title = "扣放货信息(新增)";
        this.type = "add";
        this.customDialogConfig.useFooter = "footer";
        this.formConfig.formModel = {
          ...row
        };
      }
      config.lists[0].fieldList[0].rows[0].cols[2].getSearchOptions = e => {
        //初始化工作单
        let list;
        if (row.id || row.operationOrderId) {
          list = e.find(item => item.id === row.operationOrderId);
        }
        //  else {
        //   list = e[0];
        // }
        const { id, remark, ...obj } = list || {}; // 防止扣货ID被操作单ID覆盖
        this.$refs.dialogForm.setFormModel({
          ...obj,
          operationOrderId: list
        });
      };
      this.$refs.customDialog.show();
      setTimeout(() => {
        this.changeAirline();
      });
    },

    hide() {
      this.$refs.customDialog.hide();
    },

    handleSuccess(res = {}) {
      this.$emit("handleSuccess", res.data);
      this.hide();
    },
    addPopDetain(form) {
      const operationOrderId =
        form.operationOrderId.id || form.operationOrderId;
      const params = {
        ...form,
        id: this.dataId ? this.dataId : form.id,
        type: form.type,
        company: form.company,
        // operationOrderId: form.operationOrderId.id || form.operationOrderId,
        operationOrderId:
          typeof form.operationOrderId === "string"
            ? form.opId
            : operationOrderId,
        sortBoxId: form.operationOrderId.sortBoxId || form.sortBoxId,
        followUserid: form.followUserid,
        detainTime: parseTime(form.detainTime, "{y}-{m}-{d}"),
        busUserid: form.busUserid,
        agent: form.operationOrderId.bookingSpaceProxyName,
        // shipCompany: form.operationOrderId.shipCompany,
        remark: form.remark
      };
      delete params.opId;
      if (this.type === "edit") {
        return editDetain(params);
      } else if (this.type === "add") {
        return addPopDetain(params);
      }
    },
    closeSusess() {
      // 关闭弹窗后文件列表清空
    }
  }
};
</script>
<style lang="scss" scoped>
.airline-dialog {
  /deep/.el-radio {
    margin-right: 10px;
  }
  .mark-icon {
    border-radius: 12px;
    padding: 2px 12px;
    font-size: 12px;
    margin-left: 5px;
  }
  .line-type {
    background: rgba(33, 194, 93, 0.1);
    color: #35d06f;
  }
  .route-proxy {
    background: rgba(102, 165, 255, 0.1);
    color: #66a5ff;
  }
}
</style>
