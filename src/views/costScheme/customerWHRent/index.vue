<template>
  <!-- 新页面 -->
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :formConfig="searchFormConfig"
              v-if="showSearchForm && tabsConfig.activeName === tab.name"
            >
              <template v-slot:billWarehouseId="slotProps">
                <div class="table-warehouse">
                  <AutoComplete
                    ref="billWarehouseId"
                    :formModel="slotProps.formModel"
                    :fieldItem="slotProps.fieldItem"
                    :additionalParam="{
                      billCompanyId: slotProps.formModel.billCompanyId,
                    }"
                  />
                </div>
              </template>
            </ComForm>
          </keep-alive>
          <keep-alive>
            <ComTable
              :ref="`tableRef${tab.name}`"
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="tableMixinConfig(tab.name)"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="getQueryParams"
              :rowOperationBtnListFn="() => tableConfig.statusList"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'costCode'">
                  <span
                    class="primary-text-btn"
                    @click="handleView(slotProps.row)"
                  >
                    {{ slotProps.row.costCode || "--" }}
                  </span>
                </template>
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
      <template v-slot:btnOptions="{ slotProps }">
        <el-dropdown
          v-if="slotProps.btn"
          @command="slotProps.btn.handleCommand"
          trigger="click"
          class="dropDown"
        >
          <el-button type="primary">
            {{ slotProps.btn.table }}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu
            slot="dropdown"
            class="rent-dropdown"
            :style="{ maxHeight: 'calc(100% - 150px)' }"
          >
            <el-input
              v-model="customerRules"
              @change="getAddStorageSchemeQueryAddList"
              class="dropDown_input"
              placeholder="输入后,按Enter键查询"
            ></el-input>
            <el-dropdown-item
              v-for="(item, index) in slotProps.btn.options"
              :key="index"
              :command="item"
              :title="item.label"
              class="dropDown_label"
              >{{ item.label }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </ComTabs>
    <ConfirmDialog ref="confirmDialog" />
    <rulesDialog ref="rulesDialog" />
    <TransformDialog ref="TransformDialog" @handleSuccess="handleSuccess" />
    <!-- <AddDrawer ref="AddDrawerRef" @handleSuccess="handleSuccess" /> -->
  </div>
</template>

<script>
import {
  customerWHRentFormConfig,
  customerWHRentTableConfig,
} from "../components/model.js";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { mixinCostScheme } from "../components/costSchemeMixin.js";
import { getStorageSchemeCustomerList } from "@/api/costScheme/index.js";
export default {
  name:'CustomerWHRent',
  mixins: [mixinCostScheme, mixinColsConf],
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        type: "customerWHRent",
        handleTabsClick: () => {},
        tabs: [
          {
            label: "客户仓储费用",
            name: "1",
          },
        ],
        btnArr: [
        ],
      },
      searchFormConfig: {
        formModel: {}, // 表单数据
        fold: true, // 模糊搜索是否需要展开按钮
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.searchList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        labelWidth: "100px",
        lists: customerWHRentFormConfig({
          warehouseChange: () => {
            this.$refs.billWarehouseId[0]?.changeFocusRequest();
          },
        }), // 表单渲染列表
        formRules: {}, // 表单校验规则
      },
      tableConfig: {
        httpRequest: getStorageSchemeCustomerList,
        tableHeight: "calc(100vh - 264px)",
        statusList: [
          //1-草稿 2-已启用 3-已禁用
          {
            text: "查看规则",
            handleClick: this.handleViewRules,
          },
        ],
      },
      mixinTableColArr: [customerWHRentTableConfig],
    };
  },
  mounted(){
    this.searchFromData={
      status:['2']
    }
    this.searchFormConfig.formModel={
      ...this.searchFromData
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-container {
}
.rent-dropdown {
  overflow: auto;
  margin-left: -254px;
  width: 600px;
  min-height: 250px;
  .dropDown_input {
    padding: 5px 15px;
  }
  .dropDown_label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
