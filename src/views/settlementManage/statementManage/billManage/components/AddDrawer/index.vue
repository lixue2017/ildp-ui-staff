<template>
  <ComDrawer
    class="add-drawer"
    ref="myDrawer"
    :customDrawer="drawerConfig"
    :confirmClose="false"
    v-if="drawerShow"
  >
    <template v-slot:content>
      <ComDetailTop title="数据添加" class="title-sides-margin-none" :config="{}" />
      <ComForm
        :formConfig="searchConfig()"
        v-if="$refs.myDrawer && $refs.myDrawer.drawerVisible"
      >
      </ComForm>
      <ComTable
      v-loading="loading"
        ref="tableConfig"
        :tableHeight="tableConfig.tableHeight"
        :columnConfig="tableConfig.columnConfig"
        :httpRequest="tableConfig.httpRequest"
        :getQueryParams="getQueryParams"
        @onSelectionChange="onSelectionChange"
        :selectionTableRow="[...selectionRows]"
      >
        <template v-slot:customRow="{ slotProps }">
          <template v-if="slotProps.prop === 'type'">
            <span
              :style="{
                color: slotProps.dicsList.color,
              }"
            >
              {{ slotProps.dicsList.nameCn }}
            </span>
          </template>
        </template>
				<template v-slot:bottomTotal>
          <div class="bottomTotalClass">
            <div class="selectAll">
              <el-checkbox
                v-model="selectAll"
                @change="handleSelectAll"
                >所有分页全选</el-checkbox
              >
            </div>
            <div class="money-total">
              <div class="grand-total" v-if="subtotalMoney">
                <span class="title">小计：</span>
                <span class="value">{{ subtotalMoney }}</span>
              </div>
              <div v-else></div>
            </div>
          </div>
				</template>
      </ComTable>
    </template>
  </ComDrawer>
</template>

<script>
import { settleAccountsList } from "@/api/settlementManage/statementManage";
import { searchColumns, tableColumns } from "./model";
import { DateCompute } from "@/utils/index.js";
import { mapActions, mapState } from "vuex";
import { accumulationFn } from "@/utils/instructions";

