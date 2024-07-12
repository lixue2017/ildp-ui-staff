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
              :getQueryParams="() => mGetQueryParams(tab.tNum, 1)"
              v-if="tabsConfig.activeName === tab.name"
              :rowOperationBtnListFn="
                (row) =>
                  tab.name === '3'
                    ? mTableSubmitStatusList(row)
                    : mTableStatusList(row, tab.name)
              "
              @handleTableView="
                (r) => handleView(r, tab.name === '1' ? 'first_instance' : '')
              "
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
  name: "EcFirstInstanceList",
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
            label: "电商一审交接",
            name: "1",
            tNum: 0, // 待处理
          },
          {
            label: "箱单发票",
            name: "2",
            tNum: 2,
          },
          {
            label: "已提交",
            name: "3",
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
        lists: ecFirstSearchCols(),
      },
      tableConfig: {
        httpRequest: postEcInstancePage,
      },
      tableBtnList: [
        {
          text: "一审交接",
          handleClick: (row) => {
            this.handleMixinHandover(row);
          },
        },
        {
          btnTextRender: (r) => `箱单记录(${r.xdfpLogCount})`,
          isLogCount: true,
          handleClick: (row) => {
            this.handlePackingDrawer(row);
          },
        },
      ],
      mixinTableColArr: [
        ecFirstTableCols("e_1"),
        ecFirstTableCols("e_2"),
        ecFirstTableCols("e_3"),
      ],
    };
  },
  methods: {},
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
