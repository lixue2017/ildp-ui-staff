<template>
  <div class="app-container">
    <div>
      <ComDetailTop
        title="收款凭证配置"
        ref="detailTopRef"
        :config="comDetailConfig"
        class="title-sides-margin-none"
      >
      </ComDetailTop>
    </div>
    <div>
      <div v-for="(item, index) in tableConfig.title" :key="index">
        <div class="table-title">
          <span>{{ item }}</span>
        </div>
        <div>
          <ComTable
            :ref="`tableRef${index}`"
            :httpRequest="tableConfig.httpRequest[index]"
            :columnConfig="tableConfig.columnConfig[index]"
            :getQueryParams="getQueryParams"
            :rowOperationBtnListFn="() => tableConfig.statusList(index)"
          >
          </ComTable>
        </div>
      </div>
    </div>

    <ComCustomDialog ref="customDialogRef" />
  </div>
</template>

<script>
import { tableColumns, customDialogCols, tableLists } from "./model.js";
import {
  getSettleCashierTaskPrintConfig,
  postSettleCashierTaskPrintConfig,
  getSettleCashierTaskPrintConfigCashierList,
  postSettleCashierTaskPrintConfigCashierSave,
} from "@/api/customerManage/customerList.js";
export default {
  components: {
    ComTabs: () => import("_comp/ComTabs"),
    ComTable: () => import("_comp/ComTable"),
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
  },
  data() {
    const { title, tableColumns } = tableLists();
    return {
      comDetailConfig: {
        rightBtn: [
          {
            // icon: "iconfont icon-fanhui",
            text: "返回",
            type: "back",
            className: "back",
          },
        ],
      },
      tableConfig: {
        title,
        // tableHeight: "calc(100vh - 261px)",
        columnData: [],
        columnConfig: tableColumns,
        httpRequest: [
          getSettleCashierTaskPrintConfig,
          getSettleCashierTaskPrintConfigCashierList,
        ],
        statusList: (tName) => {
          return [
            {
              text: "修改",
              handleClick: (row) => this.handleEdit(row, tName),
            },
          ];
        },
      },
    };
  },
  // computed: {
  //   tableAutoHeight(tName,row) {
  //     console.log("tName", tName);
  //     console.log('row',row)
  //     // const tableLen = this.tableConfig.columnData.length;
  //     // return tableLen > 4 ? "270px" : undefined; // 小于等于5行时不出现滚动条 表格行数 * 单行高度 + 表头高度
  //     return '294px'
  //   },
  // },
  methods: {
    handleEdit(row = {}, tName) {
      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: customDialogCols({ tName }),
        formModel: {
          ...row,
        },
        httpRequest: (formModel) => {
          const { customerName, ...obj } = formModel;
          const params = {
            ...obj,
          };
          return [
            postSettleCashierTaskPrintConfig,
            postSettleCashierTaskPrintConfigCashierSave,
          ][tName](params);
        },
        successFunction: () => {
          this.$refs[`tableRef${tName}`][0]?.refreshTable(true);
        },
      });
    },
    getQueryParams() {
      return {};
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-container {
  .com-detail-top {
    padding-top:0px;
    margin-bottom: 0px;
  }
  .table-title {
    font-size: 14px;
    font-weight: 700;
    line-height: 22px;
    padding: 14px 0 11px;
    color: #515151;
  }
}
</style>
