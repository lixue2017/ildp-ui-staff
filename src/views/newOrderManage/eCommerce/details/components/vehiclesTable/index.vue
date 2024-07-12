<template>
  <div>
    <ComTable
      class="goods-table"
      ref="tableRef"
      :columnConfig="reservationTable.columns"
      :httpRequest="getList"
      :pagination="false"
      @getResult="getTableResult"
    >
      <template v-slot:customRow="{ slotProps }">
        <template v-if="slotProps.prop === 'record'">
          <span
            class="primary-text-btn"
            @click="handleRecordView(slotProps.row)"
            v-if="slotProps.row.id"
          >
            查看
          </span>
          <span v-else>--</span>
        </template>
      </template>
    </ComTable>
    <div class="grand-total">
      <span class="grand-title">合计：</span>
      <span>
        <span class="label">件数总数：</span>
        <span class="value"> {{ grandTotalNum ? grandTotalNum : "--" }}</span>
      </span>
    </div>
  </div>
</template>

<script>
import { reservationTable } from "./model";
import { msgBox } from "@/utils/confirmBox";
import {
  getReservationWarehousingList,
  getVehicleTrafficRecord,
} from "@/api/order/dispatchVehicles.js";
export default {
  props: {
    formData: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    ComTable: () => import("_comp/ComTable"),
  },
  data() {
    return {
      reservationTable,
      grandTotalNum: "",
    };
  },
  methods: {
    getList() {
      console.log(this.formData);
      const { orderId, orderType } = this.formData || {};
      return getReservationWarehousingList({ orderId, orderType });
    },
    getTableResult({ tableData }) {
      if (tableData.length) {
        let totalNum = 0;
        tableData.forEach((item) => {
          totalNum += item.totalQuantity;
        });
        this.grandTotalNum = this.toFixedNum(totalNum, 0);
      }
    },
    handleRecordView(row) {
      getVehicleTrafficRecord({
        orderReservationWarehousingId: row.id,
      }).then((res) => {
        const title = "车辆运输记录";
        let html = "";
        res.rows.forEach((item) => {
          html += `<div class="record-list"><div>${item.step}:</div><div>${item.auditTime}</div></div>`;
        });
        if (!html) {
          html = '<div class="no-data">暂无运输记录</div>';
        }
        const cancelButtonText = "关闭";
        msgBox(
          this,
          {
            customClass: "vehicleTraffic-record-box",
            title,
            html,
            cancelButtonText,
            showConfirmButton: false,
            showCancelButton: true,
          },
          () => {
            // this.msgSuccess("数据保存成功");
          }
        );
      });
    },
  },
};
</script>
<style lang="scss">
.vehicleTraffic-record-box {
  width: 325px;
  padding: 0;
  .el-message-box__header {
    font-size: 14px;
    height: 50px;
    padding: 15px 0 15px 21px;
    background: #f4f4f4;

    .el-message-box__title {
      font-size: 14px;
      font-weight: bold;
      line-height: 20px;
    }
    .el-message-box__close {
      font-size: 21px;
    }
  }
  .el-message-box__content {
    padding: 15px 60px 13px;

    .record-list {
      font-size: 12px;
      line-height: 32px;
      display: flex;
      align-items: center;
      div {
        &:nth-child(1) {
          width: 100px;
        }
      }
    }
    .no-data {
      font-size: 12px;
      line-height: 32px;
      color: #8b8b8b;
      text-align: center;
    }
  }
  .el-message-box__btns {
    padding: 15px;
    background: #f4f4f4;
  }
}
</style>
<style lang="scss" scoped>
.goods-table {
  margin-top: 20px;
}
</style>
