<template>
  <div class="operation-records">
    <ComTable
      ref="tableRef"
      :columnConfig="tableConfig.tableColumns"
      :httpRequest="tableConfig.httpRequest"
    >
    </ComTable>
  </div>
</template>

<script>
import { tableColumns } from "./model";
import {
  getOperatorInfo,
  getPlatformOperatorInfo,
  getFBAOperatorInfo,
  getThirdPartyOperatorInfo,
  getClearanceOperatorInfo,
} from "@/api/common.js";
export default {
  components: {
    ComTable: () => import("_comp/ComTable"),
  },
  props: {
    type: {
      type: Number,
      default: 1, // 1:电商、传统、其他订单/操作单; 2:一件代发; 3:FBA; 4:第三方入库; 5:海外清关直派; 6:国内清关交接
    },
    id: {
      type: Number,
      default: 0,
    },
    params: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      tableConfig: {
        tableColumns,
        httpRequest: this.geList,
      },
      reqHttp: {
        1: getOperatorInfo,
        2: getPlatformOperatorInfo,
        3: getFBAOperatorInfo,
        4: getThirdPartyOperatorInfo,
        5: getClearanceOperatorInfo,
      },
    };
  },
  methods: {
    geList(formData) {
      if (!this.id) {
        return new Promise((resolve) => {
          resolve();
        });
      }
      formData.id = this.id;
      return this.reqHttp[this.type]({ ...formData, ...this.params });
    },
  },
};
</script>

<style lang="scss" scoped>
.operation-records {
  margin-top: 20px;
}
</style>
