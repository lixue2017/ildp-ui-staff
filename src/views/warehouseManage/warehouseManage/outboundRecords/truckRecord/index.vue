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
              :columnConfig="mixinTableColArr[tab.name - 1]"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="tableQueryParams"
              :rowOperationBtnListFn="(r) => tableBtnList(r)"
              @handleTableView="(r) => handlePage(r)"
            >
              <template v-slot:customHeader="{ slotProps }">
                <template
                  v-if="['totalVoteNum'].includes(slotProps.column.prop)"
                >
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="已核实票数/总票数"
                    placement="bottom"
                  >
                    <div style="display: inline-block">
                      {{ slotProps.column.label }}
                    </div>
                  </el-tooltip>
                </template>
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
    <GoodsVerifyDialog ref="goodsVerifyRef" />
    <EditTruckRecordDlg ref="editTruckRecordRef" />
    <ComCustomDialog ref="customDialogRef" />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { msgBox, customMessageBox } from "@/utils/confirmBox.js";
import { getStreamFileDownload } from "@/utils/zipdownload";
import {
  getDistributionTruckList,
  delDistributionTruck,
  putTruckRegistration,
  putTruckDeliveryArrival,
  getTruckCheckOrderState,
  postTruckCheck,
} from "@/api/warehouse/process";
import { putTruckUpdateStatus } from "@/api/warehouse/manage";
import { searchColumns, tableColumns, formOutboundCols } from "./model";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { simpleTimeCols } from "_comp/ConfirmDialog/customFormDialog/model.js";
export default {
  name: "TruckOutboundRecord",
  mixins: [mixinColsConf],
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: this.overseaLangObj.kc_info || "卡车信息",
            name: "1",
          },
        ],
      },
      searchFromData: {},
      searchFormConfig: {
        labelWidth:
          this.overseaLangObj.yu_yan_lang === "en-us" ? "120px" : "102px",
        formModel: {},
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getTableList(formModel);
            resolve();
          });
        },
        fold: true,
        searchForm: true,
      },
      mixinTableColArr: [tableColumns()],
      tableConfig: {
        tableHeight: "calc(100vh - 264px)",
        httpRequest: getDistributionTruckList,
        statusBtnList: [
          {
            text: this.overseaLangObj.tz_jh || "调整计划",
            showBtnStatus: [0, "v_1"],
            handleClick: (r) => this.handleAdjustPlan(r),
          },
          {
            text: this.overseaLangObj.kc_cf || "卡车出发",
            showBtnStatus: [0, "v_0"],
            handleClick: this.handleRegistration,
          },
          {
            text: this.overseaLangObj.bj_edit("修改"),
            showStatus: [0],
            handleClick: this.handleEdit,
          },
          // {
          //   text: "出库完成",
          //   showStatus: [5],
          //   handleClick: this.handleEnd,
          // },
          {
            text: this.overseaLangObj.ps_wc || "派送完成",
            showStatus: [1],
            handleClick: this.handleArrival,
          },
          {
            text: this.overseaLangObj.sc_pod || "上传POD",
            showStatus: [2, 3],
            handleClick: this.handleUpload,
          },
          {
            text: this.overseaLangObj.yc_delete("删除"),
            color: "#FF6767",
            showStatus: [0],
            handleClick: this.handleDelete,
          },
          {
            text: "卡车拣货单",
            showStatus: [0, 1, 2, 3],
            handleClick: (r) => {
              getStreamFileDownload(
                `/distributionTruckInfo/exportTruckPickingList/${r.id}`
              );
            },
          },
        ],
      },
    };
  },
  methods: {
    handleAdjustPlan(row) {
      this.$refs.goodsVerifyRef.showVerify(
        {
          ...row,
          id: row.planId,
        },
        {
          editSuccess: this.mixinkeepTable,
        }
      );
    },
    async handleRegistration(row) {
      await getTruckCheckOrderState({
        type: 1,
        idList: [row.id],
      });
      await postTruckCheck({
        truckId: row.id,
        pcCheck: true,
      });
      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: simpleTimeCols({
          title: this.overseaLangObj.kc_cf || "卡车出发",
          label: `${this.overseaLangObj.sj_fc_sj("实际出发时间")}：`,
          isRemark: true,
        }),
        httpRequest: (param) => {
          return putTruckRegistration({
            id: row.id,
            actualTime: param.time,
            remark: param.remark,
          });
        },
        successFunction: () => {
          this.mixinkeepTable();
        },
      });
    },
    handleArrival(row) {
      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: simpleTimeCols({
          title: this.overseaLangObj.ps_wc || "派送完成",
          label: `${this.overseaLangObj.sj_dd_sj("实际到达时间")}：`,
          isRemark: true,
        }),
        httpRequest: (param) => {
          return putTruckDeliveryArrival({
            id: row.id,
            actualTimeArrival: param.time,
            remark: param.remark,
          });
        },
        successFunction: () => {
          this.mixinkeepTable();
        },
      });
    },
    handlePage(row) {
      const idList = this.$refs[
        `tableRef${+this.tabsConfig.activeName}`
      ][0].tableData.map((e) => e.id);
      this.$router.push({
        path: "/warehouseManage/deliveryPlan/deliveryRecord/seeTruckOutboundRecord",
        query: {
          id: row.id,
          pageLocation: 2,
          pageSign: idList.join(","), // 详情显示上一页/下一页
          backPath: this.$route.fullPath,
        },
      });
    },
    handleEdit(row) {
      this.$router.push({
        path: "/warehouseManage/deliveryPlan/truckOutboundEdit",
        query: {
          id: row.id,
          pageLocation: 2, // 1=卡车出库；2=派卡车信息
          backPath: this.$route.path,
        },
      });
    },
    handleEnd(row = {}) {
      const { id } = row;
      this.$refs.customDialogRef.showCustomDialog({
        httpRequest: (obj) => {
          return putTruckUpdateStatus({
            id,
            status: 6,
            ...obj,
          });
        },
        successFunction: () => {
          this.msgSuccess(this.overseaLangObj.cg_tip("更新成功"));
          this.mixinkeepTable();
        },
        errorFunction: (err) => {
          const title = err.msg;
          const className = "el-icon-warning text-warning";
          const msg = "全部货物入库之后才能进行最后出库";
          const html = `<div class='display-flex'><i class='${className}'></i><span>${title}</span></div><div class='subtitle'>${msg}</div>`;
          msgBox(
            this,
            {
              title: "",
              html,
              showClose: false,
              confirmButtonText: "知道了",
              customClass: "delivery-box",
            },
            () => {}
          );
        },
        customFormConfig: formOutboundCols(),
      });
    },
    handleUpload(row = {}, mode_type = 0) {
      const opt = {
        code: row.code,
        type: "1", // 1-整箱POD 2-订单POD
        distributionInfoId: row.id,
        // attachId: row.attachId,
        attachList: row.attachList,
        // businessSn: row.businessSn
      };
      this.$refs.editTruckRecordRef.editShow(opt, {
        mode_type,
        editSuccess: () => {
          this.mixinkeepTable();
        },
      });
    },
    handleDelete(row = {}) {
      customMessageBox(
        this,
        {
          msgTitle: this.overseaLangObj.ts_tip("删除提示"),
          msgTxtColor: "#FF6767",
          httpMsgRequest: () => delDistributionTruck(row.id),
        },
        () => {
          this.msgSuccess(this.overseaLangObj.cg_tip("删除成功"));
          this.mixinkeepTable();
        }
      );
    },
    getTableList(searchFrom = {}) {
      const { createTime, thTime, ...searchObj } = searchFrom;
      const [createTimeGe, createTimeLe] = createTime || [];
      const [pickupTimeGe, pickupTimeLe] = thTime || [];
      this.searchFromData[this.tabsConfig.activeName] = {
        ...searchObj,
        createTimeGe,
        createTimeLe,
        pickupTimeGe,
        pickupTimeLe,
      };
      this.mixinkeepTable(true);
    },
    tableQueryParams() {
      return {
        ...this.searchFromData[this.tabsConfig.activeName],
      };
    },
    tableBtnList(row) {
      return this.tableConfig.statusBtnList.filter((e) => {
        if (e.showBtnStatus && e.showBtnStatus.includes(row.state)) {
          if (row.noVerifyVoteNum > 0) {
            // 调整计划: 待核实数>0
            return e.showBtnStatus.includes("v_1");
          }
          if (row.verifyVoteNum == row.totalVoteNum) {
            // 出发登记: 已核实数 = 总票数
            return e.showBtnStatus.includes("v_0");
          }
        }
        return e.showStatus?.includes(row.state);
      });
    },
    searchTabForm(index) {
      return {
        ...this.searchFormConfig,
        lists: searchColumns(index),
      };
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
  created() {
    this["dictionary/getDictionary"]([
      "distributionPlanKcState",
      "destinationType",
    ]).then(() => {
      this.showSearchForm = true;
    });
  },
  components: {
    ConfirmDialog: () => import("_comp/ConfirmDialog"),
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"), // 自定义弹窗
    EditTruckRecordDlg: () => import("./editDlg"),
    GoodsVerifyDialog: () =>
      import(
        "@/views/warehouseManage/warehouseManage/outboundDelivery/truck/components/goodsVerifyDlg.vue"
      ),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
