<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="(tab, idx) in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :ref="`searchRef${tab.name}`"
              :formConfig="searchTabForm(idx)"
              v-if="tabsConfig.activeName == 3 && showSearchForm"
            >
              <template v-slot:warehousePartitionId="slotProps">
                <!-- 所属区域 -->
                <AutoComplete
                  v-if="showSearchForm"
                  :formModel="slotProps.formModel"
                  :fieldItem="{
                    ...slotProps.fieldItem,
                    handle: changePartion,
                  }"
                  :additionalParam="{
                    warehouseId: curWarehouseObj.value,
                  }"
                />
              </template>
              <template v-slot:freightShelfId="slotProps">
                <!-- 派货架 -->
                <AutoComplete
                  v-if="showSearchForm"
                  ref="freightShelfIdRef"
                  :formModel="slotProps.formModel"
                  :fieldItem="{
                    ...slotProps.fieldItem,
                  }"
                  :additionalParam="{
                    warehouseId: curWarehouseObj.value,
                    warehousePartitionId:
                      slotProps.formModel.warehousePartitionId,
                  }"
                />
              </template>
              <template v-slot:type="slotProps">
                <!-- 库位类型 -->
                <AutoComplete
                  v-if="showSearchForm"
                  :formModel="slotProps.formModel"
                  :fieldItem="slotProps.fieldItem"
                  :additionalParam="{
                    warehouseId: curWarehouseObj.value,
                  }"
                />
              </template>
            </ComForm>
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              v-if="tabsConfig.activeName === tab.name"
              :ref="`tableRef${tab.name}`"
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="tableTabConfig(idx)"
              :httpRequest="tableConfig.httpRequest[idx]"
              :getQueryParams="tableConfig.getQueryParams"
              :isMountedRequest="false"
              :rowOperationBtnListFn="() => tableConfig.statusBtnList"
              :colShowBtnFn="operationBtn"
              @onSelectionChange="onTableSelectionChange"
              :selectionTableRow="[...selectionRows]"
            >
              <template v-slot:customRow="{ slotProps }">
                <template
                  v-if="['warehouseCode', 'code'].includes(slotProps.prop)"
                >
                  <div
                    class="primary-text-btn ellipsis-text"
                    @click="handleDetails(slotProps.row)"
                  >
                    {{ slotProps.row[slotProps.prop] || "--" }}
                  </div>
                </template>

                <template v-if="['cusType'].includes(slotProps.prop)">
                  {{
                    (haveWarehouseType[slotProps.row.cusWarehouse.type] &&
                      haveWarehouseType[slotProps.row.cusWarehouse.type]
                        .nameCn) ||
                    "--"
                  }}
                </template>

                <template
                  v-if="['dataStatus', 'status'].includes(slotProps.prop)"
                >
                  <span>
                    <i
                      class="status-dot"
                      :style="{
                        backgroundColor:
                          slotProps.dicsList && slotProps.dicsList.color,
                      }"
                    ></i>
                    {{ slotProps.dicsList.nameCn }}
                  </span>
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
    <editFormWarehouse ref="editFormRef" />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import {
  getWarehouseList,
  updateWarehouseStatus,
  delWarehouse,
} from "@/api/basicInfo/warehouse";
import {
  getPartitionList,
  getLocationList,
  getLocationTypeList,
  delPartition,
  partitionPut,
  locationPut,
  locationTypePut,
  delLocation,
  delLocationType,
  printWarehouseLocation,
  getDownShippingMark,
} from "@/api/warehouse/basic";
import { msgBox } from "@/utils/confirmBox.js";
import { pollingDownload } from "@/utils/download.js";
import { searchColumns, tableColumns } from "./model";
import editFormWarehouse from "./components/editWarehouse.vue";
import curWarehouseMixin from "@/views/warehouseManage/components/currentWarehouse/mixin";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
export default {
  name: "WarehouseSettings",
  mixins: [curWarehouseMixin, mixinColsConf],
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {
          this.$nextTick(() => {
            this.keepTableListMixin();
            if (this.isTabChangeWarehouse) {
              this.changeCurWarehouse();
            }
          });
        },
        tabs: [
          {
            label: this.overseaLangObj.ck_lb("仓库列表"),
            name: "1",
          },
          {
            label: this.overseaLangObj.fq_gl(),
            name: "2",
          },
          {
            label: this.overseaLangObj.kw_gl(),
            name: "3",
          },
          {
            label: this.overseaLangObj.kw_lx(),
            name: "4",
          },
        ],
        btnArr: [
          {
            table: this.overseaLangObj.xz_add("添加"),
            showTabName: "2,3,4",
            className: "btn-type-add",
            icon: "el-icon-plus",
            handleClick: () => this.handleAddOrEdit(),
          },
          {
            table: this.overseaLangObj.pl_print(),
            disabled: true,
            showTabName: "3",
            handleClick: () => this.handlePrint(),
          },
        ],
      },
      searchFromData: {
        1: {
          statusList: "1,2", // 状态
        },
      },
      searchFormConfig: {
        labelWidth:
          this.overseaLangObj.yu_yan_lang === "en-us" ? "115px" : "85px",
        formModel: {},
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getTableList(formModel);
            resolve();
          });
        },
        searchForm: true,
      },
      tableConfig: {
        tableHeight: "calc(100vh - 264px)",
        getQueryParams: this.getQueryParams,
        httpRequest: [
          getWarehouseList,
          getPartitionList,
          getLocationList,
          getLocationTypeList,
        ],
        statusBtnList: [
          {
            text: this.overseaLangObj.bj_edit(),
            showStatus: [0, 2],
            handleClick: (row) => this.handleAddOrEdit(row),
          },
          {
            text: this.overseaLangObj.qy_enable(),
            showStatus: [0, 2],
            handleClick: (row) => this.changeStatus(row, 1),
          },
          {
            text: this.overseaLangObj.dy_print(),
            showStatus: [0, 1, 2],
            tabBtnArr: ["3"],
            handleClick: (r) => this.handlePrint([r]),
          },
          {
            text: this.overseaLangObj.dy_disable(),
            showStatus: [1],
            color: "#FF6767",
            handleClick: (row) => this.changeStatus(row, 2),
          },
          {
            text: this.overseaLangObj.yc_delete(),
            showStatus: [0],
            color: "#FF6767",
            handleClick: (row) => this.handleDelete(row),
          },
        ],
      },
      selectionRows: [],
    };
  },
  methods: {
    changePartion() {
      this.$refs.freightShelfIdRef[0]?.changeFocusRequest();
    },
    handleAddOrEdit(row = {}) {
      const { activeName } = this.tabsConfig;
      if (activeName !== "1") {
        row.status = row.status || 0; // 0-草稿
      }
      const params = {
        ...row,
        warehouseId: this.curWarehouseObj.value,
      };
      this.$refs.editFormRef.editShow(params, {
        mode_type: activeName - 1, // 区分不同弹窗
        editSuccess: () => {
          // 编辑成功
          this.keepTableListMixin();
        },
      });
    },
    changeStatus(row = {}, status) {
      let msg = "启用之后可以被引用";
      let title = "启用提示";
      let className = "el-icon-success text-success";
      let successMsg = this.overseaLangObj.cg_tip("启用成功");
      if (status === 2) {
        msg = "禁用之后不可引用，且不影响历史数据";
        title = "禁用提示";
        className = "el-icon-warning text-warning";
        successMsg = this.overseaLangObj.cg_tip("禁用成功");
      }

      msgBox(this, { title, className, msg }, () => {
        const { activeName } = this.tabsConfig;
        const updateRequest = [
          updateWarehouseStatus,
          partitionPut,
          locationPut,
          locationTypePut,
        ][activeName - 1];
        let opt = {
          id: row.id,
        };
        if (activeName === "1") {
          opt.dataStatus = status;
        } else {
          opt.status = status;
        }
        updateRequest(opt).then(() => {
          this.msgSuccess(successMsg);
          this.keepTableListMixin();
        });
      });
    },
    handleDelete(row) {
      const msg = "删除操作不可逆！";
      const title = "删除提示";
      const className = "el-icon-warning text-warning";
      msgBox(this, { title, className, msg }, () => {
        const { activeName } = this.tabsConfig;
        const delRequest = [
          delWarehouse,
          delPartition,
          delLocation,
          delLocationType,
        ][activeName - 1];
        delRequest(row.id).then(() => {
          this.msgSuccess(this.overseaLangObj.cg_tip("删除成功"));
          this.keepTableListMixin();
          if (this.selectionRows.some((e) => e.id === row.id)) {
            this.onTableSelectionChange();
          }
        });
      });
    },
    onTableSelectionChange(rows = []) {
      this.selectionRows = rows;
      this.$refs[
        `tableRef${this.tabsConfig.activeName}`
      ][0]?._toggleRowSelectionMixin({
        newCheckRows: this.selectionRows,
      });
    },
    handleDetails(row = {}) {
      // console.log('this.$route===', this.$route)
      const { activeName } = this.tabsConfig;
      if (activeName !== "1") {
        this.$refs.editFormRef.editShow(row, {
          mode_type: activeName - 1, // 区分不同弹窗
          isSee: true, // 查看
        });
        return;
      }
      const idList = this.$refs[`tableRef${+activeName}`][0]?.tableData.map(
        (e) => e.id
      );
      this.$router.push({
        path: "/warehouseManage/wareHouseBasicData/warehouseListDetails",
        query: {
          id: row.id,
          pageSign: idList.join(","), // 详情显示上一页/下一页
          path: this.$route.path,
        },
      });
    },
    handlePrint(rows) {
      const opt = {
        printIdList: (rows || this.selectionRows).map((e) => e.id),
        warehouseCode: this.curWarehouseObj.warehouseCode,
      };
      pollingDownload(this, printWarehouseLocation, opt, getDownShippingMark);
    },
    getTableList(searchFrom = {}) {
      const { createTime, statusList, cusWarehouseName, cusType, ...searcObj } =
        searchFrom;
      const { activeName } = this.tabsConfig;
      switch (activeName) {
        case "1":
          searcObj.updateTimeSearchBegin = createTime && createTime[0];
          searcObj.updateTimeSearchEnd = createTime && createTime[1];
          searcObj["cusWarehouse.warehouseName"] = cusWarehouseName;
          searcObj["cusWarehouse.type"] = cusType;
          searcObj.statusList = statusList?.length
            ? statusList.join(",")
            : "1,2";
          break;
        case "2":
          searcObj.statusSearch = statusList?.length
            ? statusList.join(",")
            : undefined;
        default:
          searcObj.beginTime =
            createTime && `${createTime[0]}@${createTime[1]}`;
      }
      this.searchFromData[activeName] = {
        ...searcObj,
      };
      this.keepTableListMixin(true);
    },
    operationBtn(rItem, row) {
      const { activeName } = this.tabsConfig;
      let isShowBtn = false;
      if (activeName == 1) {
        isShowBtn = rItem.showStatus.includes(row.dataStatus);
      } else {
        isShowBtn = rItem.showStatus.includes(row.status || 0);
      }
      return (
        isShowBtn &&
        (rItem.tabBtnArr ? rItem.tabBtnArr.includes(activeName) : true)
      );
    },
    getQueryParams() {
      const { activeName } = this.tabsConfig;
      switch (activeName) {
        case "1":
          return {
            ...this.searchFromData[activeName],
            platformTypeList: 2, // 自建仓
            warehouseId: this.curWarehouseObj.value,
          };
        default:
          return {
            ...this.searchFromData[activeName],
            warehouseId: this.curWarehouseObj.value,
          };
      }
    },
    searchTabForm(index) {
      return {
        ...this.searchFormConfig,
        lists: searchColumns(index),
        fold: [0, 2].includes(index),
      };
    },
    tableTabConfig(index) {
      return tableColumns(index);
    },
    changeCurWarehouse() {
      // 重置关联数据
      this.isTabChangeWarehouse = false;
      this.$refs?.searchRef3 &&
        this.$refs["searchRef3"][0]?.setFormModel({
          shelfId: "",
          shelfId_name: "",
          warehousePartitionId: "",
          warehousePartitionId_name: "",
          type: "",
          type_name: "",
        });
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
  computed: {
    ...mapState({
      dictionary: (state) => state.dictionary,
      haveWarehouseType: (state) => state.dictionary.dicsData.haveWarehouseType,
    }),
  },
  watch: {
    "selectionRows.length"(sLen) {
      this.$set(this.tabsConfig.btnArr[1], "disabled", !sLen);
    },
    "curWarehouseObj.value"() {
      if (this.tabsConfig.activeName == 3) {
        this.changeCurWarehouse();
      } else {
        this.isTabChangeWarehouse = true;
      }
      this.showSearchForm = false;
      this.$nextTick(() => {
        this.showSearchForm = true;
      });
    },
  },
  created() {
    this["dictionary/getDictionary"]("basicsWarehouse").then((res) => {
      this.showSearchForm = true;
    });
  },
  components: {
    editFormWarehouse,
    CurrentWhereWarehouse: () =>
      import("@/views/warehouseManage/components/currentWarehouse"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
/deep/.operate-icon {
  &.operate-icon-info {
    color: #f26079;
  }
}
</style>
