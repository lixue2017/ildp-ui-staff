<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              ref="searchTabForm"
              :formConfig="searchTabForm(tab.name)"
              v-if="tabsConfig.activeName === tab.name && showSearchForm"
            />
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              v-if="tabsConfig.activeName === tab.name"
              :ref="`tableRef${tab.name}`"
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="tableTabConfig(tab.name)"
              :httpRequest="tableConfig.httpRequest[tab.name]"
              :getQueryParams="() => tableConfig.getQueryParams(tab.name)"
              @onSelectionChange="onTableSelectionChange"
              :isMountedRequest="false"
              :selectionRow="selectionRowEvt"
              :selectionTableRow="[...selectionRows]"
            >
						<!-- selectionKey="temp_secondId" -->
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'number'">
                  <span v-if="slotProps.row.markStatus === 2">{{
                    slotProps.row[slotProps.prop] || "--"
                  }}</span>
                  <div
                    v-else
                    class="primary-text-btn ellipsis-text"
                    @click="handleDetails(slotProps.row)"
                  >
                    {{ slotProps.row[slotProps.prop] || "--" }}
                  </div>
                </template>
                <template v-if="slotProps.prop === 'truckNumber'">
                  <span v-if="!slotProps.row[slotProps.prop]">{{ "--" }}</span>
                  <div
                    v-else
                    class="primary-text-btn ellipsis-text"
                    @click="handleTruckView(slotProps.row)"
                  >
                    {{ slotProps.row[slotProps.prop] }}
                  </div>
                </template>
                <template
                  v-if="['status', 'freightStatusDes'].includes(slotProps.prop)"
                >
                  <span>
                    <i
                      class="status-dot"
                      :style="{
                        backgroundColor:
                          slotProps.dicsList && slotProps.dicsList.color,
                      }"
                    ></i>
                    {{ slotProps.dicsList.nameCn || "--" }}
                  </span>
                </template>
                <template v-if="slotProps.prop === 'operation'">
                  <span v-if="slotProps.row.status === 6">--</span>
                  <div class="operation-content-btn">
                    <template
                      v-for="(item, index) in tableConfig.statusBtnList"
                    >
                      <el-button
                        :key="index"
                        v-if="item.btnType.includes(slotProps.row.status)"
                        :class="`operate-icon ${
                          item.info && 'operate-icon-info'
                        }`"
                        size="small"
                        type="text"
                        :icon="`${item.icon}`"
                        @click="item.handleClick(slotProps.row)"
                        >{{ item.text }}</el-button
                      >
                    </template>
                  </div>
                </template>
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
      <template v-slot:slotTabsRight>
        <CurrentWhereWarehouse @setCurWarehouse="getWarehouseTableMixin" />
      </template>
    </ComTabs>
    <div class="grand-total" v-if="tabsConfig.activeName == 1">
      <span class="title">合 计：</span>
      <div class="total-data">
        <div v-for="(item, index) in totalData" :key="index">
          <span>{{ item.label }}：</span>
          <span>{{ item.value }}</span>
        </div>
      </div>
    </div>
    <ConfirmDialog ref="confirmDialogRef" />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import {
  postTruckFreightList,
  getTruckList,
  deliveryTrajectoryPut,
  platformUpdateTruckPost,
} from "@/api/warehouse/manage";
import { formatDate } from "@/utils/index.js";
import { searchColumns, tableColumns, getTotalData } from "./model";
import { truckServerTypeConvert } from "@/api/warehouse/process";
import curWarehouseMixin from "@/views/warehouseManage/components/currentWarehouse/mixin";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
export default {
  name: "Truck",
  mixins: [curWarehouseMixin, mixinColsConf],
  data() {
    return {
      totalData: getTotalData(),
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {
          this.initialOperation();
          this.$nextTick(() => {
            //切换tabs清空勾选数据
            this.onTableSelectionChange([]);
            this.keepTableListMixin();
          });
        },
        tabs: [
          {
            label: "待派送",
            name: "1",
          },
          {
            label: "已派送",
            name: "2",
          },
        ],
      },
      tabBtnArr: [
        {
          table: "批量派车",
          disabled: true,
          handleClick: () => this.handleEditPage({}, 1),
        },
        {
          table: "转快递",
          disabled: true,
          handleClick: () => this.handleChangeStatus({}, 10),
        },
        {
          table: "转自提",
          disabled: true,
          handleClick: () => this.handleChangeStatus({}, 20),
        },
        {
          table: "卡车模板",
          disabled: true,
          handleClick: () => this.hancleTemplate(),
        },
      ],
      selectionRows: [],
      searchFromData: {},
      searchFormConfig: {
        labelWidth: "85px",
        formModel: {},
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getTableList(formModel);
            resolve();
          });
        },
        searchForm: true,
        size: "small",
        formRules: {},
      },
      tableConfig: {
        tableHeight: "calc(100vh - 324px)",
        getQueryParams: this.getQueryParams,
        httpRequest: { 1: getTruckList, 2: postTruckFreightList },
        statusBtnList: [
          {
            text: "卡车派送",
            btnType: [4],
            handleClick: this.handleEditPage,
          },
          {
            text: "更新轨迹",
            btnType: [5],
            handleClick: this.handleUpdate,
          },
          {
            text: "已送达",
            btnType: [5],
            handleClick: this.handleUpdateTruck,
          },
          {
            text: "转快递",
            btnType: [4],
            handleClick: (row) => {
              this.handleChangeStatus(row, 10);
            },
          },
          {
            text: "转自提",
            btnType: [4],
            handleClick: (row) => {
              this.handleChangeStatus(row, 20);
            },
          },
        ],
      },
    };
  },
  watch: {
    selectionRows(rows) {
      this.totalData = getTotalData(rows);
    },
  },
  methods: {
    handleChangeStatus(row, changeType) {
      //转快递，转自提
      var changeArr = [];
      if (row.id) {
        //单点
        const { id, markStatus } = row;
        changeArr.push({
          outWarehouseWay: changeType,
          markStatus,
          orderId: id,
          oldOutWarehouseWay: 0, // 0-卡车
        });
      } else {
        changeArr = this.selectionRows.map((e) => {
          const { id, markStatus } = e;
          return {
            outWarehouseWay: changeType,
            markStatus,
            orderId: id,
            oldOutWarehouseWay: 0, // 0-卡车
          };
        });
      }
      truckServerTypeConvert(changeArr).then((res) => {
        // this.keepTableList(false);
        this.keepTableListMixin();
      });
    },
    hancleTemplate() {
      //卡车模板
    },
    initialOperation() {
      //初始化操作按钮，【批量派车，转快递，转自提，卡车模板】
      const bArr =
        this.tabsConfig.activeName === "1"
          ? this.tabBtnArr.slice(0, 3)
          : this.tabBtnArr.slice(3, 4);
      this.$set(this.tabsConfig, "btnArr", bArr);
    },
    handleEditPage(row = {}, truck_type = 2) {
      // 1: 批量 2： 单个
      if (truck_type === 1 && !this.selectionRows.length) {
        this.msgError("请选择订单");
        return;
      }
      const ids = [];
      const nFreightIds = [];
      if (truck_type !== 2) {
        this.selectionRows.map((e) => {
          ids.push(e.id);
          nFreightIds.push(...(e.freightIds || []));
        });
      }
      this.$router.push({
        path: "/warehouseManage/exWarehouse/truckEdit",
        query: {
          justIds: truck_type === 2 ? row.id : ids.join(","),
          addrList:
            truck_type === 2
              ? (row.freightIds || []).join(",")
              : nFreightIds.join(","),
          detailsAddr:
            truck_type === 2
              ? row.detailsAddr
              : this.selectionRows[0].detailsAddr,
          warehouse: this.curWarehouseObj.value,
          backPath: this.$route.path,
        },
      });
    },
    // 表格多选
    onTableSelectionChange(rows = []) {
      // 初始全选时需要过滤不同条件表格行
      const row = rows[0] || {};
      this.selectionRows = rows.filter(
        (e) => e.detailsAddr === row.detailsAddr && [4, 6].includes(e.status)
        //待入仓、待出库、已出库
      );
      this.$refs[
        `tableRef${+this.tabsConfig.activeName}`
      ][0]._toggleRowSelectionMixin({ newCheckRows: this.selectionRows });
      this.tabBtnArr.map((item, index) => {
        this.$set(this.tabBtnArr[index], "disabled", !rows.length);
      });
    },
    // 不同类型不可同时选择
    selectionRowEvt(row) {
      const rSome = this.selectionRows.some(
        (e) => e.detailsAddr === row.detailsAddr
      );
      if (
        (this.selectionRows?.length && !rSome) ||
        (row.status !== 4 && row.status !== 6)
      ) {
        return false; // 禁止选择
      }
      return true; // 可选
    },
    handleUpdateTruck({ id, markStatus }) {
      platformUpdateTruckPost({
        id,
        markStatus,
        status: 6,
      }).then(() => {
        this.msgSuccess("更新成功");
        this.keepTableListMixin();
      });
    },
    handleUpdate({ id }) {
      this.$refs.confirmDialogRef?.handleFormDialog("timeConfirm", {
        dialogTitle: "更新轨迹",
        timeConfig: {
          timeId: "time",
          remarkId: "remark",
        },
        formModel: {
          time: formatDate(new Date(), "/"),
        },
        httpRequest: (formData) => {
          const { time, remark } = formData;
          return deliveryTrajectoryPut({
            id,
            updateTime: time,
            describe: remark,
          });
        },
        successFunction: () => {
          this.msgSuccess("更新成功");
          this.keepTableListMixin();
        },
      });
    },
    getTableList(searchFrom = {}) {
      const { createTime, statusList, ...searchObj } = searchFrom;
      const { activeName } = this.tabsConfig;
      this.searchFromData[activeName] = {
        ...searchObj,
        statusList: statusList?.length ? statusList : undefined,
        beginTime: createTime ? `${createTime[0]}@${createTime[1]}` : undefined,
      };
      this.keepTableListMixin();
    },
    getQueryParams(tab) {
      const { activeName } = this.tabsConfig;
      const i = tab || activeName;
      return {
        ...this.searchFromData[i],
        statusList:
          i === "1"
            ? ["4"]
            : this.searchFromData[i]?.statusList || ["5", "6", "9"], // 4-待出库 5-运输中 6-已完结
        outWarehouseWayStatus: 0, // 0 卡车   10快递   20自提
        warehouseId: this.curWarehouseObj.value, //右侧的仓库ID，数据在混入文件里
      };
    },
    handleDetails(row = {}) {
      const { markStatus } = row;
      const pathObj = {
        1: `/warehouseManage/outStorage/wholeSaleDetails`, // 一件代发详情
        0: `/warehouseManage/outStorage/fbaWarehouseDetails`, // FBA订单详情
        2: `/warehouseManage/inStorage/buttOrderDetails`, // 中转出库/大货中转 -> 电商头程详情
      };
      const idList = this.$refs[
        `tableRef${+this.tabsConfig.activeName}`
      ][0].tableData
        .map((e) => {
          if (e.markStatus == markStatus) {
            return e.id;
          }
        })
        .filter((result) => typeof result !== "undefined");
      this.$router.push({
        path: pathObj[markStatus],
        query: {
          id: row.id,
          backPath: this.$route.path,
          pageSign: idList.join(","), // 详情显示上一页/下一页
        },
      });
    },
    handleTruckView(row = {}) {
      const idList = [
        ...new Set(
          this.$refs[`tableRef${+this.tabsConfig.activeName}`][0].tableData.map(
            (e) => e.truckId
          )
        ),
      ];
      this.$router.push({
        path: "/warehouseManage/process/editTruckRecord",
        query: {
          id: row.truckId,
          backPath: this.$route.fullPath,
          pageSign: idList.join(","), // 详情显示上一页/下一页
        },
      });
    },
    searchTabForm(tName) {
      return {
        ...this.searchFormConfig,
        fold: true,
        lists: searchColumns(tName),
      };
    },
    tableTabConfig(tName) {
      return tableColumns(tName);
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
  created() {
    this["dictionary/getDictionary"]("exWarehouseDict").then(() => {
      this.showSearchForm = true;
    });
    this.initialOperation();
  },
  components: {
    ConfirmDialog: () => import("_comp/ConfirmDialog"),
    CurrentWhereWarehouse: () =>
      import("@/views/warehouseManage/components/currentWarehouse"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-container {
  .grand-total {
    .total-data {
      display: flex;
      div {
        margin-right: 15px;
      }
    }
  }
}
</style>
