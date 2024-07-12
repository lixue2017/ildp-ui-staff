<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs || []">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :formConfig="
                getSearchCols(tabsConfig.activeName == 1 ? '2' : '21')
              "
              :dictionary="dictionary"
              @searchHeight="searchHeight"
              v-if="showSearchForm && tabsConfig.activeName === tab.name"
            >
            </ComForm>
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              :ref="`customerTable${tab.name}`"
              :tableHeight="`calc(100vh - ${extraHeight + formHeight}px)`"
              :columnConfig="tableMixinConfig(tab.name)"
              :httpRequest="getHttpRequest(tab.name)"
              :rowOperationBtnListFn="(r) => getStatusList(r, 1)"
              :colShowBtnFn="isPermission"
              :getQueryParams="() => getQueryParams(tab.name)"
              @handleTableView="handleConfigDetail"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'nameCn'">
                  <div
                    class="display-flex"
                    @click="handleDetails(slotProps.row)"
                  >
                    <span class="primary-text-btn ellipsis-text">
                      {{ slotProps.row.nameCn }}
                    </span>
                  </div>
                </template>
                <template v-if="slotProps.prop === 'status'">
                  <el-tooltip
                    v-if="slotProps.row.status == '2'"
                    class="item"
                    effect="dark"
                    :content="`${
                      slotProps.row.auditingRemark
                        ? `拒绝理由：${slotProps.row.auditingRemark}`
                        : '拒绝理由：暂无'
                    }`"
                    placement="top"
                  >
                    <span>
                      <i
                        class="status-dot"
                        :style="{
                          backgroundColor:
                            slotProps.row.status &&
                            slotProps.dicsList &&
                            slotProps.dicsList.color,
                        }"
                      >
                      </i>

                      {{
                        slotProps.row.status &&
                        slotProps.dicsList &&
                        slotProps.dicsList.nameCn
                      }}
                    </span>
                  </el-tooltip>
                  <span v-else>
                    <i
                      class="status-dot"
                      :style="{
                        backgroundColor:
                          slotProps.row.status &&
                          slotProps.dicsList &&
                          slotProps.dicsList.color,
                      }"
                    >
                    </i>

                    {{
                      slotProps.row.status &&
                      slotProps.dicsList &&
                      slotProps.dicsList.nameCn
                    }}
                  </span>
                </template>
                <template v-if="slotProps.prop === 'userStatus'">
                  <span>
                    {{
                      slotProps.row.userStatus &&
                      slotProps.dicsList &&
                      slotProps.dicsList.nameCn
                    }}
                  </span>
                </template>
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
    <EditDrawer
      ref="editDrawer"
      @handleSuccess="handleSuccess"
      :dictionary="dictionary.dicsData"
    />
    <ConfirmDialog ref="confirmDialog" :dictionary="dictionary.dicsData" />
    <ComCustomDialog
      ref="customDialogRef"
      :slotDlgFormIds="['productTable', 'syncTips', 'productTips']"
    >
      <!-- <template v-slot:productTips="slotProps">
        <span class="sync-tips">说明：商品差异需要双向线下沟通之后再处理(当前可通过下单、调整库存等多种方式处理)</span>
      </template>
      <template v-slot:productTable="slotProps">
        <div>
          <span class="product-tips">商品不一致</span>
          <ComTable
            ref="productTableRef"
            :tableHeight="productTable.tableHeight"
            :columnConfig="productTable.columnConfig"
            :httpRequest="productTable.httpRequest"
            :getQueryParams="getProductQueryParams"
          />
        </div>
      </template> -->
      <template v-slot:syncTips="slotProps">
        <span class="sync-tips"
          >调用区间说明：马帮接口对接每次调用只支持5天的订单(如需调用当前数据，截至日期用明天)</span
        >
      </template>
    </ComCustomDialog>
    <AddDrawer
      ref="addDrawer"
      @handleSuccess="handleSuccess"
      :dictionary="dictionary.dicsData"
    />
    <PerfectDrawer
      ref="perfectDrawer"
      @handleSuccess="handleSuccess"
      :dictionary="dictionary.dicsData"
    />
    <PermissionSettings
      ref="permissionSettingsRef"
      :roleList="roleList"
      @handleSuccess="handleSuccess"
      v-if="showSearchForm"
    />
    <productDiffDialog ref="productDiffDialogRef" />
  </div>
</template>
<script>
import { hostLoginClient } from "@/utils/index.js";
import mixinCustomerList from "../components/mixinCustomerList";
import {
  customer,
  enterpriseConfig,
} from "@/views/enterprise/customerList/components/model.js";
import {
  getCustlist,
  POSTApiConfigSaveOrUpdate,
  DELETEApiConfigDel,
  PUTApiConfigEnableDisable,
  POSTApiConfigSyncOrder,
  POSTApiProductDifferenceGetPage,
} from "@/api/customerManage/customerList.js";
import { POSTApiConfigGetPage } from "@/api/warehouse/basic.js";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { hasBtnPermits } from "@/directive/permission/hasPermi.js";
import { exportCustomerContractList } from "@/utils/zipdownload";
import {
  erpAddDialogCols,
  syncDialogCols,
  productDiffDialogCols,
  productDiffTableColumns,
} from "../components/model.js";

export default {
  name: "Customer",
  mixins: [mixinCustomerList, mixinColsConf],
  components: {
    ComTabs: () => import("_comp/ComTabs"),
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    EditDrawer: () => import("../components/EditDrawer"),
    ConfirmDialog: () => import("_comp/ConfirmDialog"),
    AddDrawer: () => import("../components/AddDrawer"),
    PerfectDrawer: () => import("../components/PerfectDrawer"),
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
    PermissionSettings: () => import("../components/PermissionSettings"),
    productDiffDialog: () => import("../components/productDiffDialog"),
  },
  data() {
    return {
      status: "0,1,2,3,4,5,9",
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {
          this.initMixinColumnConf();
        },
        tabs: [
          {
            label: "客户列表",
            name: "1",
          },
          {
            label: "配置列表",
            name: "2",
          },
        ],
        btnArr: [
          {
            table: "新增",
            className: "btn-type-add",
            icon: "el-icon-plus",
            showTabName: ["1"],
            handleClick: () => {
              this.$refs.addDrawer.show("2");
            },
          },
          {
            table: "导出",
            icon: "iconfont daochu",
            showTabName: ["1"],
            handleClick: () => {
              exportCustomerContractList({
                clientIdentity: 2,
                status: "0,1,2,3,4,5,9",
              });
            },
          },
          {
            table: "新增易仓ERP",
            showTabName: ["2"],
            handleClick: () => {
              this.handleAddErp(
                {
                  apiType: "3",
                },
                "add"
              );
            },
          },
          {
            table: "新增马帮ERP",
            showTabName: ["2"],
            handleClick: () => {
              this.handleAddErp(
                {
                  apiType: "4",
                },
                "add"
              );
            },
          },
        ],
      },
      customerTable: {
        tableHeight: "calc(100vh - 324px)",
        httpRequest: {
          1: getCustlist,
          2: POSTApiConfigGetPage,
        },
      },
      // productTable:{
      //   tableHeight: "calc(100vh-60px)",
      //   columnConfig:productDiffTableColumns,
      //   httpRequest:POSTApiProductDifferenceGetPage,
      // },
      mixinTableColArr: [customer().tableLists, enterpriseConfig.tableLists],
      statusList: [
        {
          text: "登录客户端",
          showTabName: ["1"],
          status: ["30", "90", "91"],
          handleClick: (row) => {
            hostLoginClient(row.relationUserId);
          },
        },
        {
          text: "修改",
          showTabName: ["1"],
          status: ["00", "01", "20", "21", "30", "31", "32", "90", "91"],
          handleClick: (val) => this.handleUpdate(val, 2),
        },
        {
          text: "提交",
          showTabName: ["1"],
          status: ["00", "01", "20", "21"],
          handleClick: this.handleSubmitStatus,
        },
        {
          text: "删除",
          showTabName: ["1"],
          color: "#FF6767",
          status: ["00", "01", "20", "21"],
          handleClick: this.handleDelete,
        },
        {
          text: "审核",
          showTabName: ["1"],
          status: ["10", "11"],
          handleClick: this.handleVerify,
          hasPermission: ["enterprise:customer:examine"],
        },
        {
          text: "权限设置",
          showTabName: ["1"],
          status: ["30", "90", "91"],
          handleClick: this.permissionSettings,
        },
        {
          text: "开通账号",
          showTabName: ["1"],
          status: ["31"],
          handleClick: this.handleOpenAccount,
          hasPermission: ["enterprise:customer:openAccount"],
        },
        {
          text: "启用账号",
          showTabName: ["1"],
          status: [],
          handleClick: this.handleEnable,
        },
        {
          text: "重置账号",
          showTabName: ["1"],
          status: [],
          handleClick: () => {},
        },
        {
          text: "冻结客户",
          showTabName: ["1"],
          status: ["30", "31"],
          color: "#FF6767",
          handleClick: (row) => {
            const tips = {
              msg: "冻结之后客户不可下单，你还要继续吗？",
              title: "冻结提示",
              className: "el-icon-warning text-warning",
              type: 9,
            };
            this.handleFreeze(row, tips);
          },
        },
        {
          text: "解除冻结",
          showTabName: ["1"],
          status: ["90", "91"],
          color: "#FF6767",
          handleClick: (row) => {
            const tips = {
              msg: "删除不可逆，你还要继续吗？",
              title: "删除提示",
              className: "el-icon-warning text-warning",
              type: 3,
            };
            this.handleFreeze(row, tips);
          },
        },
        {
          text: "同步订单",
          showTabName: ["2"],
          configStatus: ["1", 1],
          showApiType: [4, "4"],
          handleClick: (row) => {
            this.handleSync(row);
          },
        },
        {
          text: "商品管理",
          showTabName: ["2"],
          configStatus: ["1", 1],
          showApiType: [4, "4"],
          handleClick: (row) => {
            this.handleProductDiff(row);
          },
        },
        {
          text: "编辑",
          showTabName: ["2"],
          configStatus: ["0", "1", 0, 1],
          handleClick: (row) => {
            this.handleAddErp(row, "edit");
          },
        },
        {
          text: "启用",
          showTabName: ["2"],
          configStatus: ["2", 2, 0, "0"],
          handleClick: (row) => {
            const { id } = row;
            const params = {
              id,
              state: 1,
            };
            PUTApiConfigEnableDisable(params).then((res) => {
              this.keepTableList();
            });
          },
        },
        {
          text: "禁用",
          color: "#FF6767",
          configStatus: ["1", 1],
          handleClick: (row) => {
            const { id } = row;
            const params = {
              id,
              state: 2,
            };
            PUTApiConfigEnableDisable(params).then((res) => {
              this.keepTableList();
            });
          },
        },
        {
          text: "删除",
          color: "#FF6767",
          showTabName: ["2"],
          configStatus: ["0", 0],
          handleClick: (row) => {
            const { id } = row;
            this.$refs.confirmDialog.delete().then(() => {
              DELETEApiConfigDel(id).then((res) => {
                this.keepTableList();
              });
            });
          },
        },
      ],
      mixinTableRef: "customerTable",
      diffSearchFromData: {},
    };
  },
  computed: {},
  created() {},
  mounted() {
    window.addEventListener("resize", this.handleResize);
  },
  methods: {
    handleResize() {
      const { activeName } = this.tabsConfig;
      this.$refs[`customerTable${+activeName}`][0].doLayout();
    },
    isPermission(row = {}) {
      const { hasPermission } = row;
      return hasPermission
        ? hasBtnPermits(hasPermission) || !hasPermission
        : true;
    },
    getHttpRequest(tName) {
      const httpRequest = this.customerTable.httpRequest[tName];
      return httpRequest;
    },
    handleAddErp(row = {}) {
      const { apiType, timingFrequency, ...obj } = row;
      this.$refs.customDialogRef?.showCustomDialog({
        customFormConfig: erpAddDialogCols(),
        formModel: {
          ...obj,
          apiType: this.typeConversion(apiType, "string"),
          timingFrequency: this.typeConversion(timingFrequency, "string"),
        },
        httpRequest: (formModel) => {
          return POSTApiConfigSaveOrUpdate(formModel);
        },
        successFunction: () => {
          this.keepTableList();
        },
      });
    },
    handleSync(row = {}) {
      const { apiType, id, customerName, customerId, ...obj } = row;
      this.$refs.customDialogRef?.showCustomDialog({
        customFormConfig: syncDialogCols(),
        formModel: {
          id,
          apiType: this.typeConversion(apiType, "string"),
          customerName,
          customerId,
        },
        httpRequest: (formModel) => {
          const { dateRange, ...obj } = formModel;
          const params = {
            ...obj,
            startDate: dateRange && dateRange[0],
            endDate: dateRange && dateRange[1],
          };
          return POSTApiConfigSyncOrder(params);
        },
        successFunction: (result = {}) => {
          const { data, code } = result;
          const { type, title, tips } = {
            200: {
              type: "success",
              title: "同步订单完成!",
              tips: `成功获取有效数据${data || 0}条`,
            },
            1002: {
              type: "error",
              title: "同步订单失败!",
              tips: "详情请查看访问记录!",
            },
          }[code];
          this.$confirm(tips, title, {
            confirmButtonText: "确定",
            showCancelButton: false,
            showClose: false,
            type,
          }).then(() => {
            this.keepTableList();
          });
        },
      });
    },
    handleConfigDetail(row = {}) {
      const { customerId, id, ...obj } = row;
      const param = {
        ...obj,
        id: customerId,
      };
      const idList = this.$refs[
        `customerTable${+this.tabsConfig.activeName}`
      ][0].tableData
        .map((item) => item.customerId)
        .filter((e) => +e);
      this.handleDetails(param, idList);
    },
    handleProductDiff(row = {}) {
      this.$refs.productDiffDialogRef?.show(row);
      // this.diffSearchFromData=row
      // const {customerName,name}=row
      // this.$refs.customDialogRef?.showCustomDialog({
      // 	customFormConfig: productDiffDialogCols(),
      // 	formModel: {
      //     customerName,
      //     name
      // 	},
      // })
    },
    permissionSettings(row) {
      this.$refs.permissionSettingsRef.show(row);
    },
    // getProductQueryParams(){
    //   const {id:apiId,customerId}=this.diffSearchFromData
    //   return {
    //     apiId,
    //     customerId
    //   }
    // },
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize); //销毁监听事件
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-container {
  .operation-content {
    .btn {
      display: flex;
      .operate-icon {
        display: flex;
        align-items: center;
        margin-right: 14px;
        &.operate-icon-info {
          color: #606060;
        }

        /deep/ span {
          font-size: 12px;
        }
      }
    }
  }
}
.product-tips {
  color: #515151;
  font-size: 14px;
  font-weight: 700;
}
.sync-tips {
  color: #aaaaaa;
  &::before {
    content: "*";
    color: #aaaaaa;
  }
}
</style>
