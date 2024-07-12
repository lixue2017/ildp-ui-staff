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
            <ComTable
              v-if="tabsConfig.activeName === tab.name"
              :ref="`tableRef${tab.name}`"
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="tableMixinConfig(tab.name)"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="getQueryParams"
              :isMountedRequest="false"
              @onSelectionChange="onTableSelectionChange"
              :selectionRow="selectionRowEvt"
              :selectionTableRow="[...selectionRows[tab.name]]"
              selectionKey="traySn"
              @handleTableView="handleUpdate"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'operation'">
                  <div class="operation-content-btn">
                    <span v-if="slotProps.row.state !== 1"> -- </span>
                    <template
                      v-for="(item, index) in tableConfig.statusBtnList"
                      v-else
                    >
                      <el-button
                        v-if="item.btnType.includes(slotProps.row.state)"
                        :key="index"
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
        <CurrentWhereWarehouse
          v-if="mixinInitTableCols"
          @setCurWarehouse="getWarehouseTableMixin"
        />
      </template>
    </ComTabs>
    <!-- <EditPutShelfDlg ref="editPutShelfRef" /> -->
    <BatchPutShelfDlg ref="batchRef" />

    <ComUpload
      style="display: none"
      ref="dropdownUploadRef"
      :uploadConfig="storageUploadConfig"
      @handleSuccess="uploadSuccess"
    />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import {
  getStorageShelveList,
  getExportStorageShelveList,
} from "@/api/warehouse/manage";
import { searchColumns, tableColumns } from "./model";
import curWarehouseMixin from "@/views/warehouseManage/components/currentWarehouse/mixin";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { requestUrl } from "@/api/downloadUrl";
import { download, comFileDownload } from "@/utils/download.js";
import { defaultTextParams, IMPORT_STORAGE_URL } from "_comp/ComUpload/model";

