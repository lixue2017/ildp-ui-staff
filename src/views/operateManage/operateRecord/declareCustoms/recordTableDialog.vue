<template>
  <ComDialog
    ref="customTableDialog"
    :customDialog="customDialogConfig.addOrEdit"
    :dialogBoxCenter="true"
    :confirmClose="false"
    class="record-dig-table"
  >
    <template v-slot:content>
      <ComTabs :tabsConfig="tabsConfig">
        <template v-for="(tab, idx) in tabsConfig.tabs">
          <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
            <ComTable
              v-if="tab.name === tabsConfig.activeName"
              :ref="`recordDigTable${tab.name}`"
              :tableHeight="providerTable.tableHeight"
              :columnConfig="recordTableOpt.tabsTable[idx].columnConfig"
              :httpRequest="recordTableOpt.tabsTable[idx].httpRequest"
              :getQueryParams="providerTable.getQueryParams"
              :current-row="true"
              @onCurrentChange="(row) => onCurrentChangeEvt(row, false)"
            >
              <template v-slot:customRow="{ slotProps }">
                <template  v-if="slotProps.prop === 'rowRadio'">
                  <el-radio class="el-table-radio" v-model="tableRow.id" :label="slotProps.row.id">.</el-radio>
              </template>
                <template v-if="slotProps.prop === 'code'">
                  <div class="display-flex">
                    <span class="primary-text-btn ellipsis-text">
                      {{ slotProps.row.code || "--" }}
                    </span>
                  </div>
                </template>
                <template v-if="slotProps.prop === 'exportType'">
                  {{ slotProps.dicsList.nameCn || '--' }}
                </template>
              </template>
            </ComTable>
          </el-tab-pane>
        </template>
        <template v-if="recordTableOpt.isTabSearch" v-slot:slotTabsRight>
          <!-- suffix-icon="el-icon-search"  -->
          <el-input type="text" :placeholder="`搜索${tabsConfig.activeName === '3' ? '登记号' : '操作单'}`" size="mini"
            clearable v-model="inputVal" @change="inpChange"
          />
        </template>
      </ComTabs>
    </template>
  </ComDialog>
</template>

<script>
import { transportTableCols, otherTableCols, assemblyTableCols } from "./model";
import { getPopCusBustypeList } from "@/api/performance/record"
export default {
  props: {
    recordTableOpt: {
      // 报关与清关管理使用默认值
      type: Object,
      default: () => ({
        tabsTable: [
          {
            httpRequest: getPopCusBustypeList, // 列表接口
            columnConfig: transportTableCols,
          },
          {
            httpRequest: getPopCusBustypeList,
            columnConfig: otherTableCols,
          },
          {
            httpRequest: getPopCusBustypeList,
            columnConfig: assemblyTableCols,
          },
        ],
        recordTabs: [
          {
            label: "单票",
            name: "1",
          },
          {
            label: "整柜",
            name: "2",
          },
          {
            label: "拼柜",
            name: "3",
          },
        ],
        isTabSearch: true,
      }),
    },
  },
  components: {
    ComTabs: () => import("_comp/ComTabs"),
    ComTable: () => import("_comp/ComTable"),
    ComDialog: () => import("_comp/ComDialog"),
  },
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {
          this.onCurrentChangeEvt();
        },
        tabs: this.recordTableOpt.recordTabs,
      },
      inputVal: '',
      customDialogConfig: {
        addOrEdit: {
          width: "727px",
          useFooter: "footer",
          footer: [
            {
              text: "取消",
              plain: true,
              handleClick: () => {
                this.$refs.customTableDialog.handleClose();
              },
            },
            {
              text: "确定",
              plain: true,
              type: "primary",
              disabled: true,
              handleClick: () => {
                if (this.tableRow.id) {
                  this.$refs.customTableDialog.handleClose();
                  this.$emit("confirmBusiness", this.tableRow);
                }
              },
            },
          ],
        },
      },
      searchFromData: {},
      tableRow: {},
      providerTable: {
        tableHeight: "calc(100vh - 324px)",
        getQueryParams: this.getQueryParams,
      },
    };
  },
  created() {},
  methods: {
    inpChange(val) {
      this.$refs[
        `recordDigTable${this.tabsConfig.activeName}`
      ][0]?.refreshTable(true);
    },
    getQueryParams() {
      const { activeName } = this.tabsConfig
      return {
        ...this.searchFromData,
        [activeName === '3' ? 'registerNo' : 'operationOrderNum']: this.inputVal,
        busType: activeName - 1
      };
    },
    _recordDigShow() {
      this.$refs.customTableDialog.show();
      this.$nextTick(() => {
        // 取消选中
        this.$refs[
          `recordDigTable${this.tabsConfig.activeName}`
        ][0]?.$refs.myTable?.setCurrentRow();
        this.onCurrentChangeEvt();
        // this.$refs[`recordDigTable`].refreshTable();
      });
    },
    onCurrentChangeEvt(row = {}, isBoolean = true) {
      this.tableRow = row;
      if (row?.busType === null) {
        this.tableRow.busType = this.tabsConfig.activeName - 1
      }
      this.customDialogConfig.addOrEdit.footer[1].disabled = isBoolean;
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.record-dig-table {
  /deep/ .com-tabs .tabs-right-btn {
    top: 0;
  }
  /deep/ .el-input--medium {
    .el-input__inner {
      height: 26px;
      line-height: 26px;
    }
    .el-input__icon {
      line-height: 26px;
    }
  }
  /deep/ .el-table-radio {
    .el-radio {
      margin-left: 6px;
    }
    .el-radio__label {
      display: none;
    }
  }
}
</style>
