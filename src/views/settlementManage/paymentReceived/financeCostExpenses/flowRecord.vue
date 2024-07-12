<template>
  <div>
    <ComDrawer
      class="flow-cabinet-arrangement"
      ref="myDrawer"
      :customDrawer="drawerConfig"
      :confirmClose="false"
    >
      <template v-slot:content>
        <ComDetailTop title="流程记录" :config="{}" />
				
				<div v-for="(fItems, i) in flowRecord" :key="`f_${i}`">
					<el-timeline :reverse="false">
						<template v-for="(item, index) in fItems">
							<el-timeline-item
								:key="`t_${index}`"
								class="timeline"
								size="normal"
								:color="`${item.auditTime ? '#5094ff' : '#bcbcbc'}`"
							>
								<div class="operation-time">
									<span class="time-name">{{ item.auditByName || '--' }}</span>
									<span class="time-txt">{{ item.auditTime}}</span>
								</div>
								<div class="time-status">{{ item.statusName }}</div>
								<div class="time-status">{{ item.remark }}</div>
							</el-timeline-item>
						</template>
					</el-timeline>
				</div>

      </template>
    </ComDrawer>
  </div>
</template>

<script>

import { getFlowRecord } from "@/api/settlementManage/paymentReceived";

export default {
  props: {},
  data() {
    return {
      drawerConfig: {
        title: "",
        width: "588px",
        size: "small",
				wrapperClosable: true,
        footer: [
          {
            text: "关 闭",
            plain: true,
            handleClick: this.hide,
          },
        ],
      },
			flowRecord: []
    };
  },
  methods: {
    show(id) {
			getFlowRecord(id).then(res => {
				this.flowRecord = res.rows || []
			})
      this.$refs.myDrawer.show();
    },
    hide() {
			this.$refs.myDrawer.hide();
    },
  },
  components: {
    ComDrawer: () => import("_comp/ComDrawer"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.flow-cabinet-arrangement {
  /deep/ .el-drawer {
    .com-detail-top {
      margin-bottom: 20px;
      padding: 20px 0 0 0;
    }
    .el-drawer__header {
      display: none;
    }
		.el-timeline-item__tail {
			border-left-color: #5094ff;
		}
  }
	.operation-time {
		margin-bottom: 3px;
		.time-txt {
			margin-left: 10px;
			color: #bcbcbc;
		}
	}
	.time-status {
		color: #bcbcbc;
		word-break: break-all;
	}
}

</style>