export default {
  mixins: [curWarehouseMixin, mixinColsConf],
  name: "StorageShelving",
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {
          this.$nextTick(() => {
            //切换tabs清空勾选数据
            this.onTableSelectionChange();
            this.initMixinColumnConf();
          });
        },
        tabs: [
          {
            label: this.overseaLangObj.sku_storage || "SKU存仓",
            name: "1",
          },
          {
            label: this.overseaLangObj.box_storage || "整箱存仓",
            name: "2",
          },
        ],
        btnArr: [
          {
            table: this.overseaLangObj.pl_sj || "批量上架",
            disabled: true,
            handleClick: () => this.handleBatchEdit(null),
          },
          {
            table: this.overseaLangObj.xz_template("下载模板"),
            handleClick: () => {
              download(requestUrl.getListingTemplate);
            },
          },
          {
            table: this.overseaLangObj.dr_doc_sj("导入文档上架"),
            handleClick: () => {
              this.storageUploadConfig.uploadData = {
                cwmId: this.curWarehouseObj.value,
              };
              this.$refs.dropdownUploadRef?.handleUploadClick();
            },
          },
          {
            table: "入库明细导出",
            handleClick: () => {
              comFileDownload(
                this,
                getExportStorageShelveList,
                this.getQueryParams()
              );
            },
          },
          // {
          //   table: "批量上架",
          //   disabled: true,
          //   handleClick: () => this.handleEdit({}, 1),
          // },
        ],
      },
      selectionRows: {
        1: [],
        2: [],
      },
      searchFromData: {},
      searchFormConfig: {
        labelWidth:
          this.overseaLangObj.yu_yan_lang === "en-us" ? "116px" : "95px",
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
      tableConfig: {
        tableHeight: "calc(100vh - 264px)",
        httpRequest: getStorageShelveList,
        statusBtnList: [
          {
            text: this.overseaLangObj.put_away() || "上架",
            btnType: [1],
            // handleClick: this.handleEdit,
            handleClick: (r) => {
              if (r.orderType === 5) {
                this.$router.push({
                  path: "/warehouseManage/inStorage/predictionReceiving",
                  query: {
                    type: "1",
                    search: r.orderSn,
                  },
                });
              } else {
                this.handleBatchEdit([r]);
              }
            },
          },
        ],
      },
      mixinTableColArr: [tableColumns(0), tableColumns(1)],
      storageUploadConfig: {
        ...defaultTextParams,
        url: IMPORT_STORAGE_URL,
        name: "multipartFile",
        showFileList: false,
        limit: 992,
        accept: ".xlsx,.xls",
        uploadData: {},
      },
    };
  },
  methods: {
    // handleEdit(row = {}, batchType = -1) {
    //   const { activeName } = this.tabsConfig;
    //   let nRow = row;
    //   const { traySn } = nRow;
    //   let trayRows = [row];
    //   if (batchType === 1) {
    //     // 批量上架
    //     nRow = {
    //       ...this.selectionRows[activeName][0],
    //       trayIds: this.selectionRows[activeName].map((e) => e.trayId), // 批量上架ID
    //     };
    //     trayRows = this.selectionRows[activeName];
    //   }
    //   const { customerName } = nRow ? nRow : {};
    //   this.$refs.editPutShelfRef.editShow(
    //     {
    //       ...nRow,
    //       customerName,
    //       trayNum: traySn,
    //       activeType: activeName - 1, // 0-SKU存仓 1-按箱存仓
    //       warehouseId: this.curWarehouseObj.value,
    //       trayInfoParamList: trayRows.map((ele) => {
    //         //orderSn工作单号  boxSns箱序号 traySn托盘号
    //         const { orderSn, boxSns } = ele || {};
    //         return {
    //           traySn: ele.traySn,
    //           orderSn: orderSn,
    //           boxSn: boxSns,
    //         };
    //       }),
    //     },
    //     {
    //       editSuccess: () => {
    //         this.mixinkeepTable();
    //       },
    //     }
    //   );
    // },
    handleBatchEdit(rows) {
      const tabRows =
        rows || this.selectionRows[this.tabsConfig.activeName] || [];
      if (tabRows.length) {
        this.$refs.batchRef.show(tabRows, {
          warehouseId: this.curWarehouseObj.value,
          typeIn: "0,1,2,3", // 存仓  4 - 大货中转
          successFn: () => this.mixinkeepTable(),
        });
      }
    },
    uploadSuccess(res) {
      // console.log("res, row===uploadSuccess", res);
      this.handleBatchEdit(res.data);
    },
    getTableList(searchFrom = {}) {
      const { createTime, orderTypes, ...searchObj } = searchFrom;
      const { activeName } = this.tabsConfig;
      this.searchFromData[activeName] = {
        ...searchObj,
        startEnterWarehouseTime: createTime && createTime[0],
        endEnterWarehouseTime: createTime && createTime[1],
        orderTypes: orderTypes?.join(",") || "",
      };
      this.mixinkeepTable(true);
    },
    getQueryParams() {
      return {
        ...this.searchFromData[this.tabsConfig.activeName],
        type: this.tabsConfig.activeName - 1, // 0-SKU存仓 1-按箱存仓
        warehouseId: this.curWarehouseObj.value,
      };
    },
    // 表格多选
    onTableSelectionChange(rows) {
      // 初始全选时需要过滤不同条件表格行
      const { activeName } = this.tabsConfig;
      const nRows = (rows || []).filter(
        (e) => e.state === 1 && row.orderType !== 5
      );
      this.selectionRows[activeName] = nRows;
      this.$refs[`tableRef${activeName}`][0]._toggleRowSelectionMixin({
        newCheckRows: this.selectionRows[activeName],
      });
    },
    // 不同类型不可同时选择
    selectionRowEvt(row) {
      if (row.state !== 1 || row.orderType === 5) {
        return false; // 禁止选择
      }
      return true; // 可选
    },
    handleDetails(row = {}) {
      if (row.receivingSource === 1) {
        const { activeName } = this.tabsConfig;
        const idList = this.$refs[`tableRef${activeName}`][0]?.tableData.map(
          (item) => item.orderId
        );
        this.$router.push({
          path: "/warehouseManage/inStorage/receiptPage",
          query: {
            id: row.orderId,
            modelType: "wms",
            backPath: this.$route.fullPath,
            isSee: 1,
            pageSign: idList.join(","), // 详情显示上一页/下一页
          },
        });
        return;
      }
      const obj = {
        0: {
          type: "fba",
          cols: "fbaCols",
          orderType: 2,
        },
        2: {
          type: "eCommerce",
          cols: "eCommerceCols",
          orderType: 0,
        },
      };
      const { cols, type, orderType } = obj[row.receivingSource] || {};
      if (!cols) {
        return;
      }
      localStorage.setItem(
        cols,
        JSON.stringify({ ...row, orderType, id: row.orderId })
      );
      this.$router.push({
        path: "/warehouseManage/inStorage/takeDelivery",
        query: {
          type,
          backPath: this.$route.fullPath,
          isSee: 1,
        },
      });
    },
    searchTabForm(index) {
      return {
        ...this.searchFormConfig,
        lists: searchColumns(index),
      };
    },
    handleUpdate(row = {}, fileItem = {}) {
      const { activeName } = this.tabsConfig;
      const idList = this.$refs[`tableRef${activeName}`][0]?.tableData
        .filter((r) => r.orderType !== 5)
        .map((item) => item.trayId);
      if (fileItem.prop == "traySn") {
        this.$router.push({
          path: "/warehouseManage/putIn/trayDetail",
          query: {
            id: row.trayId,
            tcType: row.orderType === 5 ? true : undefined, // 退仓上架单独处理
            backPath: this.$route.fullPath,
            pageSign: row.orderType === 5 ? "" : idList.join(","), // 详情显示上一页/下一页
            menuType: activeName == 1 ? 0 : 1,
          },
        });
      }
    },
    ...mapActions([
      "dictionary/getDictionary",
      "customer/setStoreCurWarehouse",
    ]),
  },
  created() {
    this["dictionary/getDictionary"]("exWarehouseManage").then(() => {
      this.showSearchForm = true;
    });
  },
  watch: {
    selectionRows: {
      deep: true,
      handler: function (newVal) {
        const { activeName } = this.tabsConfig;
        this.$set(
          this.tabsConfig.btnArr[0],
          "disabled",
          !newVal[activeName].length
        );
      },
    },
  },
  computed: {
    ...mapState({
      receiptSource: (state) =>
        state.dictionary.dicsData.truckReceivingSource || {},
    }),
  },
  components: {
    // EditPutShelfDlg: () => import("./editDlg"),
    CurrentWhereWarehouse: () =>
      import("@/views/warehouseManage/components/currentWarehouse"),
    ComUpload: () => import("_comp/ComUpload"),
    BatchPutShelfDlg: () => import("./batchDlg"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.freight-rows {
  margin-top: 5px;
}
</style>
