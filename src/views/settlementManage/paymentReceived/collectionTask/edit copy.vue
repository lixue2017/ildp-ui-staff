<template>
  <div class="payment-info">
    <div class="content" v-if="isInitRes">
      <ComDetailTop
        :title="`收款信息(${basicInfoConfig.formModel.serialCode || '--'})`"
        ref="detailTopRef"
        :formModel="basicInfoConfig.formModel"
        @handleClick="handleTopClick"
      />

      <div class="top-content">
        <ComForm
          class="left-info"
          ref="basicInfoForm"
          :formConfig="basicInfoConfig"
        />
        <div class="right-info">
          <div class="pay-amount">
            <span class="label">预计剩余付款金额：</span>
            <span>
              {{ basicInfoConfig.formModel.surplusMoney || "--" }}
            </span>
            <span class="units">{{ basicInfoConfig.formModel.currency }}</span>
          </div>
          <div class="amount-list">
            <div
              class="list"
              v-for="(item, index) in basicInfoConfig.formModel.cashierInfo ||
              []"
              :key="index"
            >
              <div class="units">
                {{ item.name }}
                <span v-if="item.type" class="mark">{{ item.type }}</span>
              </div>
              <div class="value">{{ toFixedNum(item.totalMoney) }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="middle-content">
        <div class="content-left">
          <ComForm
            class="left-info"
            ref="basicInfoForm"
            :formConfig="brieflyConfig"
          />
        </div>
        <div class="content-right">
          <!-- <el-button @click="voucher">收款凭证</el-button> -->
          <PreviewOrDownload
            btnTxt="收款凭证"
            :btnConf="{
              size: 'medium',
            }"
            :previewDownloadConf="
              previewDownloadConfig(brieflyConfig.formModel.id)
            "
            class="preview-download"
            v-if="brieflyConfig.formModel.status === 4"
          />
          <el-button @click="openRecord">收款记录</el-button>
        </div>
      </div>
      <BillTable
        :basicConfig="{
          display: false,
          mType: $route.query.type,
        }"
        :formConfig="basicInfoConfig"
        @submit="submit"
        @reBack="() => handleClick('reBack')"
      />
    </div>
    <PaymentDrawer ref="PaymentDrawer" :formModel="basicInfoConfig" />
    <div class="order-footer">
      <template v-for="(btn, index) in getFooterBtn()">
        <el-button :type="btn.type" @click="handleClick(btn.type)" :key="index">
          {{ btn.text }}
        </el-button>
      </template>
    </div>
    <WaterBillDialog ref="waterBillDialog" @handleSuccess="keepTableList" />
  </div>
</template>
<script>
import { basicInfoConfig } from "./editModel";
import { mapActions, mapState } from "vuex";
import { comFileDownload } from "@/utils/download.js";
import {
  getCashierInfo,
  editCashier,
  settleCashierPreview,
} from "@/api/settlementManage/paymentReceived";

