<template>
  <div class="share-quotation" v-if="formData.id">
    <div class="company-top">
      <div class="company-name">
        <div class="img"><img :src="logo" alt="" srcset="" /></div>
        <div class="name">
          <div class="name-cn">{{ formData.companyCnName || "--" }}</div>
          <div class="name-en">
            {{ formData.companyEnName || "--" }}
          </div>
        </div>
      </div>
      <div class="company-addr">
        <span>{{ formData.companyAddress || "--" }}</span>
        <span class="label">Tel：</span
        ><span>{{ formData.phoneNumber || "--" }}</span>
        <!-- 客户没有Fax -->
        <!-- <span class="label">Fax：</span><span>86-755-86229014 86052448</span> -->
      </div>
    </div>
    <el-row class="scheme-form">
      <el-col :span="12">
        <div class="label">To：</div>
        <div class="value">{{ formData.customerCnName || "--" }}</div>
      </el-col>
      <el-col :span="12">
        <div class="label">Date：</div>
        <div class="value">{{ formData.createTime || "--" }}</div>
      </el-col>
      <el-col :span="12">
        <div class="label">业务员：</div>
        <div class="value">{{ formData.createUserName || "--" }}</div>
      </el-col>
      <el-col :span="12">
        <div class="label"></div>
        <div class="value"></div>
      </el-col>
    </el-row>
    <div class="msg-1">
      您好！感谢贵司的支持与信任！诚祝贵司生意兴隆。依据贵司需求提供最优惠的报价：
    </div>
    <div class="port">
      <template v-if="formData.inquirySheetType === 2">
        <div class="start-port">{{ formData.pickupAddressName || "--" }}</div>
      </template>
      <template v-else>
        <div class="start-port">{{ formData.startPortName || "--" }}</div>
        <div class="iconfont jiantou2"></div>
        <div class="end-port">{{ formData.endPortName || "--" }}</div>
      </template>
      <div class="product-info" v-if="formData.productInfo">
        {{ formData.productInfo }}
      </div>
    </div>
    <div class="msg-2">
      {{ formData.remark || "--" }}
    </div>
    <template
      v-if="
        formData.domesticQuotationSheetInfoVO &&
        formData.domesticQuotationSheetInfoVO.quotationSchemeInfoVOList
      "
    >
      <div class="title">头程费用</div>
      <div class="quotation-scheme-list">
        <template
          v-for="(item, index) in formData.domesticQuotationSheetInfoVO
            .quotationSchemeInfoVOList"
        >
          <SingleScheme
            :key="item.id"
            :index="index"
            :quotationSchemeInfo="item"
            :isEdit="false"
            :isFcl="!formData.packingMode"
            :disabled="true"
            :queryPage="1"
            :webViewSource="{
              sharePage: true, // 分享页面
            }"
            :isQuotation="true"
          />
        </template>
      </div>
    </template>
    <template
      v-if="
        formData.foreignQuotationSheetInfoVO &&
        formData.foreignQuotationSheetInfoVO.quotationSchemeInfoVOList
      "
    >
      <div class="title">尾程费用</div>
      <div class="quotation-scheme-list">
        <template
          v-for="(item, index) in formData.foreignQuotationSheetInfoVO
            .quotationSchemeInfoVOList"
        >
          <SingleScheme
            :key="item.id"
            :index="index"
            :quotationSchemeInfo="item"
            :isEdit="false"
            :isFcl="!formData.packingMode"
            :disabled="true"
            :queryPage="1"
            :webViewSource="{
              sharePage: true, // 分享页面
            }"
            :isQuotation="true"
            :isOverseasToDoor="true"
          />
        </template>
      </div>
    </template>
    <div class="grand-total all-total" v-if="formData.totalCost">
      <span>总计：</span>
      <span>
        <span class="value">{{ formData.totalCost }}</span>
      </span>
    </div>
    <div class="grand-total all-total" v-if="formData.totalCostRMB">
      <span>总计RMB：</span>
      <span>
        <span class="value">{{ formData.totalCostRMB }}</span>
      </span>
    </div>
  </div>
</template>

<script>
import { formColumns, tableColumns } from "./model";
import { getShareQuotation } from "@/api/enquiryManage/customerQuotation";
import logo from "@/assets/image/logo.svg";
export default {
  components: {
    ComTable: () => import("_comp/ComTable"),
    SingleScheme: () =>
      import(
        "@/views/enquiryManage/components/QuotationSchemeTable/SingleScheme"
      ),
  },
  data() {
    return {
      logo,
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
      formData: {},
    };
  },
  created() {
    this.getDetail();
  },
  methods: {
    getDetail() {
      this.formData = {};
      const { id, type } = this.$route.query;
      getShareQuotation({ id, type }).then((res) => {
        this.formData = res.data;
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
.share-quotation {
  min-height: calc(100vh - 80px);
  padding: 20px;
  margin: 20px;
  background: #fff;

  .company-top {
    padding: 15px 0;
    background: rgba(226, 226, 226, 0.3);
    display: flex;
    flex-direction: column;
    align-items: center;

    .company-name {
      display: flex;
      justify-content: center;
      align-items: center;

      .img {
        width: 90px;
        margin-right: 5px;
      }
      .name {
        text-align: center;

        .name-cn {
          font-size: 35px;
          font-weight: 500;
          line-height: 49px;
        }
        .name-en {
          font-size: 15px;
          line-height: 21px;
        }
      }
    }
    .company-addr {
      line-height: 15px;
      margin-top: 15px;
      padding: 8px 0 3px;
      border-top: 1px solid #515151;
      font-size: 15px;
      display: flex;
      align-items: center;

      .label {
        padding-left: 10px;
        margin-left: 10px;
        border-left: 1px solid #515151;
        color: #8b8b8b;
      }
    }
  }
  .title {
    font-size: 26px;
    font-weight: 500;
    line-height: 67px;
    text-align: center;
  }
}
.msg-1 {
  line-height: 58px;
}
.msg-2 {
  padding: 7px;
  line-height: 32px;
  border-bottom: 1px solid #e2e2e2;
  word-break: break-all;
}
.port {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 14px 0 13px;
  background: rgba(226, 226, 226, 0.3);
  .start-port,
  .end-port {
    font-size: 24px;
    font-weight: 500;
    display: -webkit-box;
    max-width: 300px;
    word-break: break-all;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .jiantou2 {
    margin: 0 15px;
  }
  .product-info {
    margin-left: 40px;
    font-size: 24px;
    font-weight: 500;
  }
}
.quotation-item {
  margin-bottom: 50px;

  .quotation-route {
    display: flex;
    align-items: center;
    min-height: 50px;
    background: #f6f6f6;
    border-top: 1px solid #e2e2e2;
    border-bottom: 1px solid #e2e2e2;

    .index {
      width: 52px;
      text-align: center;
    }
  }
  .fee-title {
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
  }
}
.grand-total > span {
  &:nth-child(2) {
    padding-left: 10px;
  }
}
.scheme-form {
  border-top: 1px solid #e2e2e2;
  border-left: 1px solid #e2e2e2;
  border-right: 1px solid #e2e2e2;
  margin-top: 30px;
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
      background: #f8f8f8;
    }
    .value {
      flex: 1;
      padding-left: 40px;
    }
  }
}
/deep/ {
  .quotation-scheme {
    border-top: 1px solid #e2e2e2;
  }
}
.all-total {
  background: rgba(80, 148, 255, 0.2);
}
</style>