export default {
  components: {
    ComDrawer: () => import("_comp/ComDrawer"),
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
  },
  data() {
    return {
      drawerShow: false,
      drawerConfig: {
        title: "slot",
        width: "1300px",
        size: "small",
        showClose: false,
        wrapperClosable: true,
        footer: [
          {
            text: "确定(0)",
            type: "primary",
            disabled: true,
            handleClick: () => {
              this.$emit("handleSuccess", this.selectionRows);
              this.hide();
            },
          },
          {
            text: "取消",
            plain: true,
            handleClick: () => {
              this.hide();
            },
          },
        ],
      },
      searchFromData: {},
      searchFormConfig: {
        formModel: {}, // 表单数据
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        labelWidth: "80px",
      },
      tableConfig: {
        tableHeight: "calc(100vh - 288px)",
        httpRequest: settleAccountsList,
        columnConfig: tableColumns,
      },
      selectionRows: [],
      selectedData: [],
			sBusinessTypeList: [],
      selectAll:false,
      loading:false,
    };
  },
  methods: {
    show(rows) {
			this.selectionRows = [];
      this.selectedData = rows || [];
      this.sBusinessTypeList = this.dictBusinessTypeList
        .map((e) => e.value)
        .filter((v) => !["35", "40"].includes(v));
      this.drawerShow = true;
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.myDrawer.show();
        });
      });
    },
    hide() {
      this.selectAll=false
      this.$refs.myDrawer.hide();
      this.drawerShow = false;
    },
    getList(searchFrom) {
      this.selectAll=false
      const { createTime, ...searchObj } = searchFrom
      this.searchFromData = {
        ...searchObj,
        beginTime: createTime && createTime[0],
        endTime: createTime && createTime[1],
      };
      this.$refs.tableConfig.refreshTable(true);
    },
		searchConfig() {
      const { businessType } = this.selectedData[0] || {};
      return {
        ...this.searchFormConfig,
        lists: searchColumns(businessType), // 表单渲染列表
      };
    },
    getQueryParams() {
      const { billingMain, dealingsCompany, currencyId, type, businessType } =
        this.selectedData[0] || {};
      let searchOpt = {
        ...this.searchFromData,
        idsrc: this.selectedData.map((e) => e.id).join(","), //去重，去掉列表已经勾选的
        dataType: 1, //勾选去除
        billingMain, //记账主体
        dealingsCompany, //往来单位
        isGenerateStatement: 0, //是否已经生成对账单
        currencyId: type === 0 ? currencyId : undefined, // 币别 应付不能跨币种合并(应收可以跨币种)；
        isMustAccounting: 1,
        type, // 0-付款 1-收款
      };
      if (businessType == 35) {
        searchOpt.businessTypeList = ["35"];
      }
      if (businessType == 40) {
        searchOpt.businessTypeList = ["40"];
      }
      if (!searchOpt.businessTypeList || !searchOpt.businessTypeList.length) {
        searchOpt.businessTypeList = this.sBusinessTypeList;
      }
      return searchOpt;
    },
    onSelectionChange(rows=[]) {
      this.selectionRows = rows||[];
      this.$set(this.drawerConfig.footer[0], "text", `确定(${rows.length})`);
      this.$set(this.drawerConfig.footer[0], "disabled", !rows.length);
      this.$refs.tableConfig._toggleRowSelectionMixin({
        newCheckRows: this.selectionRows,
      });
    },
    handleSelectAll(status) {
      this.loading = true;
      if (status) {
        //每一次都得重新获取最新的数据，避免他们多屏操作增加新数据
        const params = {
          ...this.getQueryParams(),
          pageNum: 1,
          pageSize: 999999,
        };
        settleAccountsList(params).then((res) => {
          const { rows } = res;
          this.onSelectionChange(rows);
          this.loading = false;
        });
      } else {
        this.onSelectionChange();
        this.loading = false;
      }
    },
  },
	computed: {
		subtotalMoney() {
      let moneyArr = [];
      (this.selectionRows || []).forEach((e) => {
        const curIndex = moneyArr.findIndex(
          (m) => m.currencyCode === e.currencyCode
        );
        if (curIndex > -1) {
          // 不同类型相减
          moneyArr[curIndex].totalMoney = accumulationFn([
						moneyArr[curIndex].totalMoney,
						+e.totalMoney
					]);
        } else {
          moneyArr.push({
            currencyCode: e.currencyCode,
            totalMoney: +e.totalMoney,
          });
        }
      });
      return moneyArr
        .map((e) => this.formatMoney(e.totalMoney) + e.currencyCode)
        .join(" + ") || 0;
    },
		...mapState({
      dictBusinessTypeList: (state) =>
        state.dictionary.dicsData.settlementBusinessType || [],
    }),
	},
};
</script>
<style lang="scss" scoped>
.add-drawer {
  /deep/ {
    .el-drawer__header {
      position: absolute;
      top: -56px;
    }
    .drawer-content {
      padding: 0 20px 10px;
    }
    .my-pagination-container {
      text-align: left;
      padding: 12px 0;
      position: absolute;
      bottom: 0;
    }
    .el-table::before {
      background-color: transparent;
    }
  }
  .com-detail-top {
    padding: 20px 0 0;
    margin-bottom: 20px;
  }

  /deep/.bottom-pagination {
    display: flex;
    justify-content: space-between;
    min-width: 0;
    .bottomTotalClass {
      display: flex;
      align-items: center;
      min-width:0;
      flex: 1;
      .selectAll {
        min-width: 0;
      }
      .money-total {
        min-width: 0;
        flex: 1;
        .grand-total {
          display: flex;
          justify-content: flex-start;
          background: none;
          span {
            padding-left: 0px;
            margin-left: 40px;
          }
          .title {
            margin-right: -30px;
            font-size: 14px;
            font-weight: bold;
            flex-shrink: 0;
          }
          .value {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow-x: auto;
            &::-webkit-scrollbar {
              z-index: 11;
              width: 6px;
            }
            &::-webkit-scrollbar:horizontal {
              height: 6px;
            }
            &::-webkit-scrollbar-thumb {
              border-radius: 5px;
              width: 6px;
              background: #b4bccc;
            }
          }
        }
      }
    }
    .my-pagination-container {
      min-width: 0;
      flex: 1;
      position: unset;
      text-align: right;
    }
  }
}
</style>
