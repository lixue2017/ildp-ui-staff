<template>
  <div>
    <div :class="`app-container ${isView && 'container-height'}`">
      <ComTabs :tabsConfig="tabsConfig">
        <template v-for="tab in tabsConfig.tabs">
          <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
            <keep-alive>
              <ComForm
                ref="comFormRef"
                :formConfig="searchFormConfig"
                v-if="showSearchForm && tabsConfig.activeName === tab.name"
                @handleChange="handleChange"
              >
                <template v-slot:form-submit>
                  <ComColumnConf
                    :tableCols="tableAllMixinConfig(tab.name)"
                    :tName="tab.name"
                    :showMoveBtn="true"
                    @setColumnConf="(arr) => setColumnMixinConf(arr)"
                    v-if="!isView"
                  />
                  <el-button
                    size="small"
                    type="primary"
                    icon="iconfont lieshezhi"
                    plain
                    @click="handleToggle"
                    v-else
                    >图显示</el-button
                  >
                  <div class="popover" v-if="showReport">
                    <div class="title">选择呈现的报表(至少选1个)</div>
                    <div class="content">
                      <el-checkbox-group v-model="checkedReport">
                        <div
                          v-for="(item, index) in reportPopoverConfig"
                          class="checkbox-item"
                          :key="item.value"
                        >
                          <el-checkbox :label="item.value">{{
                            item.label
                          }}</el-checkbox>
                          <div class="checkbox-icon">
                            <i
                              :class="`iconfont shangyi ${!index && 'hide'}`"
                              @click="handleClick('pre', index)"
                            ></i>
                            <i
                              :class="`iconfont a-shangyi2 ${
                                index + 1 === reportPopoverConfig.length &&
                                'hide'
                              }`"
                              @click="handleClick('next', index)"
                            ></i>
                          </div>
                        </div>
                      </el-checkbox-group>
                    </div>
                    <div class="footer">
                      <el-button
                        size="small"
                        type="primary"
                        @click="handleGenerateReport"
                        >生成报表</el-button
                      >
                      <el-button size="small" plain @click="handleCancel"
                        >取 消</el-button
                      >
                    </div>
                  </div>
                </template>
                <template v-slot:salesmanIdList="slotProps">
                  <AutoComplete
                    ref="salesmanRef"
                    :formModel="slotProps.formModel"
                    :fieldItem="{
                      ...slotProps.fieldItem,
                      isNoMatchClear: true,
                      className: 'auto-dis-search',
                      disabled: !slotProps.formModel.deptId,
                      refreshRequest: !salesmanRefreshRequest,
                      handle: (val) =>
                        handleChange(val, slotProps.fieldItem.id),
                    }"
                    :additionalParam="{
                      customerId: slotProps.formModel.deptId,
                    }"
                    @clearNoMatch="clearNoMatch"
                  />
                </template>
                <template v-slot:customerIds="slotProps">
                  <AutoComplete
                    ref="companyRef"
                    :formModel="slotProps.formModel"
                    :fieldItem="{
                      ...slotProps.fieldItem,
                      className: 'auto-dis-search',
                      placeholder:
                        !slotProps.formModel.salesmanIdList ||
                        !slotProps.formModel.salesmanIdList.length
                          ? '请先选择业务员'
                          : slotProps.fieldItem.placeholder,
                      disabled:
                        !slotProps.formModel.salesmanIdList ||
                        !slotProps.formModel.salesmanIdList.length,
                      refreshRequest: !companyRefreshRequest,
                    }"
                    :additionalParam="{
                      salesmanIds: slotProps.formModel.salesmanIdList,
                    }"
                  />
                </template>
              </ComForm>
            </keep-alive>
            <keep-alive v-if="mixinShowTable">
              <ComTable
                :ref="`tableRef${tab.name}`"
                :tableHeight="tableConfig.tableHeight"
                :httpRequest="tableConfig.httpRequest"
                :columnConfig="tableMixinConfig(tab.name)"
                :getQueryParams="getQueryParams"
                :defaultExpandAll="false"
                v-if="!isView"
              >
                <template v-slot:customRow="{ slotProps }">
                  <template v-if="slotProps.prop === 'expand'">
                    <div
                      v-if="
                        slotProps.row.businessReports &&
                        slotProps.row.businessReports.length
                      "
                    >
                      <ComTable
                        :columnConfig="expandColumns"
                        :columnData="slotProps.row.businessReports"
                        :extraConfig="{ stripe: false }"
                      />
                    </div>
                    <div class="no-data" v-else>暂无数据~</div>
                  </template>
                </template>
              </ComTable>
            </keep-alive>
          </el-tab-pane>
        </template>
        <template v-slot:slotTabsRight>
          <div class="switchBtn">
            <el-button size="mini" type="primary" round @click="switchView">
              {{ isView ? "切换列表模式" : "切换视图模式"
              }}<i class="iconfont qiehuan el-icon--right"></i>
            </el-button>
          </div>
        </template>
      </ComTabs>
    </div>
    <template v-if="showSearchForm && isView">
      <template v-for="item in reportConfig">
        <ReportModel
          ref="reportModelRef"
          :key="item.value"
          :itemType="item"
          :options="dictionary.dicsData[item.basicType]"
          :showList="
            item.filter &&
            searchFromData.orderTypes &&
            searchFromData.orderTypes.length
              ? searchFromData.orderTypes
              : null
          "
          :config="item.config"
          :getQueryParams="getQueryParams"
          v-if="item.show"
        />
      </template>
    </template>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import {
  searchColumns,
  formRules,
  tableColumns,
  expandColumns,
} from "./model.js";
import { logisticsCustomerInfo } from "@/api/settlementManage/paymentReceived.js";
import { dateForwardMon, formatDate } from "@/utils/index.js";
import {
  getReportOfGeneralView,
  reportOfGeneralViewExport,
} from "@/api/settlementManage/dataOverview.js";
import { comFileDownload } from "@/utils/download.js";

export default {
  name: "BusinessReport",
  mixins: [mixinColsConf],
  components: {
    ReportModel: () => import("./components/ReportModel"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
  },
  data() {
    const oDate = new Date();
    const placeOrderDate = [
      dateForwardMon(oDate),
      formatDate(oDate, "-", "date"),
    ];
    return {
      expandColumns,
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "业务报表总览",
            name: "1",
          },
        ],
        btnArr: [
          {
            table: "导出",
            handleClick: () => this.handleReportExport(),
          },
        ],
      },
      searchFormConfig: {
        formModel: {
          placeOrderDate,
        }, // 表单数据
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.searchList(formModel);
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
        formRules, // 表单校验规则
      },
      searchFromData: {
        startDate: placeOrderDate && placeOrderDate[0],
        endDate: placeOrderDate && placeOrderDate[1],
      },
      tableConfig: {
        tableHeight: "calc(100vh - 316px)",
        httpRequest: getReportOfGeneralView,
      },
      isView: true, //true视图状态    false列表状态
      mixinTableColArr: [tableColumns],
      reportConfig: [
        {
          prop: "createDateList",
          label: "月统计报表",
          value: 0,
          basicType: "tongjiweidu",
          show: true,
          config: {
            dataZoom: true,
            dataZoomConfig: {
              bottom: 27,
            },
          },
        },
        {
          prop: "createDateList",
          label: "日统计报表",
          value: 1,
          basicType: "tongjiweidu",
          show: true,
          config: {
            dataZoom: true,
            rotate: true,
          },
        },
        {
          prop: "salesManList",
          label: "业务员报表",
          value: 2,
          basicType: "tongjiweidu",
          show: true,
          config: {
            dataZoom: true,
            dataZoomConfig: {
              bottom: 27,
            },
          },
        },
        {
          prop: "customerList",
          label: "委托人报表",
          value: 3,
          basicType: "tongjiweidu",
          show: true,
          config: {
            dataZoom: true,
            dataZoomConfig: {
              bottom: 39,
            },
          },
        },
        {
          prop: "createDateList",
          label: "月业务类型统计",
          value: 4,
          basicType: "ywbbddlx",
          show: true,
          filter: true,
          config: {
            dataZoom: true,
            dataZoomConfig: {
              bottom: 27,
            },
          },
        },
      ],
      reportPopoverConfig: [],
      checkedReport: [0, 1, 2, 3, 4],
      salesmanRefreshRequest: false,
      companyRefreshRequest: false,
      showReport: false,
      groupTypes: [1, 2, 3, 4],
    };
  },
  computed: {
    ...mapState(["dictionary"]),
    ...mapGetters(["salesmanId"]),
  },
  mounted() {
    logisticsCustomerInfo({ pageNum: 1, pageSize: 20 }).then(
      ({ rows = [] }) => {
        const { code, shortName, id: deptId } = rows[0] || {};
        const deptName = `${code}[${shortName}]`;
        this.searchFormConfig.formModel = {
          ...this.searchFormConfig.formModel,
          deptId,
          deptName,
          salesmanIdList: this.salesmanId ? [this.salesmanId] : [],
        };
        this.searchFromData.deptId = deptId;
        this.searchFromData.salesmanIdList = this.salesmanId
          ? [this.salesmanId]
          : [];
        this["dictionary/getDictionary"]("dataOverview").then((res) => {
          const typeProps = {
            2: { prop: "ecList", tableProp: "ec", totalProp: "totalEc" },
            4: {
              prop: "traditionList",
              tableProp: "tradition",
              totalProp: "totalTradition",
            },
            5: {
              prop: "otherList",
              tableProp: "other",
              totalProp: "totalOther",
            },
            7: {
              prop: "clearanceRcList",
              tableProp: "clearanceRc",
              totalProp: "totalClearanceRc",
            },
            8: {
              prop: "clearanceTpList",
              tableProp: "clearanceTp",
              totalProp: "totalClearanceTp",
            },
            9: {
              prop: "thirdList",
              tableProp: "third",
              totalProp: "totalThird",
            },
            10: {
              prop: "overseasPlatformList",
              tableProp: "overseasPlatform",
              totalProp: "totalOverseasPlatform",
            },
            11: { prop: "fbaList", tableProp: "fba", totalProp: "totalFba" },
          };
          const statisticsTypeProps = {
            1: { prop: "orderCountList", tableProp: "orderCount" },
            2: { prop: "numList", tableProp: "num" },
            3: { prop: "volumeList", tableProp: "volume" },
            4: { prop: "weightList", tableProp: "weight" },
          };
          this.dictionary.dicsData.ywbbddlx =
            this.dictionary.dicsData.ywbbddlx.map((item) => ({
              ...item,
              ...typeProps[item.value],
            }));
          this.dictionary.dicsData.tongjiweidu =
            this.dictionary.dicsData.tongjiweidu.map((item) => ({
              ...item,
              ...statisticsTypeProps[item.value],
            }));
          this.showSearchForm = true;
          if (!this.isView) {
            this.mixinkeepTable(true);
          }
        });
      }
    );
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    searchList(searchFrom = {}) {
      const { placeOrderDate, ...searchObj } = searchFrom;
      this.searchFromData = {
        ...searchObj,
        startDate: placeOrderDate && placeOrderDate[0],
        endDate: placeOrderDate && placeOrderDate[1],
      };
      if (this.isView) {
        this.$refs.reportModelRef.forEach((ref) => {
          ref.searchList(this.searchFromData);
        });
      } else {
        this.mixinkeepTable(true);
      }
    },
    setGroupTypes(groupTypes) {
      this.groupTypes = groupTypes;
    },
    getQueryParams() {
      return {
        ...this.searchFromData,
        groupTypes: this.groupTypes,
      };
    },
    switchView() {
      this.showReport = false;
      this.isView = !this.isView;
    },
    handleChange(val, prop) {
      switch (prop) {
        case "deptId":
          this.$refs.comFormRef[0].setFormModel({
            salesmanIdList: "",
            customerIds: "",
          });
          this.salesmanRefreshRequest = !this.salesmanRefreshRequest;
          break;
        case "salesmanIdList":
          this.$refs.comFormRef[0].setFormModel({
            customerIds: "",
          });
          this.companyRefreshRequest = !this.companyRefreshRequest;
          break;
        default:
          break;
      }
    },
    handleToggle() {
      this.showReport = !this.showReport;
      let checkedReport = [];
      this.reportPopoverConfig = this.reportConfig.map((item) => {
        if (item.show) {
          checkedReport.push(item.value);
        }
        return { ...item };
      });
      this.checkedReport = checkedReport;
    },
    handleClick(type, index) {
      if (type === "pre") {
        this.swapArray(this.reportPopoverConfig, index, index - 1);
      } else {
        this.swapArray(this.reportPopoverConfig, index, index + 1);
      }
    },
    swapArray(arr, index1, index2) {
      arr[index1] = arr.splice(index2, 1, arr[index1])[0];
      return arr;
    },
    handleGenerateReport() {
      this.reportConfig = this.reportPopoverConfig.map((item) => {
        return { ...item, show: this.checkedReport.includes(item.value) };
      });
      this.showReport = false;
    },
    handleCancel() {
      this.showReport = false;
    },
    handleReportExport() {
      //导出
      const params = this.getQueryParams();
      comFileDownload(this, reportOfGeneralViewExport, params);
    },
    clearNoMatch(val) {
      if (this.searchFromData.salesmanIdList.length != val.length) {
        this.$refs.comFormRef[0].setFormModel({
          salesmanIdList: val,
        });
        const params = this.$refs.comFormRef[0].getFormParams();
        this.searchList(params);
      }
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-container {
  &.container-height {
    border-radius: 4px;
    min-height: auto;
    /deep/ {
      .el-tabs__content {
        overflow: initial;
      }
    }
  }
  .no-data {
    height: 50px;
    line-height: 50px;
    margin-left: -80px;
    text-align: center;
    color: #919191;
  }
  /deep/ {
    .com-tabs .tabs-right-btn {
      width: 100%;
      padding-left: 88px;
      justify-content: space-between;
    }
    .el-table__expanded-cell {
      padding: 0;

      .el-table--border,
      .el-table--group {
        border: none;
      }
      .tableData {
        .table-header-cell {
          background-color: #fcfcfc;
        }
        .table-row {
          &.hover-row,
          &:hover {
            & > td.e-table__cell {
              background-color: #fcfcfc;
            }
          }
        }
      }
      .el-table__body {
        padding: 8px 0;
        background-color: #fcfcfc;
        td {
          padding: 6px 0;
          border-bottom: none;
          background-color: #fcfcfc;
        }
      }
      .el-table::before,
      .el-table__fixed::before {
        display: none;
      }
    }
    .iconfont {
      font-size: 13px;
    }
    .search-form-btn {
      position: relative;
    }
    .auto-dis-search {
      .el-input.is-disabled {
        .el-input__inner {
          &::placeholder {
            color: #fa7a7a;
          }
        }
      }
    }
  }
  .switchBtn {
    margin-bottom: -18px;
    /deep/ {
      .el-button {
        background: rgba(80, 148, 255, 0.7);
        border: none;

        &.el-button--mini.is-round {
          padding: 3px 12px;
        }
        span,
        i {
          font-weight: 400;
        }
      }
    }
  }
  .popover {
    width: 264px;
    position: absolute;
    top: 42px;
    right: 0;
    z-index: 1;
    text-align: left;
    border-radius: 4px;
    box-shadow: 0px 0px 8px 0px rgba(169, 169, 169, 0.5);

    &::before {
      content: "";
      width: 10px;
      height: 10px;
      position: absolute;
      top: -6px;
      right: 25px;
      z-index: -1;
      background: #f4f4f4;
      box-shadow: 0px 0px 8px 0px rgba(169, 169, 169, 0.5);
      transform: rotateZ(45deg);
    }
    .title {
      line-height: 50px;
      font-size: 14px;
      padding-left: 20px;
      color: #8b8b8b;
      background: #f4f4f4;
      border-radius: 4px 4px 0 0;
    }
    .content {
      padding: 0 14px;
      background: #fff;

      .checkbox-item {
        height: 38px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        /deep/ {
          .el-checkbox__label {
            padding-left: 10px;
          }
          .el-checkbox__input.is-checked + .el-checkbox__label {
            color: #515151;
          }
        }
        &:not(:last-child) {
          border-bottom: 1px solid #e2e2e2;
        }
        .checkbox-icon {
          i {
            font-size: 16px;
            color: #5094ff;
            cursor: pointer;
            &:nth-child(2) {
              margin-left: 7px;
            }
            &.hide {
              visibility: hidden;
            }
          }
        }
      }
    }
    .footer {
      padding: 14px 15px;
      text-align: right;
      background: #f4f4f4;
      border-radius: 0 0 4px 4px;
    }
  }
}
</style>
