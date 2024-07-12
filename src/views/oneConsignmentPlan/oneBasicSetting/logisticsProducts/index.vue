<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :formConfig="setSearchFormConf(tab.name)"
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
              v-if="tabsConfig.activeName === tab.name"
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="tableMixinConfig(tab.name)"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="getTableQueryParams"
              :rowOperationBtnListFn="() => tableConfig.statusBtnList"
              :colShowBtnFn="operationBtn"
              @handleTableView="(r) => handleAddOrEdit(r, 1)"
            />
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>

    <EditDialog ref="editDlgRef" />
  </div>
</template>

<script>
import {
  logisticsProductList,
  putLogisticsProduct,
  delLogisticsProduct,
} from "@/api/warehouse/basic";
import { mapActions, mapState } from "vuex";
import { customMessageBox } from "@/utils/confirmBox.js";
import { searchColumns, tableColumns } from "./model";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
export default {
  name: "LogisticsProducts",
  mixins: [mixinColsConf],
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "物流产品信息",
            name: "1",
          },
        ],
        btnArr: [
          {
            table: "新增",
            showTabName: "1",
            className: "btn-type-add",
            icon: "el-icon-plus",
            handleClick: () => this.handleAddOrEdit({}),
          },
        ],
      },
      searchFromData: {},
      searchFormConfig: {
        formModel: {}, // 表单数据
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getLogisticsList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        fold: true,
        labelWidth: "85px",
      },
      tableConfig: {
        tableHeight: "calc(100vh - 264px)",
        httpRequest: logisticsProductList,
        statusBtnList: [
          {
            text: "修改",
            showStatus: [0, 2],
            handleClick: (row) => this.handleAddOrEdit(row),
          },
          {
            text: "启用",
            showStatus: [0, 2],
            handleClick: (row) => this.handleUpdate(row, 1),
          },
          {
            text: "禁用",
            color: "#FF6767",
            showStatus: [1],
            handleClick: (row) => this.handleUpdate(row, 2),
          },
          {
            text: "删除",
            color: "#FF6767",
            showStatus: [0],
            handleClick: this.handleDelete,
          },
        ],
      },
      mixinTableColArr: [tableColumns("1")],
    };
  },
  methods: {
    handleAddOrEdit(row = {}, web_mode_type = 0) {
      this.$refs.editDlgRef.editShow({
        ...row,
        web_mode_type, // 0-编辑，1-查看
        webEditSuccess: () => {
          this.mixinkeepTable();
        },
      });
    },
    // handleDetails({ id }) {},
    operationBtn(rItem, row) {
      return rItem.showStatus.includes(row.state);
    },
    handleUpdate({ id }) {
      putLogisticsProduct(id).then(() => {
        this.msgSuccess("更新成功");
        this.mixinkeepTable();
      });
    },
    handleDelete(row) {
      customMessageBox(
        this,
        {
          msgTitle: "删除提示",
          msgTxtColor: "#FF6767",
          httpMsgRequest: () => delLogisticsProduct(row.id),
        },
        () => {
          this.msgSuccess("删除成功");
          this.mixinkeepTable();
        }
      );
    },
    getLogisticsList(searchFrom = {}) {
      const { createTime, statusList, ...searchObj } = searchFrom;
      const [createTimeGe, createTimeLe] = createTime || [];
      this.searchFromData = {
        ...searchObj,
        createTimeGe,
        createTimeLe,
      };
      this.mixinkeepTable(true);
    },
    setSearchFormConf(tName) {
      return {
        ...this.searchFormConfig,
        lists: searchColumns(tName), // 表单渲染列表
      };
    },
    getTableQueryParams() {
      return {
        ...this.searchFromData,
        power:true
      };
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
  created() {
    this["dictionary/getDictionary"]([
      "trueOrFalse",
      "status",
      "transportMethod",
      "computeUnit",
      "logisticsBilling",
      "returnFreightType",
      "salesPriceCompareRules",
      "costPriceCompareRules",
      "logisticsProductBillingMode",
    ]).then(() => {
      this.showSearchForm = true;
    });
  },
  components: {
    EditDialog: () => import("./editDialog"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
