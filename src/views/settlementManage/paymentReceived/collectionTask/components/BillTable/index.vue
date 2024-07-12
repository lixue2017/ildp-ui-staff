<template>
  <div class="bill-table">
    <ComTable
      ref="billDetails"
      :columnConfig="billTable.columnConfig"
      :httpRequest="billTable.httpRequest"
      :columnData="billTable.columnData"
      :pagination="false"
			@handleTableView="handleUpdate"
    />
    <div class="grand-total">
      <span class="title">小计：</span>
      <span>{{ totalMoney }}</span>
    </div>
    <div class="enclosure-content">
			<ComAttachTable ref="attachTableRef" />
    </div>

    <div class="operate-bottom" v-if="!basicConfig.display">
      <div>
        <!-- <el-button
          class="operate-icon"
          size="small"
          type="primary"
          @click="handleAdd"
        >
          添加
        </el-button> -->
      </div>
      <div v-if="basicConfig.mType !== 'view'">
        <el-button class="operate-icon" size="small" @click="reBack">
          取消
        </el-button>
        <el-button
          class="operate-icon"
          size="small"
          type="primary"
          @click="submit"
        >
          保存
        </el-button>
      </div>
    </div>
    <AddDrawer ref="addDrawer" />
  </div>
</template>


<script>
import { mapActions, mapState } from "vuex";
import { summationConfig, billColumns } from "./model";
import { jumpPageParams } from "@/views/settlementManage/statementManage/billManage/edit/components/BillTable/model.js";
// import { settleAccountsList } from "@/api/settlementManage/statementManage";
// import { editCashier } from "@/api/settlementManage/paymentReceived";
export default {
  props: {
    basicConfig: {
      type: Object,
			default: () => {}
    },
    formConfig: {
      type: Object,
      required: true,
    },
  },
  components: {
    ComTable: () => import("_comp/ComTable"),
    AddDrawer: () => import("../AddDrawer"),
		ComAttachTable: () => import("_comp/ComFileTable/attachmentTable.vue")
  },
  computed: {
    ...mapState({
      billPageDict: (state) => state.dictionary.dicsData.billPageNo,
    }),
  },
  data() {
    return {
      isChecking: true,
      summationConfig,
      billTable: {
        // httpRequest: (formModel) => {
        //   formModel.pageSize = 999;
        //   return settleAccountsList(formModel);
        // },
        columnData: [],
        columnConfig: billColumns,
      },
      totalMoney: "",
    };
  },
  watch: {
    formConfig: {
      deep: true,
      handler: function (newVal, oldVal) {
        this.initializationData();
      },
    },
  },
  created() {
    this["dictionary/getDictionary"]("billDictionary");
    this.initializationData();
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    initializationData() {
      //初始化数据
      this.billTable.columnData = this.formConfig.formModel.costDetail;
      this.getMoneyTotal(this.formConfig.formModel.costDetail);
      setTimeout(() => {
        this.$refs.billDetails?.setNewTableData(this.billTable.columnData);
				this.$refs.attachTableRef?.setFileList(this.formConfig.formModel.attachList || [])
      });
    },
    handleAdd() {
      this.$refs.addDrawer.show();
    },
    reBack() {
			this.$emit("reBack")
    },
    submit() {
      this.$emit("submit");
    },
    getMoneyTotal(list = []) {
      let moneyArr = [];
      list.forEach((e) => {
        const curIndex = moneyArr.findIndex((m) => m.currency === e.currency);
        if (curIndex > -1) {
					// 不同类型相减
          moneyArr[curIndex].totalMoney += e.type !== this.formConfig.formModel.type ? -e.totalMoney : +e.totalMoney;
        } else {
          moneyArr.push({
            currency: e.currency,
            totalMoney: e.type !== this.formConfig.formModel.type ? -e.totalMoney : +e.totalMoney,
          });
        }
      });
      this.totalMoney = moneyArr
        .map((e) => e.totalMoney.toFixed(2) + e.currency)
        .join(" + ");
    },

		async handleUpdate(row, col) {
      const orderId=row['orderId']||undefined
      const joinOrderId=row['joinOrderId']||undefined
      if(col.cPageNoKey=='pageNo'){
        if(row[col.cPageNoKey]&&row[col.cPageNoKey]==-1&&!orderId){
          return this.$message.error("未关联单号 ，请先去关联确认");
        }else if(!row[col.cPageNoKey]||row[col.cPageNoKey]==0||!orderId){
          return this.$message.error("无法跳转");
        }
      }else if (col.cPageNoKey=='joinPageNo'){
        if(row[col.cPageNoKey]&&row[col.cPageNoKey]==-1&&!joinOrderId){
          return this.$message.error("未关联单号 ，请先去关联确认");
        }else if(!row[col.cPageNoKey]||row[col.cPageNoKey]==0||!joinOrderId){
          return this.$message.error("无法跳转");
        }
      }
      await this["dictionary/getDictionary"](["billPageNo"]);
      // console.log('billPageDict==', this.billPageDict)
      const pageObj = this.billPageDict.find((e) => e.value == row[col.cPageNoKey]);
      if (!pageObj) {
        return;
      }
			const orderType = [202, 203, '202', '203'].includes(row[col.cPageNoKey]) ? row[col.cOrderType] : undefined;
      const {nameCn:path,expandVal:activeMenu=undefined}=pageObj
      this.$router.push({
        path,
        query: {
          // id: row.toperateOrderId,
					id: row[col.cOrderIdKey],
					orderType, // 传统与其他订单详情
          backPath: this.$route.fullPath,
          activeMenu
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.bill-table {
  .title {
    margin-right: -30px;
    font-size: 14px;
    font-weight: bold;
  }
  .operate-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
  }
  .enclosure-content {
    margin-top: 10px;
  }
  .grand-total {
    display: flex;
    justify-content: flex-start;
  }
}
</style>
