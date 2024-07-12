<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <ComForm
            ref="searchTabForm"
            :formConfig="searchFormConfig"
            v-if="showSearchForm"
          >
          </ComForm>
          <ComTable
            :ref="`tableRef${tab.name}`"
            :tableHeight="tableConfig.tableHeight"
            :columnConfig="tableConfig.columnConfig"
            :httpRequest="tableConfig.httpRequest"
            :getQueryParams="getQueryParams"
            :rowOperationBtnListFn="getBtnLists"
            @handleTableView="handleDetails"
            v-if="tabsConfig.activeName == tab.name && showSearchForm"
          >
            <template v-slot:customRow="{ slotProps }">
              <template v-if="slotProps.prop === 'auditRecords'">
                <span
                  @click="openRecords(slotProps.row)"
                  class="primary-text-btn ellipsis-text"
                >
                  {{ slotProps.row.auditRecords || "0" }}
                </span>
              </template>
            </template>
          </ComTable>
        </el-tab-pane>
      </template>
    </ComTabs>
    <ComCustomDialog
      ref="customDialogRef"
      :slotDlgFormIds="['customerId', 'applicationAmount', 'remark']"
    >
      <template v-slot:customerId="slotProps">
        <AutoComplete
          ref="customerIdRef"
          :formModel="slotProps.formModel"
          :fieldItem="{
            ...slotProps.fieldItem,
            handle: () => changeCustomerId(slotProps.formModel),
          }"
          :additionalParam="{
            applicationType: 1,
            operationType: slotProps.formModel.customerId ? 2 : 1,
          }"
        />
      </template>
      <template v-slot:applicationAmount="slotProps">
        <div class="dialog-money">
          <el-input-number
            v-model="slotProps.formModel.applicationAmount"
            :controls="false"
            v-input-number-limit="{
              value: slotProps.fieldItem.decimal,
              maxNumber: slotProps.fieldItem.max,
            }"
            :min="0"
            size="small"
            placeholder="请输入"
          />
          <el-select
            v-model="slotProps.formModel.applicationCurrencyId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in currencyLists"
              :key="item.id"
              :label="item.code"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>
      </template>
      <template v-slot:remark="slotProps">
        <div>
          <div>申请备注</div>
          <div>
            <el-input
              type="textarea"
              placeholder="请输入内容"
              show-word-limit
              resize="none"
              maxlength="400"
              rows="3"
              v-model="slotProps.formModel.remark"
            >
            </el-input>
          </div>
        </div>
      </template>
    </ComCustomDialog>
    <AddDrawer ref="drawerRef" />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { searchForm, tableColumns, customDialogCols } from "./model.js";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import {
  POSTCustomerlimitapplicationList,
  POSTCustomerlimitapplicationAuditing,
  POSTCreditApplication,
  DELETECustomerlimitapplication,
  PUTCustomerlimitapplication,
  getCustomerlimitapplicationauditrecords,
  POSTCustomerwalletSelectone,
} from "@/api/oneConsignmentPlan/customerLv.js";
import { remarkDialogCols } from "_comp/ConfirmDialog/customFormDialog/model.js";
import { querySearchList } from "@/api/common";
export default {
  name: "LimitManage",
  mixins: [mixinColsConf],
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "客户额度管理",
            name: "1",
          },
        ],
        btnArr: [
          {
            table: "新 增",
            className: "btn-type-add",
            icon: "el-icon-plus",
            handleClick: (row) => {
              this.handleAdd(row);
            },
          },
        ],
      },
      searchFormConfig: {
        formModel: {
          stateList:['0','1','2','3']
        }, // 表单数据
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getSearchList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        expansion: false,
        fold: true,
        size: "small",
        labelWidth: "100px",
        lists: searchForm,
        formRules: {}, // 表单校验规则
      },
      tableConfig: {
        tableHeight: "calc(100vh - 264px)",
        columnConfig: tableColumns,
        // httpRequest: (formModel) => {
        //   return new Promise((resolve) => {
        //     resolve({
        //       rows: [
        //         { id: 1, state: 0 },
        //         { id: 2, state: 1 },
        //         { id: 3, state: 2 },
        //         { id: 4, state: 3 },
        //         { id: 5, state: 4 },
        //       ],
        //     });
        //   });
        // },
        httpRequest: POSTCustomerlimitapplicationList,
        statusBtnList: [
          {
            text: "提交",
            showStatus: [0, 2],
            handleClick: (row) => {
              this.handleUpdateStatus(row, 1);
            },
          },
          {
            text: "修改",
            showStatus: [0, 2],
            handleClick: (row) => {
              this.handleAdd(row);
            },
          },
          {
            text: "删除",
            showStatus: [0, 2],
            color: "#FF6767",
            handleClick: (row) => {
              this.handleDelete(row);
            },
          },
          {
            text: "通过",
            showStatus: [1],
            handleClick: (row) => {
              this.handleUpdateStatus(row, 3);
            },
          },
          {
            text: "驳回",
            showStatus: [1],
            color: "#FF6767",
            handleClick: (row) => {
              this.handleUpdateStatus(row, 2);
            },
          },
        ],
      },
      showSearchForm: false,
      searchFromData: {
        stateList:['0','1','2','3']
      },
      currencyLists: [],
    };
  },
  mounted() {
    console.log("this.prepaidCollectDict", this.prepaidCollectDict);
  },
  created() {
    querySearchList({
      type: "currency",
      pageNum: 1,
      pageSize: 999,
    }).then((res) => {
      this.currencyLists = res.rows || [];
    });
    this["dictionary/getDictionary"](["limitManageStatus"]).then(() => {
      this.showSearchForm = true;
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getSearchList(searchFrom = {}) {
      const { createTime, ...nSearchFrom } = searchFrom;
      this.searchFromData = {
        startTime: createTime ? `${createTime[0]} 00:00:00` : undefined,
        endTime: createTime ? `${createTime[1]} 23:59:59` : undefined,
        ...nSearchFrom,
      };
      this.mixinkeepTable(true);
    },
    openRecords(row) {
      const { id } = row;
      getCustomerlimitapplicationauditrecords(id).then((res) => {
        const { data } = res;
        if (data.length <= 0) {
          this.$message.error("暂无审核记录");
          return;
        }
        this.$refs.drawerRef?.show(data);
      });
    },
    getQueryParams() {
      return {
        ...this.searchFromData,
        applicationType: 1,
      };
    },
    getBtnLists(row) {
      return this.tableConfig.statusBtnList.filter((e) => {
        return e.showStatus.includes(row.state);
      });
    },
    handleUpdateStatus(row = {}, type) {
      const config = {
        1: {
          title: "提交",
          label: "提交备注：",
          id: "msg",
          rulesKey: "msg",
          maxlength: 400,
        },
        2: {
          title: "打回",
          label: "打回备注：",
          id: "msg",
          rulesKey: "msg",
          maxlength: 400,
        },
        3: {
          title: "通过",
          label: "通过备注：",
          id: "msg",
          rulesKey: "msg",
          maxlength: 400,
        },
      }[type];
      const { id } = row;
      this.$refs.customDialogRef?.showCustomDialog({
        customFormConfig: remarkDialogCols(config),
        formModel: {
          id,
          state: type,
        },
        httpRequest: (formModel) => {
          return POSTCustomerlimitapplicationAuditing(formModel);
        },
        successFunction: () => {
          this.mixinkeepTable();
        },
      });
    },
    handleDelete(row) {
      const { id } = row;
      DELETECustomerlimitapplication(id).then((res) => {
        this.mixinkeepTable();
      });
    },
    handleDetails() {},
    handleAdd(row = {}) {
      const { id } = row;
      const httpRequest = id
        ? PUTCustomerlimitapplication
        : POSTCreditApplication;
      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: customDialogCols(),
        formModel: {
          ...row,
          // applicationCurrencyId: 5,
          applicationType: 1,
        },
        httpRequest: (formModel) => {
          return httpRequest(formModel);
        },
        successFunction: () => {
          this.mixinkeepTable(true);
        },
      });
    },
    handleRecord(row = {}) {
      const { auditRecords } = row;
      console.log("auditRecords", auditRecords);
    },
    async changeCustomerId(row = {}) {
      const { customerId, applicationCurrencyId } = row;
      const params = {
        customerInfoId: customerId,
        baseCurrencyInfoId: applicationCurrencyId,
      };
      let creditLimit = undefined;
      if (customerId && applicationCurrencyId) {
        await POSTCustomerwalletSelectone(params).then((res) => {
          creditLimit = res.data && res.data.creditLimit;
        });
      }
      this.$refs.customDialogRef.setDlgFormModel({
        creditLimit,
      });
    },
  },
  components: {
    ComTabs: () => import("_comp/ComTabs"),
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
    AddDrawer: () => import("../components/addDrawer"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
  },
};
</script>

<style lang="scss" scoped>
.dialog-money {
  display: flex;
}
</style>
