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
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="tableConfig.getQueryParams"
              :isMountedRequest="false"
              :rowOperationBtnListFn="() => tableConfig.statusBtnList"
              :colShowBtnFn="operationBtn"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'code'">
                  <div
                    class="primary-text-btn ellipsis-text"
                    @click="handlePage(slotProps.row)"
                  >
                    {{ slotProps.row[slotProps.prop] || "--" }}
                  </div>
                </template>

                <template v-if="slotProps.prop === 'operation'">
                  <div class="operation-content-btn">
                    <template
                      v-for="(item, index) in tableConfig.statusBtnList"
                    >
                      <el-button
                        :key="index"
                        size="small"
                        type="text"
                        v-if="
                          item.statusArr.includes(slotProps.row.status || 0)
                        "
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
    <EditTruckRecordDlg ref="editTruckRecordRef" />
    <ConfirmDialog ref="confirmDialogRef" />
    <ComCustomDialog ref="customDialogRef" />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { msgBox } from "@/utils/confirmBox.js";
import { exwarehouseTruckList, delTruckRecord } from "@/api/warehouse/process";
import { putTruckUpdateStatus } from "@/api/warehouse/manage";
import { searchColumns, tableColumns, formOutboundCols } from "./model";
import curWarehouseMixin from "@/views/warehouseManage/components/currentWarehouse/mixin";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
export default {
  name: "TruckRecord",
  mixins: [curWarehouseMixin, mixinColsConf],
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "卡车信息",
            name: "1",
          },
        ],
      },
      searchFromData: {},
      searchFormConfig: {
        labelWidth: "92px",
        formModel: {},
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getTableList(formModel);
            resolve();
          });
        },
        fold: true,
        searchForm: true,
        size: "small",
        formRules: {},
      },
      tableConfig: {
        tableHeight: "calc(100vh - 324px)",
        getQueryParams: this.getQueryParams,
        httpRequest: exwarehouseTruckList,
        statusBtnList: [
          {
            text: "修改",
            showStatus: [5],
            handleClick: this.handleEdit,
          },
          {
            text: "出库完成",
            showStatus: [5],
            handleClick: this.handleEnd,
          },
          {
            text: "上传POD",
            showStatus: [6],
            handleClick: this.handleUpload,
          },
          {
            text: "删除",
            color:"#FF6767",
            showStatus: [5],
            handleClick: this.handleDelete,
          },
        ],
      },
    };
  },
  methods: {
    handlePage(row) {
      const idList = this.$refs[
        `tableRef${+this.tabsConfig.activeName}`
      ][0].tableData.map((e) => e.id);
      this.handleView("/warehouseManage/process/editTruckRecord", row, idList);
    },
    handleEdit(row) {
      this.handleView("/warehouseManage/exWarehouse/truckEdit", row);
    },
    handleView(path, row = {}, idList = []) {
      this.$router.push({
        path,
        query: {
          id: row.id,
          pageSign: idList.join(","), // 详情显示上一页/下一页
          backPath: this.$route.fullPath,
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
          this.msgSuccess("更新成功");
          this.keepTableListMixin();
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
        type: 10, // 10-整箱POD 20-订单POD
        serviceName: "整箱POD",
        truckId: row.id,
        attachId: row.attachId,
      };
      this.$refs.editTruckRecordRef.editShow(opt, {
        mode_type,
        editSuccess: () => {
          this.keepTableListMixin();
        },
      });
    },
    handleDelete(row = {}) {
      const msg = "删除操作不可逆！";
      const title = "删除提示";
      const className = "el-icon-warning text-warning";
      msgBox(this, { title, className, msg }, () => {
        delTruckRecord(row.id).then(() => {
          this.msgSuccess("删除成功");
          this.keepTableListMixin();
        });
      });
    },
    getTableList(searchFrom = {}) {
      const { createTime, statusList, ...searchObj } = searchFrom;
      const { activeName } = this.tabsConfig;
      this.searchFromData[activeName] = {
        ...searchObj,
        statusList: statusList?.length ? statusList.join(",") : undefined,
        beginTime: createTime ? `${createTime[0]}@${createTime[1]}` : undefined,
      };
      this.keepTableListMixin(true);
    },
    getQueryParams() {
      return {
        ...this.searchFromData[this.tabsConfig.activeName],
        warehouseId: this.curWarehouseObj.value,
        // type: this.tabsConfig.activeName - 1
      };
    },
    handleDetails(row = {}) {},
    operationBtn(rItem, row) {
      const { showStatus } = rItem;
      const { status } = row;
      if (showStatus.includes(status || 0)) {
        return true;
      } else {
        return false;
      }
    },
    searchTabForm(index) {
      return {
        ...this.searchFormConfig,
        lists: searchColumns(index),
      };
    },
    tableTabConfig(index) {
      return tableColumns(index);
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
  created() {
    this["dictionary/getDictionary"]("exWarehouseDict").then((res) => {
      this.showSearchForm = true;
    });
  },
  components: {
    ConfirmDialog: () => import("_comp/ConfirmDialog"),
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"), // 自定义弹窗
    EditTruckRecordDlg: () => import("./editDlg"),
    CurrentWhereWarehouse: () =>
      import("@/views/warehouseManage/components/currentWarehouse"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
