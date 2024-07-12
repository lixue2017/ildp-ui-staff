<template>
  <div>
    <div class="title-content">
      <div class="title-left">
        <span>{{ tabsConfig.title }}</span>
      </div>
    </div>
    <div class="table-content">
      <ComTable
        :httpRequest="tableConfig.httpRequest"
        :columnConfig="tableConfig.cols"
        :getQueryParams="getQueryParams"
        :pagination="false"
        @getResult="getResult"
        :defaultExpandAll="true"
      >
        <template v-slot:customRow="{ slotProps }">
          <template v-if="slotProps.prop === 'expand'">
            <div
              v-if="!slotProps.row.items || !slotProps.row.items.length"
              class="noData"
            >
              暂无关联产品
            </div>
            <template v-else>
              <el-row
                style="line-height: 32px"
                v-for="(exRow, exRIndex) in slotProps.row.items"
                :gutter="20"
                :key="`${slotProps.row.temp_secondId}_${
                  exRow.temp_only_key || exRIndex
                }_${exRow.id || exRow.cpmId}`"
              >
                <el-col :span="6" class="base-flex-align">
                  <div class="new-tag" v-if="exRow.toBeConfirmed">新</div>
                  <span>产品{{ exRIndex + 1 }}：</span>
                  <template>{{ exRow.sku || "--" }}</template>
                </el-col>
                <el-col :span="4" class="base-flex-align">
                  <span>重量：</span>
                  <span>{{ toFixedNum(exRow.singleWeight, 2) }}</span>
                </el-col>
                <el-col :span="4" class="base-flex-align">
                  <span>预报数：</span>
                  <span>{{ exRow.num }}</span>
                </el-col>
                <el-col :span="4" class="base-flex-align">
                  <span>实收：</span>
                  <span>{{ toFixedNum(exRow.takeNum, 0) }}</span>
                  <!-- <TooltipOver
                    :content="exRow.skuName"
                    :style="{ width: 'calc(100% - 70px)', flex: 1 }"
                  /> -->
                </el-col>
                <el-col :span="6" class="base-flex-align">
                  <div
                    class="table-preview-image"
                    v-if="(exRow.attachList || []).length"
                  >
                    <span>图片：</span>
                    <template v-for="(imgItem, imgIndex) in exRow.attachList">
                      <el-image
                        :key="`img_${imgIndex}`"
                        :src="imgItem.filePath"
                        :preview-src-list="[imgItem.filePath]"
                      >
                      </el-image>
                    </template>
                  </div>
                </el-col>
              </el-row>
            </template>
          </template>

          <template v-if="slotProps.prop === 'slotState'">
            <div class="tag-blue-color">
              {{ slotProps.dicsList.nameCn || "--" }}
            </div>
          </template>
        </template>
      </ComTable>
      <div class="grand-total">
        <template v-for="(tItem, i) in tableSubtotal">
          <span :key="`t_${i}`">
            <span>{{ tItem.totalLabel }}：</span>
            <span>{{ tItem.totalNum }}</span>
          </span>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { detailTableColumns } from "./model.js";
import { getReturnWmsOrderPackages } from "@/api/warehouse/process";
import { multiplicationFn, accumulationFn } from "@/utils/instructions";

export default {
  props: {
    formModel: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      tabsConfig: {
        title: "货物信息",
      },
      tableConfig: {
        cols: detailTableColumns,
        httpRequest: getReturnWmsOrderPackages,
      },
      tableSubtotal: [],
    };
  },
  methods: {
    getQueryParams() {
      return {
        id: this.formModel.id,
      };
    },
    getResult({ tableData }) {
      let rowNumTotal = [];
      let takeNumTotal = [];
      let rowWeightTotal = [];
      tableData.forEach((ele) => {
        (ele.items || []).forEach((i) => {
          rowNumTotal.push(i.num);
          takeNumTotal.push(i.takeNum);
          rowWeightTotal.push(multiplicationFn([i.num, i.singleWeight]));
        });
      });
      this.tableSubtotal = [
        {
          totalLabel: "合计包裹数",
          totalNum: tableData.length,
        },
        {
          totalLabel: "合计预报SKU",
          totalNum: accumulationFn(rowNumTotal),
        },
        {
          totalLabel: "合计实收SKU",
          totalNum: accumulationFn(takeNumTotal),
        },
        {
          totalLabel: "合计重量(KG)",
          totalNum: accumulationFn(rowWeightTotal, 2),
        },
      ];
    },
  },
  mounted() {},
  components: {
    ComTable: () => import("_comp/ComTable"),
    TooltipOver: () => import("_comp/TooltipOver"),
  },
};
</script>

<style lang="scss" scoped>
.title-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  .title-left {
    font-size: 14px;
    font-weight: bold;
    line-height: 22px;
    padding: 14px 0 11px;
    color: #515151;
  }
}
.new-tag {
  font-size: 12px;
  width: 26px;
  line-height: 14px;
  text-align: center;
  position: absolute;
  left: 0;
  top: -4px;
  border-radius: 0px 0px 19px 0px;
  color: #fff;
  background: #96dcb7;
}
</style>
