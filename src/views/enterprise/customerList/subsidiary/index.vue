<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs || []">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <ComForm
            :formConfig="getSearchCols('0')"
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
                <div class="display-flex">
                  <span
                    class="primary-text-btn ellipsis-text"
                    @click="handleDetails(slotProps.row)"
                  >
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
                        :icon="`${item.icon}`"
                        @click="item.handleClick(slotProps.row, '0')"
                        >{{ item.text }}</el-button
                      >
                      <el-button
                        v-else
                        :class="`operate-icon ${
                          item.info ? 'operate-icon-info' : ''
                        }`"
                        size="small"
                        type="text"
                        :style="{
                          color: item.color ? item.color : '#5094ff',
                        }"
                        :icon="`${item.icon}`"
                        @click="item.handleClick(slotProps.row, '0')"
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
import { subsidiary } from "@/views/enterprise/customerList/components/model.js";
import { getBsList } from "@/api/customerManage/customerList.js";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
export default {
  name: "Subsidiary",
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
      status: "0,1,2,3,4,5",
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "堡森列表",
            name: "1",
          },
        ],
        btnArr: [
        {
            table: "订舱代理配置",
            handleClick: () => {
              this.handleBookingConfig();
            },
          },
          {
            table: "收款凭证配置",
            handleClick: () => {
              this.handleConfiguration();
            },
          },
          {
            table: "堡森业务员",
            handleClick: () => {
              this.handleEditBssales();
            },
          },
          {
            table: "新增",
            className: "btn-type-add",
            icon: "el-icon-plus",
            handleClick: () => {
              this.$refs.addDrawer.show("0");
            },
          },
        ],
      },
      // statusList: [
      //   {
      //     text: "修改",
      //     status: ["00", "01", "10", "11", "20", "21", "30", "31", "32"],
      //     handleClick: this.handleUpdate,
      //   },
      //   {
      //     text: "提交",
      //     status: ["00", "01", "20", "21"],
      //     handleClick: this.handleSubmitStatus,
      //   },
      //   {
      //     text: "删除",
      //     color:"#FF6767",
      //     status: ["00", "01", "20", "21"],
      //     info: true,
      //     handleClick: this.handleDelete,
      //   },
      //   {
      //     text: "审核",
      //     status: ["10", "11"],
      //     handleClick: this.handleVerify,
      //     hasPermission: ["enterprise:bs:examine"],
      //   },
      //   {
      //     text: "启用账号",
      //     status: ["32"],
      //     handleClick: this.handleEnable,
      //   },
      // ],
      customerTable: {
        tableHeight: "calc(100vh - 324px)",
        httpRequest: getBsList,
      },
      statusList: [
        {
          text: "修改",
          status: ["0", "2", "3"],
          handleClick: this.handleUpdate,
        },
        {
          text: "提交",
          status: ["0", "2"],
          handleClick: this.handleSubmitStatus,
        },
        {
          text: "删除",
          status: ["0", "2"],
          color: "#FF6767",
          handleClick: this.handleDelete,
        },
        {
          text: "审核",
          status: ["1"],
          handleClick: this.handleVerify,
          hasPermission: ["enterprise:bs:examine"],
        },
      ],
      mixinTableColArr: [subsidiary.tableLists],
    };
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    handleBookingConfig(){
      //订舱代理配置
      this.$router.push({
        path: "/enterprise/bookingConfig",
        query: {
          backPath: this.$route.path,
        },
      });
    },
    handleConfiguration() {
      //收款凭证配置
      this.$router.push({
        path: "/enterprise/vouConfig",
        query: {
          backPath: this.$route.path,
        },
      });
    },
    handleEditBssales() {
      //堡森业务员
      this.$router.push({
        path: "/enterprise/salesman",
        query: {
          backPath: this.$route.path,
        },
      });
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
