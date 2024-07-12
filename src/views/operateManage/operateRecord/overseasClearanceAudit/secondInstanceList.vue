<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <ComForm
            :formConfig="searchFormConfig"
            @searchHeight="searchHeight"
            v-if="tabsConfig.activeName == tab.name && showSearchForm"
          >
            <template v-slot:form-submit>
              <ComColumnConf
                :tableCols="tableAllMixinConfig(tab.name)"
                :tName="tab.name"
                @setColumnConf="setColumnMixinConf"
              />
            </template>
          </ComForm>
          <ComTable
            :ref="`tableRef${tab.name}`"
            :tableHeight="`calc(100vh - ${extraHeight + formHeight}px)`"
            :columnConfig="tableMixinConfig(tab.name)"
            :httpRequest="tableConfig.httpRequest"
            :getQueryParams="() => getQueryParams(tab.name)"
            @handleTableView="handleDetails"
            :rowOperationBtnListFn="
              (row) =>
                [tableStatusList(row), tableSubmitStatusList()][tab.name - 1]
            "
            v-if="tabsConfig.activeName == tab.name"
          >
            <template v-slot:customRow="{ slotProps }">
              <template v-if="slotProps.prop === 'remarkCount'">
                <span
                  class="primary-text-btn"
                  @click="handleDrawer(slotProps.row)"
                >
                  {{ slotProps.row.remarkCount || 0 }}
                </span>
              </template>
            </template>
          </ComTable>
        </el-tab-pane>
      </template>
    </ComTabs>
    <OverseasHandoverDialog
      ref="oHandoverDlgRef"
      @handleSuccess="() => mixinkeepTable()"
    />
    <RemarkDrawer ref="drawerRef" @handleSuccess="() => mixinkeepTable()" />
    <ComCustomDialog ref="customDlgRef" />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { searchForm, tableColumns } from "./model.js";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import {
  getOrderDirectClearanceList,
  postOverseaSecondToFirst,
} from "@/api/order/overSeaOther.js";
import { postNodeTime } from "@/api/operateManage/common";
import { formDlgCols } from "_comp/ComOperate/model.js";
import { customMessageBox } from "@/utils/confirmBox.js";
import {
  PUTPopClearanceRegisterStatusOver,
  PUTPopClearanceRegisterStatusRevoke,
} from "@/api/operateRecord/customsClearance";

export default {
  name: "OverseasInstanceList",
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
            label: "海外清关二审交接",
            name: "1",
          },
          {
            label: "已完结",
            name: "2",
          },
        ],
      },
      searchFormConfig: {
        formModel: {}, // 表单数据
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getSearchList(formModel);
            resolve();
          });
        }, // 表单提交接口
        residueCols: [2],
        searchForm: true,
        fold: true,
        searchColsHeight: true,
        labelWidth: "96px",
        lists: searchForm,
      },
      tableConfig: {
        httpRequest: getOrderDirectClearanceList,
      },
      mixinTableColArr: [tableColumns("two_1"), tableColumns("two_2")],
      searchFromData: {},
      tableBtnList: [
        {
          text: "已登记",
          statusArr: [10, "10"], //10未登记  20已登记
          handleClick: (row) => {
            this.handleChangeRegisterStatus(row);
          },
        },
        {
          text: "撤销登记",
          statusArr: [20, "20"], //10未登记  20已登记
          handleClick: (row) => {
            this.handleChangeRegisterStatus(row);
          },
        },
        {
          text: "二审交接",
          handleClick: (r) => {
            this.$refs.oHandoverDlgRef?.show({
              id: r.id,
            });
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
                  operationOrderId: row.id,
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
          text: "打回",
          color: "#FF6767",
          handleClick: (r) => {
            customMessageBox(
              this,
              {
                msgTxt1: "打回不可逆",
                httpMsgRequest: () => postOverseaSecondToFirst(r.id),
              },
              () => {
                this.msgSuccess("打回成功");
                this.mixinkeepTable();
              }
            );
          },
        },
      ],
    };
  },
  methods: {
    getSearchList(searchFrom = {}) {
      const { createTime, ...searchObj } = searchFrom;
      const [createStartTime, createEndTime] = createTime || [];
      this.searchFromData = {
        ...searchObj,
        createStartTime,
        createEndTime,
      };
      this.mixinkeepTable(true);
    },
    getQueryParams(tName) {
      return {
        ...this.searchFromData,
        qgsjgl: 2,
        remarkPermissionTag: "HWQGJJRS",
        overallStatusIn: ["17", "20,21,22,100"][tName - 1], // tab1-审核中, tab2-审核中后所有状态
      };
    },
    handleDetails(row) {
      const { activeName } = this.tabsConfig;
      const idList = this.$refs[`tableRef${activeName}`][0]?.tableData.map(
        (e) => e.id
      );
      this.$router.push({
        path: "/domesticBusiness/overseasClearanceDetail",
        query: {
          id: row.id,
          viewPage: "two",
          viewSource: activeName,
          backPath: this.$route.path,
          pageSign: idList.join(","), // 详情显示上一页/下一页
        },
      });
    },
    handleDrawer(row = {}) {
      // const { id, jobNo } = row;
      this.$refs.drawerRef?.show({
        // ...row,
        // moduleName: 120,
        // operationOrderNum1: jobNo,
        pageRemarkNameKey: "HWQGESBZ",
        operationOrderId: row.id,
      });
    },
    tableStatusList(row) {
      return this.tableBtnList.filter((e) => {
        return e.statusArr ? e.statusArr.includes(row.registerStatus) : true;
      });
    },
    handleChangeRegisterStatus(row = {}) {
      //清关登记状态 10未登记  20已登记
      const { id, registerStatus } = row;
      const httpRequest = {
        10: PUTPopClearanceRegisterStatusOver,
        20: PUTPopClearanceRegisterStatusRevoke,
      }[registerStatus];
      httpRequest(id).then((res) => {
        this.mixinkeepTable();
      });
    },
    tableSubmitStatusList() {
      return [
        {
          text: "交接内容",
          handleClick: (row) => {
            this.$refs.oHandoverDlgRef?.show({
              id: row.id,
              isWebHandoverSee: true,
            });
          },
        },
      ];
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
  created() {
    this["dictionary/getDictionary"]([
      "freightType",
      "overseaBusinessTypes",
      "headTransportMode",
      "clearanceReservationWarehouse",
      "nlOverAllStatus",
      "registerStatusLists",
      "clearanceStatus",
    ]).then(() => {
      this.showSearchForm = true;
    });
  },
  components: {
    ComTabs: () => import("_comp/ComTabs"),
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
    RemarkDrawer: () =>
      import(
        "@/views/operateManage/operateRecord/components/recordDrawer/remark.vue"
      ),
    OverseasHandoverDialog: () =>
      import(
        "@/views/operateManage/operateRecord/components/connectDialog/overseas.vue"
      ),
  },
};
</script>

<style lang="scss" scoped></style>
