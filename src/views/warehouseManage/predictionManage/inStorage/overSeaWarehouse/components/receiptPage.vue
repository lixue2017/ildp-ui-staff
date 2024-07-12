<template>
  <div class="app-container" v-if="showSearchForm">
    <ComDetailTop
      :title="overseaLangObj.hw_rc_sh"
      :formModel="searchFormConfig.formModel"
      ref="detailTopRef"
      @handleClick="handleTopClick"
    >
      <template v-slot:subTitle>
        <span class="sub-title">
          {{
            searchFormConfig.formModel.jobNo
              ? `(${searchFormConfig.formModel.jobNo})`
              : ""
          }}
        </span>
      </template>
    </ComDetailTop>
    <HeadCard
      :formModel="searchFormConfig.formModel"
      :formConfig="cardConfig"
    />
    <ComForm
      ref="searchTabForm"
      :formConfig="searchFormConfig"
      v-if="showSearchForm"
    >
      <template v-slot:warehouseSourceName="slotProps">
        <div class="form-tags">
          <div
            v-for="(item, index) in slotProps.formModel.warehouseSourceArr ||
            []"
            :key="index"
          >
            <el-tag
              size="small"
              :effect="getOrderTypes(item).effect"
            >
              {{ getOrderTypes(item).key }}
            </el-tag>
          </div>
          <!-- <template
            v-for="(item, index) in slotProps.formModel.warehouseSourceArr"
          >
            <span :key="index">{{ getOrderTypes(item) }}</span>
          </template> -->
        </div>
      </template>
    </ComForm>
    <TakeOver
      :formModel="{
        ...searchFormConfig.formModel,
        menuType: 'overSeaWarehouse',
      }"
      v-if="showSearchForm"
    />

    <template v-if="showSearchForm">
      <div class="footer-seize-seat"></div>
      <div class="order-footer">
        <template v-for="(btn, index) in getFootBtn()">
          <el-button :type="btn.type" @click="btn.handleClick" :key="index">
            <!-- v-hasPermi="btn.hasPermission" -->
            {{ btn.text }}
          </el-button>
        </template>
      </div>
    </template>
    <!-- <div class="take-delivery">
      <div class="content-box">
        <div class="content-box-form">
          <template>
            <WmsReceipt :wmsObj="searchFormConfig.formModel" />
          </template>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { cardConfig, searchForm } from "./model.js";
import {
  getWarehouseClearanceInfo,
  getClearancePrectionWeightAndVolume,
  postReceiptOk,
} from "@/api/warehouse/prediction.js";
import { msgBox } from "@/utils/confirmBox.js";
export default {
  components: {
    ComTabs: () => import("_comp/ComTabs"),
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
    HeadCard: () =>
      import(
        "@/views/settlementManage/paymentReceived/invoice/components/headCard.vue"
      ),
    // WmsReceipt: () =>
    //   import(
    //     "@/views/warehouseManage/predictionManage/inStorage/components/wmsReceipt/index.vue"
    //   ),
    TakeOver: () =>
      import(
        "@/views/warehouseManage/predictionManage/inStorage/components/takeOver/index.vue"
      ), //收货
  },
  data() {
    return {
      cardConfig,
      showSearchForm: false,
      searchFormConfig: {
        formModel: {},
        httpRequest: this.submitFormRequest, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        labelWidth: this.overseaLangObj.yu_yan_lang === "en-us" ? "142px" : "80px",
        lists: searchForm,
      },
      footBtn: [
        {
          text: this.overseaLangObj.receipt_completed,
          handleClick: this.handleSubmit,
          btnType: [4],
        },
        {
          text: this.overseaLangObj.gb_close,
          handleClick: this.reBack,
        },
      ],
    };
  },
  computed: {
    ...mapState({
      warehousingSource: (state) => {
        return state.dictionary.dicsData.warehousingSource;
      },
    }),
  },
  created() {
    const { id } = this.$route.query;
    this["dictionary/getDictionary"]("predictionManage").then(() => {
      if (id) {
        this.getDetailsData(id);
      } else {
        this.showSearchForm = true;
      }
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getDetailsData(id) {
      this.showSearchForm = false;
      Promise.all([
        getWarehouseClearanceInfo(id), //查详情
        getClearancePrectionWeightAndVolume(id), //查体积重量
      ]).then(([resDetail, resVolWei]) => {
        // const { id } = resDetail.data;
        const { warehouseOrderDetailVo, ...Obj } = resDetail.data;
        const { id, warehouseSource, ...nWarehouseOrderDetail } =
          warehouseOrderDetailVo;
        this.searchFormConfig.formModel = {
          ...Obj,
          ...nWarehouseOrderDetail,
          ...resVolWei.data,
          warehouseSourceArr: warehouseSource
            ? warehouseSource.split(",")
            : undefined,
          warehouseOrder: id,
        };
        this.showSearchForm = true;
      });
    },
    handleSubmit() {
      const title = "提示";
      const className = "el-icon-warning text-warning";
      const msg = "是否收货完成？确认后不可修改收货数据!";
      msgBox(this, { title, className, msg, showCancelButton: true }, () => {
        const { id } = this.$route.query;
        this.comRepeatedRequest(this, postReceiptOk, {
          id,
        }).then((res) => {
          this.reBack();
        });
      });
    },
    reBack() {
      this.$refs.detailTopRef?.comReBack();
    },
    handleTopClick({ type, id }) {
      if (type === "pre" || type === "next") {
        this.getDetailsData(id);
      }
    },
    getFootBtn() {
      const { warehouseStatus } = this.searchFormConfig.formModel;
      const bottomBtn = this.footBtn
        .map((e) => {
          const { btnType } = e;
          if (btnType) {
            if (btnType.includes(warehouseStatus)) {
              return e;
            }
          } else {
            return e;
          }
        })
        .filter((e) => e);
      return bottomBtn;
    },
    getOrderTypes(row) {
      const tags = this.warehousingSource.filter((e) => e.value == row);
      const tag = tags.length > 0 ? tags[0] : {};
      return {
        key: tag.nameCn,
        effect: tag.value == 3 ? "plain" : "dark",
      };
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/views/warehouseManage/predictionManage/inStorage/components/takeDelivery.scss";
.app-container {
  .com-detail-top {
    margin: 0 0px 15px;
  }
  .form-tags {
    display: flex;
    div {
      &:not(:first-child) {
        margin-left: 5px;
      }
    }
  }
}
</style>
