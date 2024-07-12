<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="(tab, idx) in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              ref="searchTabForm"
              :formConfig="searchTabForm(idx)"
              v-if="tabsConfig.activeName === tab.name && showSearchForm"
            />
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              v-if="tabsConfig.activeName === tab.name"
              :ref="`tableRef${tab.name}`"
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="tableTabConfig(idx)"
              :httpRequest="tableConfig.httpRequest[idx]"
              :getQueryParams="tableConfig.getQueryParams"
              @onSelectionChange="onTableSelectionChange"
              :isMountedRequest="false"
              :selectionTableRow="[...selectionRows]"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'number'">
                  <span v-if="slotProps.row.type === 2">{{
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
                <template v-if="slotProps.prop === 'code' && tab.name === '2'">
                  <div class="primary-text-btn ellipsis-text">
                    {{ slotProps.row.code || "--" }}
                  </div>
                </template>
                <template
                  v-if="['stickerStatus', 'status'].includes(slotProps.prop)"
                >
                  <span>
                    <i
                      class="status-dot"
                      :style="{
                        backgroundColor:
                          slotProps.dicsList && slotProps.dicsList.color,
                      }"
                    ></i>
                    {{
                      slotProps.prop === "stickerStatus" &&
                      slotProps.row.isSticker != 1
                        ? "--"
                        : slotProps.dicsList.nameCn || "--"
                    }}
                  </span>
                </template>

                <template v-if="slotProps.prop === 'operation'">
                  <span v-if="slotProps.row.status === 6">--</span>
                  <div class="operation-content-btn">
                    <template
                      v-for="(item, btnIndex) in tableConfig.statusBtnList"
                    >
                      <el-button
                        :key="btnIndex"
                        v-if="rowIncludesBtn(btnIndex, item, slotProps.row)"
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
    <ConfirmDialog ref="confirmDialogRef" />
    <editFormExpressDlg ref="editFormExpressRef" />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import {
  getSelectExpressList,
  deliveryTrajectoryPut,
} from "@/api/warehouse/manage";
import {
  exwarehouseRecordList,
  truckServerTypeConvert,
} from "@/api/warehouse/process";
import { formatDate } from "@/utils/index.js";
import editFormExpressDlg from "./editDlg";
import { searchColumns, tableColumns } from "./model";
import { clone } from "@/utils/ruoyi";
import curWarehouseMixin from "@/views/warehouseManage/components/currentWarehouse/mixin";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
// 页面已废弃
export default {
  name: "Express",
  mixins: [curWarehouseMixin, mixinColsConf],
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {
          this.$nextTick(() => {
            this.keepTableListMixin();
          });
          const bArr =
            this.tabsConfig.activeName === "2"
              ? this.tabBtnArr.slice(0, 1)
              : this.tabBtnArr.slice(1, 3);
          this.$set(this.tabsConfig, "btnArr", bArr);
        },
        tabs: [
          {
            label: "快递出库",
            name: "1",
          },
          {
            label: "已下单",
            name: "2",
          },
        ],
      },
      tabBtnArr: [
        {
          id: 0,
          table: "批量派送",
          disabled: true,
          handleClick: () => this.handleBatch({}, 1),
        },
        {
          id: 1,
          table: "转卡车",
          disabled: true,
          handleClick: () => this.handleStatusChange({}, 0),
        },
        {
          id: 2,
          table: "转自提",
          disabled: true,
          handleClick: () => this.handleStatusChange({}, 20),
        },
      ],
      selectionRows: [],
      selectionList: {},
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
        httpRequest: [getSelectExpressList, exwarehouseRecordList],
        statusBtnList: [
          {
            text: "去贴标",
            stickerType: [1],
            stickerArr: [0],
            isTab: "1",
            handleClick: this.handlePage,
          },
          {
            text: "快递下单",
            btnType: [7],
            isTab: "1",
            handleClick: this.handleEditDlg,
          },
          {
            text: "派送成功",
            btnType: [4],
            isTab: "2",
            handleClick: this.handleBatch,
          },
          {
            text: "转卡车",
            btnType: [7],
            isTab: "1",
            handleClick: (row) => {
              this.handleStatusChange(row, 0);
            },
          },
          {
            text: "转自提",
            btnType: [7],
            isTab: "1",
            handleClick: (row) => {
              this.handleStatusChange(row, 20);
            },
          },
        ],
      },
    };
  },
  watch: {
    "tabsConfig.activeName": {
      deep: true,
      handler: function (newVal, oldVal) {
        this.selectionList[oldVal] = clone(this.selectionRows); //需要深拷贝批量操作中的函数
        this.selectionRows = clone(this.selectionList[newVal] || []);
        this.tabsChange(this.selectionRows);
      },
    },
  },
  methods: {
    handleBatch(row = {}, type = 0) {
			const nRows = type === 1 ? this.selectionRows : [row];
      this.$refs.editFormExpressRef.editDispatchShow(nRows, {
        mode_type: 1,
        editSuccess: this.keepTableListMixin,
      });
    },

    handleEdit({ id }) {
      deliveryTrajectoryPut({
        id,
        status: 6,
      }).then(() => {
        this.msgSuccess("更新成功");
        this.$refs[`tableRef${+this.tabsConfig.activeName}`][0].refreshTable(
          false
        );
      });
    },
    handleEditDlg(row = {}, mode_type = 0) {
      if (row.isSticker === 1 && row.stickerStatus === 0) {
        this.msgError("请先去贴标");
        return;
      }
      const params = {
        ...row,
        warehouseId: this.curWarehouseObj.value,
      };
      this.$refs.editFormExpressRef.editShow(params, {
        mode_type,
        warehouseId: this.curWarehouseObj.value,
        editSuccess: () => {
          this.$refs[`tableRef${+this.tabsConfig.activeName}`][0].refreshTable(
            false
          );
        },
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
          this.$refs[`tableRef${+this.tabsConfig.activeName}`][0].refreshTable(
            false
          );
        },
      });
    },
    // 表格多选
    onTableSelectionChange(rows = []) {
      this.tabsChange(rows);
      this.selectionRows = rows;
    },
    tabsChange(rows) {
      //在快递出库和已登记TABS分别选中数据后右侧批量操作可点击，分开判断，
      let btnArr =
        this.tabsConfig.activeName === "2"
          ? this.tabBtnArr.slice(0, 1)
          : this.tabBtnArr.slice(1, 3);
      btnArr.map((item) => {
        this.$set(this.tabBtnArr[item.id], "disabled", !rows.length);
      });
    },
    handlePage(row = {}) {
      this.$router.push({
        path: "/warehouseManage/process/toBeLabeled",
        query: {
          number: row.number,
        },
      });
    },
    handleStatusChange(row = {}, changeType) {
      //转卡车  转自提
      var changeArr = [];
      if (row.id) {
        //单点
        const { id, type } = row;
        changeArr.push({
          outWarehouseWay: changeType,
          markStatus: type,
          orderId: id,
					oldOutWarehouseWay: 0, // 10-快递
        });
      } else {
        changeArr = this.selectionRows.map((e) => {
          const { id, type } = e;
          return {
            outWarehouseWay: changeType,
            markStatus: type,
            orderId: id,
						oldOutWarehouseWay: 0, // 10-快递
          };
        });
      }
      truckServerTypeConvert(changeArr).then((res) => {
        this.keepTableListMixin();
      });
    },
    handleDetails(row) {
      const { type } = row;
      const pathObj = {
        1: `/warehouseManage/outStorage/wholeSaleDetails`, // 一件代发详情
        0: `/warehouseManage/outStorage/fbaWarehouseDetails`, // FBA订单详情
        2: `/warehouseManage/inStorage/buttOrderDetails`, // 中转出库/大货中转 -> 电商头程详情
      };
      const idList = this.$refs[
        `tableRef${+this.tabsConfig.activeName}`
      ][0].tableData.map((e) => {
        if (type == e.type) {
          return e.id;
        }
      }) .filter((result) => typeof result !== "undefined");;
      this.$router.push({
        path: pathObj[type],
        query: {
          id: row.id,
          pageSign: idList.join(","), // idList.join(','), // 详情显示上一页/下一页
          backPath: this.$route.path,
        },
      });
    },
    getTableList(searchFrom = {}) {
      const { createTime, statusList, deliveryChannelid, ...searchObj } =
        searchFrom;
      const { activeName } = this.tabsConfig;
      this.searchFromData[activeName] = {
        ...searchObj,
        deliveryChannelid: deliveryChannelid || 0,
        statusList: statusList?.length ? statusList.join(",") : undefined,
        beginTime: createTime ? `${createTime[0]}@${createTime[1]}` : undefined,
      };
      this.$refs[`tableRef${+activeName}`][0].refreshTable();
    },
    rowIncludesBtn(btnIndex, item, row) {
      //出库状态(0-未出库，1-部分出库，4 待出库    6已出库   7待登记，9-全部出库)
      //isSticker  1-需要贴标 0不需要贴标
      //stickerStatus   贴标状态
      if (item.isTab === "1") {
        if (btnIndex === 0) {
          return (
            item.stickerType.includes(row.isSticker) &&
            item.stickerArr.includes(row.stickerStatus)
          );
        } else {
          return item.btnType.includes(row.status);
        }
      } else {
        return item.btnType.includes(row.status);
      }
    },
    getQueryParams() {
      const { activeName } = this.tabsConfig;
      return {
        ...this.searchFromData[activeName],
        statusList: activeName === "1" ? 7 : 4,
        outWarehouseWayStatus: activeName === "1" ? 10 : undefined, // 0 卡车   10快递   20自提
        warehouseId: this.curWarehouseObj.value, //右侧的仓库ID，数据在混入文件里
        // type: this.tabsConfig.activeName - 1
      };
    },
    searchTabForm(index) {
      return {
        ...this.searchFormConfig,
        fold: true,
        lists: searchColumns(index),
      };
    },
    tableTabConfig(index) {
      return tableColumns(index);
    },
    // keepTableList(isRefreshPage = true) {
    //   const { activeName } = this.tabsConfig;
    //   this.$refs[`tableRef${activeName}`] &&
    //     this.$refs[`tableRef${activeName}`][0]?.refreshKeepTable(
    //       isRefreshPage,
    //       activeName
    //     );
    // },
    ...mapActions(["dictionary/getDictionary"]),
  },
  created() {
    this["dictionary/getDictionary"]("exWarehouseDict").then((res) => {
      this.$set(this.tabsConfig, "btnArr", this.tabBtnArr.slice(1, 3));
      this.showSearchForm = true;
    });
  },
  // activated() {
  //   this.keepTableList(false);
  // },
  deactivated() {
    this.selectionRows = [];
  },
  components: {
    editFormExpressDlg,
    ConfirmDialog: () => import("_comp/ConfirmDialog"),
    CurrentWhereWarehouse: () =>
      import("@/views/warehouseManage/components/currentWarehouse"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
