<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="(tab, idx) in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              ref="searchTabForm"
              :formConfig="searchTabForm(tab.name)"
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
              :isMountedRequest="tabsConfig.activeName === '1'"
              :selectionRow="selectionRowEvt"
              @onSelectionChange="onTableSelectionChange"
              :selectionTableRow="[...selectionRows]"
              :getQueryParams="() => getQueryParams(tab.name)"
              @handleTableView="(r) => handleEditOrSee(r, 1)"
              :rowOperationBtnListFn="(row) => tableBtnList"
            >
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
      <template v-slot:slotTabsRight>
        <CurrentWhereWarehouse @setCurWarehouse="getWarehouseTableMixin" />
      </template>
    </ComTabs>
    <editFormTransferDlg ref="editFormTransferRef" />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
// import {
//   getSelectStickerAllList,
//   fbaFreightPut,
// } from "@/api/warehouse/process";
import {
  getOutboundLabelList,
  putOutboundLabelFinish,
} from "@/api/overseas/platformOrder.js";
import { typeConversion } from "@/utils/index";
import editFormTransferDlg from "./editDlg";
import { searchColumns, tableColumns } from "./model";
import curWarehouseMixin from "@/views/warehouseManage/components/currentWarehouse/mixin";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { customMessageBox } from "@/utils/confirmBox.js";
import { getStreamFileDownload } from "@/utils/zipdownload";

export default {
  name: "ToBeLabeled",
  mixins: [curWarehouseMixin, mixinColsConf],
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
            label: this.overseaLangObj.to_be_labeled,
            name: "1",
          },
          {
            label: this.overseaLangObj.y_labeled,
            name: "2",
          },
        ],
        btnArr: [
          {
            table: "下载附件",
            disabled: true,
            showTabName: "1",
            handleClick: () => {
              if (!this.selectionRows.length) {
                this.msgError("请选择工作单");
              }
              getStreamFileDownload(
                "/outboundLabeling/downloadAttach",
                {
                  idList: this.selectionRows.map((e) => e.id),
                },
                {
                  method: "post",
                }
              ).then(() => {
                this.onTableSelectionChange();
              });
            },
          },
        ],
      },
      searchFromData: {},
      searchFormConfig: {
        formModel: {},
        labelWidth:
          this.overseaLangObj.yu_yan_lang === "en-us" ? "130px" : "85px",
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getTableList(formModel);
            resolve();
          });
        },
        fold: true,
        searchColsHeight: true,
        searchForm: true,
      },
      tableConfig: {
        httpRequest: getOutboundLabelList,
      },
      tableBtnList: [
        // {
        //   text: this.overseaLangObj.bj_edit("修改"),
        //   handleClick: this.handleEditOrSee,
        // },
        {
          text: this.overseaLangObj.tb_labeling("贴标"),
          handleClick: this.handleFbaFreight,
        },
      ],
      selectionRows: [],
    };
  },
  methods: {
    handleEditOrSee(row = {}, mode_type = 0) {
      const nRow = {
        ...row,
        stickerType: typeConversion(row.stickerType) || "-1", // -1: 不贴标  0: 外箱贴标  1: SKU贴标
        isSort: typeConversion(row.isSort, "number") === 0, // 是否按顺序  0: 是  1: 否
      };
      this.$refs.editFormTransferRef.editShow(nRow, {
        mode_type,
        editSuccess: () => {
          this.mixinkeepTable();
        },
      });
    },
    handleFbaFreight(row = {}) {
      // const { id, markStatus } = row;
      // fbaFreightPut({ id, isSticker: 1, markStatus }).then(() => {
      //   this.mixinkeepTable();
      // });
      customMessageBox(
        this,
        {
          msgTxt1: "确认贴标是否完成？",
          msgTxt2: "",
          httpMsgRequest: () => putOutboundLabelFinish({ idList: [row.id] }),
        },
        () => {
          this.msgSuccess("贴标完成");
          this.mixinkeepTable();
        }
      );
    },
    getTableList(searchFrom = {}) {
      const { createTime, markStatusList, ...searchObj } = searchFrom;
      const [forecastTimeGe, forecastTimeLe] = createTime || [];
      this.searchFromData[this.tabsConfig.activeName] = {
        ...searchObj,
        // markStatusList: markStatusList?.length
        //   ? markStatusList.join(",")
        //   : undefined,
        forecastTimeGe,
        forecastTimeLe,
      };
      this.mixinkeepTable(true);
    },
    getQueryParams(tName) {
      return {
        ...this.searchFromData[tName],
        statusList: [+tName], // 1-待贴标；2-已贴标
        wmsId: this.curWarehouseObj.value,
      };
    },
    handleDetails(row = {}) {},
    searchTabForm(tName) {
      return {
        ...this.searchFormConfig,
        lists: searchColumns(tName - 1),
      };
    },
    onTableSelectionChange(rows) {
      //选择相应的账单
      this.selectionRows = rows || [];
      this.$refs[
        `tableRef${this.tabsConfig.activeName}`
      ][0]?._toggleRowSelectionMixin({
        newCheckRows: this.selectionRows,
      });
    },
    selectionRowEvt() {
      return true;
    },
    tableTabConfig(index) {
      return tableColumns(index);
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
  created() {
    this["dictionary/getDictionary"]("inOutWarehouseProcess").then(() => {
      this.showSearchForm = true;
    });
  },
  watch: {
    "selectionRows.length"(sLen) {
      this.$set(this.tabsConfig.btnArr[0], "disabled", !sLen);
    },
  },
  components: {
    editFormTransferDlg,
    CurrentWhereWarehouse: () =>
      import("@/views/warehouseManage/components/currentWarehouse"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
