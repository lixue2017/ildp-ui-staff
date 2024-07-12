<template>
  <div class="internal-quote">
    <div class="top">
      <div class="title">
        <span>{{ isOverseasToDoor ? "海外报价" : "国内报价" }}</span>
        <el-tag
          :color="`${getDictObj(quotationSheetState, state, false).color}1A`"
          :style="{
            color: getDictObj(quotationSheetState, state, false).color,
          }"
          size="mini"
          :hit="false"
          v-if="getDictObj(quotationSheetState, state)"
          class="scheme-tag"
        >
          {{ getDictObj(quotationSheetState, state) }}
        </el-tag>
        <span
          class="top-tip"
          v-if="queryPage == 3 && ![0, 1, 2, 4].includes(state)"
          >*
          方案为应收国内费用，设置减去利润后则为应付供应商费用，关联报价后自动生成费用信息</span
        >
      </div>
      <div class="top-right">
        <template v-for="item in handleBtn()">
          <el-button
            size="mini"
            :type="item.type || 'primary'"
            :icon="item.icon"
            @click="item.handleClick()"
            :key="item.text"
            :class="{
              [item.className]: item.className,
            }"
            :plain="item.plain"
            :round="item.round"
            :disabled="item.disabled"
          >
            {{ item.text }}
          </el-button>
        </template>
      </div>
    </div>

    <div
      class="view-remark top-line"
      v-if="state === 1 || (queryPage === 1 && state === 4)"
    >
      <div class="label">{{ state === 4 ? "业务退回" : "市场打回" }}备注：</div>
      <div class="value">{{ quotationSheetInfo.rollbackRemark || "--" }}</div>
    </div>
    <template v-else>
      <div class="quotation-scheme-list">
        <template v-for="(item, index) in quotationSchemeList">
          <DomesticSingleScheme
            :key="`${item.id || item.addId}-${item.routeNoManageId || 0}`"
            :index="index"
            :ref="`single${index}`"
            :quotationSchemeInfo="{ ...item, state }"
            :isEdit="item.isEdit"
            :isFcl="isFcl"
            :disabled="
              (queryPage === 1 && !shareScheme) ||
              ![0, 2, 3, 4, 6].includes(state)
            "
            :webViewSource="{
              isAddScheme:
                [2, 3].includes(queryPage) && [0, 2, 4].includes(state), // 新增方案
            }"
            :proxyIds="proxyIds"
            :queryPage="queryPage"
            :isOverseasToDoor="isOverseasToDoor"
            :isShowCheck="[3, 6].includes(state) && queryPage === 1"
            :shareScheme="shareScheme"
            :formData="formData"
            @handleDelete="handleDelete(index)"
            @handleRenew="handleRenew"
            @handleSelect="handleSelect"
            @handleCopy="handleCopy"
            v-if="!isOverseasToDoor"
          />
          <SingleScheme
            :key="item.id || item.addId"
            :index="index"
            :ref="`single${index}`"
            :quotationSchemeInfo="{ ...item, state }"
            :isEdit="item.isEdit"
            :isFcl="isFcl"
            :disabled="
              (queryPage === 1 && !shareScheme) ||
              ![0, 2, 3, 4, 6].includes(state)
            "
            :webViewSource="{
              isAddScheme:
                [2, 3].includes(queryPage) && [0, 2, 4].includes(state), // 新增方案
            }"
            :proxyIds="proxyIds"
            :queryPage="queryPage"
            :isOverseasToDoor="isOverseasToDoor"
            :isShowCheck="[3, 6].includes(state) && queryPage === 1"
            :shareScheme="shareScheme"
            :formData="formData"
            @handleDelete="handleDelete(index)"
            @handleRenew="handleRenew"
            @handleSelect="handleSelect"
            @handleCopy="handleCopy"
            v-else
          />
        </template>
        <template v-if="!quotationSchemeList.length">
          <div class="data-empty">
            <img :src="noDataImg" alt="" srcset="" width="150px" />
            <div>
              没有方案数据哦～ <br />
              快去添加吧！
            </div>
          </div>
        </template>
      </div>
      <div class="quotation-remark" v-if="quotationSchemeList.length">
        <template
          v-if="[2, 3].includes(queryPage) && [0, 2, 4].includes(state)"
        >
          <div class="title">报价备注</div>
          <div>
            <el-input
              type="textarea"
              :rows="3"
              placeholder="请输入报价备注"
              maxlength="2000"
              show-word-limit
              v-model="quotationSheetInfo.remark"
            >
            </el-input>
          </div>
        </template>
        <div class="view-remark" v-else>
          <div class="label">报价备注：</div>
          <div class="value">{{ quotationSheetInfo.remark || "--" }}</div>
        </div>
      </div>
    </template>
    <CopySchemeDialog
      ref="copySchemeDlgRef"
      :isOverseasToDoor="isOverseasToDoor"
      @handleSuccess="handleAddList"
    />
    <SetProfitDialog ref="setProfitRef" @handleSuccess="handleReDetail" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import noDataImg from "@/assets/image/noData.png";
