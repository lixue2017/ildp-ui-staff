<template>
  <div>
    <div class="flex-space-between operation-top">
      <div class="title">操作日志</div>
      <div class="base-flex-align">
        <span class="text-info-color">时间范围：</span>
        <el-date-picker
          v-model="selectTime"
          type="datetimerange"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          size="small"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="handleChange"
        >
        </el-date-picker>
        <el-button type="primary" size="small" @click="handleExport">
          <i class="iconfont daochu"></i>
          导出
        </el-button>
      </div>
    </div>
    <ComTable
      ref="tableRef"
      :tableHeight="tableConfig.tableHeight"
      :columnConfig="tableConfig.tableColumns"
      :httpRequest="tableConfig.httpRequest"
      :getQueryParams="getQueryParams"
    >
    </ComTable>
  </div>
</template>
<script>
import {
  getOperationRecordPage,
  operationRecordExport,
} from "@/api/clueManage/contacts.js";
import {
  getOperationRecordPage as getSalesOperationRecordPage,
  operationRecordExport as clueOperationRecordExport,
} from "@/api/clueManage/salesClue.js";
import { comFileDownload } from "@/utils/download.js";
import { tableColumns } from "./model.js";
export default {
  props: {
    formData: {
      type: Object,
      default: () => ({}),
    },
    businessType: {
      type: Number,
      default: null,
    },
  },
  components: {
    ComTable: () => import("_comp/ComTable"),
  },
  data() {
    return {
      selectTime: [],
      tableConfig: {
        tableColumns,
        httpRequest:
          this.businessType === 1
            ? getSalesOperationRecordPage
            : getOperationRecordPage,
      },
    };
  },
  methods: {
    getQueryParams() {
      const [startTime, endTime] = this.selectTime || [];
      return {
        id: this.formData.id,
        startTime,
        endTime,
      };
    },
    handleChange() {
      this.$refs.tableRef.refreshTable(true);
    },
    handleExport() {
      comFileDownload(
        this,
        this.businessType === 1
          ? clueOperationRecordExport
          : operationRecordExport,
        this.getQueryParams()
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.operation-top {
  padding: 15px 0 6px;
  .title {
    font-weight: bold;
    font-size: 13px;
    color: #1f1f1f;
    line-height: 18px;
  }
  .el-date-editor {
    width: 350px;
  }
  .el-button {
    height: 28px;
    margin-left: 20px;

    i {
      font-size: 13px;
    }
  }
}
</style>
