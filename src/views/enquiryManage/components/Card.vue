<template>
  <el-row :gutter="20" class="card">
    <template v-for="(item, i) in config">
      <el-col :span="24 / config.length" :key="i">
        <div
          class="card-item"
          :style="{ color: item.color, backgroundColor: item.bgColor }"
        >
          <div
            class="card-icon"
            v-if="item.icon"
            :class="`iconfont ${item.icon}`"
          ></div>
          <div class="card-right">
            <div class="card-line" v-for="l in item.list" :key="l.prop">
              <div
                class="label"
                :style="`width:${item.labelWidth || labelWidth}`"
              >
                {{ l.label }}
              </div>
              <div class="value">
                <TooltipOver
                  :content="`${handleValue(l)}${l.unit || ''}`"
                  class="card-tooltipOver"
                />
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </template>
  </el-row>
</template>

<script>
import { mapState } from "vuex";
export default {
  components: {
    TooltipOver: () => import("_comp/TooltipOver"),
  },
  props: {
    labelWidth: {
      type: String,
      default: "70px",
    },
    config: {
      type: Array,
      default: () => [],
    },
    formData: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    ...mapState({
      dictData: (state) => state.dictionary.dicsData,
    }),
  },
  methods: {
    handleValue(item) {
      if (item.render) {
        return item.render(this.formData);
      } else if (item.basicType) {
        return this.getBasicName(item.basicType, this.formData[item.prop]);
      }
      return this.formData[item.prop] || "--";
    },
    getBasicName(basicType, val) {
      if (!val && val !== 0) return "--";
      if (!this.dictData[basicType]) return val;
      if (this[basicType]) {
        return this[basicType][val]?.nameCn;
      } else {
        this[basicType] = {};
        this.dictData[basicType].forEach((item) => {
          this[basicType][item.value] = item;
        });
      }
      return this[basicType][val] ? this[basicType][val].nameCn : "--";
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  margin-bottom: 7.5px;
  .card-item {
    display: flex;
    align-items: center;
    padding: 16px 20px;
    border-radius: 4px;

    .card-icon {
      font-size: 35px;
      margin-right: 13px;
    }
    .card-right {
      flex: 1;
    }
    .card-line {
      display: flex;
      align-items: center;
      line-height: 22px;

      .label {
        font-size: 12px;
        text-align: right;
      }
      .value {
        flex: 1;
        width: 50px;
        font-size: 16px;
        font-weight: bold;
      }
    }
  }
}
</style>