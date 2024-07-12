<template>
  <div class="task-item base-flex-align">
    <template v-for="item in tableColumns">
      <div class="" :key="item.prop">
        <div class="label">{{ item.label }}</div>
        <div class="value">
          <template v-if="item.basicType">
            <i
              v-if="item.dotColor"
              class="status-dot"
              :style="{
                backgroundColor: colDictParams(item, formData, true).color,
              }"
            />
            <span
              :style="{
                color: colDictParams(item, formData, true).color,
              }"
            >
              {{ colDictParams(item, formData) || "--" }}
            </span>
          </template>
          <TooltipOver
            v-else
            className="txt-rg"
            :content="formData[item.prop] || '--'"
          />
        </div>
      </div>
    </template>
    <div class="align-right" style="flex: 1">
      <el-button
        type="info"
        size="small"
        icon="el-icon-info"
        plain
        @click="handleInfo"
      >
        <span class="text-theme-color">详情</span>
      </el-button>
    </div>
  </div>
</template>

<script>
import { tableColumns } from "./model";
import { mapState } from "vuex";
export default {
  props: {
    formData: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    TooltipOver: () => import("_comp/TooltipOver"),
  },
  data() {
    return {
      tableColumns,
    };
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  methods: {
    handleInfo() {
      this.$emit("handleInfo");
    },
    colDictParams(col, row, isObj) {
      const { [col.basicType]: dictColArr = [] } = this.dictionary.dicsData;
      const dictObj =
        dictColArr.find((e) => row[col.basicTypeVal || col.prop] == e.value) ||
        {};
      if (isObj) {
        return dictObj;
      }
      // 不能给默认值，会影响有些render函数的显示
      return dictObj.nameCn;
    },
  },
};
</script>
<style lang="scss" scoped>
.task-item {
  padding: 15px 50px;
  background: #f4f8ff;
  border-radius: 2px;
  border: 1px solid #e3edff;
  margin-bottom: 10px;
  & > div {
    width: 200px;
    padding: 0 10px;
    .label {
      color: #8b8b8b;
      line-height: 18px;
      margin-bottom: 10px;
    }
    .value {
      color: #515151;
      line-height: 18px;
    }
  }
  .align-right {
    text-align: right;
  }
  /deep/ {
    .el-button--info.is-plain {
      background: #fff;
      color: #919191;
    }
  }
}
</style>
