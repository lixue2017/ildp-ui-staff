<template>
  <div>
    <ComForm
      ref="dialogForm"
      :formConfig="detailFormConfig(0)"
      style="width: 100%"
      v-if="isInitRes"
    >
      <!-- <template v-slot:exportType="slotProps">
        <div class="base-flex-align">
          <span class="tag-green-color">{{
            slotProps.dicsData.nameCn || "--"
          }}</span>
          <span class="tag-blue-color">{{
            busTypeFind(slotProps.formModel.busType)
          }}</span>
        </div>
      </template> -->
    </ComForm>
    <template v-if="detailType !== 'operationOrderDetails'">
      <div class="warehousing-content" v-if="detailFormModel.warehouseStatus">
        <p class="tit-css">入仓信息：</p>
        <ComForm
          ref="dialogForm"
          :formConfig="detailFormConfig(1, '80px')"
          style="width: 100%"
        />
      </div>
      <!-- <div
        class="warehousing-content"
        v-if="
          !detailFormModel.trailerStatus &&
          typeof detailFormModel.trailerStatus !== 'object'
        "
      >
        <p class="tit-css">拖车信息</p>
        <ComForm
          class="trailer-form"
          ref="dialogForm"
          :formConfig="detailFormConfig(2, '78px')"
          style="width: 100%"
          v-if="isInitRes"
        >
          <template v-slot:slotQyd="slotProps">
            <div class="base-flex-align">
              <TooltipOver
                :content="`${slotProps.formModel.startAddress || '--'}`"
                refName="tooltipOver"
                :style="{
                  width: 'calc(100% - 170px)',
                  flex: 1,
                  minWidth: '10px',
                }"
              />
              <span class="tag-green-color">港口</span>
              <div class="flex-direction-col trailer-mode">
                <span class="tag-grey-color">集装箱离港</span>
                <svg-icon
                  :class="['clearance-icon-trailer']"
                  icon-class="clearance-trailer"
                />
              </div>
            </div>
          </template>
          <template v-slot:slotMdi="slotProps">
            <span>{{ slotProps.formModel.aimAddresso || "--" }}</span>
            <span class="tag-blue-color">仓库</span>
          </template>
        </ComForm>
      </div> -->
    </template>
    <div class="warehousing-content">
      <ComForm ref="filesUpload" :formConfig="formConfig"> </ComForm>
    </div>
  </div>
</template>

<script>
import { popClearanceDetail } from "@/api/performance/record";
import { getTrailerInfo } from "@/api/operateManage/details.js";
import { BUS_TYPE, WAREHOUSE_TYPE } from "@/utils/mixin";
import {
  detailInfoCols,
  warehousingCols,
  trailerCols,
  clearanceFiles,
} from "../model";
export default {
  props: {
    detailFormModel: {
      type: Object,
      default: () => {},
    },
    detailType: {
      type: String,
      default: () => "", // operationOrderDetails: 操作单详情/清关信息
    },
    operateId: {
      type: [String, Number],
      default: () => "", // 操作单ID
    },
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
    TooltipOver: () => import("_comp/TooltipOver"),
  },
  data() {
    return {
      WAREHOUSE_TYPE,
      trailerInfoDetails: {},
      customsFormDetail: {},
      isInitRes: false,
      formConfig: {
        isAttachFileId: true,
        formModel: {},
        size: "small",
        labelWidth: "52px",
        lists: clearanceFiles(),
        formRules: {},
      },
    };
  },
  created() {
    this.formConfig = {
      ...this.formConfig,
      formModel: {
        ...this.detailFormModel,
      },
    };
    if (this.detailType === "operationOrderDetails") {
      // 操作单详情/清关信息
      popClearanceDetail(this.operateId).then((res) => {
        this.customsFormDetail = res.data || {};
        this.isInitRes = true;
      });
    } else {
      // 列表清关详情 -> 获取清关拖车详情
      this.customsFormDetail = { ...this.detailFormModel };
      getTrailerInfo({
        operationOrderId: this.detailFormModel.joinOrderId,
        clearanceStatus: 1,
      }).then((res) => {
        this.trailerInfoDetails = res.data ? res.data[0] : {};
        this.isInitRes = true;
      });
    }
  },
  methods: {
    detailFormConfig(index = 0, labelWidth = "105px") {
      const formModel =
        index === 2 ? this.trailerInfoDetails : this.customsFormDetail;
      return {
        formModel,
        isAttachFileId: index === 0,
        labelWidth,
        size: "small",
        lists: [
          {
            fieldList: [
              {
                rows: [
                  {
                    cols: [detailInfoCols, warehousingCols, trailerCols][index],
                  },
                ],
              },
            ],
          },
        ], // 表单渲染列表
        formRules: {},
      };
    },
    // busTypeFind(val) {
    //   const obj = BUS_TYPE.find((e) => e.value == val) || {};
    //   return obj.label || "--";
    // },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "~@/assets/styles/variables.scss";
.tag-blue-color {
  margin-left: 5px;
}
.warehousing-content {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid $divisionBorder;
}
.tit-css {
  margin-bottom: 10px;
  font-weight: 500;
  color: $tabBtnTxt;
}
.trailer-form {
  margin-left: 12px;
}
.trailer-mode {
  flex: 1 0 100px;
  position: relative;
  padding-left: 20px;
  .tag-grey-color {
    position: absolute;
    bottom: 10px;
  }
  .clearance-icon-trailer {
    width: 100%;
  }
}
</style>
