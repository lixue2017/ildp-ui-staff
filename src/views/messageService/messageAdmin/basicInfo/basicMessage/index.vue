<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive v-if="mixinShowTable">
            <ComTable
              :ref="`tableRef${tab.name}`"
              v-if="tabsConfig.activeName === tab.name && showListForm"
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="tableConfig.columnConfig"
              :httpRequest="tableConfig.httpRequest"
              :spanMethod="objectSpanMethod"
              :extraConfig="{ stripe: false }"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'msgType'">
                  <span
                    :style="{
                      color: slotProps.dicsList && slotProps.dicsList.color,
                    }"
                  >
                    {{ slotProps.dicsList && slotProps.dicsList.nameCn }}
                  </span>
                </template>
                <template v-if="slotProps.prop === 'flagPush'">
                  <span
                    :style="{
                      color: slotProps.dicsList && slotProps.dicsList.color,
                    }"
                  >
                    {{ slotProps.dicsList && slotProps.dicsList.nameCn }}
                  </span>
                </template>
                <template v-if="slotProps.prop === 'operation'">
                  <div class="operation-content-btn">
                    <template v-for="(item, index) in tableConfig.btnList">
                      <el-button
                        v-if="item.status.includes(slotProps.row.flagPush)"
                        :key="index"
                        size="small"
                        type="text"
                        @click="item.handleClick(slotProps.row)"
                        >{{ item.text }}</el-button
                      >
                    </template>
                  </div>
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
import {
  tableColumns,
  mergeColumn,
  mergeColumnName,
  mergeColumnMatch,
} from "./model";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { getBaseMsgList, updateConfig } from "@/api/messageService";
import { mapActions, mapState } from "vuex";
export default {
  name: "BasicMessage",
  mixins: [mixinColsConf],
  data() {
    return {
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
            label: "基本消息",
            name: "1",
          },
        ],
        btnArr: [],
      },
      tableConfig: {
        tableHeight: "calc(100vh - 262px)",
        getQueryParams: this.getQueryParams,
        httpRequest: () => {
          return new Promise((resolve) => {
            resolve(this.getTableData());
          });
        },
        columnConfig: tableColumns,
        btnList: [
          {
            text: "推送",
            status: ["n"],
            handleClick: (row) => this.updateConfig(row, "y"),
          },
          {
            text: "取消推送",
            status: ["y"],
            handleClick: (row) => this.updateConfig(row, "n"),
          },
        ],
      },
      mergeObj: {},
      showListForm: false,
    };
  },
  created() {
    this["dictionary/getDictionary"]("messageService").then(() => {
      this.showListForm = true;
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getTableData() {
      return getBaseMsgList().then((res) => {
        const { rows } = res;
        rows.forEach((item, index) => {
          mergeColumnName.forEach((identNames, key) => {
            let name = [mergeColumn[key]];
            identNames.forEach((i) => {
              name.push(item[i]);
            });
            name = name.join("_");
            if (!this.mergeObj[name]) {
              this.mergeObj[name] = {
                index,
                num: 1,
              };
            } else {
              this.mergeObj[name].num += 1;
            }
          });
        });
        console.log(this.mergeObj);
        return res;
      });
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (mergeColumn.includes(columnIndex)) {
        const identNames = mergeColumnMatch[columnIndex];
        let name = [columnIndex];
        identNames.forEach((i) => {
          name.push(row[i]);
        });
        name = name.join("_");
        console.log(identNames, name, this.mergeObj, mergeColumnName);
        const { index, num } = this.mergeObj[name];
        if (rowIndex === index) {
          return {
            rowspan: num,
            colspan: 1,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
    },
    updateConfig(row, flagPush) {
      updateConfig({
        id: row.id,
        flagPush,
      }).then(() => {
        this.$message.success("修改成功");
        row.flagPush = flagPush;
      });
    },
  },
};
</script>