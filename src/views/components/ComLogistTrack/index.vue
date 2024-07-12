<template>
  <div>
    <ComDrawer
      ref="myDrawer"
      :customDrawer="drawerConfig"
      :confirmClose="false"
      v-if="!isNoDrawer"
    >
      <template v-slot:content>
        <template v-if="activities.showBasic">
          <div class="sn-info">
            <div class="order-sn">
              运单号:{{ activities.basicInfo.operationOrderNum }}
            </div>
            <div class="orange-bg">
              {{
                getDictObj(dictOrderStatus, activities.basicInfo.orderStatus)
              }}
            </div>
          </div>
          <div class="desti-info">
            <div class="depart-arrive">
              {{ activities.basicInfo.startPort || "深圳" }}
            </div>
            <div class="by-way">
              <i class="iconfont chuanbo"></i>
              <span class="arrows"></span>
              <!-- <span class="time-consume"
                >已耗时:{{ activities.basicInfo.totalTime }}</span
              > -->
            </div>
            <div class="depart-arrive">
              {{
                activities.basicInfo.endPort || activities.basicInfo.countryName
              }}
            </div>
          </div>
          <el-divider></el-divider>
        </template>
        <el-timeline :reverse="false">
          <template v-for="(activity, i) in activities.list">
            <el-timeline-item
              :key="`title-${i}`"
              class="timeline timeline-title"
              :icon="`iconfont ${activity.nodeIcon}`"
              size="large"
              color="#5094FF"
            >
              <div class="title">
                {{ activity.nodeName }}
              </div>
            </el-timeline-item>
            <template v-for="(list, index) in activity.infoList">
              <el-timeline-item
                :key="`timeline-${i}-${index}`"
                class="timeline"
                size="normal"
                color="#bcbcbc"
              >
                <div class="operation-time">
                  {{
                    list.nodeId === 2
                      ? list.effectivenessTime
                      : list.trajectoryTime
                  }}
                </div>
                <div class="operation">
                  <span> {{ list.msg }}</span>
                </div>
              </el-timeline-item>
            </template>
          </template>
        </el-timeline>
      </template>
    </ComDrawer>

    <div class="track-outer" v-else>
      <div class="track base-flex-between">
        <span class="track-title">
          <span>{{ activities.title }}</span>
        </span>
        <div class="base-flex-align" v-if="list.length">
          <span class="orange-bg" v-if="activities.timeConsume"
            >总耗时：{{ activities.timeConsume }}</span
          >
          <!-- 清关轨迹详情 -->
          <!-- <div
            class="show-client-btn base-flex-align"
            v-if="['tailDetails'].includes(orderSourceObj.trackSource)"
          >
            <div class="base-flex-align">
              <el-button
                type="primary"
                @click="estimateDispatch"
                size="small"
                round
                >预约派送</el-button
              >
              <el-button
                type="primary"
                @click="actualDispatch"
                size="small"
                round
                >实际派送</el-button
              >
            </div>
          </div> -->

          <!-- 操作单详情 -->
          <div
            class="show-client-btn base-flex-align"
            v-if="
              ['operationDetails', 'clearanceDetails', 'tailDetails'].includes(
                orderSourceObj.trackSource
              )
            "
          >
            <el-button
              v-show="isShowSelect"
              @click="sendMail"
              type="primary"
              size="small"
              round
              >发送邮箱</el-button
            >
            <el-button
              v-show="!showClient"
              v-throttle
              type="primary"
              size="small"
              @click="() => setClient('del')"
              round
              >{{ overseaLangObj.yc_delete("删除")
              }}{{ overseaLangObj.yu_yan_lang === "en-us" ? " " : ""
              }}{{ overseaLangObj.jd_node("节点信息") }}</el-button
            >
            <el-button
              v-if="orderSourceObj.trackSource === 'operationDetails'"
              v-throttle
              round
              v-show="!showClient"
              @click="setClient"
              type="primary"
              size="small"
              >设置客户端限制</el-button
            >

            <div
              class="base-flex-align"
              style="margin-left: 10px"
              v-show="showClient"
            >
              <el-button
                type="primary"
                @click="saveClient"
                size="small"
                round
                >{{ overseaLangObj.bc_save("保 存") }}</el-button
              >
              <el-button
                type="primary"
                @click="showClient = false"
                plain
                size="small"
                round
                >{{ overseaLangObj.qx_cancel("取 消") }}</el-button
              >
              <el-checkbox
                class="client-checkbox"
                :indeterminate="isIndeterminate"
                v-model="isCheckAll"
                @change="handleCheckAllChange"
                >{{ overseaLangObj.select_all("全选") }}（{{
                  setBtnType === "del"
                    ? overseaLangObj.yc_delete("删除")
                    : "在客户端显示"
                }}）</el-checkbox
              >
            </div>
          </div>
        </div>
      </div>
      <el-timeline
        :reverse="false"
        :class="`${isShowSelect && 'isShowSelect'}`"
      >
        <template v-for="(activity, i) in list">
          <el-timeline-item
            :key="`title-${i}`"
            class="timeline timeline-title"
            :icon="`iconfont ${activity.nodeIcon}`"
            size="large"
            color="#5094FF"
          >
            <div class="title base-flex-between">
              <el-radio
                v-model="activitySelect"
                :label="i"
                class="activity-select"
                v-if="isShowSelect && activity.infoList"
              >
                <span></span>
              </el-radio>
              <span>{{ activity.nodeName }}</span>
              <!-- 操作单详情配置客户端显示节点 -->
              <template v-if="checkOptions(activity)">
                <el-checkbox
                  v-model="checkObj[activity.id]"
                  :true-label="activity.id"
                  :false-label="-1"
                  @change="handleCheckedCitiesChange"
                ></el-checkbox>
              </template>
            </div>
          </el-timeline-item>

          <template v-for="(tItem, index) in activity.infoList">
            <el-timeline-item
              :key="`line-${i}-${index}`"
              class="timeline"
              size="normal"
              color="#bcbcbc"
              v-if="tItem.msg"
            >
              <div class="operation-time base-flex-between">
                <span>{{
                  tItem.nodeId === 2
                    ? tItem.effectivenessTime
                    : tItem.trajectoryTime
                }}</span>

                <!-- 操作单详情配置客户端显示节点 -->
                <template v-if="checkOptions(tItem)">
                  <el-checkbox
                    v-model="checkObj[tItem.id]"
                    :true-label="tItem.id"
                    :false-label="-1"
                    @change="handleCheckedCitiesChange"
                  ></el-checkbox>
                </template>
              </div>
              <div class="operation">
                <span> {{ tItem.msg }}</span>
              </div>
            </el-timeline-item>
          </template>
        </template>
      </el-timeline>
      <div class="table-empty" v-if="!list.length">
        <img :src="noDataImg" alt="" srcset="" width="150px" />
        <div>{{ overseaLangObj.no_data("暂无物流轨迹～") }}</div>
      </div>
    </div>
    <SendEmail ref="sendEmail" :paramObj="paramObj" />
    <DispatchTrack :activities="activities" ref="dispatchRef" />
  </div>
