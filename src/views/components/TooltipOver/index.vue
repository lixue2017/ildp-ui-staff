<template>
  <div v-if="fieldItem.txtLineCols" class="txt-cols-box">
    <!-- 多行显示 -->
    <el-row
      v-if="!fieldItem.txtObjKey || formModel[fieldItem.txtObjKey]"
      :gutter="20"
    >
      <template v-for="(rItem, rIndex) in fieldItem.txtLineCols">
        <el-col
          class="col-txt"
          :span="rItem.txtColSpan || 24"
          :key="`ic_${rIndex}`"
        >
          <i
            v-if="rItem.iconColClass"
            class="col-icon"
            :class="rItem.iconColClass"
          ></i>
          <span>
            <span v-if="rItem.txtColLabel"> {{ rItem.txtColLabel }} </span>
            <template v-if="rItem.txtColRender">{{
              rItem.txtColRender(
                formModel,
                fieldItem,
                dictionary.dicsData[rItem.txtColDictKey]
              )
            }}</template>
            <template v-else>{{
              (fieldItem.txtObjKey
                ? formModel[fieldItem.txtObjKey][rItem.txtColKey]
                : formModel[rItem.txtColKey]) || "--"
            }}</template>
          </span>
        </el-col>
      </template>
    </el-row>
    <template v-else>--</template>
  </div>

  <div
    v-else
    class="text-tooltip"
    :class="fieldItem.txtClassName || 'base-flex-align'"
  >
    <el-tooltip
      class="item"
      effect="dark"
      :disabled="isShowTooltip"
      :content="`${txtContent(content)}` /* 传入el组件需要改为字符串类型 */"
      placement="top"
    >
      <p
        class="over-flow txt-cols-box"
        :class="className"
        @mouseover="onMouseOver(refName)"
      >
        <i
          v-if="fieldItem.iconColClass"
          class="col-icon"
          :class="fieldItem.iconColClass"
        ></i>
        <span
          :ref="refName"
          :class="[textLineClamp > 1 && 'over-line-clamp']"
          :style="{
            ...(textLineClamp > 1
              ? {
                  'white-space': 'pre-wrap', // 识别\n换行符, 同时保留多个空白格
                  '-webkit-line-clamp': textLineClamp,
                }
              : {}),
            color: fieldItem.fontColor
              ? colDictParams(fieldItem).color
              : fieldItem.fontTxtColor,
            ...(fieldItem.txtStyleObj || {}),
          }"
        >
          <!-- 文字与标签需要在同一行, 否则会多一个空白格 -->
          <template>{{ txtContent(content) }}</template>
        </span>
        <span v-if="isMoreBtn" class="more-txt">
          ...
          <span @click="dialogVisible = true" class="primary-text-btn"
            >更多</span
          >
        </span>
      </p>
    </el-tooltip>

    <div
      class="tag-txt-box"
      :style="{
        ...(fieldItem.tagStyleObj || {}),
      }"
      v-if="fieldItem.txtTagArr && fieldItem.txtTagArr.length"
    >
      <!-- 标签 -->
      <template v-for="(tItem, tIndex) in fieldItem.txtTagArr">
        <span
          :key="tIndex"
          :class="`tag-${tItem.tagColor || 'blue'}-color`"
          :style="{
            color: tItem.fontTagColor ? colDictParams(tItem).color : undefined,
            background: tItem.bgTagColor
              ? `${colDictParams(tItem).color}1A`
              : undefined,
          }"
          v-if="
            !tItem.noDictValueHide ||
            colDictParams(tItem).nameCn ||
            (tItem.tagKey && formModel[tItem.tagKey])
          "
          >{{
            colDictParams(tItem).nameCn ||
            (tItem.tagKey && formModel[tItem.tagKey]) ||
            "--"
          }}</span
        >
      </template>
    </div>

    <el-dialog
      v-if="dialogVisible"
      class="tip-over-txt"
      :title="labelTip"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="60%"
    >
      <div style="word-break: break-all; white-space: pre-wrap">
        <template>{{ txtContent(content) }}</template>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
/**
 * txtTagArr: [{
 * 	tagColor: 'green' / 'grey',
 * 	basicType: '',
 * 	basicTypeVal: ''
 * }]
 */
import { mapState } from "vuex";

