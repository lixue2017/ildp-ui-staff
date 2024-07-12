<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :formConfig="getSearchFormConfig()"
              v-if="tabsConfig.activeName === tab.name && showSearchForm"
            >
              <template v-slot:form-submit>
                <ComColumnConf
                  :tableCols="tableAllMixinConfig(tab.name)"
                  :tName="tab.name"
                  @setColumnConf="(arr) => setColumnMixinConf(arr)"
                />
              </template>
            </ComForm>
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              :ref="`tableRef${tab.name}`"
              v-if="tabsConfig.activeName === tab.name"
              :tableHeight="tableConfig.tableHeight"
              :httpRequest="tableConfig.httpRequest"
              :columnConfig="tableMixinConfig(tab.name)"
              :getQueryParams="() => tableConfig.getQueryParams()"
              :selectionRow="selectionRowEvt"
              @onSelectionChange="onTableSelectionChange"
              :selectionTableRow="[...selectionRows]"
              @handleTableView="handleView"
              :rowOperationBtnListFn="getOperationBtn"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'inlandExportParam'">
                  <span
                    :class="[
                      'isComplete',
                      slotProps.row.inlandExportParam
                        ? 'text-success-color'
                        : 'text-danger-color',
                    ]"
                    v-if="slotProps.row.inlandExportParam !== null"
                  >
                    <i
                      :class="
                        slotProps.row.inlandExportParam
                          ? 'el-icon-circle-check'
                          : 'el-icon-warning-outline'
                      "
                    ></i>
                    {{ slotProps.dicsList && slotProps.dicsList.nameCn }}
                  </span>
                  <span v-else>--</span>
                </template>
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
    <OrderSubmit ref="OrderSubmit" @handleSuccess="mixinkeepTable" />
  </div>
</template>

<script>
import mixinOperation from "../components/mixinOperation";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { airEcommerce } from "@/views/operateManage/components/model.js";
export default {
  name: "AirEcommerce",
  mixins: [mixinColsConf, mixinOperation],
  components: {
    ComTabs: () => import("_comp/ComTabs"),
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComDialog: () => import("_comp/ComDialog"),
    MoreBtn: () => import("../components/MoreBtn"),
    OrderSubmit: () =>
      import("@/views/newOrderManage/components/OrderSubmit/index.vue"),
  },
  computed: {},
  data() {
    return {
      tabsConfig: {
        type: "airEcommerce",
        activeName: "1",
        slotTabs: true,
        handleTabsClick: this.initMixinColumnConf,
        tabs: [
          {
            label: "空运电商操作单",
            name: "1",
          },
        ],
        btnArr: [
          {
            table: "导出",
            icon: "iconfont daochu",
            handleClick: () => this.handleExport('airEcommerce'),
          },
        ],
      },
      mixinTableColArr: [airEcommerce.lists],
    };
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