export default {
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    BillTable: () => import("./components/BillTable"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
    PaymentDrawer: () =>
      import(
        "@/views/settlementManage/paymentReceived/taskList/components/paymentDrawer/index"
      ),
    WaterBillDialog: () => import("./components/EditDialog/index"),
    PreviewOrDownload: () => import("_comp/ComFileTable/previewOrDownload.vue"),
  },
  data() {
    const formConfig = {
      formModel: {},
      httpRequest: this.submitData, // 表单提交接口
      successFunction: () => {}, // 表单提交成功回调
      size: "small",
      labelWidth: "90px",
      formRules: {}, // 表单校验规则
      visibleAll: true,
    };
    return {
      basicInfoConfig: {
        ...formConfig,
        lists: basicInfoConfig.lists,
      },
      brieflyConfig: {
        ...formConfig,
        lists: basicInfoConfig.brieflyList,
      },
      isInitRes: false,
      statusList: [
        {
          text: "收款确认",
          statusArr: [2],
          type: "Collection",
        },
        {
          text: "财务核销",
          statusArr: [3],
          type: "Verification",
        },
        {
          text: "关闭",
          statusArr: [],
          isBtnAll: true,
          type: "reBack",
        },
      ],
    };
  },
  created() {
    this["dictionary/getDictionary"]("billDictionary").then(() => {
      const { id, type } = this.$route.query;
      if (type === "view") {
        this.basicInfoConfig.lists = basicInfoConfig.detailsList;
      } else if (type === "payment") {
        this.basicInfoConfig.lists = basicInfoConfig.lists;
      }
      if (id) {
        this.getCashierInfo(id);
      }
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    previewDownloadConfig() {
      const { id } = this.$route.query;
      return {
        previewParam: {
          id,
        },
        previewHttp: settleCashierPreview,
      };
    },
    getCashierInfo(id) {
      this.isInitRes = false;
      getCashierInfo(id).then((res) => {
        const fModel = res.data;
        this.basicInfoConfig.formModel = {
          ...fModel,
          // createBy: fModel.taskByName,
          // createTime: fModel.taskCreateTime,
        };
        this.brieflyConfig.formModel = fModel;
        this.isInitRes = true;
      });
    },
    submit() {
      this.$refs.basicInfoForm.submitForm();
    },
    submitData(rows) {
      //付款登记修改
      var params = {
        id: this.$route.query ? JSON.parse(this.$route.query.id) : "", //id
        latestPaymentDate: rows.latestPaymentDate, //最迟付款日(yyyy-MM-dd)
        payCashier: rows.payCashier, //付款出纳
        totalCashier: rows.totalCashier, //费用出纳
        cashierBy: rows.cashierBy, //销账人
        checkNo: rows.checkNo, //发票号
        financialRemark: rows.remark, //财务备注
      };
      editCashier(params).then((res) => {
        this.$router.push("/settlementManagement/paymentReceived/taskList");
      });
    },
    openRecord() {
      const { statementsId } = this.basicInfoConfig.formModel;
      this.$refs.PaymentDrawer.show(statementsId, "collection");
    },
    getFooterBtn() {
      const { status } = this.basicInfoConfig.formModel;
      return this.statusList.filter(
        (e) => e.statusArr?.includes(status) || e.isBtnAll
      );
    },
    keepTableList() {
      const { id } = this.$route.query;
      this.getCashierInfo(id);
    },
    handleTopClick({ type, id }) {
      if (type === "pre" || type === "next") {
        this.getCashierInfo(id);
      }
    },
    voucher() {
      const { id } = this.$route.query;
      comFileDownload(this, settleCashierPreview, { id });
    },
    handleClick(type) {
      switch (type) {
        //Collection 收款确认    Verification财务核销    reBack返回
        case "Collection":
          this.$refs.waterBillDialog.show(this.basicInfoConfig.formModel, type);
          break;
        case "Verification":
          this.$refs.waterBillDialog.show(this.basicInfoConfig.formModel, type);
          break;
        case "reBack":
          this.$refs.detailTopRef?.comReBack();
          break;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.payment-info {
  background: #f9f9f9;
  padding: 11px 0 20px;
  font-size: 14px;
  /deep/ {
    .el-form-item {
      margin-bottom: 20px;
    }
    .remark-info {
      margin-bottom: 0;
    }
  }
  .content {
    padding: 15px 20px 30px;
    min-height: calc(100vh - 108px);
    margin: 10px 10px 100px;
    background: #fff;
    .title {
      font-weight: bold;
      color: #515151;
      margin-bottom: 15px;
    }
    .top-content {
      display: flex;
      margin-bottom: 20px;
      .left-info {
        width: 50%;
        padding-right: 20px;
      }
      .right-info {
        width: 50%;
        padding-left: 20px;
        border-left: 1px solid #e2e2e2;
        .pay-amount {
          width: 100%;
          padding-left: 35px;
          height: 35px;
          line-height: 35px;
          background: rgba(80, 148, 255, 0.05);
          box-shadow: 0px 0px 3px 0px rgba(20, 69, 147, 0.25);
          border-radius: 20px;
          .label {
            font-size: 13px;
            color: #8b8b8b;
          }
          .units {
            margin: 0 20px;
          }
        }
        .amount-list {
          .list {
            width: 170px;
            height: 72px;
            padding-left: 13px;
            background: rgba(188, 188, 188, 0.1);
            border-radius: 4px;
            border: 1px solid rgba(188, 188, 188, 0.5);
            display: flex;
            flex-direction: column;
            justify-content: center;
            float: left;
            margin-left: 18px;
            margin-top: 20px;
            color: #515151;
            font-size: 13px;
            .value {
              margin-top: 9px;
            }
            .units {
              .mark {
                font-size: 12px;
                color: #66a5ff;
                background: rgba(102, 165, 255, 0.1);
                border-radius: 12px;
                padding: 0 12px;
              }
            }
          }
          .list:nth-of-type(1),
          .list:nth-of-type(4) {
            margin-left: 0;
          }
        }
      }
    }
    .middle-content {
      display: flex;
      justify-content: space-between;
      .content-left {
        width: 90%;
      }
      .content-right {
        width: 20%;
        text-align: right;
        .preview-download {
          margin-right: 10px;
        }
      }
    }
  }
}
</style>
