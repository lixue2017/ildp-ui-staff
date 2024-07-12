<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :formConfig="searchFormConfig"
              @searchHeight="searchHeight"
              v-if="showSearchForm && tabsConfig.activeName === tab.name"
            >
              <template v-slot:form-submit>
                <ComColumnConf
                  :tableCols="tableAllMixinConfig(tab.name)"
                  :tName="tab.name"
                  @setColumnConf="setColumnMixinConf"
                />
              </template>
            </ComForm>
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              :ref="`tableRef${tab.name}`"
              :tableHeight="`calc(100vh - ${extraHeight + formHeight}px)`"
              :columnConfig="tableMixinConfig(tab.name)"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="() => mGetQueryParams(tab.tNum, 3)"
              v-if="tabsConfig.activeName === tab.name"
              :rowOperationBtnListFn="
                (row) =>
                  tab.name === '2'
                    ? mTableSubmitStatusList(row)
                    : mTableStatusList(row, tab.name)
              "
              @handleTableView="(r) => handleView(r, 'ct_detail')"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'remarkCount'">
                  <span
                    class="primary-text-btn"
                    @click="handleMixinDrawer(slotProps.row)"
                  >
                    {{ slotProps.row.remarkCount || 0 }}
                  </span>
                </template>
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
    <CustomsHandoverDialog
      ref="handoverDlgRef"
      @handleSuccess="() => mixinkeepTable()"
    />
    <RemarkDrawer ref="drawerRef" @handleSuccess="() => mixinkeepTable()" />
    <DrawerPackingRecord ref="packingDrawerRef" />

    <SendEmail
      ref="emailRef"
      :paramObj="{
        operationOrderId: mEmailData.tootId,
        webMailTag: 'clearance_qg',
      }"
    />
  </div>
</template>

<script>
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { postEcInstancePage } from "@/api/performance/record.js";
import { handoverListMixin } from "../components/handoverListMixin.js";
import { ecFirstSearchCols, ecFirstTableCols } from "../components/model.js";

export default {
  name: "TraditionHandover",
  mixins: [mixinColsConf, handoverListMixin],
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
            label: "传统清关交接",
            name: "1",
            tNum: 0, // 待处理
          },
          {
            label: "已完结",
            name: "2",
            tNum: 1,
          },
        ],
      },
      searchFormConfig: {
        formModel: {},
        fold: true,
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.searchList(formModel);
            resolve();
          });
        },
        searchForm: true,
        searchColsHeight: true,
        labelWidth: "88px",
        residueCols: [2],
        lists: ecFirstSearchCols("c_s601"),
      },
      tableConfig: {
        httpRequest: postEcInstancePage,
      },
      tableBtnList: [
        {
          text: "清关交接",
          handleClick: (row) => {
            this.handleMixinHandover(row);
          },
        },
      ],
      mixinTableColArr: [
        ecFirstTableCols("c_t601"),
        ecFirstTableCols("c_t602"),
      ],
    };
  },
  methods: {},
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
