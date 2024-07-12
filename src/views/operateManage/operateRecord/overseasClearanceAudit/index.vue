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
              (r) => [tableBtnList, tableSubmitStatusList(r)][tab.name - 1]
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
    <SendEmail
      ref="emailRef"
      :paramObj="{
        operationOrderId: emailData.id,
        webMailTag: 'clearance_hw_qg',
      }"
    />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { searchForm, tableColumns } from "./model.js";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { getOrderDirectClearanceList } from "@/api/order/overSeaOther.js";
import { getClearanceEmailRecipient } from "@/api/performance/record.js";
export default {
  name: "OverseasClearanceAudit",
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
            label: "海外清关一审交接",
            name: "1",
          },
          {
            label: "已提交",
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
      mixinTableColArr: [tableColumns("one_1"), tableColumns("one_2")],
      searchFromData: {},
      tableBtnList: [
        {
          text: "一审交接",
          handleClick: (r) => {
            this.handleOverseasHandover(r);
          },
        },
      ],
      tableSubmitBtnList: [
        {
          text: "发送邮件",
          handleClick: (row) => {
            this.emailData = row;
            getClearanceEmailRecipient({
              isOverseaOrders: 1, // 0-电商/传统 1-海外
              businessId: row.id,
            }).then((eRes) => {
              this.$refs.emailRef?.show({ resRecipientStr: eRes.data });
            });
          },
        },
      ],
      emailData: {},
    };
  },
  created() {
    this["dictionary/getDictionary"]("overSeaOther").then(() => {
      this.showSearchForm = true;
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    handleDrawer(row = {}) {
      // const { id, jobNo } = row;
      this.$refs.drawerRef?.show({
        // ...row,
        // moduleName: 120,
        // operationOrderNum1: jobNo,
        pageRemarkNameKey: "HWQGYSBZ",
        operationOrderId: row.id,
      });
    },
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
        qgsjgl: 1,
        remarkPermissionTag: "HWQGJJYS",
        overallStatusIn: ["14", "17,20,21,22,100"][tName - 1], // tab1-待审核, tab2-待审核后所有状态
      };
    },
    handleDetails(row) {
      const { activeName } = this.tabsConfig;
      const idList = this.$refs[`tableRef${activeName}`][0]?.tableData.map(
        (item) => item.id
      );
      this.$router.push({
        path: "/domesticBusiness/overseasClearanceDetail",
        query: {
          id: row.id,
          viewSource: activeName,
          backPath: this.$route.path,
          pageSign: idList.join(","), // 详情显示上一页/下一页
        },
      });
    },
    handleOverseasHandover(row) {
      this.$refs.oHandoverDlgRef?.show({
        id: row.id,
      });
    },
    tableSubmitStatusList(r) {
      let rBtnList = [];
      rBtnList.push({
        text: "交接内容",
        handleClick: (row) => {
          this.$refs.oHandoverDlgRef?.show({
            id: row.id,
            isWebHandoverSee: true,
          });
        },
      });
      if (r && [4, 563].includes(r.agent)) {
        // 海外代理为荷兰与湖南堡森发送邮件
        return this.tableSubmitBtnList.concat(rBtnList);
      }
      return rBtnList;
    },
  },
  components: {
    ComTabs: () => import("_comp/ComTabs"),
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    RemarkDrawer: () =>
      import(
        "@/views/operateManage/operateRecord/components/recordDrawer/remark.vue"
      ),
    OverseasHandoverDialog: () =>
      import(
        "@/views/operateManage/operateRecord/components/connectDialog/overseas.vue"
      ),
    SendEmail: () => import("_comp/ComLogistTrack/components/SendEmail"),
  },
};
</script>

<style lang="scss" scoped></style>
