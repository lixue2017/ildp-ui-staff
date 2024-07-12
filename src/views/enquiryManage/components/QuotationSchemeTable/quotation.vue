<template>
  <div class="internal-quote">
    <div class="top">
      <div class="title">
        <span>{{ isOverseasToDoor ? "海外报价" : "国内报价" }}</span>
        <el-tag
          :color="`${
            getDictObj(quotationSheetState, quotationSheetInfo.state, false)
              .color
          }1A`"
          :style="{
            color: getDictObj(
              quotationSheetState,
              quotationSheetInfo.state,
              false
            ).color,
          }"
          size="mini"
          :hit="false"
          v-if="getDictObj(quotationSheetState, quotationSheetInfo.state)"
          class="scheme-tag"
        >
          {{ getDictObj(quotationSheetState, quotationSheetInfo.state) }}
        </el-tag>
      </div>
    </div>

    <div class="quotation-scheme-list">
      <template v-for="(item, index) in quotationSchemeList">
        <DomesticSingleScheme
          :key="item.id || item.addId"
          :index="index"
          :ref="`single${index}`"
          :quotationSchemeInfo="{ ...item }"
          :formData="formData"
          :isEdit="false"
          :isFcl="isFcl"
          :disabled="true"
          :queryPage="1"
          :isOverseasToDoor="isOverseasToDoor"
          :shareScheme="shareScheme"
          :isShowRadio="state === 6"
          :webViewSource="webDataSource"
          :isQuotation="true"
          @handleSelectRadio="handleSelectRadio"
          v-if="!isOverseasToDoor"
        />
        <SingleScheme
          :key="item.id || item.addId"
          :index="index"
          :ref="`single${index}`"
          :quotationSchemeInfo="{ ...item }"
          :isEdit="false"
          :isFcl="isFcl"
          :disabled="true"
          :queryPage="1"
          :isOverseasToDoor="isOverseasToDoor"
          :shareScheme="shareScheme"
          :isShowRadio="state === 6"
          :webViewSource="webDataSource"
          :isQuotation="true"
          @handleSelectRadio="handleSelectRadio"
          v-else
        />
      </template>
    </div>
    <div class="quotation-remark" v-if="quotationSchemeList.length">
      <div class="view-remark">
        <div class="label">报价备注：</div>
        <div class="value">{{ quotationSheetInfo.remark || "--" }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getQuotationInfo } from "@/api/enquiryManage/index";
import noDataImg from "@/assets/image/noData.png";
export default {
  props: {
    isOverseasToDoor: {
      type: Boolean,
      default: false,
    },
    queryPage: {
      type: Number,
      default: 1,
    },
    quotationSheetInfo: {
      type: Object,
      default: () => ({}),
    },
    isFcl: {
      type: Boolean,
      default: false,
    },
    formData: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    SingleScheme: () => import("./SingleScheme"),
    DomesticSingleScheme: () => import("./DomesticSingleScheme"),
  },
  data() {
    return {
      noDataImg,
      quotationSchemeList: [],
      state: 0,
      addId: 0,
      shareScheme: false,
      selectQuotation: {},
      selectQuotationIds: [],
      webDataSource: {
        detailRadio: true,
        radioId: 0,
      },
    };
  },
  computed: {
    ...mapState({
      quotationSheetState: (state) =>
        state.dictionary.dicsData.quotationSheetState,
    }),
  },
  created() {
    const {
      viewState,
      state,
      quotationSchemeInfoVOList = [],
    } = this.quotationSheetInfo;
    this.state = state;
    this.quotationSchemeList = this.handleList(quotationSchemeInfoVOList);
    if (state === 3) {
      this.shareScheme = true;
    }
  },
  methods: {
    handleList(list) {
      if (!list || !list.length) return [];
      return list.map((item) => {
        const { quotationSchemeDetailInfoVOList, ...data } = item;
        return {
          ...data,
          isEdit: false,
          quotationSchemeDetailInfoVOList: quotationSchemeDetailInfoVOList.map(
            (detail) => ({ ...detail, temp_only_key: Math.random() + "" })
          ),
        };
      });
    },
    handleAdd() {
      this.addId += 1;
      const { id } = this.quotationSheetInfo;
      this.quotationSchemeList = [
        {
          name: "",
          quotationSheetId: id,
          type: this.isOverseasToDoor ? 2 : 1, // 1=国内报价单；2=国外报价单
          quotationSchemeDetailInfoVOList: [],
          isEdit: true,
          addId: `addId${this.addId}`,
        },
        ...this.quotationSchemeList,
      ];
    },
    getNewList(list, index) {
      this.quotationSchemeList.splice(index, 1);
      const addList = this.quotationSchemeList.filter((item) => item.addId);
      this.quotationSchemeList = [...addList, ...this.handleList(list)];
    },
    handleSelectRadio(id) {
      this.webDataSource.radioId = id;
      this.$emit("handleSelectRadio", {
        id,
        isOverseasToDoor: this.isOverseasToDoor,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-button {
  font-weight: bold;
}
.title {
  font-size: 14px;
  font-weight: bold;
  padding: 15px 0 16px;

  .scheme-tag {
    height: 21px;
    line-height: 21px;
    border: none;
    border-radius: 12px;
    padding: 0 13px;
    margin-left: 5px;
  }
}
.internal-quote {
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .quotation-scheme-list {
    border: 1px solid #e2e2e2;
    border-bottom: none;
  }
  .data-empty {
    line-height: 20px;
    text-align: center;
    border-bottom: 1px solid #e2e2e2;
    img {
      width: 100px;
      padding: 30px 0 14px;
    }
    div {
      padding-bottom: 30px;
    }
  }
  .quotation-remark {
    .title {
      padding-bottom: 10px;
    }
    .remark {
      margin-bottom: 10px;
    }
  }
  .view-remark {
    display: flex;
    line-height: 18px;
    padding: 21px 22px;
    background: #fff6f1;
    border-radius: 0px 0px 4px 4px;
    &.top-line {
      border-top: 1px solid #e2e2e2;
    }
    .label {
      color: #8b8b8b;
    }
    .value {
      flex: 1;
      font-weight: bold;
      margin-left: 4px;
    }
  }
}
</style>
