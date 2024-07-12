<template>
  <!-- 自定义弹窗 - 清关与头程派送信息 -->
  <ComCustomDialog ref="customDlgRef" :slotDlgFormIds="['msgSlot']">
    <template v-slot:msgSlot="slotProps">
      <span
        >{{ activities.pageType==1?activities.jobNo:activities.operationOrderNum || "工作单号" }}
        {{ overseaLangObj.yu_yan_lang === "en-us" ? "" : "的" }}</span
      >
      <div class="base-flex-between">
        <el-input
          v-model="dispatchData.shipmentId"
          placeholder="Shipment ID"
          size="small"
        />

        <el-input-number
          size="small"
          style="margin: 0 5px"
          v-model="dispatchData.dispatchNum"
          v-input-number-limit="0"
          :controls="false"
          :placeholder="`${overseaLangObj.sl_num || '数量'}（${
            overseaLangObj.zs_integer || '整数'
          }）`"
        />

        <el-select
          v-model="dispatchData.selectVal"
          placeholder="请选择"
          size="small"
        >
          <el-option
            v-for="item in dispatchOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <span
        >{{ slotProps.fieldItem.placeholder }}
        {{ slotProps.formModel.estimatedTime }}</span
      >
    </template>
  </ComCustomDialog>
</template>

<script>
import { trackClearanceMixin } from "../../trajectoryMixin";
export default {
  mixins: [trackClearanceMixin],
  props: {
    activities: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {};
  },
};
</script>
