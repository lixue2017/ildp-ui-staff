<template>
  <div class="app-content-container">
    <ComDetailTop
      :title="`WMS退仓包裹详情`"
      :formModel="basicInfo"
      ref="detailTopRef"
      @handleClick="handleTopClick"
    >
      <template v-slot:subTitle>
        <span class="sub-title">
          {{ `(海外仓)` }}
        </span>
      </template>
    </ComDetailTop>

    <div class="content" v-if="isInitRes">
      <div class="order-left">
        <HeaderCard
          :formModel="basicInfo"
          :formConfig="detailCardConfig('tc_warehouse')"
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
            <!-- <WmsGoodsTable :formModel="basicInfo" /> -->
            <ComTable
              :columnData="basicInfo.items || []"
              :columnConfig="packageTableCols()"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'tagSlot'">
                  <div class="new-tag" v-if="slotProps.row.toBeConfirmed">
                    新
                  </div>
                </template>
              </template>
              <template v-slot:bottomTotal>
                <div class="grand-total">
                  <!-- <span>合计：</span> -->
                  <template v-for="(tItem, i) in tableSubtotal">
                    <span :key="`t_${i}`">
                      <span>{{ tItem.totalLabel }}：</span>
                      <span>{{ tItem.totalNum }}</span>
                    </span>
                  </template>
                </div>
              </template>
            </ComTable>
          </div>
          <!-- 附件信息 -->
          <div v-show="tabsActive === 50">
            <ComAttachTable ref="comAttachRef" />
          </div>
        </template>
      </div>
    </div>

    <template v-if="isInitRes">
      <div class="footer-seize-seat"></div>
      <div class="order-footer">
        <el-button @click="() => reBack()">{{
          overseaLangObj.gb_close || "关 闭"
        }}</el-button>
      </div>
    </template>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { getReturnWmsPackageInfo } from "@/api/warehouse/process";
import { mixinEditCache } from "@/views/ComMixins/editPageCache.js";
import { multiplicationFn, accumulationFn } from "@/utils/instructions";
import { detailCardConfig } from "../components/model.js";
import { packageHeadCols, packageTableCols } from "./model.js";
export default {
  name: "WmsWithdrawalPackageDetails",
  mixins: [mixinEditCache],
  data() {
    return {
      detailCardConfig,
      packageTableCols,
      basicInfo: {},
      warehouseHeadConfig: {
        labelWidth:
          this.overseaLangObj.yu_yan_lang === "en-us" ? "142px" : "92px",
        lists: packageHeadCols(),
        afterMounted: () => {
          this.$refs.comAttachRef?.setFileList(this.basicInfo.attachList || []); // 附件信息
        },
      },
      tabsActive: 10,
      btnTabsList: [
        {
          label: "基本信息",
          key: 10,
        },
        {
          label: "附件信息",
          key: 50,
        },
      ],
      tableSubtotal: [],
      isInitRes: false,
    };
  },
  methods: {
    mixinInitData() {
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
      this.isInitRes = false;
      getReturnWmsPackageInfo(id).then((res) => {
        this.basicInfo = {
          createBy: res.data.createUserName,
          ...res.data,
        };
        this.calcNumTotal(res.data.items || []);
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
    calcNumTotal(arr = []) {
      let rowNumTotal = [];
      let takeNumTotal = [];
      let rowWeightTotal = [];
      arr.forEach((i) => {
        rowNumTotal.push(i.num);
        takeNumTotal.push(i.takeNum);
        rowWeightTotal.push(multiplicationFn([i.num, i.singleWeight]));
      });
      this.tableSubtotal = [
        {
          totalLabel: "SKU类数",
          totalNum: arr.length,
        },
        {
          totalLabel: "SKU预报总数",
          totalNum: accumulationFn(rowNumTotal),
        },
        {
          totalLabel: "SKU实收总数",
          totalNum: accumulationFn(takeNumTotal),
        },
        {
          totalLabel: "总重量(KG)",
          totalNum: accumulationFn(rowWeightTotal, 2),
        },
      ];
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
  components: {
    ComDetailTop: () => import("_comp/ComDetailTop"),
    HeaderCard: () => import("_comp/HeaderCard"),
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    WmsGoodsTable: () => import("../components/goodsTable"),
    ComAttachTable: () => import("_comp/ComFileTable/attachmentTable"),
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
  .new-tag {
    font-size: 12px;
    width: 26px;
    line-height: 17px;
    text-align: center;
    position: absolute;
    left: 0px;
    top: 0;
    z-index: 9;
    border-radius: 0px 0px 19px 0px;
    color: #fff;
    background: #96dcb7;
  }
}
</style>
