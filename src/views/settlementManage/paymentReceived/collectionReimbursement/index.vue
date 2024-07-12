<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :formConfig="searchTabForm(tab.name)"
              v-if="showSearchForm && tabsConfig.activeName === tab.name"
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
              v-if="tabsConfig.activeName === tab.name && showSearchForm"
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="tableMixinConfig(tab.name)"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="() => tableConfig.getQueryParams(tab.name)"
              :rowOperationBtnListFn="
                (row) => (row.status === null ? [] : rowStatusList)
              "
              :colShowBtnFn="(btnItem, row) => operationBtn(btnItem, row)"
              :tree-props="{
                children: 'children',
                hasChildren: 'WEB_HAVECHILDREN',
              }"
              :treeLazyLoad="{
                lazy: true,
                load: getColsChildren,
              }"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'serialCode'">
                  <span
                    class="primary-text-btn"
                    @click="handleView(slotProps.row, 'id', 'receiptsDetails')"
                  >
                    {{ slotProps.row.serialCode }}
                  </span>
                </template>
                <!-- <template v-if="slotProps.prop === 'operation'">
                  <div class="operation-content-btn">
                    <template v-for="(bItem, index) in tableConfig.statusList">
                      <el-button
                        :key="`b_${index}`"
                        size="small"
                        type="text"
                        v-if="operationBtn(bItem, slotProps.row)"
                        @click="bItem.handleClick(slotProps.row)"
                        >{{ bItem.text }}</el-button
                      >
                    </template>
                  </div>
                </template> -->
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>

    <EditCollectionDialog ref="editDialogRef" @handleSuccess="mixinkeepTable" />
    <ComCustomDialog ref="customDialogRef" />
  </div>
</template>

<script>
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { collectionConfig } from "@/views/settlementManage/paymentReceived/components/model.js";
import mixinExpenses from "@/views/settlementManage/paymentReceived/components/mixinExpenses.js";
import { getCashierList } from "@/api/settlementManage/paymentReceived";
import { mixinCollectionExpenses } from "../financeCostExpenses/mixinCostExpenses.js";
export default {
  name: "CollectionReimbursement",
  mixins: [mixinColsConf, mixinExpenses, mixinCollectionExpenses],
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: this.initMixinColumnConf,
        tabs: [
          {
            label: "待处理", //财务收款
            name: "1",
          },
          {
            label: "已处理",
            name: "2",
          },
        ],
      },
      searchFormConfig: {
        formModel: {},
        httpRequest: (formModel) => {
          const { activeName } = this.tabsConfig;
          const { taskByName, taskBySearch, ...nObj } = formModel;
          const params = {
            ...nObj,
            taskBySearch: activeName == 1 ? taskBySearch : undefined,
          };
          return new Promise((resolve) => {
            this.getList(params);
            resolve();
          });
        }, // 表单提交接口
        residueCols: [2],
        searchColsHeight: true,
        searchForm: true,
        fold: true,
        size: "small",
        labelWidth: "85px",
        formRules: {},
      },
      tableConfig: {
        tableHeight: "calc(100vh - 262px)",
        getQueryParams: this.getQueryParams,
        httpRequest: (params) => {
          return new Promise((resolve, reject) => {
            getCashierList(params)
              .then((res) => {
                resolve({
                  ...res,
                  rows: res.rows.map((e) => {
                    return {
                      ...e,
                      WEB_HAVECHILDREN:
                        e.isMainBill == 1 || e.isMainBill == 2 ? true : false,
                    };
                  }),
                });
              })
              .catch(() => {
                reject();
              });
          });
        },
      },
      mixinTableColArr: [
        collectionConfig.OTcolumnConfig,
        collectionConfig.TTcolumnConfig,
      ],
    };
  },
  methods: {
    getInitialData() {
      this.searchFormConfig.formModel = {
        taskBySearch: this.curUserInfo?.userId,
        taskByName: this.curUserInfo?.userName,
        auditBySearch: this.curUserInfo?.userId,
        auditByName: this.curUserInfo?.userName,
      };
      this.searchFromData[1] = {
        taskBySearch: this.curUserInfo?.userId,
      };
      this.searchFromData[2] = {
        auditBySearch: this.curUserInfo?.userId,
        auditByName: this.curUserInfo?.userName,
      };
      this.showSearchForm = true;
    },
    getQueryParams(tName) {
      const {
        status,
        flowType = undefined,
        taskByName,
        auditByName,
        taskBySearch,
        auditBySearch,
        ...obj
      } = this.searchFromData[tName] || {};
      return {
        ...obj,
        statusIn:
          this.tabsConfig.activeName === "2"
            ? "100,99"
            : status?.length
            ? status.join(",")
            : "65,80",
        typeList: [3],
        auditStatus: tName - 1,
        costType: 1,
        isMainBillList: [0, 1, 2],
        flowType: flowType ? [flowType] : undefined,
        taskBySearch: tName == 1 ? taskBySearch : undefined,
        auditBySearch: tName == 2 ? auditBySearch : undefined,
      };
    },
    searchTabForm(tName) {
      return {
        ...this.searchFormConfig,
        lists: [collectionConfig.OTSearch, collectionConfig.TTSearch][
          tName - 1
        ],
      };
    },
    operationBtn(bItem, row) {
      if (row.status === null) {
        return false;
      }
      if (bItem.statusBtnArr.includes("btnBack")) {
        return row.serialCode.includes("-1") || !row.serialCode.includes("-");
      }
      return bItem.statusBtnArr.includes(row.status);
    },
    getColsChildren(row, treeNode, resolve) {
      const { id } = row;
      const params = {
        parentId: id,
      };
      getCashierList(params).then((res) => {
        resolve(
          (res.rows || res.data || []).map((item) => {
            item.status = null;
            return item;
          })
        );
      });
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
