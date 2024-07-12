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
            <!-- :columnConfig="tableTabConfig(idx)" -->
            <ComTable
              v-if="tabsConfig.activeName === tab.name"
              :ref="`tableRef${tab.name}`"
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="tableMixinConfig(tab.name)"
              :httpRequest="tableConfig.httpRequest[idx]"
              :getQueryParams="getTableQueryParams"
              @onSelectionChange="onTableSelectionChange"
              :selectionTableRow="[...selectionRows]"
							:rowOperationBtnListFn="(r) => rowIncludesBtn(r)"
              @handleTableView="handleDetails"
            >
              <template v-slot:customRow="{ slotProps }">
                <!-- <template v-if="slotProps.prop === 'number'">
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
                </template> -->
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
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
      <!-- <template v-slot:slotTabsRight>
        <CurrentWhereWarehouse
          v-if="mixinInitTableCols"
          @setCurWarehouse="getWarehouseTableMixin"
        />
      </template> -->
    </ComTabs>
    <editFormLiftingDlg ref="editFormLiftingRef" />
    <detailsDlg ref="detailsDlgRef" />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import {
  pickUpPreviewDownload,
  POSTDistributionPlanPickupPage,
  GETdIstributionPickupInfo
} from "@/api/warehouse/manage";
import { changePlanDistributionType, getTruckCheckOrderState } from "@/api/warehouse/process";
import { filesPreview } from "@/utils/index";
import editFormLiftingDlg from "./editDlg";
import { searchColumns, tableColumns } from "./model";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
export default {
  name: "SelfLifting",
  mixins: [mixinColsConf],
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {
          this.initMixinColumnConf();
        },
        tabs: [
          {
            label: this.overseaLangObj.zt_dj || "自提登记",
            name: "1",
          },
          {
            label: this.overseaLangObj.ydj_registered || "已登记",
            name: "2",
          },
        ],
      },
      tabBtnArr: [
        {
          table: this.overseaLangObj.zg_kc || "转卡车",
          disabled: true,
          showTabName: "1",
          handleClick: () => this.handleStatusChange(null, 1),
        },
        {
          table: this.overseaLangObj.zh_kd || "转快递",
          disabled: true,
          showTabName: "1",
          handleClick: () => this.handleStatusChange(null, 2),
        },
        // {
        //   table: "打印模板",
        //   disabled: false,
        //   showTabName: "2",
        //   handleClick: () => this.handleBatch({}, 1),
        // },
      ],
      searchFormConfig: {
        labelWidth:
          this.overseaLangObj.yu_yan_lang === "en-us" ? "120px" : "85px",
        formModel: {},
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getTableList(formModel);
            resolve();
          });
        },
        searchForm: true,
      },
      selectionRows: [],
      tableConfig: {
        tableHeight: "calc(100vh - 264px)",
        httpRequest: [
          POSTDistributionPlanPickupPage,
          POSTDistributionPlanPickupPage,
        ],
        statusBtnList: [
          {
            text: "登记",
            btnType: [2],
            isTab: "1",
            handleClick: (row) => this.handleEditDlg(row,0,1),
          },
          {
            text: this.overseaLangObj.zt_hw || "提货",
            infoStateShow: [0],
            isTab: "2",
            handleClick: async (row) => {
              await getTruckCheckOrderState({
                type: 3,
                idList: [row.distributionInfoId],
              });
              this.handleEditDlg(row, 0, 2);
            },
          },
          // {
          //   text: "打印模板",
          //   // btnType: [6],
          //   isTab: "2",
          //   handleClick: (row) => this.handlePreview(row, "print"),
          // },
          {
            text: this.overseaLangObj.zg_kc || "转卡车",
            // btnType: [7],
            isTab: "1",
            handleClick: (row) => this.handleStatusChange([row?.id], 1),
          },
          {
            text: this.overseaLangObj.zh_kd || "转快递",
            // btnType: [7],
            isTab: "1",
            handleClick: (row) => this.handleStatusChange([row?.id], 2),
          },
        ],
      },
      searchFromData: {
        1: {},
        2: {},
      },
      mixinTableColArr: [tableColumns(0), tableColumns(1)],
    };
  },
  methods: {
    // handleBatch(row = {}, type = 0) {},
    handlePreview(row = {}, operationType) {
      pickUpPreviewDownload({ id: row.id }).then((res) => {
        if (res.data) {
          if (operationType === "print") {
            window.open(res.data);
          } else {
            filesPreview(res.data);
          }
        }
      });
    },
    async handleEditDlg(row = {}, mode_type = 0, activeName) {
      let params = {};
      if (activeName == 1) {
        params = {
          ...row,
        };
      }else {
        const detailData=await GETdIstributionPickupInfo(row.distributionInfoId)
        params={
          ...detailData.data||{}
        }
      }
      this.$refs.editFormLiftingRef.editShow(params, {
        mode_type,
        activeName,
        editSuccess: () => {
          this.mixinkeepTable();
        },
      });
    },
    // handleDetails(row) {
    //   const { markStatus } = row;
    //   const pathObj = {
    //     1: `/warehouseManage/outStorage/wholeSaleDetails`, // 一件代发详情
    //     0: `/warehouseManage/outStorage/fbaWarehouseDetails`, // FBA订单详情
    //     2: `/warehouseManage/inStorage/buttOrderDetails`, // 中转出库/大货中转 -> 电商头程详情
    //   };
    //   const idList = this.$refs[
    //     `tableRef${+this.tabsConfig.activeName}`
    //   ][0].tableData
    //     .map((e) => {
    //       if (e.markStatus == markStatus) {
    //         return e.id;
    //       }
    //     })
    //     .filter((result) => typeof result !== "undefined");
    //   this.$router.push({
    //     path: pathObj[markStatus],
    //     query: {
    //       id: row.id,
    //       pageSign: idList.join(","), // idList.join(','), // 详情显示上一页/下一页
    //       backPath: this.$route.path,
    //     },
    //   });
    // },
    getTableList(searchFrom = {}) {
      const { activeName } = this.tabsConfig;
      const { createTime, destinationId, ...obj } = searchFrom;
      // console.log("searchFrom", searchFrom);
      this.searchFromData[activeName] = {
        ...obj,
        destinationId,
        destinationType: destinationId ? 1 : undefined, //目的仓类型
        createTimeGe: createTime && createTime[0],
        createTimeLe: createTime && createTime[1],
      };
      this.mixinkeepTable(true);
    },
    rowIncludesBtn(row) {
      const { activeName } = this.tabsConfig;
      const arr = this.tableConfig.statusBtnList.filter((e) => {
        const { isTab, btnType,infoStateShow } = e;
        if (btnType) {
          return btnType.includes(row.state) && isTab == activeName;
        }else if(infoStateShow){
          return infoStateShow.includes(row.infoState) && isTab == activeName;
        } else {
          return isTab == activeName;
        }
      });
      return arr;
    },
    handleStatusChange(idList, distributionType) {
      //转卡车，转自提
      const params = {
        distributionType,
        idList: idList ? idList : (this.selectionRows || []).map((e) => e.id),
      };
      this.comRepeatedRequest(this, changePlanDistributionType, params).then(
        () => {
          this.msgSuccess(this.overseaLangObj.cg_tip("操作成功"));
          this.onTableSelectionChange();
          this.mixinkeepTable();
        }
      );
    },
    getTableQueryParams() {
      const { activeName } = this.tabsConfig;
      return {
        ...this.searchFromData[activeName],
        distributionType: 3,
        tab: activeName === "1" ? 0 : 1,
        // statusList: activeName === "1" ? undefined : 6,
        // outWarehouseWayStatus: activeName === "1" ? 10 : undefined, // 0 卡车   10快递   20自提
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
    // tableTabConfig(index) {
    //   return tableColumns(index);
    // },
    onTableSelectionChange(rows = []) {
      //暂无勾选条件
      this.selectionRows = rows;
      this.tabBtnArr.slice(0, 2).map((item, index) => {
        this.$set(this.tabBtnArr[index], "disabled", !rows.length);
      });
    },
    handleDetails(row){
      const {distributionInfoId}=row
      GETdIstributionPickupInfo(distributionInfoId).then((res)=>{
        this.$refs.detailsDlgRef?.show(res.data);
      })
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
  created() {
    this.$set(this.tabsConfig, "btnArr", this.tabBtnArr);
    this["dictionary/getDictionary"]("exWarehouseDict").then(() => {
      this.showSearchForm = true;
    });
  },
  activated() {
    this.onTableSelectionChange();
  },
  components: {
    editFormLiftingDlg,
    detailsDlg: () =>
        import("./detailDlg.vue"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
