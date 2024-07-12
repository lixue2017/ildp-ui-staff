<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs || []">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <ComForm
            :formConfig="getSearchCols('3')"
            :dictionary="dictionary"
            @searchHeight="searchHeight"
            v-if="showSearchForm"
          >
          </ComForm>
          <ComTable
            :ref="`customerTable${tab.name}`"
            :tableHeight="`calc(100vh - ${extraHeight + formHeight}px)`"
            :columnConfig="tableMixinConfig(tab.name)"
            :httpRequest="customerTable.httpRequest"
            :getQueryParams="() => getQueryParams(tab.name)"
          >
            <template v-slot:customRow="{ slotProps }">
              <template v-if="slotProps.prop === 'nameCn'">
                <div class="display-flex" @click="handleDetails(slotProps.row)">
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
              <template v-if="slotProps.prop === 'operation'">
                <div class="operation-content">
                  <div class="btn">
                    <div
                      class="btn-list"
                      v-for="(item, index) in getStatusList(slotProps.row)"
                      :key="index"
                    >
                      <el-button
                        v-if="!item.hasPermission"
                        :class="`operate-icon ${
                          item.info ? 'operate-icon-info' : ''
                        }`"
                        size="small"
                        type="text"
                        :style="{
                          color: item.color ? item.color : '#5094ff',
                        }"
                        @click="item.handleClick(slotProps.row, '3')"
                        >{{ item.text }}</el-button
                      >
                      <el-button
                        v-else
                        :class="`operate-icon ${
                          item.info ? 'operate-icon-info' : ''
                        }`"
                        size="small"
                        :style="{
                          color: item.color ? item.color : '#5094ff',
                        }"
                        type="text"
                        @click="item.handleClick(slotProps.row, '3')"
                        v-hasPermi="item.hasPermission"
                        >{{ item.text }}</el-button
                      >
                    </div>
                  </div>
                </div>
              </template>
            </template>
          </ComTable>
        </el-tab-pane>
      </template>
    </ComTabs>
    <EditDrawer
      ref="editDrawer"
      @handleSuccess="handleSuccess"
      :dictionary="dictionary.dicsData"
    />
    <ConfirmDialog ref="confirmDialog" :dictionary="dictionary.dicsData" />
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
  </div>
</template>
<script>
import mixinCustomerList from "../components/mixinCustomerList";
import { supplier } from "@/views/enterprise/customerList/components/model.js";
import {
  getFacilitatorlist,
  disableFacilitator,
  enableFacilitator,
} from "@/api/customerManage/customerList.js";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { exportCustomerContractList } from "@/utils/zipdownload";
import { msgTipBox } from "@/utils/confirmBox.js";

export default {
  name: "Supplier",
  mixins: [mixinCustomerList, mixinColsConf],
  components: {
    ComTabs: () => import("_comp/ComTabs"),
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    EditDrawer: () => import("../components/EditDrawer"),
    ConfirmDialog: () => import("_comp/ConfirmDialog"),
    AddDrawer: () => import("../components/AddDrawer"),
    PerfectDrawer: () => import("../components/PerfectDrawer"),
  },
  data() {
    return {
      isQueryFirstDept: 1,
      status: "0,1,2,3,4,5,6",
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "服务商列表",
            name: "1",
          },
        ],
        btnArr: [
          {
            table: "新增",
            className: "btn-type-add",
            icon: "el-icon-plus",
            handleClick: () => {
              this.$refs.addDrawer.show("3");
            },
          },
          {
            table: "导出",
            icon: "iconfont daochu",
            handleClick: () => {
              exportCustomerContractList({
                clientIdentity: 3,
                status: "0,1,2,3,4,5", // 禁用状态不用导出
              });
            },
          },
        ],
      },
      customerTable: {
        tableHeight: "calc(100vh - 324px)",
        httpRequest: getFacilitatorlist,
      },
      statusList: [
        {
          text: "修改",
          status: ["0", "2", "3"],
          handleClick: this.handleUpdate,
        },
        {
          text: "禁用",
          status: ["3"],
          handleClick: this.handleDisable,
          hasPermission: ["enterprise:serviceProvider:disable"],
        },
        {
          text: "启用",
          status: ["6"],
          handleClick: this.handleEnable,
          hasPermission: ["enterprise:serviceProvider:enable"],
        },
        {
          text: "提交",
          status: ["0", "2"],
          handleClick: this.handleSubmitStatus,
        },
        {
          text: "删除",
          color: "#FF6767",
          status: ["0", "2"],
          handleClick: this.handleDelete,
        },
        {
          text: "审核",
          status: ["1"],
          handleClick: this.handleVerify,
          hasPermission: ["enterprise:serviceProvider:examine"],
        },
      ],
      mixinTableColArr: [supplier.tableLists],
    };
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    handleDisable(row) {
      msgTipBox(
        this,
        {
          title: "禁用提示",
          msg: "禁用之后不可被其他模块引用",
          showCancelButton: true,
        },
        () => {
          this.comRepeatedRequest(this, disableFacilitator, {
            id: row.id,
          }).then(() => {
            this.keepTableList();
          });
        }
      );
    },
    handleEnable(row) {
      msgTipBox(
        this,
        {
          title: "启用提示",
          msg: "启用之后可被其他模块引用",
          showCancelButton: true,
        },
        () => {
          this.comRepeatedRequest(this, enableFacilitator, { id: row.id }).then(
            () => {
              this.keepTableList();
            }
          );
        }
      );
    },
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
</style>
