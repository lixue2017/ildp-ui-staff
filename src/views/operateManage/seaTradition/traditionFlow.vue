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
              @updateColumnConf="
                (r) => setColumnMixinConf(r, { noChangeShowRequest: true })
              "
              :httpRequest="tableConfig.httpRequest"
              :columnConfig="
                tableMixinConfig(tab.name).filter((e) =>
                  mixinSearchConfParams.countType !== '130'
                    ? e.type !== 'selection'
                    : true
                )
              "
              :getQueryParams="() => tableConfig.getQueryParams()"
              :selectionRow="selectionRowEvt"
              :isMountedRequest="false"
              @onSelectionChange="onTableSelectionChange"
              :selectionTableRow="[...selectionRows]"
              @handleTableView="handleView"
              :rowOperationBtnListFn="(r) => tableFlowStatusList(r)"
            />
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
    <OrderSubmit ref="OrderSubmit" @handleSuccess="mixinkeepTable" />
    <ComCustomDialog ref="customDialogRef" />
    <!-- 订舱登记 -->
    <BookingDialog
      ref="BookingDialog"
      @handleSuccess="() => mixinkeepTable()"
    />
    <!-- 报关弹框 -->
    <DeclareCustomsDlg
      ref="declareCustomsDialog"
      @handleSuccess="() => mixinkeepTable()"
    />
  </div>
</template>

<script>
import mixinOperation from "../components/mixinOperation";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { mixinEcOperateFlow } from "../seaEcommerce/mixinEcOperateFlow.js";
import { seaTraditionModel } from "@/views/operateManage/components/model.js";
export default {
  name: "SeaTraditionFlow",
  mixins: [mixinColsConf, mixinOperation, mixinEcOperateFlow],
  computed: {},
  data() {
    return {
      tabsConfig: {
        type: "seaTradition",
        page_list: "traditionFlow",
        activeName: "1",
        className: "slot-label-state",
        slotTabs: true,
        isTabStateCount: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "传统流程",
            name: "1",
          },
        ],
        btnArr: [
          // {
          //   table: "导出",
          //   icon: "iconfont daochu",
          //   handleClick: () => this.handleExport("seaTradition"),
          // },
        ],
      },
      mixinTableColArr: [seaTraditionModel().lists],
    };
  },
  methods: {
    tableFlowStatusList(r) {
      const { countType } = this.mixinSearchConfParams;
      if (countType === "130") {
        // 操作接单
        return this.getOperationBtn(r);
      }
      const rBtnList = this.stateTabBtn.filter((e) =>
        e.cTypeArr.includes(countType)
      );
      if (["140", "150"].includes(countType)) {
        return rBtnList.filter((b) => {
          return (
            (b.bookingSpaceState &&
              b.bookingSpaceState.includes(r.isBookingSpace)) ||
            ([0, 1].includes(b.nodeIndex) &&
              (b.nodeIndex === 0 ||
                r.smallNodeList[b.nodeIndex - 1].state === 3) &&
              [0, 1].includes(r.smallNodeList[b.nodeIndex].state))
          );
        });
      }
      return rBtnList;
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
