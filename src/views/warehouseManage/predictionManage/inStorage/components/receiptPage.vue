<template>
  <div class="take-delivery" v-if="initRes">
    <div class="content-box">
      <ComDetailTop
        :title="overseaLangObj.dsf_rkd_sh"
        ref="detailTopRef"
        :formModel="basicFormConfig.formModel"
        :class="`title-sides-margin-none detail-top-right-none`"
        @handleClick="handleTopClick"
      >
        <template v-slot:subTitle>
          <span class="sub-title">
            ({{ basicFormConfig.formModel.orderSn || "--" }})
          </span>
        </template>
      </ComDetailTop>
      <div class="content-box-form">
        <div class="header-info">
          <ComForm class="basic-info" :formConfig="basicFormConfig" />
        </div>
        <!-- 第三方入库 WMS收货 -->
        <template v-if="modelType === 'wms'">
          <WmsReceipt :wmsObj="receiptObj[modelType]" />
        </template>
      </div>
    </div>

    <div class="order-footer">
      <el-button @click="finishStorage()" type="primary">{{overseaLangObj.receipt_completed}}</el-button>
      <el-button @click="reBack()">{{overseaLangObj.gb_close}}</el-button>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { msgBox } from "@/utils/confirmBox.js";
import {
  getThirdPartyReceiptDetails,
  putThirdPartyReceiptOk,
} from "@/api/warehouse/prediction";
import { mixinEditCache } from "@/views/ComMixins/editPageCache.js";
import { receiptFormCols } from "./rModel";

export default {
  name: "ReceiptPage",
  mixins: [mixinEditCache],
  data() {
    return {
      // isSee: false, // 查看页不可编辑
      modelType: "",
      basicFormConfig: {
        formModel: {},
        labelWidth: this.overseaLangObj.yu_yan_lang === "en-us" ? "142px" : "92px",
        lists: receiptFormCols(),
      },
      receiptObj: {},
      initRes: false,
    };
  },
  methods: {
    finishStorage() {
      const title = "提示";
      const className = "el-icon-warning text-warning";
      const msg = "是否收货完成？确认后不可修改收货数据!";
      msgBox(this, { title, className, msg, showCancelButton: true }, () => {
        const { id } = this.receiptObj[this.modelType];
        putThirdPartyReceiptOk({ id }).then(() => {
          this.msgSuccess("收货完成");
          this.reBack();
        });
      });
    },
    wmsDetails(id) {
      this.initRes = false;
      getThirdPartyReceiptDetails(id).then((res) => {
        const {
          noReceiptVOBoxList,
          noReceiptVOSkuList,
          okReceiptVOBoxList,
          okReceiptVOSkuList,
          ...nResData
        } = res.data || {};
        this.receiptObj["wms"] = {
          ...(res.data || {}),
          // isSee: this.isSee,
        };
        this.basicFormConfig.formModel = {
          ...nResData,
          warehousingSource: this.typeConversion(res.data.warehousingSource),
        };
        this.initRes = true;
      });
    },
    reBack() {
      this.$refs.detailTopRef?.comReBack();
    },
    handleTopClick({ type, id }) {
      if (type === "pre" || type === "next") {
        this.wmsDetails(id);
      }
    },
    mixinInitData() {
      this["dictionary/getDictionary"]("predictionManage").then(() => {
        const { modelType, id, isSee = false } = this.$route.query;
        this.modelType = modelType;
        // this.isSee = isSee;
        if (modelType === "wms") {
          this.wmsDetails(id);
        }
      });
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
  created() {},
  components: {
    WmsReceipt: () => import("./wmsReceipt"),
  },
};
</script>

<style lang="scss" scoped>
@import "./takeDelivery.scss";
</style>
