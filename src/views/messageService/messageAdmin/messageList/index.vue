<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              ref="formRef"
              :formConfig="searchFormConfig"
              v-if="tabsConfig.activeName === tab.name"
              class="searchForm"
              @handleChange="handleChange"
            >
              <template v-slot:allRead>
                <el-button type="primary" size="small" @click="handleRead"
                  >全部标记已读</el-button
                >
              </template>
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
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'msgTitle'">
                  <span
                    class="primary-text-btn"
                    @click="handleView(slotProps.row)"
                    v-if="slotProps.row.msgTitle"
                  >
                    {{ slotProps.row.msgTitle }}
                  </span>
                  <span v-else>--</span>
                </template>
                <template v-if="slotProps.prop === 'msgContent'">
                  <div
                    class="show-overflow-tooltip"
                    v-html="handleContent(slotProps.row.msgContent)"
                  ></div>
                </template>
                <template v-if="slotProps.prop === 'msgType'">
                  <span
                    :style="{
                      color: slotProps.dicsList && slotProps.dicsList.color,
                    }"
                  >
                    {{ slotProps.dicsList && slotProps.dicsList.nameCn }}
                  </span>
                </template>
                <template v-if="slotProps.prop === 'flagRead'">
                  <span>
                    <i
                      class="status-dot"
                      :style="{
                        backgroundColor:
                          slotProps.dicsList && slotProps.dicsList.color,
                      }"
                    ></i>
                    {{ slotProps.dicsList && slotProps.dicsList.nameCn }}
                  </span>
                </template>
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
    <RemindDialog ref="remindDialog" />
  </div>
</template>

<script>
import { searchConfig, tableColumns } from "./model";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { getMsgRecordList, updateMsgInfo } from "@/api/messageService";
import { handleContent } from "@/utils";
import { mapGetters } from "vuex";
export default {
  name: "MessageList",
  mixins: [mixinColsConf],
  components: {
    RemindDialog: () => import("./components/RemindDialog"),
  },
  data() {
    return {
      handleContent,
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {
          this.$nextTick(() => {
            this.mixinkeepTable();
          });
        },
        tabs: [
          {
            label: "消息列表",
            name: "1",
          },
        ],
        btnArr: [],
      },
      searchFromData: {
        flagReadList: ["y", "n"],
        msgTypeList: ["1", "2"],
        todoHandledList: ["0", "1"],
      },
      searchFormConfig: {
        formModel: {
          flagReadList: ["y", "n"],
          msgTypeList: ["1", "2"],
          todoHandledList: ["0", "1"],
        }, // 表单数据
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getMessageRecord(formModel);
            resolve();
          });
        }, // 表单提交接口
        size: "small",
        labelWidth: "87px",
        formRules: {}, // 表单校验规则
        ...searchConfig(true),
      },
      tableConfig: {
        tableHeight: "calc(100vh - 270px)",
        getQueryParams: this.getQueryParams,
        httpRequest: getMsgRecordList,
        columnConfig: tableColumns,
      },
    };
  },
  computed: {
    ...mapGetters(["unreadCount", "userId"]),
  },
  watch: {
    unreadCount(newVal, oldVal) {
      if (oldVal !== undefined) {
        this.mixinkeepTable(true);
      }
    },
    $route(to, from) {
      // 重新
      if (to.name === "MessageList") {
        this.handleInitParam();
      }
    },
  },
  created() {
    this.handleInitParam();
  },
  methods: {
    handleInitParam() {
      const { isTodo } = this.$route.params;
      const searchFromData = {
        flagReadList: ["y", "n"],
        msgTypeList: ["1", "2"],
        todoHandledList: ["0", "1"],
      };
      if (isTodo) {
        searchFromData.msgTypeList = ["2"];
        searchFromData.todoHandledList = ["0"];
        this.searchFormConfig.formModel = searchFromData;
        this.searchFromData = searchFromData;
        this.$refs.formRef &&
          this.$refs.formRef[0].setFormModel(searchFromData);
      }
    },
    getMessageRecord(searchFrom = {}) {
      if (searchFrom.msgTypeList != this.searchFromData.msgTypeList) {
        if (searchFrom.msgTypeList.includes("2")) {
          this.searchFormConfig = {
            ...this.searchFormConfig,
            ...searchConfig(true),
          };
          this.isTodo = true;
        } else {
          this.searchFormConfig = {
            ...this.searchFormConfig,
            ...searchConfig(false),
          };
          this.isTodo = false;
        }
        setTimeout(() => {
          this.$refs.formRef[0].getFormModel();
        });
      }
      this.searchFromData = {
        ...searchFrom,
      };
      this.mixinkeepTable(true);
    },
    getQueryParams() {
      const param = {};
      for (let key in this.searchFromData) {
        this.searchFromData[key] && (param[key] = this.searchFromData[key]);
      }
      if (!this.isTodo && param.todoHandledList) {
        delete param.todoHandledList;
      }
      return { ...param, receiveId: this.userId };
    },
    handleChange() {
      this.$refs.formRef[0].submitForm();
    },
    handleRead() {
      const idList = this.$refs[
        `tableRef${this.tabsConfig.activeName}`
      ][0].tableData
        .filter((item) => item.id && item.flagRead === "n")
        .map((item) => item.id);
      updateMsgInfo({
        idList,
        flagRead: "y",
        actionType: "R",
      }).then(() => {
        this.lists = [];
        this.$message.success("本页已标志为已读！");
        this.mixinkeepTable(true);
      });
    },
    handleView(row) {
      if (row.flagRead !== "y") {
        this.comRepeatedRequest(this, updateMsgInfo, {
          idList: [row.id],
          flagRead: "y",
          actionType: "R",
        }).then(() => {
          row.flagRead = "y";
        });
      }
      this.$refs.remindDialog.show(row);
    },
  },
};
</script>

<style lang="scss" scoped>
.searchForm {
  /deep/ {
    .el-checkbox {
      background: #fff;
      border-radius: 4px;
      border: 1px solid #8b8b8b;
      padding: 0 18px;
      color: #8b8b8b;
      height: 30px;
      line-height: 30px;

      &.is-checked {
        border-color: #5094ff;
        background: rgba(80, 148, 255, 0.1);
        color: #5094ff;
      }
      .el-checkbox__label {
        padding-left: 5px;
      }
    }
    .width-330 {
      width: 330px;
    }
    .el-col.flex-1 {
      min-width: calc(100% - 990px);
      flex: 1;
      text-align: right;
    }
  }
}
</style>