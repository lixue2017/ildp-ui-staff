<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :formConfig="searchFormConfig"
              v-if="showSearchForm && tabsConfig.activeName === tab.name"
            >
            </ComForm>
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              :ref="`tableRef${tab.name}`"
              v-if="tabsConfig.activeName === tab.name"
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="tableConfig.columnConfig"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="() => tableConfig.getQueryParams()"
              :rowOperationBtnListFn="() => tableConfig.btnList"
              :colShowBtnFn="
                (btnItem, row) => btnItem.status.includes(row.state)
              "
              @handleTableView="(r) => handleTemplate('detail', r)"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'mailContent'">
                  <div
                    class="show-overflow-tooltip"
                    v-html="handleContent(slotProps.row.content || '')"
                  ></div>
                </template>
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { searchConfig, tableColumns } from "./model";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { getTemplateList } from "@/api/messageService";
import { updateMailTemplate, deleteMailTemplate } from "@/api/messageService";
import { customMessageBox } from "@/utils/confirmBox.js";
import { handleContent } from "@/utils";
export default {
  name: "Template",
  mixins: [mixinColsConf],
  data() {
    return {
      handleContent,
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "邮件模板",
            name: "1",
          },
        ],
        btnArr: [
          {
            table: "新增",
            handleClick: this.handleTemplate,
            icon: "el-icon-plus",
            className: "add-btn",
          },
        ],
      },
      searchFromData: {},
      searchFormConfig: {
        formModel: {}, // 表单数据
        fold: true, // 模糊搜索是否需要展开按钮
        searchForm: true,
        expansion: false,
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getMailTemplate(formModel);
            resolve();
          });
        }, // 表单提交接口
        labelWidth: "80px",
        ...searchConfig,
      },
      showSearchForm: false,
      tableConfig: {
        tableHeight: "calc(100vh - 264px)",
        getQueryParams: this.getQueryParams,
        httpRequest: getTemplateList,
        columnConfig: tableColumns,
        btnList: [
          {
            text: "修改",
            status: [0, 2], // 禁用添加修改测试用
            handleClick: (row) => this.handleTemplate("edit", row),
          },
          {
            text: "删除",
            status: [0, 2],
            handleClick: (row) => this.handleDelete(row),
            color: "#FF6767",
          },
          {
            text: "启用",
            status: [0, 2],
            handleClick: (row) => this.handleStatus(row, 1),
          },
          {
            text: "禁用",
            status: [1],
            handleClick: (row) => this.handleStatus(row, 2),
            color: "#FF6767",
          },
        ],
      },
    };
  },
  methods: {
    getMailTemplate(searchFrom = {}) {
      const { createTime, ...searchObj } = searchFrom;
      const [createTimeGe, createTimeLe] = createTime || [];
      this.searchFromData = {
        ...searchObj,
        createTimeGe,
        createTimeLe,
      };
      this.mixinkeepTable(true);
    },
    getQueryParams() {
      return this.searchFromData;
    },
    handleTemplate(type, row = {}) {
      const { id } = row;
      let path = "";
      switch (type) {
        case "detail":
          path = "/messageService/mailAmin/templateDetail";
          break;
        case "edit":
          path = "/messageService/mailAmin/editTemplate";
          break;
        default:
          path = "/messageService/mailAmin/addTemplate";
      }
      const idList = this.$refs[
        `tableRef${this.tabsConfig.activeName}`
      ][0]?.tableData.map((r) => r.id);
      this.$router.push({
        path,
        query: {
          id,
          backPath: this.$route.fullPath,
          pageSign: idList.join(","), // 详情显示上一页/下一页
        },
      });
    },
    handleStatus(row) {
      updateMailTemplate(row.id).then(() => {
        this.msgSuccess("操作成功");
        this.mixinkeepTable();
      });
    },
    handleDelete(row) {
      customMessageBox(
        this,
        {
          msgTitle: "删除提示",
          msgTxtColor: "#FF6767",
          httpMsgRequest: () => deleteMailTemplate(row.id),
        },
        () => {
          this.msgSuccess("删除成功");
          this.mixinkeepTable();
        }
      );
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
  created() {
    this["dictionary/getDictionary"](["status"]).then(() => {
      this.showSearchForm = true;
    });
  },
};
</script>
<style lang="scss" scoped>
/deep/.com-tabs .add-btn {
  background-color: #ff813d;
  border-color: #ff813d;
}
</style>
