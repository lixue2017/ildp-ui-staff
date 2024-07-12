<template>
  <div class="monthly-profit">
    <div class="content">
      <div class="top-tab">
        <div class="title">月利润统计表</div>
        <div class="tab-right">
          <span class="tab-sub"
            >锁单之后系统自动生成，最后锁定于2022-07-15 14:30</span
          >
          <el-button type="primary" size="small" plain> 导出 </el-button>
        </div>
      </div>
      <ComForm :formConfig="searchFormConfig" />
      <div class="monthly-title">2022年6月月利润统计表</div>
      <ComTable
        ref="tableConfig"
        :columnConfig="tableConfig.columnConfig"
        :httpRequest="tableConfig.httpRequest"
        :getQueryParams="tableConfig.getQueryParams"
        :pagination="false"
        :extraConfig="{ multiline: true }"
      />
      <ComTable
        ref="totalTableConfig"
        :columnConfig="totalTableConfig.columnConfig"
        :httpRequest="totalTableConfig.httpRequest"
        :pagination="false"
        :extraConfig="{ multiline: true }"
      >
        <template v-slot:customRow="{ slotProps }">
          <template v-if="slotProps.prop === 'operationOrderNum'">
            小计：{{ slotProps.row.number }}票
          </template>
        </template>
      </ComTable>
      <div class="totalReceivable">
        <span>本月票结汇率：应付USD：--</span>
        <span>应收USD：--</span>
        <span>应收HKD：--</span>
        <span>，票结汇率：--</span>
        <span>月结汇率+-0.05</span>
      </div>
      <div class="businessTable">
        <div class="title">业务费用</div>
        <div class="table">
          <ComTable
            ref="businessTableColumns"
            :columnConfig="businessTableColumns.columnConfig"
            :httpRequest="businessTableColumns.httpRequest"
            :pagination="false"
            :extraConfig="{ multiline: true }"
          >
            <template v-slot:customHeader="{ slotProps }">
              <template
                v-if="
                  /total|basicTask|businessExpenses|exceedBusiness|totalBusiness/.test(
                    slotProps.column.prop
                  )
                "
              >
                <div>{{ slotProps.column.labelTop }}</div>
                <div>{{ slotProps.column.labelBtm }}</div>
              </template>
            </template>
          </ComTable>
        </div>
      </div>
      <div class="rateMonth">
        <div class="flex border-bottom">
          <div class="rateMonth-title line-height-50">本月现钞汇率</div>
          <div class="rateMonth-right">
            <div class="rateMonth-top">
              <div>USD</div>
              <div>HKD</div>
              <div>EUR</div>
              <div>GBP</div>
            </div>
            <div class="rateMonth-bottom"></div>
          </div>
        </div>
        <div class="flex border-bottom">
          <div class="rateMonth-title">应付</div>
          <div></div>
        </div>
        <div class="flex">
          <div class="rateMonth-title">应付</div>
          <div></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  searchColumns,
  tableColumns,
  subtotalTableColumns,
  businessMonthFee,
} from "./model";
export default {
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
  },
  data() {
    return {
      searchFormConfig: {
        formModel: {}, // 表单数据
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            console.log(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        size: "small",
        labelWidth: "85px",
        lists: [
          {
            className: "search-form-width",
            fieldList: [
              {
                rows: [
                  {
                    cols: searchColumns,
                  },
                ],
              },
            ],
          },
        ], // 表单渲染列表
        formRules: {}, // 表单校验规则
      },
      tableConfig: {
        getQueryParams: this.getQueryParams,
        httpRequest: () => {
          return new Promise((resolve) => {
            resolve({
              total: 2,
              rows: [
                {
                  id: 1,
                  gzh: "ZJB220100004",
                  dsddh: "BS02201041",
                  ywy: "中进宝",
                  khmc: "欧洲FBA柜",
                  khrq: "2022-01-12",
                },
                {
                  id: 2,
                  gzh: "ZJB220100004",
                  dsddh: "BS02201041",
                  ywy: "中进宝",
                  khmc: "欧洲FBA柜",
                  khrq: "2022-01-12",
                },
              ],
            });
          });
        },
        columnConfig: tableColumns,
      },
      totalTableConfig: {
        httpRequest: () => {
          return new Promise((resolve) => {
            resolve({
              total: 2,
              rows: [
                {
                  id: 1,
                  number: 2,
                  gzh: "ZJB220100004",
                  dsddh: "BS02201041",
                  ywy: "中进宝",
                  khmc: "欧洲FBA柜",
                  khrq: "2022-01-12",
                  rmb: "1790.22",
                },
              ],
            });
          });
        },
        columnConfig: subtotalTableColumns,
      },
      businessTableColumns: {
        httpRequest: () => {
          return new Promise((resolve) => {
            resolve({
              total: 2,
              rows: [
                {
                  id: 1,
                  number: 2,
                  gzh: "ZJB220100004",
                  dsddh: "BS02201041",
                  ywy: "中进宝",
                  khmc: "欧洲FBA柜",
                  khrq: "2022-01-12",
                  rmb: "1790.22",
                },
              ],
            });
          });
        },
        columnConfig: businessMonthFee,
      },
    };
  },
};
</script>

