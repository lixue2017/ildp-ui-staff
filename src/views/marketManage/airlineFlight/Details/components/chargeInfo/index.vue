<template>
  <div class="detail-table">
    <ComTable
      ref="tableConfig"
      :tableHeight="tableConfig.tableHeight"
      :columnConfig="tableConfig.columnConfig"
      :httpRequest="tableConfig.httpRequest"
      :getQueryParams="() => getQueryParams()"
    >
      <template v-slot:customRow="{ slotProps }">
        <template v-if="slotProps.prop === 'type'">
          <span
            :style="{
              color: slotProps.dicsList && slotProps.dicsList.color,
            }"
            >{{ slotProps.dicsList.nameCn }}</span
          >
        </template>
        <template v-if="slotProps.prop === 'lockOrder'">
          <span>{{ slotProps.row.lockOrder ? "是" : "否" }}</span>
        </template>
        <template v-if="slotProps.prop === 'operation'">
          <div class="operation-content">
            <div
              class="operation-Btn"
              v-for="(item, index) in tableConfig.statusList[
                slotProps.row.isGenerateStatement || 0
              ]"
              :key="index"
            >
              <el-button
                class="operate-icon"
                size="small"
                type="text"
                @click="item.handleClick(slotProps.row)"
              >
                {{ item.text }}
              </el-button>
            </div>
          </div>
        </template>
      </template>
    </ComTable>
  </div>
</template>

<script>
import { chargeInfo, operation } from "./model";
import {
  settleAccountsList,
  deleteSettleAccounts,
} from "@/api/settlementManage/statementManage";
export default {
  props: {
    formModel: {
      type: Object,
      default: () => {
        return {
          encasementWay: 1,
          pickUpHome: false,
        };
      },
    },
    getQueryParams: {
      type: Function,
      default: () => {},
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    ComTable: () => import("_comp/ComTable"),
  },
  data() {
    let columnConfig = chargeInfo.columns;
    if (!this.disabled) {
      columnConfig = [...columnConfig, operation];
    }
    return {
      chargeInfo,
      tableConfig: {
        tableHeight: "539px",
        columnConfig: chargeInfo.columns,
        httpRequest: settleAccountsList,
        // httpRequest: getTraditionListAll,
        statusList: {
          0: [
            {
              text: "修改",
              handleClick: (row) => {
                this.$emit("handleUpdateBill", row);
              },
            },
            {
              text: "删除",
              handleClick: this.handleDelete,
            },
          ],
        },
      },
    };
  },
  methods: {
    refreshTable() {
      this.$refs.tableConfig.refreshTable(true);
    },
    handleDelete(row) {
      if (row.id) {
        deleteSettleAccounts(row.id).then(() => {
          this.$message({
            message: "删除成功",
            type: "success",
          });
          this.refreshTable();
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.detail-table {
  // margin-top: -22px;
  /deep/ .tableData .table-header-cell {
    background-color: #f8f8f8;
  }
  .title {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;

    .title-left {
      font-size: 14px;
      font-weight: bold;
      line-height: 22px;
      padding: 14px 0 11px;
      color: #515151;
    }
    .radio {
      font-size: 13px;
      .el-radio {
        margin-right: 6px;
      }
      /deep/ {
        .el-radio__label {
          padding-left: 0;
        }
      }
    }
    .checkbox {
      font-size: 13px;
      padding: 0 35px;
      /deep/ .el-checkbox__label {
        padding-left: 0;
      }
      /deep/ .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
        background-color: #5094ff;
        border-color: #5094ff;
        &::after {
          border-color: #fff;
        }
      }
    }
  }
  .pics-box {
    img {
      width: 50px;
      height: 40px;
      vertical-align: middle;
    }
  }
  .operation-content {
    display: flex;
  }
}
</style>
