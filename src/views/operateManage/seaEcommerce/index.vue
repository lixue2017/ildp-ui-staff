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
            >
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
    <OrderSubmit ref="OrderSubmit" @handleSuccess="mixinkeepTable" />
    <ComCustomDialog ref="customDialogRef" />
  </div>
</template>

<script>
import mixinOperation from "../components/mixinOperation";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { seaEcommerceModel } from "@/views/operateManage/components/model.js";
export default {
  name: "SeaEcommerce",
  mixins: [mixinColsConf, mixinOperation],
  components: {
    ComDialog: () => import("_comp/ComDialog"),
    MoreBtn: () => import("../components/MoreBtn"),
    OrderSubmit: () =>
      import("@/views/newOrderManage/components/OrderSubmit/index.vue"),
    TabSearchColumn: () => import("_comp/ComColumnConf/SearchColumn"),
  },
  computed: {},
  data() {
    return {
      tabsConfig: {
        type: "seaEcommerce",
        activeName: "1",
        className: "slot-label-state",
        slotTabs: true,
        isTabStateCount: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "电商操作单",
            name: "1",
          },
        ],
        btnArr: [
          {
            table: "导出",
            icon: "iconfont daochu",
            handleClick: () => this.handleExport("seaEcommerce"),
          },
        ],
      },
      mixinTableColArr: [seaEcommerceModel().lists],
    };
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