export default {
  name: "textTooltip",
  props: {
    // 显示的文字内容
    content: {
      type: [String, Number],
      default: () => "",
    },
    textLineClamp: {
      type: [Number],
      default: () => 1,
    },
    labelTip: {
      type: [String, Number],
      default: () => "更多",
    },
    showMoreTextBtn: {
      type: Boolean, // 显示更多按钮
      default: () => false,
    },
    numDecimal: {
      type: [Number, String],
      default: () => null,
    },
    fieldItem: {
      type: Object,
      default: () => ({}),
    },
    formModel: {
      type: Object,
      default: () => ({}),
    },
    // 外层框的样式，在传入的这个类名中设置文字显示的宽度
    className: {
      type: String,
      default: () => "",
    },
    colsObjKey: {
      type: String,
      default: () => "",
    },
    // 为页面文字标识（如在同一页面中调用多次组件，此参数不可重复）
    refName: {
      type: String,
      default: () => {
        return "tooltipOverRef";
      },
    },
  },
  data() {
    return {
      isShowTooltip: true,
      isMoreBtn: false,
      dialogVisible: false,
    };
  },
  methods: {
    onMouseOver(str) {
      if (this.$refs[str]) {
        if (this.textLineClamp > 1) {
          let parentHeight = this.$refs[str].parentNode.offsetHeight;
          let contentHeight = this.$refs[str].scrollHeight;
          if (contentHeight > parentHeight) {
            if (this.showMoreTextBtn) {
              this.isMoreBtn = true;
            } else {
              this.isShowTooltip = false;
            }
          } else {
            if (this.showMoreTextBtn) {
              this.isMoreBtn = false;
            } else {
              this.isShowTooltip = true;
            }
          }
          return;
        }
        let parentWidth = this.$refs[str].parentNode.offsetWidth;
        let contentWidth = this.$refs[str].offsetWidth;
        // 判断是否开启tooltip功能
        if (contentWidth > parentWidth) {
          this.isShowTooltip = false;
        } else {
          this.isShowTooltip = true;
        }
      }
    },
    txtContent(content) {
      // 不能在created()里赋值，父组件值改变时，子组件的值需要自动更新
      if (content === 0) {
        return 0;
      }
      let txt = content || "--";
      if (this.numDecimal || this.numDecimal === 0) {
        if (this.fieldItem?.colFormat === "thousandthMark") {
          txt = this.formatMoney(txt, this.numDecimal); // 金额显示几位小数与千分符
        } else {
          txt = this.toFixedNum(txt, this.numDecimal); // 数字显示几位小数
        }
      }
      if (this.colsObjKey) {
        // 整个cols取对象里的值
        txt = this.formModel[this.colsObjKey][this.fieldItem.id] || "--";
      }
      if (this.fieldItem.colObjKey && this.fieldItem.id.includes(".")) {
        // cols中的单个item取对象里的值
        const [obj_key, val_key] = this.fieldItem.id.split(".");
        txt = this.formModel[obj_key][val_key] || "--";
      }
      if (this.fieldItem?.colUnit) {
        // 单位
        return `${txt} ${this.fieldItem?.colUnit || ""}`;
      }
      return txt;
    },
    colDictParams(col) {
      const { basicType, basicTypeVal, id } = col;
      if (!basicType) {
        return {
          color: "",
        };
      }
      const { [basicType]: dictColArr = [] } = this.dictionary.dicsData;
      const dictObj = dictColArr.find(
        (e) => this.formModel[basicTypeVal || id] == e.value
      );
      return dictObj || {};
    },
  },
  computed: {
    ...mapState(["dictionary"]),
  },
};
</script>
<style lang="scss">
@import "~@/assets/styles/tooltip.scss"; //悬浮框
</style>
<style lang="scss" scoped>
.txt-cols-box {
  .col-txt {
    word-break: break-all;
  }
  .col-icon {
    color: #8b8b8b;
    font-size: 16px;
    margin-right: 8px;
  }
}
.text-tooltip {
  position: relative;
  .more-txt {
    position: absolute;
    bottom: 0;
    right: 0px;
    padding-left: 2px;
    background: #fff;
    line-height: 22px;
  }
  .tag-txt-box {
    padding-left: 3px;
    white-space: nowrap;
    span {
      margin-right: 5px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
}
.over-flow {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  &.txt-rg {
    flex: 1;
  }
}
.over-line-clamp {
  padding-top: 5px;
  white-space: normal;
  display: -webkit-box;
  // -webkit-line-clamp: 10;
  -webkit-box-orient: vertical;
  word-break: break-all;
  line-height: 22px;
}
p {
  margin: 0;
}
.tip-over-txt {
  /deep/ {
    .el-dialog__body {
      padding: 0 20px;
      line-height: 22px;
    }
  }
}
</style>
