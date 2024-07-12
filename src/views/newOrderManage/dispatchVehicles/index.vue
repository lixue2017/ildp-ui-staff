<template>
  <div class="app-container">
    <div class="top-operation">
      <div>
        <el-button type="primary" size="small" @click="handleClear"
          >约新车</el-button
        >
        <div class="select-record">
          <span>已约记录：</span>
          <el-select
            v-model="selectRecord"
            placeholder="约车记录"
            size="small"
            @change="handleChange"
          >
            <el-option
              v-for="item in recordList"
              :key="item.id"
              :label="`${item.name || '--'}(${item.phone})`"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <div
        v-if="
          currSelectData.type !== 2 &&
          (!selectRecord || currSelectData.state === 0)
        "
      >
        <el-button
          type="info"
          v-if="selectRecord"
          size="small"
          @click="handleCancel"
          >取消约车</el-button
        >
        <el-button
          type="primary"
          size="small"
          :disabled="!selectNum"
          @click="handleSubmit"
          >{{
            selectRecord ? "重新复制二维码链接" : "保存并复制链接"
          }}</el-button
        >
      </div>
    </div>
    <div class="record-title">
      <span>司机信息</span>
      <span class="record-state" v-if="selectRecord && currSelectData.id">{{
        stateObj[currSelectData.state] && stateObj[currSelectData.state].nameCn
      }}</span>
    </div>
    <ComForm
      ref="formRef"
      :formConfig="formConfig"
      :disabled="!!selectRecord"
    />
    <!-- :tableHeight="`calc(100vh - 316px)`" -->
    <ComTable
      ref="tableRef"
      :columnConfig="tableColumns(!!selectRecord)"
      :httpRequest="getTableList"
      :extraConfig="{
        tempKeyList: ['boxCount'],
      }"
      @getResult="getResult"
      @onSelectionChange="handleSelectionChange"
      :selectionTableRow="[...multipleSelection]"
      :selectionRow="selectionRowEvt"
    >
    </ComTable>
    <div class="grand-total">
      <template v-for="(tItem, i) in tableSubtotal">
        <span :key="`t_${i}`">
          <span>{{ tItem.totalLabel }}：</span>
          <span>{{ tItem.totalNum }}</span>
        </span>
      </template>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import {
  addReservationCar,
  cancelReservationCar,
  getReservationCarList,
  getReservationCarDetail,
  getOrderCarEcFreightList,
} from "@/api/order/dispatchVehicles";
import { config, tableColumns } from "./model";
import { msgBox, customMessageBox, handleCopyText } from "@/utils/confirmBox";
import { accumulationFn } from "@/utils/instructions";

