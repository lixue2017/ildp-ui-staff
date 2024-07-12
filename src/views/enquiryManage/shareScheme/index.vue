<template>
  <div class="share-scheme">
    <div class="scheme-item">
      <div class="title" v-if="shareScheme.quotationSheetType === 1">
        头程{{ shareScheme.shippingModeName
        }}{{ shareScheme.tradeTypeName }}服务报价
      </div>
      <div class="title" v-else>海外提派服务报价</div>
      <el-row class="scheme-form">
        <template v-for="col in formColumns(shareScheme.quotationSheetType)">
          <el-col :key="col.id" :span="col.span">
            <div class="label">{{ col.label }}</div>
            <div class="value">
              {{
                col.basicType
                  ? handleText(col.basicType, shareScheme[col.id])
                  : shareScheme[col.id] || "--"
              }}
            </div>
          </el-col>
        </template>
      </el-row>
    </div>
    <div class="scheme-item">
      <div class="title">物流渠道服务</div>
      <ComTable
        ref="tableRef"
        :columnConfig="tableColumns"
        :columnData="shareScheme.shareSchemeDetailInfoVOList"
        v-if="shareScheme.shareSchemeDetailInfoVOList"
      />
    </div>
  </div>
</template>

<script>
import { shareScheme } from "@/api/enquiryManage";
import { formColumns, tableColumns } from "./model";
export default {
  components: {
    ComTable: () => import("_comp/ComTable"),
  },
  data() {
    return {
      formColumns,
      tableColumns,
      shareScheme: {},
      tradeType: {
        1: "进口",
        2: "出口",
      },
      shippingMode: {
        1: "海运",
        2: "空运",
      },
    };
  },
  created() {
    this.getDetail();
  },
  methods: {
    getDetail() {
      const { id } = this.$route.query;
      if (!id) return;
      shareScheme(id).then((res) => {
        const { tradeType, shippingMode } = res.data;
        res.data.tradeTypeName = this.tradeType[tradeType] || "";
        res.data.shippingModeName = this.shippingMode[shippingMode] || "";
        this.shareScheme = res.data;
      });
    },
  },
};
</script>
<style lang="scss">
.staff {
  overflow: auto;
}
</style>
<style lang="scss" scoped>
.share-scheme {
  min-height: calc(100vh - 80px);
  padding: 47px 40px;
  margin: 40px 50px;
  background: #fff;
}
.scheme-item {
  border-left: 1px solid #e2e2e2;
  border-right: 1px solid #e2e2e2;
  margin-bottom: 50px;
  .title {
    font-size: 16px;
    font-weight: bold;
    height: 50px;
    line-height: 50px;
    padding-left: 25px;
    color: #696969;
    background: rgba(227, 227, 227, 0.4);
    border-top: 1px solid #e2e2e2;
  }
  .scheme-form {
    border-top: 1px solid #e2e2e2;
    .el-col {
      height: 40px;
      line-height: 40px;
      display: flex;
      border-bottom: 1px solid #e2e2e2;

      &:nth-child(2n) {
        border-left: 1px solid #e2e2e2;
      }
      .label {
        width: 210px;
        text-align: center;
        border-right: 1px solid #e2e2e2;
      }
      .value {
        flex: 1;
        padding-left: 40px;
      }
    }
  }
  /deep/ {
    .serial-num {
      .cell {
        padding-left: 25px;
      }
    }
  }
}
</style>
