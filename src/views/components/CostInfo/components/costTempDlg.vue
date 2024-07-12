<template>
  <ComDialog
    ref="dialogRef"
    :customDialog="customDialogConfig"
    :dialogBoxCenter="true"
    :confirmClose="false"
  >
    <template v-slot:content>
      <div v-if="$refs.dialogRef && $refs.dialogRef.dialogVisible">
        <ComForm
          :formConfig="setSearchFormConf()"
          style="margin-bottom: 10px"
        />
        <ComTable
          ref="cTableRef"
          :tableHeight="tableConfig.tableHeight"
          :columnConfig="tableTabConfig()"
          :httpRequest="tableConfig.httpRequest"
          @onCurrentChange="(r) => onCurRowChange(r)"
          :getQueryParams="
            () => ({
              ...searchFormConfig.formModel,
              business: 1, // 当前用户
            })
          "
        >
          <template v-slot:customRow="{ slotProps }">
            <template v-if="slotProps.prop === 'radioSlot'">
              <el-radio
                style="margin: 0"
                class="el-table-radio"
                v-model="radioRow.id"
                :label="slotProps.row.id"
                >.</el-radio
              >
            </template>
          </template>
        </ComTable>
      </div>
    </template>
  </ComDialog>
</template>

<script>
import { tableCostTempCols } from "../model";
import { getCostTempList } from "@/api/settlementManage/feeSet";
export default {
  props: {},
  data() {
    return {
      customDialogConfig: {
        width: "850px",
        dlgClassName: "dialog-body-table",
        title: "费用模板",
        footer: [
          {
            text: "确定",
            type: "primary",
            handleClick: () => this.handleConfirm(),
          },
          {
            text: "取消",
            plain: true,
            handleClick: () => {
              this.$refs.dialogRef.handleClose();
            },
          },
        ],
      },
      searchFormConfig: {
        formModel: {}, // 表单数据
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getTableList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        // fold: true,
        labelWidth: "85px",
        searchColsHeight: true,
      },
      radioRow: {},
      tempObj: {},
      tableConfig: {
        tableHeight: "calc(100vh - 336px)",
        httpRequest: getCostTempList,
      },
    };
  },
  methods: {
    editShow({ addTempSuccess }) {
      this.tempObj = {
        addTempSuccess,
      };
      this.radioRow = {};
      this.$refs.dialogRef.show();
    },
    onCurRowChange(row) {
      this.radioRow = row;
    },
    handleConfirm() {
      if (this.radioRow.id) {
        this.tempObj.addTempSuccess(this.radioRow.itemList || []);
      }
      this.$refs.dialogRef.hide();
    },
    getTableList(searchFrom = {}) {
      this.searchFormConfig.formModel = {
        ...searchFrom,
      };
      this.$refs.cTableRef?.refreshTable();
    },
    setSearchFormConf() {
      return {
        ...this.searchFormConfig,
        lists: [
          {
            className: "search-form-width",
            fieldList: [
              {
                rows: [
                  {
                    cols: [
                      {
                        span: 12,
                        id: "name",
                        label: "模板名称：",
                        placeholder: "请输入",
                        type: "text",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };
    },
    tableTabConfig() {
      return tableCostTempCols();
    },
  },
  components: {
    ComTable: () => import("_comp/ComTable"),
    ComForm: () => import("_comp/ComForm"),
    ComDialog: () => import("_comp/ComDialog"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
/deep/ .el-table-radio {
  .el-radio__label {
    display: none;
  }
}
</style>
