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
              :getQueryParams="tableConfig.getQueryParams"
              :isMountedRequest="false"
              @onSelectionChange="onTableSelectionChange"
              :selectionRow="selectionRowEvt"
              :selectionTableRow="[...selectionRows[tab.name]]"
              selectionKey="wtblrIds"
              @handleTableView="handleUpdate"
              :rowOperationBtnListFn="rowOperationBtnListFn"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="['state'].includes(slotProps.prop)">
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
                <!-- <template
                  v-if="
                    [
                      'enterWarehouseTime',
                      'packingTrackingNum',
                      'destination',
                      'customerName',
                      'warehouseCode',
                    ].includes(slotProps.prop)
                  "
                >
                  <el-row
                    :class="[
                      'ellipsis-text',
                      index === 0 ? '' : 'freight-rows',
                    ]"
                    v-for="(item, index) in slotProps.row
                      .twarehouseStorageListSonVos || []"
                    :key="`2_${index}_${item.id}`"
                  >
                    <span>
                      {{ item[slotProps.prop] || "--" }}
                    </span>
                  </el-row>
                </template> -->
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
    <InOutDetails ref="inOutDetailRef" />
    <EditPutShelfDlg ref="editPutShelfRef" />
    <BatchPutShelfDlg ref="batchRef" />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { getTransferList, warehouseStoragePut } from "@/api/warehouse/manage";
