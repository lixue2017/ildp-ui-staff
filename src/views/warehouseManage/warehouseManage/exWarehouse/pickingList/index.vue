<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="(tab, idx) in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <template slot="label">
            <TabSearchColumn
              :searchFormData="mixinSearchFormData"
              :tabName="tab.name"
            />
          </template>
          <keep-alive>
            <ComForm
              ref="searchTabForm"
              :formConfig="searchTabForm(idx)"
              @searchHeight="searchHeight"
              v-if="tabsConfig.activeName === tab.name && showSearchForm"
            />
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              v-if="tabsConfig.activeName === tab.name"
              :ref="`tableRef${tab.name}`"
              :tableHeight="`calc(100vh - ${extraHeight + formHeight}px)`"
              :columnConfig="tableTabConfig(idx)"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="getQueryParams"
              :isMountedRequest="false"
              @onSelectionChange="onTableSelectionChange"
              :selectionRow="selectionRowEvt"
              :selectionTableRow="[...selectionRows]"
              @handleTableView="(r) => handlePage(r, 'details')"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'operation'">
                  <template
                    v-for="(item, index) in getStatusBtnList(slotProps.row)"
                  >
                    <PreviewOrDownload
                      style="margin-right: 5px"
                      v-if="item.isPreviewOrDownload"
                      :key="index"
                      :btnTxt="item.text"
                      :btnArr="['download']"
                      @handleSuccess="
                        (type) => handleSuccess(type, slotProps.row, item)
                      "
                      :previewDownloadConf="
                        previewDownloadConfig(slotProps.row)
                      "
                    />
                    <el-button
                      v-else
                      :key="index"
                      :class="`operate-icon ${
                        item.info && 'operate-icon-info'
                      }`"
                      size="small"
                      type="text"
                      @click.native="item.handleClick(slotProps.row)"
                      >{{ item.text }}</el-button
                    >
                  </template>
                  <template v-if="getStatusBtnList(slotProps.row).length == 0">
                    --
                  </template>
                </template>
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
      <template v-slot:slotTabsRight>
        <CurrentWhereWarehouse @setCurWarehouse="handleWarehouseTableMixin" />
      </template>
    </ComTabs>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { getPickingList, delPicking, pickingPut } from "@/api/warehouse/manage";
import { msgBox } from "@/utils/confirmBox.js";
import { getStreamFileDownload } from "@/utils/zipdownload";
import { searchColumns, tableColumns } from "./model";
import curWarehouseMixin from "@/views/warehouseManage/components/currentWarehouse/mixin";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { uploadPickingBill, comSaveRepeatedRequest } from "@/api/common.js";
export default {
  name: "PickingList",
  mixins: [curWarehouseMixin, mixinColsConf],
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        className: "slot-label-state",
        isTabStateCount: true,
        handleTabsClick: () => {},
        searchColumnParams: {},
        tabs: [
          {
            label: this.overseaLangObj.jhd_lb || "拣货单管理",
            name: "1",
          },
        ],
        btnArr: [
          {
            table: this.overseaLangObj.xz_add(),
            className: "btn-type-add",
            icon: "el-icon-plus",
            handleClick: () => this.handlePage({}, "add", -1),
          },
          {
            table: "批量打印快递面单",
            disabled: true,
            handleClick: () => this.handleBatch(),
          },
          {
            table: "打印面单",
            handleClick: () => {
              this.$router.push({
                path: "/warehouseManage/exWarehouse/printWaybill",
                query: {
                  warehouseId: this.curWarehouseObj.value,
                  backPath: this.$route.path,
                },
              });
            },
          },
        ],
      },
      searchFromData: {},
      searchFormConfig: {
        labelWidth:
          this.overseaLangObj.yu_yan_lang === "en-us" ? "120px" : "92px",
        formModel: {},
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getTableList(formModel);
            resolve();
          });
        },
        fold: true,
        residueCols: [2],
        searchColsHeight: true,
        searchForm: true,
      },
      tableConfig: {
        httpRequest: getPickingList,
        statusBtnList: [
          {
            text: "修改",
            showStatus: [0],
            handleClick: (row) => {
              this.handlePage(row, "edit", 1);
            },
          },
          {
            text: "提交确认",
            showStatus: [0],
            handleClick: (row) => {
              this.updatePicking(row, 1);
            },
          },
          {
            text: "打印拣货单",
            showStatus: [1, 2, 3, 4],
            isPreviewOrDownload: true,
            // handleClick: (row) => {
            //   this.handlePage(row, "edit", 4);
            // },
          },
          {
            text: "打印并拣货完成",
            showStatus: [1],
            btnType: "printState",
            isPreviewOrDownload: true,
          },
          {
            text: "拣货完成",
            showStatus: [2],
            handleClick: (row) => {
              this.updatePicking(row, 3);
            },
          },
          // {
          //   text: "拣货完成",
          //   showStatus: [3],
          //   handleClick: (row) => {
          //     this.handleSuccess("completed", row);
          //   },
          // },
          // {
          //   text: "打印出货单",
          //   showStatus: [3, 4],
          //   handleClick: (row) => {
          //     this.handlePage(row, "edit", 6);
          //   },
          // },
          {
            text: "删除",
            color: "#FF6767",
            showStatus: [0],
            handleClick: (row) => {
              this.handleDelete(row);
            },
          },
        ],
      },
      selectionRows: [],
    };
  },
  methods: {
    // handleBtnClick(row = {}, type_num) {
    //   console.log("row", row);
    //   console.log("type_num", type_num);
    //   // console.log('handleEdit===', row)
    //   switch (type_num) {
    //     case 1:
    //     case 4:
    //       this.handlePage(row, "edit", type_num);
    //       // this.uploadPickingBill(row);
    //       break;
    //     case 6:
    //       this.handlePage(row, "edit", type_num);
    //       // this.uploadPickingBill(row);
    //       break;
    //     case 2:
    //       this.handleDelete(row);
    //       break;
    //     case 3:
    //       // 点击 提交确认 状态待拣货
    //       this.updatePicking(row, 1);
    //       break;
    //     case 5:
    //       this.updatePicking(row, 3);
    //       break;
    //     default:
    //       this.$refs.dialogFormRef?.show();
    //   }
    //   // this.$refs[`tableRef${+activeName}`][0].refreshTable(false);
    // },
    async handleSuccess(type, row, btn) {
      const { pickingStatus, id, orderType } = row;
      if (type == "download" && pickingStatus == 1) {
        await pickingPut({
          id,
          orderType,
          pickingStatus: 2, // 出货单是6-2，拣货单是4-2，目前出货单已经被去除，所以默认2
        });
        if (btn.btnType === "printState") {
          this.updatePicking(row, 3);
        } else {
          this.mixinkeepTable(true);
          // this.keepTableListMixin();
        }
      }
    },
    handleBatch() {
      if (this.selectionRows?.length) {
        let infoIdList = [];
        this.selectionRows.forEach((e) => {
          infoIdList.push(...e.dpInfoIdList);
        });
        getStreamFileDownload(
          "urlDownloadDeliveryNote",
          {
            distributionType: 2, // 1=卡车；2=快递；3=自提
            infoIdList,
          },
          {
            method: "post",
            customFileName: "attach.zip",
          }
        ).then(() => {
          this.mixinkeepTable();
        });
      }
    },
    previewDownloadConfig(row) {
      const { id, orderType, pickingNumber, userName } = row;
      return {
        previewParam: {
          id,
          orderType,
          pickingNumber,
          userName,
        },
        previewHttp: uploadPickingBill,
      };
    },
    handleDelete(row = {}) {
      const msg = "删除操作不可逆！";
      const title = "删除提示";
      const className = "el-icon-warning text-warning";
      const { orderType, id } = row;
      msgBox(this, { title, className, msg }, () => {
        delPicking({ orderType, id }).then(() => {
          this.msgSuccess("删除成功");
          this.mixinkeepTable(true);
          // this.keepTableListMixin();
        });
      });
    },
    updatePicking(row, pStatus) {
      const params = {
        id: row.id,
        orderType: row.orderType,
        pickingStatus: pStatus, // 1-待拣货，2-拣货中，3-已拣货
      };
      comSaveRepeatedRequest(pickingPut, params).then(() => {
        this.msgSuccess(this.overseaLangObj.cz_cg || "更新成功");
        this.mixinkeepTable(true);
        // this.keepTableListMixin();
      });
    },
    handlePage(row = {}, routeType = "edit", modeType) {
      const { activeName } = this.tabsConfig;
      const ROUTER_PAGE = {
        add: "pickingEdit",
        edit: "pickingEdit",
        details: "pickingDetails",
      };
      const { warehouseMainId, warehouseCode, warehouseName } =
        this.curWarehouseObj;
      const idList = this.$refs[`tableRef${activeName}`][0]?.tableData.map(
        (item) => item.id
      );
      this.$router.push({
        path: `/warehouseManage/exWarehouse/${ROUTER_PAGE[routeType]}`,
        query: {
          id: row.id,
          modeType,
          orderType: row.orderType,
          pickingStatus: row.pickingStatus,
          backPath: this.$route.path,
          warehouseCode,
          warehouseName,
          warehouseId: warehouseMainId,
          pageSign: routeType == "details" ? idList.join(",") : undefined, // 详情显示上一页/下一页
        },
      });
    },
    getTableList(searchFrom = {}) {
      const { createTime, pickingType, stateList, ...searchObj } = searchFrom;
      const { activeName } = this.tabsConfig;
      this.searchFromData[activeName] = {
        ...searchObj,
        pickingList: pickingType,
        beginTime: createTime ? `${createTime[0]}@${createTime[1]}` : undefined,
        stateList: stateList?.length ? stateList.join(",") : undefined,
      };
      this.mixinkeepTable(true);
    },
    getQueryParams() {
      return {
        ...this.searchFromData[this.tabsConfig.activeName],
        warehouseId: this.curWarehouseObj.value,
        ...this.mixinSearchConfParams,
        // type: this.tabsConfig.activeName - 1
      };
    },
    handleDetails(row = {}) {},
    searchTabForm(index) {
      return {
        ...this.searchFormConfig,
        lists: searchColumns(index),
      };
    },
    tableTabConfig(index) {
      return tableColumns(index);
    },
    getStatusBtnList(row) {
      const { pickingStatus } = row;
      const btnList = this.tableConfig.statusBtnList.filter((e) => {
        const { showStatus } = e;
        return pickingStatus <= 4 && showStatus.includes(pickingStatus || 0);
      });
      return btnList;
    },
    selectionRowEvt(row) {
      return row.dpInfoIdList && row.dpInfoIdList.length;
    },
    onTableSelectionChange(rows) {
      this.selectionRows = (rows || []).filter(
        (e) => e.dpInfoIdList && e.dpInfoIdList.length
      );
      this.$refs[
        `tableRef${this.tabsConfig.activeName}`
      ][0]?._toggleRowSelectionMixin({
        newCheckRows: this.selectionRows,
      });
    },
    handleWarehouseTableMixin(row = {}, type) {
      const { warehouseMainId } = row;
      this.curWarehouseObj = {
        ...row,
      };
      this.tabsConfig.searchColumnParams = {
        warehouseId: warehouseMainId,
      };
      if (type == "WEB_HANDLESET") {
        this.mixinkeepTable(true, {
          isTableSearch: true,
        });
      }
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
  created() {
    this["dictionary/getDictionary"]("exWarehouseDict").then(() => {
      this.showSearchForm = true;
    });
  },
  watch: {
    "selectionRows.length"(sLen) {
      this.$set(this.tabsConfig.btnArr[1], "disabled", !sLen);
    },
  },
  components: {
    CurrentWhereWarehouse: () =>
      import("@/views/warehouseManage/components/currentWarehouse"),
    PreviewOrDownload: () => import("_comp/ComFileTable/previewOrDownload.vue"),
    TabSearchColumn: () => import("_comp/ComColumnConf/SearchColumn"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
/deep/ {
  .el-tabs__nav {
    width: calc(100% - 600px) !important;
  }
}
</style>
