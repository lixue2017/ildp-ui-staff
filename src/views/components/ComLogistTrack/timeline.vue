<template>
  <el-timeline :class="className" :reverse="false">
    <template v-for="(activity, i) in timeList">
      <el-timeline-item
        :key="`title-${i}`"
        :icon="`iconfont icon-${activity.nodeIcon}`"
        size="large"
        color="#5094ff"
      >
        <div class="title">{{ activity.nodeName }}</div>
      </el-timeline-item>

      <template v-for="(cItem, index) in activity.infoList">
        <el-timeline-item
          :key="`line-${i}-${index}`"
          class="timeline"
          size="normal"
          color="#bcbcbc"
					v-if="cItem.msg"
        >
          <!-- <div class="operation">
                  {{ cItem.trajectoryTime }}
          </div>-->
          <!-- 不显示时间 -->
          <div class="operation">
            <span>{{ cItem.msg }}</span>
          </div>
        </el-timeline-item>
      </template>
    </template>
  </el-timeline>
</template>

<script>
export default {
	props: {
		timeList: {
			type: Array,
			default: () => ([])
		},
		className: {
			type: String,
			default: () => ''
		},
	}
}
</script>

<style lang="scss" scoped>
.el-timeline {
  /deep/ {
    .el-timeline-item__tail {
      left: 3.5px;
      border-left: 1px dashed #bcbcbc;
    }
    .el-timeline-item__node--normal {
      left: 1px;
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
    font-size: 15px;
    font-weight: bold;
    color: #515151;
    line-height: 30px;
		width: 100%;
		display: flex;
		justify-content: space-between;

    &.is-active {
      color: #515151;
    }
    .time-consume {
      font-size: 14px;
      color: #5094ff;
    }
  }
  .operation {
    font-size: 13px;
    color: #515151;
    margin-bottom: 6px;
		word-break: break-all;

    span {
      // color: #bcbcbc;
      line-height: 18px;
      font-weight: bold;
      color: #515151;
    }
  }
	&.trajectory-line {
		.operation {
			span {
				color: #bcbcbc;
			}
		}
	}
}
</style>