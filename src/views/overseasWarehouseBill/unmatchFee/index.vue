<template>
  <!-- 新页面 -->
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :formConfig="searchFormConfig"
              v-if="showSearchForm && tabsConfig.activeName == tab.name"
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
    </ComTabs>
    <!-- <ConfirmDialog ref="confirmDialog" /> -->
  </div>
</template>

<script>
import {
  unmatchFeeFormConfig,
  unmatchFeeTableConfig,
} from "../components/model.js";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { WarehouseBillMixin } from "../components/mixin.js";
import { getStorageMatchList } from "@/api/costScheme/index.js";
export default {
  name:"UnmatchFee",
  mixins: [WarehouseBillMixin, mixinColsConf],
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        type: "unmatchFee",
        handleTabsClick: () => {},
        tabs: [
          {
            label: "未匹配到规则",
            name: "1",
          },
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
        lists: unmatchFeeFormConfig({
          warehouseChange: () => {
            this.$refs.billWarehouseId[0]?.changeFocusRequest();
          },
        }), // 表单渲染列表
        formRules: {}, // 表单校验规则
      },
      tableConfig: {
        tableHeight: "calc(100vh - 264px)",
        httpRequest: getStorageMatchList,
      },
      mixinTableColArr: [unmatchFeeTableConfig],
    };
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
