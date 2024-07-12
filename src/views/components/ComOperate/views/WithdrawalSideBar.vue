<template>
  <!-- WMS退仓入库详情侧边栏 -->
  <div style="height: 100%">
    <OperateSidebarCard :showBarTabArr="showBarTabArr" class="customs-bar-box">
      <template v-slot:slideCard="{ showTabObj }">
        <div v-show="showTabObj.tabKey === 'remarkBar'">
          <div class="operate-status">
            <span>{{ overseaLangObj.zt_status || "状态" }}</span>
            <div style="flex: 1; background-color: #f9f9f9; color: #a5a5a5">
              {{
                getDictObj("returnWmsOrderState", formData.state) ||
                formData.state
              }}
            </div>
          </div>
          <RemarksBarCard :formData="formData" v-if="['tc_operate', 'tc_warehouse'].includes(formData.webPageSource)" />
        </div>

        <template v-if="showBarTabArr.some((e) => e.tabKey === 'stateBar')">
          <div v-show="showTabObj.tabKey === 'stateBar'">
            <!-- <div class="flow-card-title">业务相关信息</div> -->
            <OperateFlowCard
              :formData="formData"
              :nodeFlowList="nodeFlowList"
              @handleFlowClick="handleNodeClick"
            />
          </div>
        </template>
      </template>
    </OperateSidebarCard>
  </div>
</template>

<script>
import { mixinOperable } from "../mixins/operationBtnList.js";
import { mixinNodeOperable } from "../mixins/nodeOperate.js";
import { getLogisticsByOrder } from "@/api/operateManage/common";
import { mapActions } from "vuex";
export default {
  mixins: [mixinOperable, mixinNodeOperable],
  props: {
    formData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      nodeFlowList: [],
      showBarTabArr:[],
      tagsList:[
      {
        isTabShow: false,
        showWebPageSource:['tc_operate', 'tc_warehouse','tc_order'],
        tabKey: "stateBar",
        name: "轨迹",
      },
      {
        isTabShow: false,
        showWebPageSource:['tc_operate', 'tc_warehouse'],
        tabKey: "remarkBar",
        className: "remarks-bar",
        name: "备注",
      },
      ]
    };
  },
  methods: {
    ...mapActions(["tagsView/delView"]),
    handleNodeClick(row) {
      const { nodeId, isAlert } = row;
      const { orderSn,wmsId } = this.formData;
      if (!isAlert) {
        switch (nodeId) {
          case 64: // 收货
          case 65://收货确认
          case 67://商家
            this["tagsView/delView"](this.$route).then(() => {
              // 返回时关闭当前页面，防止反复保存
              this.$router.push({
                path: "/warehouseManage/inStorage/predictionReceiving",
                query: {
                  type: "1",
                  search: orderSn,
                  warehouseId:wmsId
                },
              });
            });
            break;
        }
      }
    },
  },
  created() {
    const { id,webPageSource } = this.formData;
    this.showBarTabArr = this.tagsList.filter((e)=>{
      const {showWebPageSource}=e
      return showWebPageSource?showWebPageSource.includes(webPageSource):true
    })
    getLogisticsByOrder({ id, orderType: 25 }).then((res) => {
      this.nodeFlowList = res.data || [];
    });
  },
  components: {
    OperateSidebarCard: () => import("../components/operateCard"),
    OperateFlowCard: () =>
      import("_comp/ComOperate/components/operateCard/operationFlow.vue"), // 业务流程节点
    RemarksBarCard: () => import("../components/remarks/WithdrawalRemark"),
  },
};
</script>

<style lang="scss" scoped>
.customs-bar-box {
  .flow-card-title {
    font-size: 14px;
    font-weight: bold;
    margin: 25px 0 10px;
    color: #515151;
  }
  .operate-status {
    display: flex;
    font-size: 14px;
    height: 34px;
    line-height: 34px;
    border-radius: 4px;
    border: 1px solid #5094ff;
    margin-top: 24px;
    text-align: center;
    overflow: hidden;
    & > span:nth-child(1) {
      width: 74px;
      background: #5094ff;
      color: #fff;
    }
  }
}
</style>
