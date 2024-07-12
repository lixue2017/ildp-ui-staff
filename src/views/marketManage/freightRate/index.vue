<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :ref="`formRef${tab.name}`"
              :formConfig="{ ...searchFormConfig, ...searchColumns(tab.name) }"
              @searchHeight="searchHeight"
              @resetForm="handleResetForm"
              v-if="showSearchForm && tabsConfig.activeName === tab.name"
              @handleChange="handleChange"
            >
            </ComForm>
          </keep-alive>
          <SearchTabs
            ref="startPortRef"
            title="起运港"
            :dataList="searchList[tab.name].port"
            v-if="
              tabsConfig.activeName === tab.name &&
              searchList[tab.name].port.length
            "
            @handleSelect="(val) => handleSelect(val, 'startPortId')"
          />
          <SearchTabs
            ref="routeRef"
            title="航线"
            :dataList="searchList[tab.name].route"
            :defaultProp="{
              value: 'id',
              label: 'code,nameCn',
            }"
            v-if="
              tabsConfig.activeName === tab.name &&
              searchList[tab.name].route.length
            "
            @handleSelect="(val) => handleSelect(val, 'routeId')"
          />
          <keep-alive v-if="mixinShowTable">
            <ComTable
              :ref="`tableRef${tab.name}`"
              :tableHeight="`calc(100vh - ${extraHeight + formHeight}px)`"
              :columnConfig="
                getTableColumns(searchFromData[tab.name].packingMode)
              "
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="() => tableConfig.getQueryParams(tab.name)"
              @onSelectionChange="onTableSelectionChange"
              :selectionRow="selectionRowEvt"
              :selectionTableRow="[...selectionRows]"
              :rowOperationBtnListFn="rowOperationBtnListFn"
              @handleTableView="handleView"
              v-if="tabsConfig.activeName === tab.name"
            >
              <template v-slot:customRow="{ slotProps }">
                <!-- <template v-if="slotProps.prop === 'startPortCode'">
                  <div
                    class="primary-text-btn"
                    @click="handleView(slotProps.row)"
                  >
                    <TooltipOver
                      :content="`${slotProps.row.startPortCode} → ${slotProps.row.endPortCode}`"
                      :textLineClamp="2"
                    />
                  </div>
                </template> -->
                <template v-if="slotProps.prop === 'routeNoManageName'">
                  <div class="route-manage">
                    <div class="route-code">
                      {{ slotProps.row.routeNoManageName || "--" }}
                    </div>
                    <div class="free-cabin" v-if="slotProps.row.freeCabinNum">
                      现舱({{ slotProps.row.freeCabinNum }})
                    </div>
                  </div>
                </template>
                <template v-if="slotProps.column.color">
                  <span
                    :style="{
                      color: slotProps.column.color,
                    }"
                    v-if="
                      slotProps.row.boxModelMap &&
                      slotProps.row.boxModelMap[slotProps.prop]
                    "
                  >
                    {{ slotProps.row.boxModelMap[slotProps.prop] }}
                  </span>
                  <span v-else>--</span>
                </template>
                <template v-if="slotProps.prop === 'bookingNum'">
                  <span
                    class="booking-num"
                    v-if="slotProps.row[slotProps.prop]"
                    @click="handleSkip(slotProps.row)"
                    >{{ slotProps.row[slotProps.prop] }}</span
                  >
                  <span v-else>0</span>
                </template>
                <template v-if="slotProps.prop === 'surcharge'">
                  <el-button
                    size="mini"
                    type="primary"
                    plain
                    round
                    @click="handleClickSee(slotProps.row)"
                  >
                    查看
                  </el-button>
                </template>
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
    <SurchargeDetail ref="surchargeRef" />
    <BookingSpace
      ref="bookingSpaceRef"
      :proxyIds="proxyIds"
      @handleSuccess="mixinkeepTable"
    />
    <SetBatchDialog ref="setQuotationRef" />
  </div>
</template>

