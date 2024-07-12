<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <div class="tab-label" slot="label">
            <span>{{ tab.label }}</span>
            <div class="tab-switch-box">
              <div class="switch-layout" @click="switchLayout">
                <template v-if="overseaLangObj.yu_yan_lang === 'en-us'">{{
                  overseaLangObj.qh_st_ms
                }}</template>
                <template v-else
                  >切换{{ isView ? "列表" : "视图" }}模式</template
                >
                <i class="iconfont qiehuan"></i>
              </div>
            </div>
          </div>
          <DataLayout
            ref="dataLayout"
            @handleClearanceView="handleClearanceView"
            @handleView="handleView"
            @stripping="onStripping"
            :curWarehouseId="curWarehouseId"
            v-if="isView"
          />
          <template v-else>
            <keep-alive>
              <ComForm
                ref="searchTabForm"
                :formConfig="searchFormConfig"
                v-if="tabsConfig.activeName === tab.name && showSearchForm"
              >
                <template v-slot:form-submit>
                  <ComColumnConf
                    :tableCols="tableAllMixinConfig(tab.name)"
                    :tName="tab.name"
                    @setColumnConf="
                      (cols) =>
                        setColumnMixinConf(cols, { mountedNoRequest: true })
                    "
                  />
                </template>
              </ComForm>
            </keep-alive>
            <keep-alive v-if="mixinShowTable">
              <!-- :columnConfig="tableConfig.tableColumns" -->
              <ComTable
                :ref="`tableRef${tab.name}`"
                :tableHeight="tableConfig.tableHeight"
                :columnConfig="tableMixinConfig(tab.name)"
                :httpRequest="tableConfig.httpRequest"
                :getQueryParams="getQueryParams"
                :isMountedRequest="false"
                v-if="tabsConfig.activeName === tab.name"
                :rowOperationBtnListFn="(r) => tableStatusList(r)"
              >
                <template v-slot:customRow="{ slotProps }">
                  <template v-if="slotProps.prop === 'nlcode'">
                    <span
                      v-if="slotProps.row.nlcode"
                      class="primary-text-btn"
                      @click="
                        handleClearanceView({
                          ...slotProps.row,
                          id:
                            slotProps.row.orderOperationId || slotProps.row.id,
                        })
                      "
                    >
                      {{ slotProps.row.nlcode }}
                    </span>
                    <span v-else>--</span>
                  </template>
                  <template v-if="slotProps.prop === 'orderOperationNum'">
                    <span
                      v-if="
                        slotProps.row.orderOperationNum ||
                        slotProps.row.operationOrderNum
                      "
                      class="primary-text-btn"
                      @click="handleView(slotProps.row)"
                    >
                      {{
                        slotProps.row.orderOperationNum ||
                        slotProps.row.operationOrderNum
                      }}
                    </span>
                    <span v-else>--</span>
                  </template>
                </template>
              </ComTable>
            </keep-alive>
          </template>
        </el-tab-pane>
      </template>
      <template v-slot:slotTabsRight>
        <CurrentWhereWarehouse @setCurWarehouse="setCurWarehouse" />
      </template>
    </ComTabs>

    <ComCustomDialog ref="customDialogRef" />
  </div>
</template>

<script>
import {
  getStrippingList,
  stripping,
  actualityDevann,
} from "@/api/warehouse/prediction";
import {
  popClearanceDetail,
  getOverseaClearanceSalesman,
} from "@/api/performance/record";
import { mapActions, mapGetters, mapState } from "vuex";
import {
  strippingSearchCols,
  strippingTableCols,
  realityCabinetCols,
} from "./model";
import { formatDate } from "@/utils/index";
import curWarehouseMixin from "@/views/warehouseManage/components/currentWarehouse/mixin";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { msgBox } from "@/utils/confirmBox.js";
import { hostCurrentEnv } from "@/utils/index.js";

