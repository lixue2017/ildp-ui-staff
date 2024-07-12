<template>
  <div class="app-content-container">
    <ComDetailTop
      title="退仓包裹详情"
      class="title-sides-margin-none"
      :formModel="seeFormConfig.formModel"
      ref="detailTopRef"
      @handleClick="handleTopClick"
    />

    <ComForm
      v-if="isInitRes"
      class="detail-see-form"
      :formConfig="seeFormConfig"
    >
      <template v-slot:tableData>
        <div>
          <div class="base-flex-between table-title-btn">
            <div class="title-txt">货物信息</div>
          </div>
          <ComTable
            :ref="`tableRef`"
            :columnConfig="tableTabConfig()"
            :pagination="false"
            :columnData="seeFormConfig.formModel.items"
          >
            <template v-slot:customRow="{ slotProps }">
              <template v-if="slotProps.prop === 'attachList'">
                <div class="table-preview-image">
                  <template
                    v-for="(imgItem, imgIndex) in slotProps.row.attachList ||
                    []"
                  >
                    <el-image
                      :key="imgIndex"
                      :src="imgItem.filePath"
                      :preview-src-list="[imgItem.filePath]"
                    >
                    </el-image>
                  </template>
                </div>
              </template>
            </template>
            <template v-slot:bottomTotal>
              <div class="grand-total">
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
      </template>
    </ComForm>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { unKnownReturnDetail } from "@/api/warehouse/manage";
import { accumulationFn } from "@/utils/instructions";
import { editPageTableColumns, detailFromCols } from "./model";

export default {
  data() {
    return {
      seeFormConfig: {
        formModel: {},
        labelWidth: "90px",
        lists: detailFromCols(),
      },
      tableSubtotal: [],
      isInitRes: false,
    };
  },
  methods: {
    getDetails() {
      const { id } = this.$route.query;
      this.isInitRes = false;
      unKnownReturnDetail(id).then((res) => {
        const { customerClaimItems, ...resData } = res.data || {};
        this.seeFormConfig.formModel = {
          createBy: resData.createUserName,
          ...resData,
          kqKw: resData.kw ? `${resData.kq || "--"}${resData.kw || ""}` : "",
        };
        this.calcNumTotal(resData.items || []);
        this.isInitRes = true;
      });
    },
    calcNumTotal(arr = []) {
      this.tableSubtotal = [
        {
          totalLabel: "SKU种类",
          totalNum: arr.length,
        },
        {
          totalLabel: "SKU数量",
          totalNum: accumulationFn(arr.map((e) => e.num)),
        },
      ];
    },
    handleTopClick({ type }) {
      if (type === "pre" || type === "next") {
        this.getDetails();
      }
    },
    reBack() {
      this.$refs.detailTopRef?.comReBack();
    },
    tableTabConfig() {
      return editPageTableColumns(true);
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
  created() {
    this["dictionary/getDictionary"](["claimOrderState", "packageType"]).then(
      () => {
        this.getDetails();
      }
    );
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-content-container {
  min-height: calc(100vh - 80px);
  .table-title-btn {
    padding: 10px 0;
    .title-txt {
      font-size: 14px;
      font-weight: 600;
    }
  }
}
</style>
