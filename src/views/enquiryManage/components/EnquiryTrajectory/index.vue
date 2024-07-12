<template>
  <OperateSidebarCard class="trajectory" :showBarTabArr="showBarTabArr">
    <template v-slot:slideCard>
      <template v-if="queryPage === 1">
        <div class="operate-status" v-if="formData.stateName">
          <span>状态</span>
          <div style="width: 100%; background-color: #f9f9f9; color: #a5a5a5">
            {{ formData.stateName }}
          </div>
        </div>
        <div class="operate-btn">
          <template v-if="!isQuotation">
            <div class="title">您可以操作</div>
            <el-button size="small" @click="updQuotationUser()" plain
              >更新报价人</el-button
            >
          </template>
          <div class="operate-data">
            <div class="operate-data-item">
              <span class="label">询价人：</span>
              <span class="value">{{ formData.inquirerUserName || "--" }}</span>
            </div>
            <div
              class="operate-data-item"
              v-if="[1, 3].includes(formData.type)"
            >
              <span class="label">国内报价人：</span>
              <span class="value">{{
                formData.domesticQuotedPriceUserName || "--"
              }}</span>
            </div>
            <div
              class="operate-data-item"
              v-if="[2, 3].includes(formData.type)"
            >
              <span class="label">海外报价人：</span>
              <span class="value">{{
                formData.foreignQuotedPriceUserName || "--"
              }}</span>
            </div>
          </div>
        </div>
        <div class="title">询价流程</div>
        <BtnProcess :nodeFlowList="formData.node" />
      </template>
      <template v-else>
        <template v-if="!isQuotation && [2, 3].includes(queryPage)">
          <div class="operate-btn">
            <div class="title">您可以操作</div>
            <template
              v-if="
                queryPage === 2 &&
                [0, 1, 2, 4].includes(
                  formData.domesticQuotationSheetInfoVO &&
                    formData.domesticQuotationSheetInfoVO.state
                )
              "
            >
              <el-button size="small" @click="updPortInfo" plain
                >修改港口</el-button
              >
            </template>
            <el-button
              style="margin-left: 0"
              size="small"
              @click="handleCopy"
              plain
              >复制询价单信息</el-button
            >
          </div>
        </template>
        <el-timeline class="line-trajectory" :reverse="false">
          <template v-for="(activity, i) in formData.node">
            <el-timeline-item :key="`title-${i}`" color="#A5A5A5">
              <div class="node">
                <div class="name">
                  {{ activity.name
                  }}{{
                    activity.optUserName ? `(${activity.optUserName})` : ""
                  }}
                </div>
                <div class="time" v-if="activity.optTime">
                  {{ activity.optTime }}
                </div>
              </div>
              <div class="remark" v-if="activity.remark">
                {{ activity.remark }}
              </div>
            </el-timeline-item>
          </template>
        </el-timeline>
      </template>
    </template>
  </OperateSidebarCard>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    formData: {
      type: Object,
      default: () => ({}),
    },
    queryPage: {
      type: Number,
      default: 1,
    },
    isQuotation: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    OperateSidebarCard: () => import("_comp/ComOperate/components/operateCard"),
    BtnProcess: () => import("./BtnProcess"),
  },
  data() {
    return {
      showBarTabArr: [
        {
          isTabShow: false,
          tabKey: "OrderTrackBar",
          name: "询价流程",
        },
      ],
      trajectoryList: [],
    };
  },
  computed: {
    ...mapState({
      dictionaryDataState: (state) =>
        state.dictionary.dicsData?.inquirySheetState,
    }),
  },
  methods: {
    updQuotationUser() {
      this.$emit("updQuotationUser");
    },
    updPortInfo() {
      this.$emit("updPortInfo");
    },
    handleCopy() {
      this.$emit("handleCopy");
    },
  },
};
</script>

<style lang="scss" scoped>
.trajectory {
  &.status-bar-box {
    /deep/ {
      .com-operate {
        margin-left: 0;
        &.com-operate-width {
          width: 348px;
          padding: 0 20px 20px;
        }
      }
    }
  }
}

.operate-status {
  display: flex;
  font-size: 14px;
  height: 34px;
  line-height: 34px;
  border-radius: 4px;
  border: 1px solid #5094ff;
  margin-top: 44px;
  text-align: center;
  overflow: hidden;

  & > span:nth-child(1) {
    width: 74px;
    height: 34px;
    line-height: 34px;
    background: #5094ff;
    color: #fff;
  }
  /deep/ .el-select {
    .el-input__inner {
      height: 34px;
      line-height: 34px;
      text-align: center;
      border-color: transparent;
    }
  }
}
.title {
  font-size: 14px;
  font-weight: bold;
  margin: 25px 0 10px;
  color: #515151;
}

.operate-btn {
  border-bottom: 1px solid #e2e2e2;
  .title {
    font-size: 14px;
    font-weight: 700;
    margin: 25px 0 10px;
    color: #515151;
  }
  .el-button {
    width: 100%;
    margin-bottom: 10px;
    color: #515151;
    border-color: transparent;
    box-shadow: 0px 0px 3px 0px rgba(203, 203, 203, 0.7);
    border-radius: 4px;
    &:hover {
      color: #5094ff;
      border-color: #5094ff;
    }
  }

  .operate-data {
    padding: 7px 0 18px;
    line-height: 23px;
    .operate-data-item:not(:last-child) {
      margin-bottom: 5px;
    }
    .label {
      color: #8b8b8b;
    }
    .label-item {
      color: #515151;
    }
  }
}

.line-trajectory {
  padding: 30px 0;
  /deep/ {
    .el-timeline-item__node--normal {
      width: 8px;
      height: 8px;
    }
    .el-timeline-item__tail {
      left: 3px;
      border-left: 1px dashed #bcbcbc;
    }
    .el-timeline-item__wrapper {
      padding-left: 21px;
      top: -4px;
    }
  }
  .node {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .name {
      white-space: nowrap;
      font-weight: bold;
    }
    .time {
      white-space: nowrap;
      color: #8b8b8b;
    }
  }
  .remark {
    padding-top: 8px;
    line-height: 18px;
    color: #ff6767;
  }
}
</style>