export default {
  name: "Devanning",
  mixins: [curWarehouseMixin, mixinColsConf], //curWarehouseMixin为当前所在仓选择文件    mixinColsConf为列设置文件与初始化
  components: {
    CurrentWhereWarehouse: () =>
      import("@/views/warehouseManage/components/currentWarehouse"),
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"), // 自定义弹窗
    DataLayout: () => import("./components/DataLayout"),
  },
  data() {
    return {
      isView: true,
      curWarehouseId: 0,
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {
          this.$nextTick(() => {
            this.mixinkeepTable();
            // this.keepTableList(false);
          });
        },
        tabs: [
          {
            label: this.overseaLangObj.yy_cg || "预约拆柜",
            name: "1",
          },
        ],
      },
      searchFromData: {},
      searchFormConfig: {
        formModel: {}, // 表单数据
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getSearchList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        expansion: false,
        fold: true,
        labelWidth:
          this.overseaLangObj.yu_yan_lang === "en-us" ? "110px" : "100px",
        lists: strippingSearchCols.lists,
      },
      tableConfig: {
        tableHeight: "calc(100vh - 264px)",
        httpRequest: getStrippingList,
      },
      tableBtnList: [
        {
          text: this.overseaLangObj.sj_tcg("实际提拆柜"),
          handleClick: this.onStripping,
          btnType: [0],
        },
        {
          text: "预排库",
          isWarehouseBtn: true,
          btnType: [0, 1],
          handleClick: this.onInventoryScheduling,
        },
      ],
      mixinTableColArr: [strippingTableCols],
    };
  },
  created() {
    this["dictionary/getDictionary"]("predictionManage").then(() => {
      this.showSearchForm = true;
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    setCurWarehouse(obj) {
      this.curWarehouseId = (obj || {}).value || 0;
      this.getWarehouseTableMixin(obj);
    },
    switchLayout() {
      this.isView = !this.isView;
      setTimeout(() => {
        if (this.isView) {
          this.$refs.dataLayout[0].getList(this.curWarehouseId);
        } else {
          this.initMixinColumnConf();
        }
      }, 20);
    },
    getSearchList(searchFrom = {}) {
      const { createTime, actualTime, statusList, ...nSearchFrom } = searchFrom;
      this.searchFromData = {
        ...nSearchFrom,
        beginTime: createTime && createTime[0],
        endTime: createTime && createTime[1],
        actualBeginTime: actualTime && actualTime[0],
        actualEndTime: actualTime && actualTime[1],
        statusList: statusList && statusList.join(","),
      };
      this.keepTableListMixin(true);
    },
    getQueryParams() {
      return {
        ...this.searchFromData,
        warehouseId: this.curWarehouseObj.value,
      };
    },
    handleView(row) {
      const { id, intendDevannBusinessSource } = row;
      const { activeName } = this.tabsConfig;
      const routePath = {
        1: "/warehouseManage/inStorage/overseasWarehouseDetails",
        0: "/warehouseManage/inStorage/buttOrderDetails",
      }[intendDevannBusinessSource];
      const idList = !this.isView
        ? this.$refs[`tableRef${activeName}`][0].tableData
            .filter(
              (i) => i.intendDevannBusinessSource == intendDevannBusinessSource
            )
            .map((item) => item.id)
        : [];
      this.$router.push({
        path: routePath,
        query: {
          id,
          backPath: this.$route.path,
          pageType: intendDevannBusinessSource == 1 ? 3 : undefined,
          pageSign: idList.join(","), // 详情显示上一页/下一页
        },
      });
    },
    handleClearanceView({ id, clearanceId, intendDevannBusinessSource: type }) {
      const { activeName } = this.tabsConfig;
      const idList = !this.isView
        ? this.$refs[`tableRef${activeName}`][0].tableData
            .filter((i) => type === i.intendDevannBusinessSource)
            .map((item) => item[type == 1 ? "id" : "clearanceId"])
        : [];
      let query = {
        id: clearanceId,
        backPath: this.$route.path,
        pageSign: idList.join(","), // 详情显示上一页/下一页
      };
      let path = "/overseasBusiness/customsClearanceInfo";
      if (type == 1) {
        path = "/warehouseManage/inStorage/overseasWarehouseDetails";
        query.pageType = 3; //海外入仓
        query.id = id;
      }
      this.$router.push({
        path,
        query,
      });
    },
    async onStripping(row) {
      let { id, boxStatus, state, intendDevannBusinessSource: type } = row;
      if (typeof boxStatus !== "number") {
        boxStatus = state;
      }
      let cObj = {};
      if (type === 1) {
        cObj = (await getOverseaClearanceSalesman(id)).data || {};
      } else {
        cObj = (await popClearanceDetail(id)).data || {};
      }
      const { salesman, warehouseId, putWarehousing } = cObj;
      const httpReq = {
        0: stripping, // 对接头程
        1: actualityDevann, // 海外入仓
      };
      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: realityCabinetCols({ salesman }),
        formModel: {
          warehouseId,
          putWarehousing,
          actualSplitBoxTime: formatDate(new Date().getTime(), "-"),
        },
        httpRequest: (obj) => {
          const params = {
            id,
            ...obj,
          };
          if (type != 1) {
            params.boxStatus = boxStatus == 0 ? 1 : 0;
          }
          return httpReq[type || 0](params);
        },
        successFunction: () => {
          const { intendDevannBusinessSource } = row;
          if (
            intendDevannBusinessSource == 0 &&
            intendDevannBusinessSource != null
          ) {
            //类型为对接头程实际提拆柜后跳转到电商头程（海外仓）
            this.$router.push({
              path: "/warehouseManage/inStorage/buttOrder",
            });
          } else {
            this.keepTableListMixin();
            if (this.isView) {
              this.$refs.dataLayout[0].getList();
            } else {
              this.keepTableListMixin();
            }
          }
        },
      });
      // this.confirmStripping().then(() => {
      // stripping({ id, boxStatus: boxStatus == 0 ? 1 : 0 }).then((res) => {
      //   if (this.isView) {
      //     this.$refs.dataLayout[0].getList();
      //   } else {
      //     this.keepTableListMixin();
      //   }
      // });
      // });
    },
    confirmStripping() {
      return new Promise((resolve) => {
        const title = "拆柜之后货物进入到[对接头程模块]";
        const className = "el-icon-warning text-warning";
        const msg = "拆柜动作不可逆，你还要继续吗？";
        msgBox(this, { title, className, msg, showCancelButton: true }, () => {
          resolve();
        });
      });
    },
    onInventoryScheduling(row) {
      this.$router.push({
        path: "/warehouseManage/expectedReceipt",
        query: {
          id: row.id,
          ywType: [2, 4][row.intendDevannBusinessSource], // 2-头程 4-海外
          backPath: this.$route.fullPath,
        },
      });
    },
    tableStatusList(row) {
      return this.tableBtnList.filter((e) => {
        return (
          (e.btnType ? e.btnType.includes(row.boxStatus) : true) &&
          (e.isWarehouseBtn ? this.isWarehouseRole : true)
        );
      });
    },
  },
  activated() {
    if (this.isView && this.isMixinDeactivated) {
      this.$refs.dataLayout[0].getList(this.curWarehouseId);
    }
  },
  computed: {
    isWarehouseRole() {
      const envStr = hostCurrentEnv();
      const roleObj =
        this.warehouseIdOneByOne.find(
          (e) => e.nameCn.includes(envStr) && e.nameEn === "YPKW"
        ) || {};
      return roleObj.value?.includes(this.curWarehouseObj.value);
    },
    ...mapState({
      warehouseIdOneByOne: (state) =>
        state.dictionary.dicsData.roleIdOneByOne || [],
    }),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.staff .app-container {
  margin: 10px;
}
.tab-label {
  display: flex;
}
.tab-switch-box {
  position: relative;
  width: 0px;
}
.switch-layout {
  position: absolute;
  padding: 0 10px;
  height: 21px;
  line-height: 21px;
  font-size: 12px;
  background: rgba(80, 148, 255, 0.7);
  border-radius: 12px;
  color: #fff;
  left: 5px;
  cursor: pointer;
  .qiehuan {
    margin-left: 8px;
    font-size: 12px;
  }
}
</style>
