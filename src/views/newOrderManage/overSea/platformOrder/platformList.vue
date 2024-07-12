<template>
  <!-- 目前只有一件代发的订单和操作单用到了这个文件 -->
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :ref="`searchRef${tab.name}`"
              :formConfig="getSearchFormConfig()"
              v-if="tabsConfig.activeName === tab.name && showSearchForm"
            />
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              :ref="`tableRef${tab.name}`"
              v-if="tabsConfig.activeName === tab.name"
              :tableHeight="tableConfig().tableHeight"
              :columnConfig="tableConfig().tableColumns"
              :httpRequest="tableConfig().httpRequest"
              :getQueryParams="() => getQueryParams(tab.name)"
              :rowOperationBtnListFn="(r) => tableStatusList(r)"
              @handleTableView="(r) => handleUpdate(r)"
            >
              <template v-slot:isSelectBtns="{ slotProps }">
                <el-dropdown trigger="click">
                  <el-button size="small" type="text"
                    >{{ slotProps.item.text }}<i class="el-icon-arrow-down"
                  /></el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-for="(
                        cItem, cIndex
                      ) in platformOrderExportCurrencyLists"
                      :key="cIndex"
                      @click.native="
                        slotProps.item.handleClick(cItem, slotProps.row)
                      "
                    >
                      {{ cItem.nameCn }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
              <template v-slot:customRow="{ slotProps }">
                <!-- <template v-if="slotProps.prop === 'number'">
                  <span
                    class="primary-text-btn"
                    @click="handleUpdate(slotProps.row)"
                  >
                    {{ slotProps.row.number }}
                  </span>
                </template> -->
                <template v-if="slotProps.prop === 'insurance'">
                  <span
                    class="text-theme-color"
                    v-if="slotProps.row.insurance == '1'"
                  >
                    ✓保险
                  </span>
                  <span v-else>--</span>
                </template>
                <template v-if="slotProps.prop === 'product'">
                  <el-row>
                    <span
                      :class="[
                        'isComplete',
                        slotProps.row.foreignExportParam == 1
                          ? 'text-success-color'
                          : 'text-danger-color',
                      ]"
                    >
                      <i
                        :class="
                          slotProps.row.foreignExportParam == 1
                            ? 'el-icon-circle-check'
                            : 'el-icon-warning-outline'
                        "
                      ></i>
                      {{ slotProps.dicsList.nameCn }}
                    </span>
                  </el-row>
                </template>
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>

    <ComCustomDialog ref="mCustomDialogRef" />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import {
  getWholeSaleList,
  getOperationWholeSaleList,
  postOrderPlatformRepulse,
  POSTOrderPlatformExportFees,
} from "@/api/warehouse/prediction";
import { remarkDialogCols } from "_comp/ConfirmDialog/customFormDialog/model.js";
import { customMessageBox } from "@/utils/confirmBox.js";
import { getStreamFileDownload } from "@/utils/zipdownload";
import { platformOrderConfig } from "../components/model.js";
import { comFileDownload } from "@/utils/download.js";
export default {
  mixins: [mixinColsConf],
  props: {
    platformConfObj: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: this.platformConfObj.label,
            name: "1",
          },
        ],
      },
      searchFromData: {},
      searchFormConfig: {
        formModel: {}, // 表单数据
        fold: true, // 模糊搜索是否需要展开按钮
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        labelWidth: "85px",
        residueCols: [2],
      },
      tableStatusBtnList: [
        {
          text: "导出账单",
          viewType: ["webOrderView"],
          btnType: [1, 2, 3, 4, 5, 6, 7],
          isSelectBtns: true,
          handleClick: this.handleSingeExport,
        },
        {
          text: "打回",
          viewType: ["webOrderView"],
          btnType: [1],
          color: "#FF6767",
          handleClick: (row) => this.handleRepulse(row),
        },
      ],
    };
  },

  computed: {
    ...mapState({
      platformOrderExportCurrencyLists: (state) =>
        state.dictionary.dicsData.platformOrderExportCurrency,
    }),
  },
  created() {
    this["dictionary/getDictionary"]("overseasOrderTypeEn").then(() => {
      this.getIsint();
    });
  },
  methods: {
    getIsint() {
      if (this.platformConfObj.pageType === "webOrderView") {
        // 订单
        const dropdownArr = this.platformOrderExportCurrencyLists.map((e) => ({
          name: e?.nameCn,
          value: e?.value,
        }));
        this.$set(this.tabsConfig, "btnArr", [
          {
            table: "导出费用",
            btnType: "dropdown",
            dropdownArr,
            handleClick: (_, { name }) => {
              const { pageNum, pageSize, ...obj } = this.getQueryParams();
              comFileDownload(this, POSTOrderPlatformExportFees, {
                ...obj,
                trackingSnList: obj.trackingSnList?.split(" "),
                businessType: 35,
                queryType: 1,
                currencyCode: name,
              });
            },
          },
        ]);
      }
      this.showSearchForm = true;
    },
    handleSingeExport({ nameCn }, { id }) {
      comFileDownload(this, POSTOrderPlatformExportFees, {
        id,
        queryType: 1,
        currencyCode: nameCn,
      });
    },
    handleRepulse({ id }) {
      this.$refs.mCustomDialogRef?.showCustomDialog({
        customFormConfig: remarkDialogCols(),
        formModel: {
          id,
        },
        httpRequest: postOrderPlatformRepulse,
        errorFunction: (err) => {
          if (err.code === 1002) {
            customMessageBox(
              this,
              {
                msgTitle: err.msg,
                msgTxt1: "如需打回",
                msgTxt2: "，请先删除费用信息！",
                msgTxtColor: "#FF6767",
                showCancelButton: false,
                confirmButtonText: "关闭",
              },
              () => {
                this.$refs.mCustomDialogRef.customDialogHide();
              }
            );
          }
        },
        successFunction: () => this.mixinkeepTable(),
      });
    },
    getSearchFormConfig() {
      return {
        ...this.searchFormConfig,
        lists: platformOrderConfig(this.platformConfObj).searchCols,
      };
    },
    tableConfig() {
      return {
        tableHeight: "calc(100vh - 264px)",
        tableColumns: platformOrderConfig(this.platformConfObj).tableCols,
        httpRequest:
          this.platformConfObj.pageType === "webOperationView"
            ? getOperationWholeSaleList
            : getWholeSaleList,
      };
    },
    // path = "/newOrderManage/overseasIssue/overseasDetails" 删除该路由
    handleUpdate(row) {
      const { activeName } = this.tabsConfig;
      const idList = this.$refs[`tableRef${activeName}`][0].tableData.map(
        (e) => e.id
      );
      const pathObj = {
        webOrderView: "wholeSaleOrderDetails", // 订单
        webOperationView: "wholeSaleOperationDetails", // 操作单
      };
      this.$router.push({
        path: `/warehouseManage/outStorage/${
          pathObj[this.platformConfObj.pageType]
        }`,
        query: {
          id: row.id,
          backPath: this.$route.fullPath,
          pageSign: idList.join(","), // 详情显示上一页/下一页
        },
      });
    },
    getList(searchFrom) {
      const { beginTime, ...nSearchFrom } = searchFrom || {};
      this.searchFromData = {
        ...nSearchFrom,
        beginTime: beginTime && beginTime.join("@"),
      };
      this.mixinkeepTable(true);
    },
    getQueryParams(tab) {
      let { state, ...params } = this.searchFromData;
      if (state && Array.isArray(state)) {
        state = state.join(",");
      }
      return {
        ...params,
        state,
        queryType:
          this.platformConfObj.pageType === "webOrderView" ? 1 : undefined,
      };
    },
    tableStatusList(row) {
      if (this.platformConfObj.pageType === "webOrderView") {
        return this.tableStatusBtnList.filter(
          (e) =>
            (e.viewType || []).includes(this.platformConfObj.pageType) &&
            e.btnType.includes(row.status)
        ); // 订单操作
      }
      return [];
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
  components: {
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
