<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <template slot="label">
            <TabSearchColumn
              :searchFormData="mixinSearchFormData"
              :tabName="tab.name"
            />
          </template>
          <keep-alive>
            <ComForm
              :formConfig="getSearchFormConfig()"
              @searchHeight="searchHeight"
              v-if="tabsConfig.activeName === tab.name && showSearchForm"
            >
              <template v-slot:form-submit>
                <ComColumnConf
                  :tableCols="tableAllMixinConfig(tab.name)"
                  :tName="tab.name"
                  @setColumnConf="
                    (r) => setColumnMixinConf(r, { mountedNoRequest: true })
                  "
                />
              </template>
            </ComForm>
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              :ref="`tableRef${tab.name}`"
              v-if="tabsConfig.activeName === tab.name"
              :tableHeight="`calc(100vh - ${extraHeight + formHeight}px)`"
              :setColumnParams="mixinColumnSetParams"
              :httpRequest="tableConfig.httpRequest"
              :columnConfig="tableMixinConfig(tab.name)"
              :getQueryParams="() => tableConfig.getQueryParams()"
              :selectionRow="selectionRowEvt"
              :isMountedRequest="false"
              @onSelectionChange="onTableSelectionChange"
              :selectionTableRow="[...selectionRows]"
              @handleTableView="handleView"
              :rowOperationBtnListFn="getOperationBtn"
            />
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
    <OrderSubmit ref="OrderSubmit" @handleSuccess="mixinkeepTable" />
    <ComCustomDialog ref="customDialogRef" />
  </div>
</template>

<script>
// import { searchColumns } from "./model";
import mixinOperation from "../components/mixinOperation";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { otherOperateModel } from "@/views/operateManage/components/model.js";
export default {
  name: "OtherOperate",
  mixins: [mixinColsConf, mixinOperation],
  components: {
    ComDialog: () => import("_comp/ComDialog"),
    MoreBtn: () => import("../components/MoreBtn"),
    OrderSubmit: () =>
      import("@/views/newOrderManage/components/OrderSubmit/index.vue"),
    TabSearchColumn: () => import("_comp/ComColumnConf/SearchColumn"),
  },
  data() {
    return {
      dataRouteType: [],
      tabsConfig: {
        type: "otherOperate",
        activeName: "1",
        className: "slot-label-state",
        slotTabs: true,
        isTabStateCount: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "其他操作单",
            name: "1",
          },
          // {
          //   label: "拖车操作单",
          //   name: "2",
          // },
          // {
          //   label: "报关出证",
          //   name: "3",
          // },
        ],
        btnArr: [
          {
            table: "导出",
            icon: "iconfont daochu",
            handleClick: () => this.handleExport("otherOperate"),
          },
        ],
      },
      statusList: {
        4: {
          text: "放货登记",
          icon: "",
          status: 7,
        },
      },
      addVisible: false,
      mixinTableColArr: [otherOperateModel.lists],
    };
  },
  methods: {
    // handleView(row) {
    //   const idList = this.$refs[
    //     `tableRef${this.tabsConfig.activeName}`
    //   ][0].tableData.map((e) => e.id);
    //   this.$router.push({
    //     path: "/operateManage/otherDetails",
    //     query: {
    //       id: row.id, // 操作单ID
    //       backPath: this.$route.fullPath,
    //       pageSign: idList.join(","), // 详情显示上一页/下一页
    //     },
    //   });
    // },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
