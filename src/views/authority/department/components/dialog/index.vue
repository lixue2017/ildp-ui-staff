<template>
  <div>
    <ComDialog
      ref="customDialog"
      :customDialog="customDialogConfig"
      :confirmClose="confirmClose"
      class="audit-dialog"
    >
      <template v-slot:title></template>
      <template v-slot:content>
        <ComForm
          ref="dialogForm"
          :formConfig="formConfig"
          class="dialog-form"
          v-if="$refs.customDialog && $refs.customDialog.dialogVisible"
        >
          <template v-slot:tips>
            <div style="color: #3179ef">
              <span>* 默认第1个关联仓库为主仓库</span>
            </div>
          </template>
          <template v-slot:isOperateMain="slotProps">
            <span
              class="green-text-color"
              v-if="slotProps.formModel.isOperateMain"
            >
              是
            </span>
            <span v-else>否</span>
          </template>
        </ComForm>
      </template>
    </ComDialog>
  </div>
</template>

<script>
import { config } from "./model";
import { addOrUpdateDeptWarehouse } from "@/api/system/dept";
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
  data() {
    return {
      confirmClose: false,
      customDialogConfig: {
        title: "维护仓库",
        width: "800px",
        appendToBody: this.appendToBody,
        footer: [
          {
            text: "取 消",
            handleClick: () => {
              this.$refs.customDialog.handleClose();
            },
          },
          {
            text: "保 存",
            type: "primary",
            handleClick: () => {
              this.$refs.dialogForm.submitForm();
            },
          },
        ],
      },
      formConfig: {
        formModel: {},
        httpRequest: this.submitFormRequest, // 表单提交接口
        successFunction: this.handleFormSuccess, // 表单提交成功回调
        size: "small",
        labelWidth: "85px",
        lists: [],
        formRules: {},
      },
      userDeptId: this.$store.state.user.deptId,
      listData: {},
    };
  },
  created() {},
  methods: {
    submitFormRequest(formModel) {
      return new Promise((resolve) => {
        var params = {
          deptId: this.listData?.deptId,
          cusDeptWareHouses: [],
          overseasDeptWarehouses: [],
        };
        if (formModel.isOperateMain) {
          params.cusDeptWareHouses = formModel.wareHouses.map((item) => {
            return {
              warehouseMainId: item.warehouseMainId,
              deptId: this.listData.deptId,
              isMain: 0,
            };
          });
          if (params.cusDeptWareHouses.length) {
            params.cusDeptWareHouses[0].isMain = 1; //选中的第一条数据默认为主单
          }
        }
        params.overseasDeptWarehouses = formModel.overseasDeptWarehouses.map(
          (item) => {
            return {
              warehouseMainId: item.warehouseMainId,
              deptId: this.listData.deptId,
              isMain: 0,
            };
          }
        );
        if (params.overseasDeptWarehouses.length) {
          params.overseasDeptWarehouses[0].isMain = 1; //选中的第一条数据默认为主单
        }
        addOrUpdateDeptWarehouse(params).then((res) => {
          this.$emit("handleSuccess");
          resolve();
        });
      });
    },
    handleFormSuccess() {
      this.hide();
      this.$emit("handleSuccess");
    },
    async show(row) {
      this.listData = row;
      if (row.warehouseIdList) {
        var wareHouses = row.warehouseIdList.map((item) => {
          return {
            warehouseMainId: item,
          };
        });
      }
      if (row.overseasDeptWarehouseIdList) {
        var overseasDeptWarehouses = row.overseasDeptWarehouseIdList.map(
          (item) => {
            return {
              warehouseMainId: item,
            };
          }
        );
      }
      this.formConfig.formModel = {
        deptName: row.deptName,
        isOperateMain: row.isOperateMain,
        wareHouses,
        overseasDeptWarehouses,
      };
      this.formConfig.lists = config(row.isOperateMain).maintainLists.lists;
      this.$refs.customDialog.show();
    },
    hide() {
      this.$refs.customDialog.hide();
    },
  },
};
</script>
<style lang="scss" scoped>
.audit-dialog {
  /deep/ {
    .el-dialog__body {
      padding: 30px 30px 10px 30px;
    }
    .title {
      font-size: 14px;
      color: #515151;
      font-weight: bold;
      line-height: 20px;
    }
    .sub-title {
      font-size: 13px;
      color: #8b8b8b;
      line-height: 20px;
      margin: 5px 0 18px;
    }
    .card-uploader {
      .el-upload--picture-card,
      .el-upload-list--picture-card .el-upload-list__item {
        width: 80px;
        height: 80px;
        line-height: 85px;
        margin: 0 18px 0 0;
      }
    }
    .custom-remark {
      .el-form-item {
        .el-form-item__label {
          margin: 0 0 5px 5px;
        }
      }
      .el-form-item--small .el-form-item__content {
        line-height: 20px;
        min-height: 20px;
      }
    }
  }
  .table-slot-Sxf {
    /deep/.el-input-group__append {
      width: 80px;
    }
  }
  .table-slot-HDSY {
    display: flex;
    & > div:first-child {
      margin-right: 10px;
      flex: 1;
    }
  }
  .slot-content-receiptPayment {
    width: 100%;
    background-color: rgba(250, 250, 250, 1);
    padding-left: 5px;
    padding-right: 5px;
    border-color: rgba(215, 215, 215, 1);
    border-width: 1px;
    border-style: solid;
    border-color: rgba(215, 215, 215, 1);
    border-radius: 4px;
  }
  .dialog-form {
    /deep/.bill-left {
      height: 100%;
      padding-right: 40px;
      .margin-bottom-0 {
        margin-bottom: 0;
      }
      .el-col:last-child {
        .el-form-item--small.el-form-item {
          margin-bottom: 0;
        }
      }
    }
    /deep/.bill-right {
      padding-left: 40px;
      border-left: 1px solid #e2e2e2;
      .el-col:last-child {
        .el-form-item--small.el-form-item {
          margin-bottom: 0;
        }
      }
    }
    .content-payNum {
      width: 100%;
      & > span:nth-child(2) {
        font-size: 15px;
        color: #3179ef;
      }
    }
    /deep/.content-mainMoney {
      color: red;
    }
    .content-verification {
      width: 100%;
      background: rgba(80, 148, 255, 0.05);
      box-shadow: 0px 0px 3px 0px rgba(20, 69, 147, 0.25);
      border-radius: 10px;
      padding-left: 25px;
    }
    /deep/ {
      .el-select {
        .el-tag {
          max-width: 400px;
          display: inline-block;
          line-height: 18px;

          .el-select__tags-text {
            display: inline-block;
            width: calc(100% - 12px);
            vertical-align: middle;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }
}
</style>
