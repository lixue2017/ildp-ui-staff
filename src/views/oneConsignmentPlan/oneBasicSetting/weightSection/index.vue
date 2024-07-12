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
              <!-- <template v-slot:form-submit>
                <ComColumnConf
                  :tableCols="tableAllMixinConfig(tab.name)"
                  :tName="tab.name"
                  @setColumnConf="(arr) => setColumnMixinConf(arr)"
                />
              </template> -->
            </ComForm>
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <!-- tableMixinConfig(tab.name) -->
            <ComTable
              :ref="`tableRef${tab.name}`"
              v-if="tabsConfig.activeName === tab.name"
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="mixinTableColArr[tab.name - 1]"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="getTableQueryParams"
              :rowOperationBtnListFn="() => tableConfig.statusBtnList"
              :colShowBtnFn="operationBtn"
              @handleTableView="(r) => handleDetails(r, '0')"
            />
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
  </div>
</template>

<script>
import {
  weightSectionTempList,
  delWeightSectionTemp,
  putWeightSectionTemp,
} from "@/api/warehouse/basic";
import { mapActions, mapState } from "vuex";
import { customMessageBox } from "@/utils/confirmBox.js";
import { searchColumns, tableColumns } from "./model";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";

export default {
  name: "WeightSection",
  mixins: [mixinColsConf],
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "重量段模板",
            name: "1",
          },
        ],
        btnArr: [
          {
            table: "新增",
            showTabName: "1",
            className: "btn-type-add",
            icon: "el-icon-plus",
            handleClick: () => this.handleDetails({}),
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
        labelWidth: "100px",
      },
      tableConfig: {
        tableHeight: "calc(100vh - 264px)",
        httpRequest: weightSectionTempList,
        statusBtnList: [
          {
            text: "修改",
            showStatus: [0],
            handleClick: (row) => this.handleDetails(row),
          },
          {
            text: "复制",
            showStatus: [1, 2],
            handleClick: (row) =>
              this.handleDetails({
                ...row,
                webRowCopy: "btnCopy",
              }),
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
  created() {
    this["dictionary/getDictionary"]([
      "goodsPackType",
      "status",
      "weightSectionTempModel",
    ]).then(() => {
      this.showSearchForm = true;
    });
  },
  methods: {
    handleDetails({ id, webRowCopy }, pType = "1") {
      const idList =
        pType === "1"
          ? []
          : this.$refs[
              `tableRef${this.tabsConfig.activeName}`
            ][0].tableData.map((e) => e.id);
      this.$router.push({
        path: `/oneConsignmentPlan/oneBasicSetting/${
          pType === "1" ? "editWeightSection" : "detailWeightSection"
        }`,
        query: {
          id,
          webRowCopy,
          backPath: this.$route.path,
          pageSign: pType === "1" ? undefined : idList.join(","), // 详情显示上一页/下一页
        },
      });
    },
    operationBtn(rItem, row) {
      return rItem.showStatus.includes(row.state);
    },
    handleUpdate({ id }, status) {
      // 状态：0-草稿，1-启用，2-禁用
      putWeightSectionTemp(id).then(() => {
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
          httpMsgRequest: () => delWeightSectionTemp(row.id),
        },
        () => {
          this.msgSuccess("删除成功");
          this.mixinkeepTable();
        }
      );
    },
    getLogisticsList(searchFrom = {}) {
      const { createTime, ...searchObj } = searchFrom;
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
      return this.searchFromData;
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
