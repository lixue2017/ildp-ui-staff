<template>
  <div class="app-container" v-if="showSearchForm">
    <!-- 目前只有水单认领列表，水单收付款列表会跳转到这个页面 -->
    <ComDetailTop
      :title="/*水单详情*/ `水单信息`"
      ref="detailTopRef"
      :formModel="formConfig.formModel"
      class="title-sides-margin-none"
      @handleClick="handleTopClick"
    >
      <template v-slot:subTitle>
        <span class="sub-title">
          {{
            formConfig.formModel.serialCode
              ? `(${formConfig.formModel.serialCode})`
              : ""
          }}
        </span>
      </template>
    </ComDetailTop>
    <WaterComForm
      :WEBType="'detail'"
      :formData="formConfig.formModel"
      v-if="showSearchForm"
    />
    <WaterComTable
      :WEBType="'detail'"
      :formData="formConfig.formModel"
      v-if="showSearchForm"
    />
    <div
      class="water-attach"
      v-if="
        showSearchForm &&
        formConfig.formModel.picUrl &&
        formConfig.formModel.picUrl.length
      "
    >
      <div class="title">水单附件</div>
      <div class="custom-preview-image">
        <template v-for="(item, index) in formConfig.formModel.picUrl">
          <el-image
            v-if="item"
            :src="item"
            :key="index"
            :preview-src-list="formConfig.formModel.picUrl"
          >
          </el-image>
        </template>
      </div>
    </div>
    <div>
      <div class="footer-seize-seat"></div>
      <div class="order-footer">
        <template v-for="(btn, index) in statusList">
          <el-button :type="btn.type" @click="btn.handleClick" :key="index">
            {{ btn.text }}
          </el-button>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { comFormConfig } from "./model.js";
import {
  getWaterBillDetail,
  getApplyInvoice,
} from "@/api/settlementManage/paymentReceived.js";
export default {
  components: {
    WaterComForm: () => import("./components/comForm"),
    WaterComTable: () => import("./components/comTable"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
  },
  data() {
    const { lists, formRules } = comFormConfig();
    return {
      formConfig: {
        formModel: {}, // 表单数据
        httpRequest: this.handleRequest,
        size: "small",
        labelWidth: "110px",
        lists,
        formRules,
      },
      statusList: [
        {
          text: "取 消",
          plain: true,
          handleClick: () => {
            this.reBack();
          },
        },
      ],
      showSearchForm: false,
    };
  },
  created() {
    const { id } = this.$route.query;
    this["dictionary/getDictionary"]("billDictionary").then(() => {
      this.getDeatilData({ id });
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary", "tagsView/delView"]),
    handleTopClick({ type, id }) {
      if (type === "pre" || type === "next") {
        this.showSearchForm = false;
        this.getDeatilData({ id });
      }
    },
    handleRequest() {},
    getDeatilData(row = {}) {
      const { id } = row;
      Promise.all([
        getWaterBillDetail(id),
        getApplyInvoice({ bankReceiptId: id }),
      ]).then(([res, applyInvoice]) => {
        const { money, moneyInfo, ...obj } = res.data || {};
        this.formConfig.formModel = {
          ...obj,
          ...applyInvoice.data,
          money,
          moneyInfo,
          moneyRemain:
            moneyInfo || moneyInfo == 0 ? moneyInfo.moneyRemain : money,
          picUrl:
            obj.attachList && obj.attachList.length
              ? obj.attachList.map((item) => item.filePath)
              : [],
        };
        this.showSearchForm = true;
      });
    },
    reBack() {
      this.$refs.detailTopRef?.comReBack();
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-container {
  .com-detail-top {
    padding-top: 0px;
  }
  .content-bsAccountInfo {
    width: 100%;
    background: #f8f8f8;
    border-radius: 4px;
    border: 1px solid #d9d9d9;
    padding: 10px 20px;
    .title {
      font-size: 14px;
      font-weight: bold;
      color: #515151;
    }
    .content {
      display: flex;
      flex-direction: column;
      padding-left: 27px;
      font-size: 13px;
      font-weight: 400;
      .content-label {
        color: #8b8b8b;
      }
      .content-value {
        color: #515151;
      }
    }
  }
  .water-attach {
    .title {
      font-size: 14px;
      font-weight: bold;
      padding: 14px 0;
    }
  }
}
</style>