</template>

<script>
import commonMixin from "@/utils/mixin";
import { showClientMixin } from "./trajectoryMixin";
import {
  getLogisticsList,
  getClearanceLogistics,
  getTailLogistics,
  getWarehouseLogistics,
} from "@/api/operateManage/common";
import { mapState } from "vuex";
import noDataImg from "@/assets/image/noData.png";
export default {
  mixins: [commonMixin, showClientMixin],
  props: {
    activities: {
      type: Object,
      default: () => {},
    },
    orderSourceObj: {
      // 页面来源，区分订单与仓库
      type: Object,
      default: () => ({}),
    },
    isNoDrawer: {
      type: Boolean,
      default: false,
    },
    isShowSelect: {
      type: Boolean,
      default: false,
    },
    paramObj: {
      type: Object,
      default: () => ({}),
    },
    orderType: {
      type: Number,
      default: null,
    },
  },
  components: {
    ComDrawer: () => import("_comp/ComDrawer"),
    TooltipOver: () => import("_comp/TooltipOver"),
    SendEmail: () => import("_comp/ComLogistTrack/components/SendEmail"),
    DispatchTrack: () => import("_comp/ComLogistTrack/components/dispatch"),
  },
  data() {
    return {
      drawerConfig: {
        title: this.overseaLangObj.logistics_trajectory || "物流轨迹",
        width: "550px",
        appendToBody: true,
        wrapperClosable: true,
      },
      setBtnType: "",
      list: [],
      activitySelect: 0,
      noDataImg,
    };
  },
  computed: {
    ...mapState({
      dictOrderStatus: (state) => state.dictionary.dicsData.orderStatus,
    }),
  },
  mounted() {
    this.getLogisticsNodes();
  },
  methods: {
    estimateDispatch() {
      this.$refs.dispatchRef?.dispatchDialog("estimate", {
        successFunction: () => this.getLogisticsNodes(),
      });
    },
    actualDispatch() {
      this.$refs.dispatchRef?.dispatchDialog("actual", {
        successFunction: () => this.getLogisticsNodes(),
      });
    },
    getLogisticsNodes(callBack) {
      // 操作单id
      if (this.isNoDrawer && this.activities.id) {
        const http_obj = {
          clearance: getClearanceLogistics, // 清关
          tail: getWarehouseLogistics, // 头程
        };
        const { requestKey } = this.orderSourceObj;
        const httpLogistics =
          requestKey && http_obj[requestKey]
            ? http_obj[requestKey]
            : getLogisticsList;
        httpLogistics(this.activities.id, this.orderType).then((res) => {
          this.list = res.data || [];
          callBack && callBack();
        });
      }
    },
    show(id) {
      // 操作单id
      getLogisticsList(id, this.orderType).then((res) => {
        this.activities.list = res.data || [];
        this.$refs.myDrawer.show();
      });
    },
    changeActivities(callBack) {
      // 外部组件有调用此方法
      getLogisticsList(this.activities.id, this.orderType).then((res) => {
        this.list = res.data || [];
        callBack && callBack();
      });
    },
    checkOptions(row) {
      return this.showClient && this.cityOptions.some((e) => e.id === row.id);
    },
    hide() {
      this.$refs.myDrawer.hide();
    },
    sendMail() {
      console.log(this.list[this.activitySelect]);
      const { nodeName } = this.list[this.activitySelect];
      this.$refs.sendEmail.show({
        nodeName,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/mixin.scss";
@import "~@/assets/styles/variables.scss";
/deep/ {
  .el-timeline-item__icon {
    font-size: 12px;
  }
  .el-timeline-item {
    padding-bottom: 10px;
    &.timeline-title {
      padding-bottom: 0px;
    }
  }
  .el-timeline-item__timestamp.is-bottom {
    margin-top: 5px;
  }
}
.sn-info {
  @include spaceBetween;
  color: #1f1f1f;
  font-size: 14px;
}
.desti-info {
  @include spaceBetween;
  padding: 0 24px;
  margin-top: 32px;
  .depart-arrive {
    white-space: nowrap;
    font-size: 30px;
    font-weight: 500;
    color: #333333;
    align-self: center;
  }
  .by-way {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0 25px;
    flex: 1;
    .arrows {
      max-width: 216px;
      height: 2px;
      background: #5094ff;
      margin: 6px 0 20px;
    }
    .chuanbo,
    .time-consume {
      align-self: center;
    }
    .chuanbo {
      font-size: 28px;
      color: #5094ff;
    }
  }
}
.track-outer {
  position: relative;
  min-height: 300px;
}
.track {
  margin: 10px 0px 22px 0px;
  // margin-bottom: 22px;
  line-height: 30px;
  .track-title {
    font-size: 16px;
    font-weight: bold;
  }
}
.el-timeline {
  margin-top: 4px;
  padding-left: 9px;

  &.isShowSelect {
    margin-left: 24px;
  }
}
.timeline {
  /deep/ {
    .el-timeline-item__tail {
      left: 3.5px;
      border-left: 1px dashed #e4e7ed;
    }
    .el-timeline-item__node--normal {
      left: 0.5px;
      width: 7px;
      height: 7px;
    }
    .el-timeline-item__node--large {
      left: -7px;
      width: 22px;
      height: 22px;
    }
  }
  .title {
    font-size: 14px;
    font-weight: 500;
    color: #515151;
    line-height: 30px;
    @include spaceBetween;
    border-bottom: 1px solid #e2e2e2;

    &.is-active {
      color: #515151;
    }
    .time-consume {
      font-size: 14px;
      color: #5094ff;
    }

    .activity-select {
      position: absolute;
      left: -32px;
    }
  }
  .operation {
    font-size: 13px;
    color: #bcbcbc;
    line-height: 18px;
    word-break: break-all;
  }
  .operation-time {
    font-size: 13px;
    color: #515151;
    margin-bottom: 3px;
    line-height: 18px;
  }
}

/deep/.orange-bg {
  line-height: 30px;
  background: rgba($color: #5094ff, $alpha: 0.1);
  border-radius: 25px;
  color: #5094ff;
  padding: 0 10px;
  font-size: 14px;
}
.show-client-btn {
  margin-left: 10px;
  .client-checkbox {
    margin-left: 10px;
  }
}
.table-empty {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, calc(-50% + 28px));
  line-height: 20px;
  img {
    width: 100px;
    padding: 30px 0 14px;
  }
  div {
    padding-bottom: 30px;
  }
}
</style>
