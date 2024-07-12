<template>
  <div>
    <ComDrawer
      class="add-cabinet-arrangement"
      ref="myDrawer"
      :customDrawer="drawerConfig"
      :confirmClose="false"
    >
      <template v-slot:content>
        <ComDetailTop title="添加" :config="{}" />
        <ComForm :formConfig="searchFormConfig" v-show="isFormShow" />
        <ComTable
          :ref="`tableDrawerRef`"
          v-if="isFormShow"
          :tableHeight="tableConfig.tableHeight"
          :columnConfig="tableConfig.columnConfig"
          :httpRequest="tableConfig.httpRequest"
          :getQueryParams="getSearchParams"
          @onSelectionChange="onSelectionChangeEvt"
          :selectionTableRow="[...checkTableArr]"
        >
          <template v-slot:bottomTotal>
            <div class="grand-total" v-if="Object.keys(totalData[0]).length">
              <div class="total-item total-samount">
                <span class="title">待认领小计：</span>
                <div
                  v-for="(value, key) in totalData[0]"
                  :index="key"
                  class="item-space"
                >
                  <span>{{ value }}</span>
                  <span>{{ key }}</span>
                </div>
              </div>
              <div class="total-item total-tamount">
                <span class="title">总金额小计：</span>
                <div
                  v-for="(value, key) in totalData[1]"
                  :index="key"
                  class="item-space"
                >
                  <span>{{ value }}</span>
                  <span>{{ key }}</span>
                </div>
              </div>
            </div>
          </template>
        </ComTable>
      </template>
    </ComDrawer>
  </div>
</template>

<script>
import { searchDrawerFormCols, tableDrawerCols } from "./model";
import { accumulationFn } from "@/utils/instructions";
import {
  getBysSttleBill,
  getByStatement,
} from "@/api/settlementManage/paymentReceived";
export default {
  props: {},
  data() {
    return {
      drawerConfig: {
        title: "",
        width: "1288px",
        size: "small",
        footer: [
          {
            text: "取消",
            plain: true,
            handleClick: this.hide,
          },
          {
            text: "确定",
            type: "primary",
            disabled: true,
            handleClick: () => {
              this.saveSubmit();
            },
          },
        ],
      },
      searchFormConfig: {
        formModel: {},
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getTableList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        size: "small",
        labelWidth: "75px",
        lists: searchDrawerFormCols(),
        formRules: {},
      },
      tableConfig: {
        tableHeight: "calc(100vh - 262px)",
        httpRequest: getBysSttleBill,
        columnConfig: tableDrawerCols(),
      },
      isFormShow: false, // 阻止自动聚焦与表格选择缓存
      searchFromData: {},
      checkTableArr: [],
      routeId: "",
      totalData: [{}, {}],
    };
  },
  methods: {
    getTableList(searchFrom = {}) {
      const { billNo, orderNo, dealingsCompany, businessCompany } = searchFrom;
      this.searchFromData = {
        ...this.searchFromData,
        billNo,
        orderNo,
        dealingsCompany,
        businessCompany,
      };
      this.$refs[`tableDrawerRef`]?.refreshTable();
    },
    onSelectionChangeEvt(arr = []) {
      this.checkTableArr = arr;
      this.totalData = [{}, {}];
      arr.map((e) => {
        if (e.samount) {
          e.samount.split("+").map((cRes) => {
            const value = cRes.match(/[a-zA-Z]+|[^a-zA-Z]+/g)[0];
            const label = cRes.replace(/[^a-z]/gi, "");
            this.totalData[0][label] = accumulationFn(
              [this.totalData[0][label], value],
              2
            );
          });
        }
        if (e.tamount) {
          e.tamount.split("+").map((cRes) => {
            // const value = /(\d+(\.\d+)?)/.exec(cRes)[0];
            const value = cRes.match(/[a-zA-Z]+|[^a-zA-Z]+/g)[0];
            const label = cRes.replace(/[^a-z]/gi, "");
            this.totalData[1][label] = accumulationFn(
              [this.totalData[1][label], value],
              2
            );
          });
        }
      });
      this.$set(this.drawerConfig.footer[1], "disabled", !arr.length);
    },
    show(row = {}) {
      const { bankReceiptId, billIds = [] } = row;
      if (!bankReceiptId) return;
      this.onSelectionChangeEvt(billIds);
      this.searchFromData = {
        bankReceiptId,
        // idsrc:billIds
      };
      this.$refs.myDrawer.show();
      this.$nextTick(() => {
        this.isFormShow = true;
      });
    },
    hide() {
      this.isFormShow = false;
      this.$refs.myDrawer.hide();
    },
    getSearchParams(row) {
      return {
        type: 1,
        status: 55,
        isClaim: 0,
        ...this.searchFromData,
      };
    },
    saveSubmit() {
      const { bankReceiptId } = this.searchFromData;
      let idArr = this.checkTableArr.map((item) => item.id);
      if (idArr.length > 0) {
        getByStatement(idArr, bankReceiptId).then((res) => {
          const { rows } = res;
          this.$emit("handleSuccess", rows);
          this.hide();
        });
      } else {
        this.$emit("handleSuccess", []);
        this.hide();
      }
    },
  },
  components: {
    ComDrawer: () => import("_comp/ComDrawer"),
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
  },
  computed: {},
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.add-cabinet-arrangement {
  .operation-content {
    .iconfont {
      font-size: 13px;
      margin-right: 2px;
    }
  }
  /deep/ .el-drawer {
    .com-detail-top {
      padding: 20px 0 0 0;
      margin: 0 0px 15px;
    }
    .el-table--medium td {
      padding: 7px 0;
    }
    .el-drawer__header {
      display: none;
    }
    .my-pagination-container {
      text-align: left;
      padding: 12px 0;
      position: absolute;
      bottom: 0;
    }
  }
  .grand-total {
    display: flex;
    justify-content: flex-start;
    .total-item {
      display: flex;
      align-items: center;
      .title {
        font-size: 14px;
        font-weight: bold;
        padding-left: 15px;
      }
      .item-space {
        margin-right: 15px;
      }
    }
    .total-tamount {
      &:before {
        content: "(";
      }
      &:after {
        content: ")";
      }
    }
  }
}

.estimate-header {
  display: flex;
  span {
    flex: 1;
    padding: 0 3px;
  }
}
.estimate-row {
  span {
    flex: 1;
    padding: 0 3px;
  }
}
</style>
