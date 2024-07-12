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
                      // billCompanyId: slotProps.formModel.billCompanyId,
                    }"
                  />
                </div>
              </template>
            </ComForm>
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              :ref="`tableRef${tab.name}`"
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="tableMixinConfig(tab.name)"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="getQueryParams"
              :rowOperationBtnListFn="() => tableConfig.statusList"
              :colShowBtnFn="operationBtn"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'schemeCode'">
                  <span
                    class="primary-text-btn"
                    @click="
                      handleView(slotProps.row, {
                        path: '/costScheme/warehouseRentDetail',
                      })
                    "
                  >
                    {{ slotProps.row.schemeCode || "--" }}
                  </span>
                </template>
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
    <ConfirmDialog ref="confirmDialog" />
    <rulesDialog ref="rulesDialog" />
    <ComCustomDialog ref="customDialogRef" />
  </div>
</template>

<script>
import {
  warehouseRentFormConfig,
  warehouseRentTableConfig,
} from "../components/model.js";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { mixinCostScheme } from "../components/costSchemeMixin.js";
import {
  getStorageSchemeList,
  deleteStorageScheme,
  updateStorageScheme,
  getStorageSchemeCopy,
  putStorageSchemeUpdEnablingTime,
  putStorageSchemeCancelUp,
  getStorageSchemeUpgrade
} from "@/api/costScheme/index.js";
export default {
  name: "WarehouseRent",
  mixins: [mixinCostScheme, mixinColsConf],
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        type: "warehouseRent",
        handleTabsClick: () => {},
        tabs: [
          {
            label: "仓租方案",
            name: "1",
          },
        ],
        btnArr: [
          {
            table: "新增",
            className: "btn-type-add",
            icon: "el-icon-plus",
            handleClick: (row) => {
              this.handleAdd(row, {
                path: "/costScheme/warehouseRentAddEdit",
                operationType: "add",
              });
            },
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
        lists: warehouseRentFormConfig({
          // warehouseChange: () => {
          //   this.$refs.billWarehouseId[0]?.changeFocusRequest();
          // },
        }), // 表单渲染列表
        formRules: {}, // 表单校验规则
      },
      tableConfig: {
        httpRequest: getStorageSchemeList,
        tableHeight: "calc(100vh - 264px)",
        statusList: [
          //1-草稿 2-已启用 3-已禁用
          {
            text: "复制",
            showStatus: [1, 2, 3],
            handleClick: (row) => {
              const { id } = row;
              this.handleCopy(id, {
                httpRequest: getStorageSchemeCopy,
                path: "/costScheme/warehouseRentAddEdit",
                operationType: "copy",
              });
            },
          },
          {
            text: "修改",
            showStatus: [1],
            handleClick: (formModel) => {
              this.handleAdd(formModel, {
                path: "/costScheme/warehouseRentAddEdit",
                operationType: "edit",
              });
            },
          },
          {
            text: "启用",
            showStatus: [1, 3],
            handleClick: (formModel) => {
              const { status } = formModel;
              if (status == 3) {
                this.handleEffectuate(formModel,{
                  httpRequest: updateStorageScheme,
                  requestParams:{
                    status:2
                  }
                })
              } else {
                this.handleChangeState(formModel, {
                  type: 0,
                  httpRequest: updateStorageScheme,
                });
              }
            },
          },
          {
            text: "升级",
            showStatus: [2],
            handleClick: (formModel) => {
              this.upgradeScheme(formModel,{
                httpRequest:getStorageSchemeUpgrade,
                path: "/costScheme/warehouseRentAddEdit",
                operationType: "edit",
              })
            },
          },
          {
            text: "禁用",
            showStatus: [2],
            color: "#FF6767",
            handleClick: (formModel) => {
              this.handleChangeStatus(formModel, {
                status: 3,
                httpRequest: updateStorageScheme,
              });
            },
          },
          {
            text: "删除",
            showStatus: [1],
            color: "#FF6767",
            handleClick: (formModel) => {
              this.handleDelete(formModel, {
                httpRequest: deleteStorageScheme,
              });
            },
          },
          {
            text: "修改生效时间",
            showStatus: [5],
            handleClick: (formModel) => {
              this.handleChangeState(formModel,{
                type:1,
                httpRequest:putStorageSchemeUpdEnablingTime
              })
            },
          },
          {
            text: "取消",
            showStatus: [5],
            handleClick: (formModel) => {
              this.handleCancel(formModel,{
                httpRequest:putStorageSchemeCancelUp
              })
            },
          },
        ],
      },
      mixinTableColArr: [warehouseRentTableConfig],
    };
  },
  mounted(){
    this.searchFromData={
      status:['1','2']
    }
    this.searchFormConfig.formModel={
      ...this.searchFromData
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-container {
  .btn-color {
    background: #ff813d;
    font-weight: bold;
    /deep/.el-icon-plus {
      font-weight: bold;
    }
  }
}
</style>