import InOutDetails from "./details";
import { searchColumns, tableColumns } from "./model";
import curWarehouseMixin from "@/views/warehouseManage/components/currentWarehouse/mixin";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
export default {
  name: "InOut",
  mixins: [curWarehouseMixin, mixinColsConf],
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: this.overseaLangObj.large_cargo_transit || "大货中转",
            name: "1",
          },
        ],
        btnArr: [
          {
            table: this.overseaLangObj.pl_sj || "批量上架",
            disabled: true,
            handleClick: () => this.handleBatchEdit(null),
          },
          // {
          //   table: "批量上架",
          //   disabled: true,
          //   handleClick: () => this.handleGrounding({}, 1),
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
          this.overseaLangObj.yu_yan_lang === "en-us" ? "120px" : "100px",
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
        getQueryParams: this.getQueryParams,
        httpRequest: getTransferList,
        statusBtnList: [
          // {
          //   text: "查看",
          //   btnType: [0, 1, 2],
          //   handleClick: this.handleDetails,
          // },
          {
            text: this.overseaLangObj.put_away() || "上架",
            btnType: ["putShelfTime"],
            handleClick: (r) => this.handleBatchEdit([r]),
            // handleClick: (r) => this.handleGrounding(r),
          },
          // {
          //   text: "卡车派送",
          //   btnType: [0],
          //   handleClick: (row) => this.handleEditPage(row, 1),
          // }, {
          //   text: "已送达",
          //   btnType: [1],
          //   handleClick: (row) => this.handleEdit(row, 2),
          // }
        ],
      },
      mixinTableColArr: [tableColumns(0)],
    };
  },
  // computed: {
  //   ...mapState({
  //     dictData: (state) => state.dictionary.dicsData,
  //   }),
  // },
  methods: {
    // handleGrounding(row = {}, batchType = -1) {
    //   const { activeName } = this.tabsConfig;
    //   let nRow = row;
    //   let trayRows = [row];
    //   if (batchType === 1) {
    //     // 批量上架
    //     if (!this.selectionRows[activeName].length) {
    //       return;
    //     }
    //     nRow = {
    //       ...this.selectionRows[activeName][0],
    //       trayIds: this.selectionRows[activeName].map((e) => e.wtblrIds), // 批量上架ID
    //     };
    //     trayRows = this.selectionRows[activeName];
    //   }
    //   const { customerName } = nRow.twarehouseStorageListSonVos
    //     ? nRow.twarehouseStorageListSonVos[0]
    //     : {};
    //   this.$refs.editPutShelfRef.editShow(
    //     {
    //       ...nRow,
    //       customerName,
    //       webPartitionType: 4,
    //       // activeType: activeName - 1, // 0-SKU存仓 1-按箱存仓
    //       warehouseId: this.curWarehouseObj.value,
    //       trayInfoParamList: trayRows.map((ele) => {
    //         const { orderNum, packingTrackingNum } =
    //           ele.twarehouseStorageListSonVos[0] || {};
    //         return {
    //           traySn: ele.trayNum,
    //           orderSn: orderNum,
    //           boxSn: packingTrackingNum,
    //         };
    //       }),
    //     },
    //     {
    //       editSuccess: () => this.mixinkeepTable(),
    //     }
    //   );
    // },
    handleBatchEdit(rows) {
      const tabRows = rows || this.selectionRows[this.tabsConfig.activeName];
      if (tabRows.length) {
        this.$refs.batchRef.show(tabRows, {
          warehouseId: this.curWarehouseObj.value,
          typeIn: "4",
          successFn: () => this.mixinkeepTable(),
        });
      }
    },
    handleEdit(row = {}, deliveryStatus) {
      const opt = {
        id: row.id,
        deliveryStatus,
      };
      warehouseStoragePut(opt).then(() => {
        this.msgSuccess(this.overseaLangObj.cz_cg || "更新成功");
        this.mixinkeepTable();
      });
    },
    handleEditPage(row = {}) {
      this.$router.push({
        path: "/warehouseManage/exWarehouse/truckEdit",
        query: {
          justIds: row.id,
          detailsAddr: row.destination,
          backPath: this.$route.path,
        },
      });
    },
    getTableList(searchFrom = {}) {
      const { createTime, orderTypes, ...searchObj } = searchFrom;
      const { activeName } = this.tabsConfig;
      this.searchFromData[activeName] = {
        ...searchObj,
        orderTypes: orderTypes && orderTypes.join(","),
        startEnterWarehouseTime: createTime && createTime[0],
        endEnterWarehouseTime: createTime && createTime[1],
      };
      this.mixinkeepTable(true);
    },
    getQueryParams() {
      return {
        ...this.searchFromData[this.tabsConfig.activeName],
        // type: 1,
        storageWay: 1, // 1-大货中转   大货中转时，type为1
        warehouseId: this.curWarehouseObj.value,
      };
    },
    handleDetails(row = {}) {
      this.$refs.inOutDetailRef.detailShow(row);
    },
    searchTabForm(index) {
      return {
        ...this.searchFormConfig,
        lists: searchColumns(index),
      };
    },
    // 表格多选
    onTableSelectionChange(rows = []) {
      const { activeName } = this.tabsConfig;
      const nRows = rows.filter((e) => !e.putShelfTime);
      this.selectionRows[activeName] = nRows;
      this.$refs[`tableRef${activeName}`][0]._toggleRowSelectionMixin({
        newCheckRows: this.selectionRows[activeName],
      });
    },
    // 已上架不可选择
    selectionRowEvt(row) {
      if (row.putShelfTime) {
        return false; // 禁止选择
      }
      return true; // 可选
    },
    rowOperationBtnListFn(row) {
      return this.tableConfig.statusBtnList.filter((e) => {
        if (e.btnType.includes("putShelfTime")) {
          return !row.putShelfTime;
        } else {
          return e.btnType.includes(row.state || 0);
        }
      }); // 订单操作
    },
    handleUpdate(row = {}, fileItem = {}) {
      const { activeName } = this.tabsConfig;
      const idList = this.$refs[`tableRef${activeName}`][0]?.tableData.map(
        (item) => item.trayId
      );
      if (fileItem.prop == "trayNum") {
        this.$router.push({
          path: "/warehouseManage/putIn/trayDetail",
          query: {
            id: row.trayId,
            backPath: this.$route.fullPath,
            pageSign: idList.join(","), // 详情显示上一页/下一页
            menuType: 2,
          },
        });
      }
    },
    ...mapActions(["dictionary/getDictionary"]),
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
  components: {
    InOutDetails,
    CurrentWhereWarehouse: () =>
      import("@/views/warehouseManage/components/currentWarehouse"),
    EditPutShelfDlg: () => import("../storageShelving/editDlg"),
    BatchPutShelfDlg: () => import("../storageShelving/batchDlg"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