<script>
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { searchColumns, tableColumnsFCL, tableColumnsLCL } from "./model";
import { getPortPublicList } from "@/api/publicInterface/index.js";
import { getAirlineList } from "@/api/marketManage/airline";
import { msgBox } from "@/utils/confirmBox.js";
import {
  getFreightRateList,
  delFreightRate,
  enableDisableFreightRate,
} from "@/api/marketManage/freightRate";
import { POSTOrderIsolateConfig } from "@/api/marketManage/airline";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "FreightRate",
  mixins: [mixinColsConf],
  components: {
    SearchTabs: () => import("./components/SearchTabs"),
    SurchargeDetail: () => import("./components/SurchargeDetail"),
    BookingSpace: () => import("./components/BookingSpace"),
    TooltipOver: () => import("_comp/TooltipOver"),
    SetBatchDialog: () =>
      import(
        "@/views/enquiryManage/customerQuotation/components/SetBatchDialog"
      ),
  },
  data() {
    return {
      extraHeight: 304,
      pageType: 1,
      tabsBtnArr: [
        {
          table: "批量报价",
          disabled: true,
          handleClick: () => {
            const id = this.selectionRows.map((e) => e.id);
            this.handleQuotation({ id });
          },
        },
        {
          table: "海运运价",
          btnType: "dropdown",
          dropdownArr: [
            {
              name: "海运运价",
              value: 1,
              types: [1, 2],
            },
            {
              name: "空运运价",
              value: 2,
              types: [1, 2],
            },
          ],
          handleClick: this.handleDropdown,
        },
      ],
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {
          this.initMixinColumnConf();
        },
        tabs: [
          {
            label: "海运运价",
            name: "1",
          },
          {
            label: "空运运价",
            name: "2",
          },
        ],
        btnArr: [],
      },
      searchColumns,
      searchFormConfig: {
        formModel: {
          packingMode: "0",
        }, // 表单数据
        fold: true, // 模糊搜索是否需要展开按钮
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getList(formModel);
            resolve();
          });
        },
        searchForm: true,
        size: "small",
        labelWidth: "75px",
        formRules: {},
      },
      tableConfig: {
        httpRequest: getFreightRateList,
        getQueryParams: this.getQueryParams,
      },
      searchFromData: {
        1: {
          packingMode: "0",
        },
        2: {
          packingMode: "1",
        },
      },
      statusList: [
        {
          statusArr: [0],
          text: "提交",
          type: "submit",
          handleClick: this.handleBtnClick,
          isHavePurview: true,
        },
        {
          statusArr: [0],
          text: "编辑",
          type: "edit",
          handleClick: this.handleBtnClick,
          isHavePurview: true,
        },
        {
          statusArr: [0],
          text: "删除",
          type: "delete",
          color: "#ff6767",
          handleClick: this.handleBtnClick,
          isHavePurview: true,
        },
        {
          statusArr: [1, 2],
          text: "复制",
          type: "copy",
          handleClick: this.handleBtnClick,
          isHavePurview: true,
        },
        {
          statusArr: [1],
          text: "禁用",
          type: "interdict",
          handleClick: this.handleBtnClick,
          isHavePurview: true,
        },
        {
          statusArr: [1],
          text: "订舱",
          type: "bookingSpace",
          handleClick: this.handleBtnClick,
        },
        {
          statusArr: [2],
          text: "启用",
          type: "enable",
          handleClick: this.handleBtnClick,
          isHavePurview: true,
        },
        {
          statusArr: [1],
          text: "设置客户运价",
          type: "setQuotation",
          handleClick: this.handleBtnClick,
        },
      ],
      searchList: {
        1: {
          port: [],
          route: [],
        },
        2: {
          port: [],
          route: [],
        },
      },
      isHavePurview: false,
      selectionRows: [],
      proxyIds: "",
    };
  },
  computed: {
    ...mapGetters(["routesCollect"]),
  },
  watch: {
    "selectionRows.length"(sLen) {
      this.$set(this.tabsConfig.btnArr[0], "disabled", !sLen);
    },
  },
  created() {
    this.searchDictionary();
    this.getPortPublicList(1);
    this.getPortPublicList(2);
    this.getAirlineList(1);
    this.getAirlineList(2);
    if ((this.routesCollect.name || []).includes("EditFreightRate")) {
      this.isHavePurview = true;
      this.tabsConfig.btnArr = this.tabsBtnArr;
    }
    this.getOrderIsolateConfig();
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    searchDictionary() {
      this["dictionary/getDictionary"]("freightRate").then(() => {
        this.showSearchForm = true;
      });
    },
    rowOperationBtnListFn(row) {
      const bArr = [...this.statusList];
      // const nBtnArr = bArr
      return bArr.filter(
        (e) =>
          (!e.isHavePurview || e.isHavePurview === this.isHavePurview) &&
          e.statusArr?.includes(row.state)
      );
    },
    getPortPublicList(tab) {
      // typeList 0-海运 1-陆运 2-铁路 3-空运 4-快递
      const obj = {
        1: "0,1,2",
        2: "3,4",
      };
      getPortPublicList({
        typeList: obj[tab],
        pageSize: 9999,
        pageNum: 1,
      }).then((res) => {
        this.searchList[tab].port = res.rows || [];
      });
    },
    getAirlineList(tab) {
      // typeList 0-海运 1-陆运 2-铁路 3-空运 4-快递
      const obj = {
        1: "0,1,2",
        2: "3,4",
      };
      getAirlineList({
        typeList: obj[tab],
        status: 1,
        pageSize: 999,
        pageNum: 1,
      }).then((res) => {
        this.searchList[tab].route = res.rows || [];
      });
    },
    getTableColumns(packingMode) {
      if (packingMode == 0) return tableColumnsFCL;
      return tableColumnsLCL;
    },
    handleChange(val, prop) {
      if (prop === "packingMode") {
        this.getList(
          this.$refs[`formRef${this.tabsConfig.activeName}`][0].getFormParams()
        );
      }
    },
    getList(searchFrom = {}) {
      const { effectiveTime, packingMode, ...searchObj } = searchFrom;
      const [startEffectiveTime, endEffectiveTime] = effectiveTime || [];
      const { startPortId, routeId } =
        this.searchFromData[this.tabsConfig.activeName];
      this.searchFromData[this.tabsConfig.activeName] = {
        startPortId,
        routeId,
        ...searchObj,
        packingMode: this.tabsConfig.activeName == 2 ? "1" : packingMode,
        startEffectiveTime,
        endEffectiveTime,
      };
      this.mixinkeepTable(true);
    },
    getQueryParams(tabName) {
      return {
        ...(this.searchFromData[tabName] || {}),
        shippingMode: Number(tabName),
      };
    },
    handleResetForm() {
      this.searchFromData[this.tabsConfig.activeName] = {};
      if (this.$refs.startPortRef && this.$refs.startPortRef[0])
        this.$refs.startPortRef[0].activeName = 0;
      if (this.$refs.routeRef && this.$refs.routeRef[0])
        this.$refs.routeRef[0].activeName = 0;
    },
    handleClickSee(row) {
      this.$refs.surchargeRef.show(row);
    },
    handleSelect(val, prop) {
      this.searchFromData[this.tabsConfig.activeName] = {
        ...this.searchFromData[this.tabsConfig.activeName],
        [prop]: val,
      };
      this.getList(
        this.$refs[`formRef${this.tabsConfig.activeName}`][0].getFormParams()
      );
    },
    handleInterdict(rows) {
      const { id } = rows;
      if (id) {
        const msg = "操作禁用之后该数据不可被关联引用！";
        const title = "禁用提示";
        const className = "el-icon-warning text-warning";
        msgBox(this, { title, className, msg }, () => {
          this.comRepeatedRequest(this, enableDisableFreightRate, { id }).then(
            () => {
              this.msgSuccess("禁用成功！");
              this.mixinkeepTable();
            }
          );
        });
      }
    },
    handleDelete(rows) {
      const { id } = rows;
      if (id) {
        const msg = "删除操作不可逆！";
        const title = "删除提示";
        const className = "el-icon-warning text-warning";
        msgBox(this, { title, className, msg }, () => {
          this.comRepeatedRequest(this, delFreightRate, { id }).then(() => {
            this.msgSuccess("删除成功！");
            this.mixinkeepTable();
          });
        });
      }
    },
    handleDropdown(_, btn) {
      const { value: shippingMode } = btn;
      this.$router.push({
        path: "/marketManage/editFreightRate",
        query: {
          shippingMode,
          backPath: this.$route.path,
        },
      });
    },
    handleBtnClick(row, btn) {
      const { type } = btn;
      const { id } = row;
      switch (type) {
        case "submit":
          this.comRepeatedRequest(this, enableDisableFreightRate, { id }).then(
            () => {
              this.msgSuccess("提交成功！");
              this.mixinkeepTable();
            }
          );
          break;
        case "edit":
          this.$router.push({
            path: "/marketManage/editFreightRate",
            query: {
              id,
              shippingMode: this.tabsConfig.activeName,
              backPath: this.$route.path,
            },
          });
          break;
        case "delete":
          this.handleDelete(row);
          break;
        case "copy":
          this.$router.push({
            path: "/marketManage/editFreightRate",
            query: {
              copyId: id,
              backPath: this.$route.path,
              shippingMode: this.tabsConfig.activeName,
            },
          });
          break;
        case "interdict":
          this.handleInterdict(row);
          break;
        case "bookingSpace":
          this.$refs.bookingSpaceRef.show(row);
          break;
        case "enable":
          this.comRepeatedRequest(this, enableDisableFreightRate, { id }).then(
            () => {
              this.msgSuccess("启用成功！");
              this.mixinkeepTable();
            }
          );
          break;
        case "setQuotation":
          this.handleQuotation({ id: [id] });
          break;
        default:
          break;
      }
    },
    handleView(row) {
      const { activeName } = this.tabsConfig;
      const idList = this.$refs[`tableRef${activeName}`][0]?.tableData.map(
        (item) => item.id
      );
      this.$router.push({
        path: "/marketManage/freightRateDetail",
        query: {
          id: row.id,
          backPath: this.$route.path,
          pageSign: idList.join(","), // 详情显示上一页/下一页
        },
      });
    },
    handleSkip(row) {
      const { packingMode, shippingMode, id, bookingSpaceProxyId } = row;
      let path = "";
      if (packingMode === 0) {
        path = "/marketManage/marketBookingFcl";
      } else if (shippingMode === 1) {
        path = "/marketManage/workSheetBookingLcl";
      } else if (bookingSpaceProxyId === 187) {
        path = "/marketManage/marketBookingLcl";
      } else {
        path = "/marketManage/workSheetBookingLcl";
      }
      this.$router.push({
        path,
        query: {
          params: JSON.stringify({
            freightRateId: id,
            activeName: "2",
          }),
        },
      });
    },
    onTableSelectionChange(rows = []) {
      this.selectionRows = rows;
      this.$refs[
        `tableRef${this.tabsConfig.activeName}`
      ][0]?._toggleRowSelectionMixin({
        newCheckRows: this.selectionRows,
      });
    },
    handleQuotation({ id: freightRateIds }) {
      this.$refs.setQuotationRef.show({ freightRateIds });
    },
    selectionRowEvt(row) {
      // 列表条件选择，不满足条件置灰
      if (row.state !== 1) {
        //1已经生成过对账单，0未生成过对账单，排除已经生成过对账单的账单
        return false;
      }
      const rSome = this.selectionRows.some(
        (e) =>
          e.endPortCode === row.endPortCode &&
          e.startPortCode === row.startPortCode
      );
      if (this.selectionRows.length && !rSome) {
        return false;
      }
      return true;
    },
    getOrderIsolateConfig() {
      POSTOrderIsolateConfig().then((res) => {
        const { data } = res;
        this.proxyIds = data;
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
  .booking-num {
    color: #5094ff;
    cursor: pointer;
  }
  .route-manage {
    display: flex;

    .route-code {
      flex: 1;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .free-cabin {
      line-height: 17px;
      padding: 1px 10px;
      color: #fff;
      background: rgba(83, 200, 138, 0.6);
      border-radius: 4px;
    }
  }
}
</style>
