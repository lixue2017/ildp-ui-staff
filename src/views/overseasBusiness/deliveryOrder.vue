<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :formConfig="searchFormConfig"
              @searchHeight="searchHeight"
              v-if="showSearchForm && tabsConfig.activeName === tab.name"
            >
              <template v-slot:form-submit>
                <ComColumnConf
                  :tableCols="tableAllMixinConfig(tab.name)"
                  :tName="tab.name"
                  @setColumnConf="setColumnMixinConf"
                />
              </template>
            </ComForm>
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              :ref="`tableRef${tab.name}`"
              :tableHeight="`calc(100vh - ${extraHeight + formHeight}px)`"
              :columnConfig="tableMixinConfig(tab.name)"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="tableConfig.getQueryParams"
              :rowOperationBtnListFn="rowOperationBtnListFn"
              @handleTableView="(row) => handleView(row, pageType)"
              v-if="showSearchForm && tabsConfig.activeName === tab.name"
            >
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
    <editDialogForm ref="dialogFormRef" @handleSuccess="mixinkeepTable" />
    <editTrailer
      ref="trailerEditRef"
      @handleSuccess="() => editTrailerSuccess(1)"
    />
    <!-- 自定义弹窗 -->
    <ComCustomDialog ref="customDlgRef" />
    <PlaceOrderDialog
      ref="placeOrderRef"
      :tabType="pageType"
      title="海外提派"
      @handleSuccess="mixinkeepTable"
    />
  </div>
</template>

<script>
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { mixinTableConf } from "./components/mixinTabelConf.js";
import { delivery } from "@/views/overseasBusiness/components/model.js";
import {
  getDeliveryClearanceList,
  clearanceRepulse,
} from "@/api/operateRecord/customsClearance";
import { remarkDialogCols } from "@/views/components/ConfirmDialog/customFormDialog/model.js";
export default {
  name: "DeliveryOrder",
  mixins: [mixinColsConf, mixinTableConf],
  data() {
    return {
      pageType: 2,
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: this.overseaLangObj.hw_ps_dd("海外提派订单"),
            name: "1",
          },
        ],
      },
      searchFormConfig: {
        formModel: {}, // 表单数据
        fold: true, // 模糊搜索是否需要展开按钮
        httpRequest: this.searchList,
        searchForm: true,
        searchNum: delivery.searchColumns.length,
        labelWidth:
          this.overseaLangObj.yu_yan_lang === "en-us" ? "124px" : "110px",
        lists: [
          {
            className: "search-form-width",
            fieldList: [
              {
                rows: [
                  {
                    cols: delivery.searchColumns,
                  },
                ],
              },
            ],
          },
        ],
        formRules: {},
      },
      tableConfig: {
        httpRequest: getDeliveryClearanceList,
        getQueryParams: this.getQueryParams,
      },
      mixinTableColArr: [delivery.tableColumns],
      searchFromData: {},
      statusList: [
        {
          showStatus: [22],
          color: "#FF6767",
          text: this.overseaLangObj.dh_repulse("打回"),
          handleClick: this.handleRepulse,
        },
      ],
    };
  },
  methods: {
    rowOperationBtnListFn(row) {
      const { devlieryStatus, overseaBusinessTypes } = row;

      const btnArr = this.statusList.filter((e) => {
        const { showStatus } = e;
        if (
          showStatus.includes(devlieryStatus) &&
          overseaBusinessTypes.length == 1 &&
          overseaBusinessTypes[0] == 2
        ) {
          return true;
        }
      });
      return btnArr;
    },
    handleRepulse(row) {
      this.$refs.customDlgRef?.showCustomDialog({
        customFormConfig: remarkDialogCols({
          title: this.overseaLangObj.dh_repulse("打回"),
          label: `${this.overseaLangObj.bz_remark("打回说明")}：`,
          id: "remark",
          rulesKey: "remark",
        }),
        formModel: {},
        httpRequest: (formModel) => {
          // console.log("formModel", formModel);
          const { remark } = formModel;
          const params = {
            id: row.id,
            remark,
            source: 2,
          };
          return clearanceRepulse(params);
        },
        successFunction: this.mixinkeepTable,
      });
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-container {
  /deep/ {
    .drawer-title {
      display: flex;
      & > span:first-child {
        margin-right: 30px;
      }
    }
  }
}
</style>
