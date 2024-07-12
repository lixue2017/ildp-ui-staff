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
      :slotDlgFormIds="[
        'applicationAmount',
        'customerAccountId',
        'customerId',
        'bsCollectionAccountId',
      ]"
    >
      <template v-slot:applicationAmount="slotProps">
        <div class="dialog-money">
          <el-input-number
            v-model="slotProps.formModel.applicationAmount"
            :controls="false"
            v-input-number-limit="{
              value: slotProps.fieldItem.decimal,
            }"
            :min="0"
            size="small"
            placeholder="请输入"
          />
          <el-select
            v-model="slotProps.formModel.applicationCurrencyId"
            disabled
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
      <template v-slot:customerId="slotProps">
        <AutoComplete
          ref="customerIdIdRef"
          :formModel="slotProps.formModel"
          :fieldItem="{
            ...slotProps.fieldItem,
            handle: changeCustomerId,
          }"
          :additionalParam="{
            applicationType: 2,
            operationType: slotProps.formModel.customerId ? 2 : 1,
          }"
        />
      </template>
      <template v-slot:customerAccountId="slotProps">
        <AutoComplete
          ref="customerAccountIdRef"
          :formModel="slotProps.formModel"
          :fieldItem="{
            ...slotProps.fieldItem,
            disabled: !slotProps.formModel.customerId,
            handleCreate: (row) => addAccountInfo(slotProps.formModel),
          }"
          :additionalParam="{
            customerId: slotProps.formModel.customerId,
            labelKey: 'accountName',
            currencyId: slotProps.formModel.applicationCurrencyId,
          }"
        />
      </template>
      <template v-slot:bsCollectionAccountId="slotProps">
        <AutoComplete
          ref="bsCollectionAccountIdRef"
          :formModel="slotProps.formModel"
          :fieldItem="{
            ...slotProps.fieldItem,
            disabled: !slotProps.formModel.customerId,
          }"
          :additionalParam="{
            id: slotProps.formModel.customerId,
          }"
        />
      </template>
    </ComCustomDialog>
    <ConfirmDialog ref="confirmDialog" />
    <AddDrawer ref="drawerRef" />
  </div>
</template>

<script>
import { querySearchList } from "@/api/common";
import { mapActions } from "vuex";
import { searchForm, tableColumns, customDialogCols } from "./model.js";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { remarkDialogCols } from "_comp/ConfirmDialog/customFormDialog/model.js";
import { addBankInfo } from "@/api/customerManage/customerList.js";
import {
  POSTCreditApplication,
  POSTCustomerlimitapplicationAuditing,
  DELETECustomerlimitapplication,
  POSTCustomerlimitapplicationList,
  PUTCustomerlimitapplication,
  getCustomerlimitapplicationauditrecords,
  GETCustomerlimitapplicationAttach,
} from "@/api/oneConsignmentPlan/customerLv.js";
export default {
  mixins: [mixinColsConf],
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "客户预充值管理",
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
        formModel: {}, // 表单数据
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
        //     resolve({ rows: [{ id: 1 }] });
        //   });
        // },
        httpRequest: POSTCustomerlimitapplicationList,
        statusBtnList: [
          {
            text: "提交",
            showStatus: [0],
            handleClick: (row) => {
              this.handleUpdateStatus(row, 1);
            },
          },
          {
            text: "修改",
            showStatus: [0],
            handleClick: (row) => {
              this.handleAdd(row);
            },
          },
          {
            text: "删除",
            showStatus: [0],
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
              this.handleUpdateStatus(row, 0);
            },
          },
        ],
      },
      showSearchForm: false,
      searchFromData: {},
      currencyLists: [],
    };
  },
  mounted() {},
  created() {
    querySearchList({
      type: "currency",
      pageNum: 1,
      pageSize: 999,
    }).then((res) => {
      this.currencyLists = res.rows || [];
    });
    console.log("this.moneyLists", this.moneyLists);
    this["dictionary/getDictionary"](["preRechargeStatus"]).then(() => {
      this.showSearchForm = true;
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getSearchList(searchFrom = {}) {
      const { createTime, waterTime, ...nSearchFrom } = searchFrom;
      this.searchFromData = {
        startTime: createTime ? `${createTime[0]} 00:00:00` : undefined,
        endTime: createTime ? `${createTime[1]} 23:59:59` : undefined,
        waterStartTime: waterTime ? `${waterTime[0]} 00:00:00` : undefined,
        waterEndTime: waterTime ? `${waterTime[1]} 23:59:59` : undefined,
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
        applicationType: 2,
      };
    },
    // handleRecord(row = {}) {
    //   const { auditRecords } = row;
    //   console.log("auditRecords", auditRecords);
    // },
    handleDetails() {},
    changeCustomerId(row) {
      this.$refs.customerAccountIdRef?.changeFocusRequest();
      this.$refs.bsCollectionAccountIdRef?.changeFocusRequest();
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
          applicationType: 2,
        },
        httpRequest: (formModel) => {
          return POSTCustomerlimitapplicationAuditing(formModel);
        },
        successFunction: () => {
          this.mixinkeepTable();
        },
      });
    },
    addAccountInfo(row = {}) {
      const { customerId } = row;
      this.$refs.confirmDialog.handleFormDialog("bankAccount", {
        httpRequest: (bankData) => {
          return addBankInfo({
            ...bankData,
            isDefault: bankData.isDefault ? 1 : 0,
            isApplyInvoice: bankData.isApplyInvoice ? 1 : 0,
          });
        },
        successMessage: "提交成功", // 成功提示
        successFunction: () => {
          this.$refs.customerAccountIdRef?.changeFocusRequest();
        }, // 接口成功回调
        formModel: {
          customerId,
          dataStatus: 1,
          isDefault: true,
        },
      });
    },
    handleDelete(row) {
      const { id } = row;
      DELETECustomerlimitapplication(id).then((res) => {
        this.mixinkeepTable();
      });
    },
    async handleAdd(row = {}) {
      const { id, temp_secondId, ...obj } = row;
      let attachList=[];
      if (id) {
        await GETCustomerlimitapplicationAttach(id).then((res) => {
          const { data=[] } = res;
          attachList = data
        });
      }
      const httpRequest = id
        ? PUTCustomerlimitapplication
        : POSTCreditApplication;
      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: customDialogCols(),
        formModel: {
          ...obj,
          id,
          applicationCurrencyId: 5,
          applicationType: 2,
          attachList
        },
        httpRequest: (formModel) => {
          const { attachId, ...obj } = formModel;
          const params = {
            ...obj,
            attachments: attachId,
          };
          return httpRequest(params);
        },
        successFunction: () => {
          this.mixinkeepTable(true);
        },
      });
    },
  },
  components: {
    ComTabs: () => import("_comp/ComTabs"),
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
    ConfirmDialog: () => import("_comp/ConfirmDialog"),
    AddDrawer: () => import("../components/addDrawer"),
  },
};
</script>

<style lang="scss" scoped>
.dialog-money {
  display: flex;
}
</style>
