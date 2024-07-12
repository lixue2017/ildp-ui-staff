<template>
  <div class="app-content-container">
    <ComDetailTop
      :title="`WMS退仓入库详情`"
      :titConfig="leftTopConfig"
      :formModel="basicInfo"
      ref="detailTopRef"
      @handleClick="handleTopClick"
    >
      <template v-slot:subTitle>
        <span class="sub-title">
          {{ basicInfo.orderSn ? `(${basicInfo.orderSn})` : "" }}
        </span>
      </template>
    </ComDetailTop>

    <div class="content" v-if="isInitRes">
      <div class="order-left">
        <HeaderCard
          :formModel="basicInfo"
          :formConfig="detailCardConfig(viewDetailsSource)"
        />
        <ComForm
          :class="['detail-see-form']"
          :formConfig="{
            ...warehouseHeadConfig,
            formModel: basicInfo,
          }"
        >
        </ComForm>
        <div class="custom-tabs-btn">
          <template v-for="tItem in btnTabsList">
            <el-button
              size="small"
              plain
              :key="tItem.key"
              @click="changeTabs(tItem.key)"
              :type="tItem.key === tabsActive ? 'activation' : ''"
              >{{ tItem.label }}</el-button
            >
          </template>
        </div>
        <template>
          <!-- 基本信息 -->
          <div v-show="tabsActive === 10">
            <WmsGoodsTable :formModel="basicInfo" />
            <ComForm
              v-if="['tc_order'].includes(viewDetailsSource)"
              :class="['detail-see-form']"
              :ref="'wmsBasicFormRef' /** 父组件有调用，更换名称需同步 */"
              :formConfig="{
                ...warehouseBasicConfig,
                formModel: basicInfo,
              }"
            >
            </ComForm>
          </div>
          <!-- 应收应付 -->
          <div v-if="tabsActive === 20">
            <CostInfo
              ref="costInfoRef"
              :formModel="{
                ...basicInfo,
                billingMain:
                viewDetailsSource == 'tc_warehouse'
                    ? basicInfo.wmsBelongId //海外仓
                    : basicInfo.customerBelongId, //订单操作单
                id: basicInfo.id,
                businessType: 25,
                jobNo : basicInfo.orderSn,
                isBussiness : basicInfo.wmsBelongId == basicInfo.customerBelongId ? 1 : 0,
                warehouseComId:basicInfo.wmsBelongId,
                operationMain:basicInfo.customerBelongId
              }"
              :isWarehouse="viewDetailsSource == 'tc_warehouse' ? true : false"
            />

          </div>
          <div v-show="tabsActive==30">
            <ComLogistTrack
                ref="myLogistTrack"
                :activities="activities"
                isNoDrawer
                v-if="activities.id"
                :orderType="25"
              >
                <template v-slot:title="slotProps">
                  <span class="orange-bg"> {{ slotProps.activity.name }}</span>
                </template>
                <template v-slot:operationDate="slotProps">
                  <span> {{ slotProps.activity.trajectoryTime }}</span>
                </template>
                <template v-slot:operationContent="slotProps">
                  <span> {{ slotProps.activity.msg }}</span>
                </template>
              </ComLogistTrack>

          </div>
          <!-- 附件信息 -->
          <div v-show="tabsActive === 50">
            <ComAttachTable ref="comAttachRef" />
          </div>
        </template>
      </div>
      <div v-if="['tc_operate', 'tc_warehouse','tc_order'].includes(viewDetailsSource)">
        <!-- 操作单与仓库详情显示侧边栏 -->
        <WithdrawalSideOperationBar
          :formData="{
            ...basicInfo,
            webPageSource: viewDetailsSource,
          }"
        />
      </div>
    </div>

    <template v-if="isInitRes">
      <div class="footer-seize-seat"></div>
      <div class="order-footer">
        <!-- 订单显示底部操作按钮 -->
        <slot name="footerBtn" :btnInfo="basicInfo" />
        <el-button @click="() => reBack()">{{
          overseaLangObj.gb_close || "关 闭"
        }}</el-button>
      </div>
    </template>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { getReturnWmsOrderInfo } from "@/api/warehouse/process";
