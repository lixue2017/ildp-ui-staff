<template>
  <div class="app-content-container">
    <ComDetailTop
      title="批量约车编辑"
      class="title-sides-margin-none"
      :config="{}"
      ref="detailTopRef"
    />
    <ComForm v-if="isInitRes" ref="editFormRef" :formConfig="editFormConfig">
    </ComForm>

    <div v-if="isInitRes">
      <div class="base-flex-between footer-btn">
        <div class="title-txt">电商订单信息</div>
        <el-button
          type="primary"
          size="small"
          @click="addContainerEvt"
          class="add-btn"
        >
          <i class="el-icon-plus"></i>
          {{ overseaLangObj.xz_add("添 加") }}
        </el-button>
      </div>
      <ComTable
        :ref="`tableRef`"
        :columnConfig="tableConfig.columnConfig"
        :columnData="tableColumnData"
        :rowOperationBtnListFn="(row) => tableConfig.statusBtnList"
        :pagination="false"
      />
    </div>

    <template v-if="isInitRes">
      <div class="footer-seize-seat"></div>
      <div class="order-footer">
        <template v-for="(btn, index) in footBtnList">
          <el-button :type="btn.type" @click="btn.handleClick" :key="index">
            {{ btn.text }}
          </el-button>
        </template>
      </div>
    </template>

    <addDrawerOrder ref="addDrawerRef" @handleCheckClick="addTableClick" />
  </div>
</template>

<script>
import {
  addReservationCar,
  getOrderCarEcFreightList,
  getReservationCarDetail,
} from "@/api/order/dispatchVehicles";
import { mixinEditCache } from "@/views/ComMixins/editPageCache.js";
import { mapActions } from "vuex";
import { editFormColumns, editFormRules, editTableColumns } from "./model";
export default {
  name: "EditBookingTruck",
  mixins: [mixinEditCache],
  data() {
    return {
      editFormConfig: {
        formModel: {},
        httpRequest: this.editFormSubmit, // 表单提交接口
        successFunction: () => {
          this.msgSuccess("保存成功");
          this.reBack();
        }, // 表单提交成功回调
        labelWidth: "92px",
        formRules: editFormRules,
        lists: editFormColumns(),
      },
      tableConfig: {
        columnConfig: editTableColumns(),
        statusBtnList: [
          {
            text: "移除",
            handleClick: this.handleDelete,
          },
        ],
      },
      tableColumnData: [],

      footBtnList: [
        {
          text: "保 存",
          handleClick: () => {
            if (this.tableColumnData?.length) {
              this.$refs.editFormRef?.submitForm();
            } else {
              this.msgError("请添加订单信息");
            }
          },
        },
        {
          text: "取 消",
          handleClick: this.reBack,
        },
      ],

      isInitRes: false, // 是否完成初始化
      totalList: [],
      listIds: [],
    };
  },
  methods: {
    mixinInitData() {
      const { id, orderEcIds } = this.$route.query;
      this.isInitRes = false;
      if (id) {
        getReservationCarDetail({ id }).then((res) => {
          const { orderReservationCarFreightList, ...resData } = res.data || {};
          this.setBoxTableData(orderReservationCarFreightList, {
            isDetails: true,
          });
          this.editFormConfig.formModel = resData;
          this.isInitRes = true;
        });
      } else {
        this.editFormConfig.formModel = { orderIds: orderEcIds.split(",") };
        this.editFormConfig.afterMounted = () => {
          getOrderCarEcFreightList({
            orderEcIds: orderEcIds.split(","),
            pageNum: 1,
            pageSize: 99999,
          }).then((res) => {
            this.addTableClick(res.rows || []);
          });
        };
        this.isInitRes = true;
      }
    },
    editFormSubmit(sData) {
      const { id, orderIds, name, phone, remark } = sData || {};
      const opt = {
        id,
        orderIds,
        name,
        phone,
        remark,
        classify: 2, // 1-客户，2-员工，3-司机
        confirmationState: 1,
        state: 0, // 0-待预约
        type: orderIds?.length > 1 ? 2 : 1, // 1-单个预约，2-批量预约
        orderType: 2,
        orderReservationCarFreightList: this.tableColumnData.map((e) => ({
          orderFreightId: e.orderFreightId || e.id,
          quantity: e.boxCount,
          // remark: "",
        })),
      };
      return addReservationCar(opt);
    },

    addContainerEvt() {
      const { id, orderIds } = this.editFormConfig.formModel || {};
      this.$refs.addDrawerRef.show(this.tableColumnData, {
        id,
        orderEcIds: orderIds.join(","),
      });
    },
    addTableClick(arr) {
      this.tableColumnData = [...(arr || []), ...this.tableColumnData];
      this.setBoxTableData(this.tableColumnData);
    },
    setBoxTableData(arr, obj = {}) {
      this.tableColumnData = (arr || []).map((ele) => {
        let rItem = {
          ...ele,
          temp_boxCount: ele.boxCount,
        };
        if (obj?.isDetails) {
          rItem.boxCount = ele.quantity;
        }
        return rItem;
      });
      this.$refs.tableRef?.setNewTableData(this.tableColumnData);
    },
    handleDelete(row = {}) {
      const rIndex = this.tableColumnData.findIndex(
        (e) => e.temp_secondId === row.temp_secondId
      );
      if (rIndex > -1) {
        this.tableColumnData.splice(rIndex, 1);
        this.setBoxTableData(this.tableColumnData);
      }
    },
    reBack() {
      this.$refs.detailTopRef?.comReBack();
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
  created() {},
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
    addDrawerOrder: () => import("./addDrawer.vue"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-content-container {
  min-height: calc(100vh - 80px);
  .footer-btn {
    padding: 10px 0;
    .title-txt {
      font-size: 14px;
      font-weight: 600;
    }
  }
}
</style>