export default {
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
  },
  data() {
    return {
      selectRecord: "",
      recordList: [],
      stateObj: {},
      formConfig: {
        formModel: {}, // 表单数据
        httpRequest: this.handleQRCode, // 表单提交接口
        successFunction: this.handleSuccess,
        labelWidth: "98px",
        ...config,
      },
      tableColumns,
      multipleSelection: [],
      tableSubtotal: [],
      selectNum: 0,
      qrCodePath: "",
      currSelectData: {},
    };
  },
  computed: {
    ...mapState({
      orderReservationCarState: (state) =>
        state.dictionary.dicsData.orderReservationCarState,
    }),
  },
  created() {
    this.getReservationCarList();
    this["dictionary/getDictionary"](["orderReservationCarState"]).then(() => {
      const obj = {};
      this.orderReservationCarState.forEach((item) => {
        obj[item.value] = item;
      });
      this.stateObj = obj;
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getReservationCarList(selectFirst) {
      const { orderId } = this.$route.query;
      getReservationCarList({ orderId, orderType: 2 }).then((res) => {
        this.recordList = res.rows;
        if (selectFirst) {
          const selectRecord = this.recordList[0].id;
          this.selectRecord = selectRecord;
          this.handleChange(selectRecord);
        }
      });
    },
    getTableList() {
      const { orderId } = this.$route.query;
      return getOrderCarEcFreightList({
        orderEcIds: orderId,
      });
    },
    getResult({ tableData }) {
      this.calcNumTotal(tableData);
    },
    calcNumTotal(arr = []) {
      this.tableSubtotal = [
        {
          totalLabel: "箱数",
          totalNum: accumulationFn(arr.map((e) => e.boxCount)),
        },
        {
          totalLabel: "体积小计(m³)",
          totalNum: accumulationFn(
            arr.map((e) => e.totalBoxVolume),
            3
          ),
        },
        {
          totalLabel: "毛重小计(KG)",
          totalNum: accumulationFn(
            arr.map((e) => e.totalBoxWeight),
            2
          ),
        },
      ];
    },
    handleChange(val) {
      const { orderId } = this.$route.query;
      getReservationCarDetail({ id: val, orderId }).then((res) => {
        const {
          orderReservationCarFreightList = [],
          phone,
          name,
          qrCodeAttach,
        } = res.data || {};
        this.currSelectData = res.data || {};
        this.qrCodePath = qrCodeAttach?.filePath;
        // const list = this.$refs.tableRef.getNewTableData();
        // const ids = orderReservationCarFreightList.map(
        //   (item) => item.orderFreightId
        // );
        // this.multipleSelection = list.filter((item) => ids.includes(item.id));
        this.multipleSelection = orderReservationCarFreightList;
        this.calcNumTotal(orderReservationCarFreightList);
        this.$refs.tableRef.setNewTableData(orderReservationCarFreightList);
        this.selectNum = this.multipleSelection.length;
        this.$refs.formRef.setFormModel({ phone, name });
        this.toggleRowOpnSelection(this.multipleSelection);
      });
    },
    toggleRowOpnSelection(arr) {
      this.$refs.tableRef?._toggleRowSelectionMixin({
        newCheckRows: arr,
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.selectNum = val.length;
    },
    selectionRowEvt() {
      if (this.selectRecord) return false;
      return true;
    },
    handleQRCode(formData) {
      // console.log(formData);
      const { orderId } = this.$route.query;
      const params = {
        ...formData,
        orderType: 2,
        orderIds: [orderId],
        classify: 2, // 1-客户，2-员工，3-司机
        orderReservationCarFreightList: this.multipleSelection.map((item) => ({
          orderFreightId: item.id,
          quantity: item.boxCount,
          remark: item.remark,
        })),
        state: 0,
      };
      return addReservationCar(params).catch((err) => {
        if (err && err.code === 1002) {
          msgBox(
            this,
            { title: "确认", msg: err.msg, showCancelButton: true },
            () => {
              params.confirmationState = 1;
              addReservationCar(params)
                .then((res) => this.handleSuccess(res))
                .catch((err) => {
                  this.$message.error(err.msg);
                });
            }
          );
        } else if (err.msg) {
          this.$message.error(err.msg);
        }
      });
    },
    handleSuccess(res) {
      if (res.data) {
        handleCopyText(res.data, this);
        this.handleClear();
        this.getReservationCarList(true);
      }
    },
    handleSubmit() {
      if (!this.selectRecord) {
        this.$refs.formRef.submitForm();
      } else {
        handleCopyText(this.qrCodePath, this);
      }
    },
    handleClear() {
      this.$refs.formRef.setFormModel({ phone: "", name: "" });
      this.toggleRowOpnSelection([]);
      this.selectRecord = "";
      this.multipleSelection = [];
      this.selectNum = 0;
      delete this.currSelectData.type;
      this.$refs.tableRef.refreshTable();
    },
    handleCancel() {
      customMessageBox(
        this,
        {
          msgTitle: "取消提示",
          msgTxt1: "取消不可逆",
          httpMsgRequest: () => cancelReservationCar({ id: this.selectRecord }),
        },
        () => {
          this.msgSuccess("取消约车成功");
          this.currSelectData.state = 2;
          this.getReservationCarList();
        }
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.top-operation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 30px 10px 10px;
  background: #f4f8ff;
  & > div {
    display: flex;
    align-items: center;
  }
  .select-record {
    margin-left: 40px;
    & > span {
      color: #8b8b8b;
    }
  }
}
.record-title {
  line-height: 50px;
  span {
    &:nth-child(1) {
      font-weight: bold;
      margin-right: 10px;
    }
    &.record-state {
      padding: 2px 14px;
      border-radius: 12px;
      color: #ff813d;
      background: rgba(255, 129, 61, 0.1);
    }
  }
}
/deep/ {
  .form-class {
    .el-input.is-disabled {
      .el-input__inner {
        padding: 0 15px;
        border: 1px solid #e4e7ed;
        border-radius: 4px;
      }
    }
  }
}
</style>
