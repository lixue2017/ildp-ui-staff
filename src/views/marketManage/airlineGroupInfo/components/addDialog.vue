<template>
  <div>
    <ComDialog
      ref="customDialog"
      :customDialog="customDialogConfig"
      class="airline-dialog"
    >
      <template v-slot:content>
        <ComForm
          ref="dialogForm"
          :formConfig="formConfig"
          class="dialog-form"
          v-if="
            $refs &&
            $refs.customDialog &&
            $refs.customDialog.dialogVisible &&
            Object.keys(dictionary.dicsData).length
          "
        >
        </ComForm>
      </template>
    </ComDialog>
  </div>
</template>

<script>
import { config } from "./model";
import { mapActions, mapState } from "vuex";
import { addOperateCode, putOperateCode } from "@/api/marketManage/airline.js";
import { comSaveRepeatedRequest } from "@/api/common";
export default {
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComDialog: () => import("_comp/ComDialog"),
  },
  props: {
    appendToBody: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  data() {
    return {
      status: 0,
      customDialogConfig: {
        title: "航线组信息",
        width: "650px",
        dataStatus: 0,
        appendToBody: this.appendToBody,
        footer: [
          {
            text: "取消",
            plain: true,
            handleClick: () => {
              this.$refs.customDialog.handleClose();
            },
          },
          {
            text: "保存并启用",
            type: "primary",
            handleClick: (rows) => {
              this.submitType = 1;
              this.$refs.dialogForm.submitForm();
            },
          },
          {
            text: "暂存",
            type: "primary",
            handleClick: (rows) => {
              this.submitType = 0;
              this.$refs.dialogForm.submitForm();
            },
          },
        ],
        type: "",
      },
      formConfig: {
        formModel: {},
        httpRequest: this.submitFormRequest, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        size: "small",
        labelWidth: "120px",
        lists: config.lists, // 表单渲染列表
        formRules: config.formRules, // 表单校验规则
        visibleAll: true,
      },
      submitType: "",
    };
  },
  created() {
    this["dictionary/getDictionary"]("marketManage");
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    show(row={}) {
      const {id,isPublic,lineType,...obj}=row
      // if (row?.id) {
      //   //编辑
      //   this.formConfig.formModel = {
      //     ...row,
      //   };
      // } else {
      //   this.formConfig.formModel = {
      //     ...row,
      //   };
      // }
      this.customDialogConfig.title=id?'航线组信息(编辑)':'航线组信息(新增)'
      this.formConfig.formModel = {
        ...obj,
        id,
        isPublic:isPublic?isPublic:'1',
        lineType:lineType?lineType:'0'
      };
      this.$refs.customDialog.show();
    },
    hide() {
      this.$refs.customDialog.hide();
    },
    handleSuccess(res = {}) {
      this.hide();
      this.$emit("handleSuccess");
    },
    submitFormRequest(formModel) {
      const params = {
        ...formModel,
        status: this.submitType,
      };
      delete params.undefined;
      if (formModel.id) {
        return comSaveRepeatedRequest(putOperateCode, params)
        // return new Promise((resolve) => {
        //   putOperateCode(params).then((res) => {
        //     resolve();
        //   });
        // });
      } else {
        return comSaveRepeatedRequest(addOperateCode, params)
        // return new Promise((resolve) => {
        //   addOperateCode(params).then((res) => {
        //     resolve();
        //   });
        // });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.airline-dialog {
  /deep/ {
    .el-radio {
      margin-right: 10px;
    }
  }
  .mark-icon {
    border-radius: 12px;
    padding: 2px 12px;
    font-size: 12px;
    margin-left: 5px;
    border: 1px solid #66a5ff;
  }
}
.diaLogPortType {
  display: flex;
  align-items: center;
  .el-tag {
    margin-left: 10px;
  }
}
</style>