<style lang="scss" scoped>
.monthly-profit {
  background: #f9f9f9;
  padding: 11px 0 20px;
  .content {
    width: 1214px;
    padding: 15px 20px 30px;
    min-height: calc(100vh - 108px);
    margin: auto;
    background: #fff;

    .top-tab {
      display: flex;
      align-items: center;

      .title {
        font-size: 14px;
        font-weight: bold;
        line-height: 20px;
        padding-bottom: 3px;
        border-bottom: 2px solid #515151;
      }

      .tab-right {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex: 1;
        border-bottom: 1px solid #e2e2e2;
        line-height: 20px;
        padding-left: 30px;

        .tab-sub {
          color: #8b8b8b;
        }
        .el-button {
          margin-bottom: 1px;
        }
      }
    }

    .search-form-class {
      margin: 15px 0;
      /deep/ .el-form-item--small.el-form-item {
        margin-bottom: 0;
      }
    }

    .monthly-title {
      font-size: 14px;
      font-weight: bold;
      height: 50px;
      line-height: 50px;
      border-top: 1px solid #e2e2e2;
      background-color: #f7f7f7;
      text-align: center;
    }
  }
}
.businessTable {
  display: flex;
  .title {
    width: 147px;
    line-height: 102px;
    border: 1px solid #e2e2e2;
    border-right: none;
    text-align: center;
  }
  .table {
    width: calc(100% - 147px);
  }
}
.tableData {
  flex: 1;
}
.totalReceivable {
  height: 35px;
  line-height: 35px;

  span {
    margin-right: 60px;
  }
}
/deep/ {
  .tableData .table-header-cell .cell {
    padding: 0 10px;
  }
  .el-table .el-table__header-wrapper th,
  .el-table .el-table__fixed-header-wrapper th {
    padding: 0;
  }
}
.rateMonth {
  width: 491px;
  margin-top: 30px;
  border-top: 1px solid #e2e2e2;
  border-bottom: 1px solid #e2e2e2;
  line-height: 50px;

  .flex {
    display: flex;
  }
  .rateMonth-title {
    width: 118px;
    border-right: 1px solid #e2e2e2;
    text-align: center;
    &.line-height-50 {
      line-height: 100px;
      & > div {
        flex: 1;
      }
    }
  }
  .rateMonth-right {
    flex: 1;
  }
  .rateMonth-top {
    display: flex;
    justify-content: space-between;
    text-align: center;
    border-bottom: 1px solid #e2e2e2;
    background: #f8f8f8;

    div {
      flex: 1;
    }
  }
  .rateMonth-bottom {
    flex: 1;
    height: 50px;
  }
}
.border-bottom {
  border-bottom: 1px solid #e2e2e2;
}
</style>