export default {
  props: {
    quotationSchemeInfoVOList: {
      type: Array,
      default: () => [],
    },
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
    proxyIds: {
      type: String,
      default: "",
    },
  },
  components: {
    SingleScheme: () => import("./SingleScheme"),
    DomesticSingleScheme: () => import("./DomesticSingleScheme"),
    CopySchemeDialog: () =>
      import(
        "@/views/enquiryManage/components/QuotationSchemeTable/CopySchemeDialog"
      ),
    SetProfitDialog: () =>
      import("@/views/enquiryManage/components/SetProfitDialog"),
  },
  data() {
    return {
      noDataImg,
      btnList: [
        {
          type: "danger",
          text: "打 回",
          plain: true,
          round: true,
          showPage: [2, 3],
          showState: [0],
          handleClick: () => this.handleVoid(1),
        },
        {
          text: "复制方案",
          plain: true,
          round: true,
          showPage: [2, 3],
          showState: [0, 2, 4],
          handleClick: this.handleCopyScheme,
        },
        {
          text: "新增方案",
          plain: true,
          round: true,
          showPage: [2, 3],
          showState: [0, 2, 4],
          handleClick: this.handleAdd,
        },
        // {
        //   text: "确认报价方案",
        //   plain: true,
        //   round: true,
        //   showPage: [1],
        //   showState: [3],
        //   handleClick: this.confirmQuotationSheet,
        // },
        {
          text: "业务退回",
          plain: true,
          round: true,
          showPage: [1],
          showState: [3], // 已报价状态
          handleClick: () => this.handleVoid(4),
        },
        {
          text: "设置利润",
          plain: true,
          round: true,
          showPage: [3],
          showState: [3, 6, 7], // 已报价状态
          handleClick: this.setProfit,
        },
        {
          text: "撤回方案",
          plain: true,
          round: true,
          showPage: [2, 3],
          showState: [3], // 已报价状态
          handleClick: this.handleRecall,
        },
      ],
      quotationSchemeList: [],
      state: 0,
      addId: 0,
      shareScheme: false,
      selectQuotation: {},
      selectQuotationIds: [],
    };
  },
  computed: {
    ...mapState({
      quotationSheetState: (state) =>
        state.dictionary.dicsData.quotationSheetState,
    }),
  },
  created() {
    const { state, quotationSchemeInfoVOList = [] } = this.quotationSheetInfo;
    this.state = state;
    const addList = [];
    const list = [];
    (quotationSchemeInfoVOList || []).forEach((item) => {
      if (item.addId) {
        addList.push(item);
      } else {
        list.push(item);
      }
    });
    this.quotationSchemeList = [...addList, ...this.handleList(list)];
    if ([3, 6].includes(state)) {
      this.shareScheme = true;
    }
  },
  methods: {
    handleBtn() {
      const { state, queryPage, btnList } = this;
      const currBtn = [];
      btnList.forEach((btn) => {
        if (btn.showPage.includes(queryPage) && btn.showState.includes(state)) {
          currBtn.push(btn);
        }
      });
      return currBtn;
    },
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
      setTimeout(() => {
        // 新增时默认带出费用填写栏
        this.$refs[`single${0}`] &&
          this.$refs[`single${0}`][0]?.handleAddCost();
      }, 300);
    },
    handleAddList(list) {
      const { id } = this.quotationSheetInfo;
      const arr = list.map((item) => {
        const { quotationSchemeDetailSaveParamList, ...data } = item;
        this.addId += 1;
        return {
          ...data,
          quotationSheetId: id,
          type: this.isOverseasToDoor ? 2 : 1, // 1=国内报价单；2=国外报价单
          isEdit: true,
          addId: `addId${this.addId}`,
          quotationSchemeDetailInfoVOList:
            quotationSchemeDetailSaveParamList.map((detail) => ({
              ...detail,
              temp_only_key: Math.random() + "",
            })),
        };
      });
      this.quotationSchemeList = [...arr, ...this.quotationSchemeList];
    },
    handleCopy(row, index) {
      this.addId += 1;
      this.quotationSchemeList.splice(index, 0, {
        ...row,
        addId: `addId${this.addId}`,
      });
      setTimeout(() => {
        // 新增时默认带出费用填写栏
        this.$refs[`single${index}`] &&
          this.$refs[`single${index}`][0]?.handleUpdate(true);
      }, 300);
    },
    handleDelete(index) {
      this.quotationSchemeList.splice(index, 1);
    },
    handleVoid(state) {
      this.$emit("handleVoid", state);
    },
    confirmQuotationSheet() {
      const { id } = this.quotationSheetInfo;
      this.$emit("confirmQuotationSheet", id);
    },
    handleRenew(index, copyId) {
      const addList = this.quotationSchemeList.filter(
        (item, i) => item.addId && i !== index
      );
      this.$emit(
        "handleRenew",
        (list) => this.getNewList(list, index, copyId),
        addList
      );
    },
    getNewList(list, index, copyId) {
      if (index || index === 0) {
        this.quotationSchemeList.splice(index, 1);
      }
      const addList = this.quotationSchemeList.filter((item) => item.addId);
      this.quotationSchemeList = [...addList, ...this.handleList(list)];
      if (copyId) {
        const index = this.quotationSchemeList.findIndex(
          (item) => copyId === item.id
        );
        if (index > -1) {
          this.$nextTick(() => {
            this.$refs[`single${index}`] &&
              this.$refs[`single${index}`][0]?.handleUpdate(true);
          });
        }
      }
    },
    handleRecall() {
      const { id } = this.quotationSheetInfo;
      this.$emit("handleRecall", id);
    },
    getSaveArr() {
      for (let i = 0; i < this.quotationSchemeList.length; i++) {
        if (this.$refs[`single${i}`][0]?.singleEdit) {
          this.$message.error(`第${i + 1}个方案未保存！`);
          return `第${i + 1}个方案未保存！`;
        }
      }
      return false;
    },
    handleSelect(obj) {
      const selectQuotationIds = [];
      this.selectQuotation[obj.id] = obj.bol;
      for (let key in this.selectQuotation) {
        if (this.selectQuotation[key]) selectQuotationIds.push(key);
      }
      this.selectQuotationIds = selectQuotationIds;
      this.$emit("handleSelect", selectQuotationIds);
    },
    handleAllEdit() {
      this.quotationSchemeList.forEach((item, index) => {
        if (item.id) {
          this.addId += 1;
          item.id = undefined;
          item.addId = `addId${this.addId}`;
        }
        this.$nextTick(() => {
          this.$refs[`single${index}`] &&
            this.$refs[`single${index}`][0]?.handleUpdate(true, true);
        });
      });
    },
    handleCopyScheme() {
      this.$refs.copySchemeDlgRef.show(this.formData);
    },
    setProfit() {
      this.$refs.setProfitRef.show({
        inquirySheetId: this.formData.id,
      });
    },
    handleReDetail() {
      this.$emit("handleReDetail");
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
.top-tip {
  font-size: 12px;
  font-weight: 400;
  margin-left: 5px;
  color: #5094ff;
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
