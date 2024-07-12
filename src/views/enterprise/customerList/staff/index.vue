<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs || []">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <ComForm
            :formConfig="getSearchCols('9')"
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
              <template v-if="slotProps.prop === 'nameEn'">
                <div class="display-flex">
                  <span
                    @click="handleDetails(slotProps.row)"
                    v-if="slotProps.row.nameEn"
                    class="primary-text-btn ellipsis-text"
                  >
                    {{ slotProps.row.nameEn }}
                  </span>
                  <span v-else>--</span>
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
                        :class="`operate-icon ${
                          item.info ? 'operate-icon-info' : ''
                        }`"
                        size="small"
                        type="text"
                        :style="{
                          color: item.color ? item.color : '#5094ff',
                        }"
                        :icon="`${item.icon}`"
                        @click="item.handleClick(slotProps.row, '9')"
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
    <ComCustomDialog ref="customDialogRef" :slotDlgFormIds="['msgSlot']">
      <template v-slot:msgSlot="slotProps">
        <span>{{ slotProps.fieldItem.placeholder }}</span>
      </template>
    </ComCustomDialog>
    <!-- <AddDrawer
      ref="addDrawer"
      @handleSuccess="handleSuccess"
      :dictionary="dictionary.dicsData"
    /> -->
    <PerfectDrawer
      ref="perfectDrawer"
      @handleSuccess="handleSuccess"
      :dictionary="dictionary.dicsData"
    />
  </div>
</template>
<script>
import mixinCustomerList from "../components/mixinCustomerList";
import { staff } from "@/views/enterprise/customerList/components/model.js";
import { getPersonlist } from "@/api/customerManage/customerList.js";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
export default {
  name: "Staff",
  mixins: [mixinCustomerList, mixinColsConf],
  components: {
    ComTabs: () => import("_comp/ComTabs"),
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    EditDrawer: () => import("../components/EditDrawer"),
    ConfirmDialog: () => import("_comp/ConfirmDialog"),
    // AddDrawer: () => import("../components/AddDrawer"),
    PerfectDrawer: () => import("../components/PerfectDrawer"),
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
  },
  data() {
    return {
      isQueryFirstDept: 1,
      status: "0,4,5",
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "员工列表",
            name: "1",
          },
        ],
        btnArr: [
          {
            table: "新增",
            className: "btn-type-add",
            icon: "el-icon-plus",
            handleClick: () => {
              this.handleStaffAdd({}, "add");
              // this.$refs.addDrawer.show("9");
            },
          },
        ],
      },
      customerTable: {
        tableHeight: "calc(100vh - 324px)",
        httpRequest: getPersonlist,
      },
      // statusList: [
      //   {
      //     text: "启用",
      //     status: [],
      //     handleClick: () => {},
      //   },
      //   {
      //     text: "禁用",
      //     status: [],
      //     handleClick: () => {},
      //   },
      // ],
      mixinTableColArr: [staff.tableLists],
      statusList: [
        //0草稿  4已启用  5已停用
        {
          text: "修改",
          status: ["0", "4", "5"],
          handleClick: (row) => {
            this.handleStaffAdd(row, "edit");
          },
        },
        {
          text: "启用",
          status: ["0", "5"],
          handleClick: this.handleEnable,
        },
        {
          text: "禁用",
          color: "#FF6767",
          status: ["4"],
          handleClick: this.handleDisable,
        },
        {
          text: "删除",
          color: "#FF6767",
          status: ["0"],
          handleClick: this.handleDelete,
        },
      ],
    };
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {},
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