import { mixinWmsListDetails } from "./mixinListDetails.js";
import {
  detailCardConfig,
  warehouseHeadCols,
  warehouseOrderTypeCols,
} from "./model.js";
export default {
  mixins: [mixinWmsListDetails],
  props: {
    viewDetailsSource: {
      type: String,
      default: () => "",
    },
  },
  data() {
    return {
      detailCardConfig,
      basicInfo: {},
      leftTopConfig: {
        columnConfig: [],
      },
      warehouseHeadConfig: {
        labelWidth:
          this.overseaLangObj.yu_yan_lang === "en-us" ? "142px" : "92px",
        lists: warehouseHeadCols(this.viewDetailsSource),
        afterMounted: () => {
          this.$refs.comAttachRef?.setFileList(this.basicInfo.attachList || []); // 附件信息
        },
      },
      warehouseBasicConfig: {
        labelWidth: "142px",
        lists: warehouseOrderTypeCols(),
      },
      tabsActive: 10,
      btnTabsList: [
        {
          label: "基本信息",
          key: 10,
        },
        {
          label: "应收应付",
          key: 20,
        },
        {
          label: "物流轨迹",
          key: 30,
        },
        {
          label: "附件信息",
          key: 50,
        },
      ],
      isInitRes: false,
      activities: {
        title: this.overseaLangObj.logistics_trajectory || "物流轨迹",
      },
    };
  },
  methods: {
    getInitData() {
      this["dictionary/getDictionary"]([
        "returnWmsOrderState",
        "returnType",
        "returnWmsOrderPackageState",
        "packageType",
      ]).then(() => {
        this.getDetails();
      });
    },
    getDetails() {
      const { id } = this.$route.query;
      this.activities.id = id; //操作单id
      this.isInitRes = false;
      getReturnWmsOrderInfo(id).then((res) => {
        this.basicInfo = {
          // createBy: res.data.createUserName,
          ...res.data,
        };
        this.isInitRes = true;
      });
    },
    changeTabs(tKey) {
      this.tabsActive = tKey;
    },
    handleRefreshPage() {
      // 父组件调用
      this.getDetails();
    },
    handleTopClick({ type }) {
      if (type === "pre" || type === "next") {
        this.getDetails();
      }
    },
    reBack() {
      this.$refs.detailTopRef?.comReBack();
    },
  },
  created() {
    this.leftTopConfig.columnConfig = [
      // 标题左侧label，数据取值formModel
      {
        label: "创建人",
        prop: "createUserName",
      },
      {
        label: "创建时间",
        prop: "createTime",
      },
    ];
    if (["tc_order", "tc_operate"].includes(this.viewDetailsSource)) {
      this.leftTopConfig.columnConfig.push({
        label: "业务员",
        prop: "salesmanName",
      });
    }
  },
  components: {
    ComDetailTop: () => import("_comp/ComDetailTop"),
    HeaderCard: () => import("_comp/HeaderCard"),
    ComForm: () => import("_comp/ComForm"),
    WmsGoodsTable: () => import("./goodsTable"),
    ComAttachTable: () => import("_comp/ComFileTable/attachmentTable"),
    WithdrawalSideOperationBar: () =>
      import("_comp/ComOperate/views/WithdrawalSideBar.vue"),
    CostInfo: () => import("_comp/CostInfo/billings/wmsBackWarehouse.vue"),
    ComLogistTrack: () => import("_comp/ComLogistTrack"),
  },
};
</script>

<style lang="scss" scoped>
.app-content-container {
  min-height: calc(100vh - 108px);
  padding: 0 0 10px;
  .content {
    width: 100%;
    display: flex;
    .order-left {
      min-width: 900px;
      flex: 0 1 100%;
      padding: 0 20px;
    }
  }
}
</style>
