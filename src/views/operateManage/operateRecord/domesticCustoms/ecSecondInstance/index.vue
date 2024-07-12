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
              :getQueryParams="() => mGetQueryParams(tab.tNum, 2)"
              v-if="tabsConfig.activeName === tab.name"
              :rowOperationBtnListFn="
                (row) =>
                  tab.name === '3'
                    ? mTableSubmitStatusList()
                    : mTableStatusList(row, tab.name)
              "
              @handleTableView="
                (r) =>
                  handleView(r, tab.name === '1' ? 'second_instance' : 'second')
              "
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'remarkCount'">
                  <span
                    class="primary-text-btn"
                    @click="
                      handleMixinDrawer({
                        ...slotProps.row,
                        pageRemarkNameKey: 'GNQGESBZ',
                      })
                    "
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
    <ComCustomDialog ref="customDlgRef" />
  </div>
</template>

<script>
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import {
  postEcInstancePage,
  postEcSecondToFirst,
} from "@/api/performance/record.js";
import { postNodeTime } from "@/api/operateManage/common";
import { formDlgCols } from "_comp/ComOperate/model.js";
import { handoverListMixin } from "../components/handoverListMixin.js";
import { customMessageBox } from "@/utils/confirmBox.js";
import { ecFirstSearchCols, ecFirstTableCols } from "../components/model.js";

export default {
  name: "EcSecondInstanceList",
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
            label: "电商二审交接",
            name: "1",
            tNum: 0, // 待处理
          },
          {
            label: "箱单发票",
            name: "2",
            tNum: 2,
          },
          {
            label: "已完结",
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
          text: "已登记",
          statusArr: [10, "10"], //10未登记  20已登记
          handleClick: (row) => {
            this.handleChangeRegisterStatus({
              ...row,
              id: row.tpccId,
            });
          },
        },
        {
          text: "撤销登记",
          statusArr: [20, "20"], //10未登记  20已登记
          handleClick: (row) => {
            this.handleChangeRegisterStatus({
              ...row,
              id: row.tpccId,
            });
          },
        },
        {
          text: "二审交接",
          handleClick: (row) => {
            this.handleMixinHandover(row);
          },
        },
        {
          text: "预计到港",
          handleClick: (row) => {
            this.$refs.customDlgRef?.showCustomDialog({
              httpRequest: ({ estimatedTime }) => {
                return postNodeTime({
                  trajectoryTime: estimatedTime,
                  nodeId: 23, // 离港-17；到港-23
                  operationOrderId: row.tootId,
                });
              },
              successFunction: () => {
                this.mixinkeepTable();
              },
              customFormConfig: formDlgCols({ modelType: "arrival" }),
            });
          },
        },
        {
          btnTextRender: (r) => `箱单记录(${r.xdfpLogCount})`,
          isLogCount: true,
          handleClick: (row) => {
            this.handlePackingDrawer(row);
          },
        },
        {
          text: "打回",
          color: "#FF6767",
          handleClick: (r) => {
            customMessageBox(
              this,
              {
                msgTxt1: "打回不可逆",
                httpMsgRequest: () => postEcSecondToFirst(r.tootId),
              },
              () => {
                this.msgSuccess("打回成功");
                this.mixinkeepTable();
              }
            );
          },
        },
      ],
      mixinTableColArr: [
        ecFirstTableCols("e_201"),
        ecFirstTableCols("e_202"),
        ecFirstTableCols("e_203"),
      ],
    };
  },
  methods: {},
  components: {
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
