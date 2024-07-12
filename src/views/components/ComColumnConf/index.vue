<template>
  <el-popover
    placement="bottom"
    width="700"
    v-model="showPopover"
    trigger="click"
    @show="handleShow"
  >
    <div class="custom-conf-list-box" :class="[overseaLangObj.yu_yan_lang]">
      <div id="sortColumn" class="conf-list">
        <div
          v-for="(item, idx) in columnConfList"
          :key="idx"
          :class="[item.fixed && 'ignore-elements']"
          class="conf-col-item"
        >
          <div class="base-flex-between">
            <div class="check-label">
              <el-checkbox
                v-model="item.showEnable"
                :disabled="!!item.fixed || item.request"
                >{{ item.label }}</el-checkbox
              >
            </div>
            <span
              class="mandatory-check"
              :style="{ opacity: item.fixed || item.request ? 1 : 0 }"
              >({{ overseaLangObj.bt_required("必选") }})</span
            >
            <span
              class="mandatory-check"
              :style="{ opacity: item.fixed ? 1 : 0 }"
              >({{ overseaLangObj.gd_lock("固定") }})</span
            >
            <div class="checkbox-icon" v-if="!item.fixed && showMoveBtn">
              <i
                :class="`iconfont shangyi ${firstIndex === idx && 'hide'}`"
                @click="handleClick('pre', idx)"
              ></i>
              <i
                :class="`iconfont a-shangyi2 ${lastIndex === idx && 'hide'}`"
                @click="handleClick('next', idx)"
              ></i>
            </div>
            <div class="width-conf base-flex-end">
              <span class="width-txt"
                >{{
                  item.widthKey === "minWidth"
                    ? overseaLangObj.yu_yan_lang === "en-us"
                      ? "MIN "
                      : "最小"
                    : ""
                }}{{
                  overseaLangObj.yu_yan_lang === "en-us" ? "WIDTH" : "宽度"
                }}</span
              >
              <span class="width-inp">
                <el-input-number
                  v-if="item.widthKey === 'minWidth'"
                  v-model="item.minWidth"
                  v-input-number-limit="0"
                  :controls="false"
                  :max="390"
                  :min="60"
                  size="small"
                  :placeholder="overseaLangObj.please_input('请输入')"
                />
                <el-input-number
                  v-else
                  v-model="item.width"
                  v-input-number-limit="0"
                  :controls="false"
                  :max="390"
                  :min="60"
                  size="small"
                  :placeholder="overseaLangObj.please_input('请输入')"
                />
              </span>
              <span>px</span>
            </div>
          </div>
        </div>
      </div>

      <div class="base-flex-between bottom-btn">
        <el-button
          size="small"
          v-throttle
          type="primary"
          plain
          @click="handleShow"
          >{{ overseaLangObj.cz_reset }}</el-button
        >
        <div>
          <el-button size="small" v-throttle type="primary" @click="renewEvt">{{
            overseaLangObj.gx_update
          }}</el-button>
          <el-button
            size="small"
            v-throttle
            type="primary"
            @click="submitForm"
            >{{ overseaLangObj.qr_confirm() }}</el-button
          >
          <el-button size="small" plain @click="cancelEvt">{{
            overseaLangObj.qx_cancel()
          }}</el-button>
        </div>
      </div>
    </div>

    <el-button
      slot="reference"
      size="small"
      v-throttle
      :round="columnConfObj.btnRound"
      class="col-btn"
      icon="iconfont lieshezhi"
      >{{ basicLangObj.lsz_set_cols || "列设置" }}</el-button
    >
  </el-popover>
</template>

<script>
import Sortable from "sortablejs";
import { systemColumnList, saveSystemColumn } from "@/api/common.js";
import basicLangObj from "@/language/basicLang.js";
// sortablejs官网配置： http://www.sortablejs.com/options.html
export default {
  props: {
    tableCols: {
      type: Array,
      default: () => [],
    },
    tName: {
      type: String,
      default: () => "1",
    },
    columnConfObj: {
      type: Object,
      default: () => ({}),
    },
    showMoveBtn: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showPopover: false,
      resData: {},
      columnConfList: [],
      webTableCols: [], // 本地列数据
      basicLangObj,
      firstIndex: "",
      lastIndex: "",
    };
  },
  methods: {
    submitForm() {
      // 调接口保存后回传事件
      // console.log('====', this.columnConfList)
      const { id } = this.resData;
      const opt = {
        id, // 修改时需要传
        tab: this.tName,
        routeType: this.$route.path,
        columnFields: this.columnConfList.map((ele) => {
          const { widthKey, ...nEle } = ele;
          return {
            ...nEle,
            showEnable: ele.showEnable ? 1 : 0, // 是否勾选，0：否，1：是
          };
        }),
      };
      saveSystemColumn(opt).then(() => {
        this.$emit("setColumnConf", opt.columnFields);
        this.showPopover = false;
      });
    },
    cancelEvt() {
      this.showPopover = false;
    },
    renewEvt() {
      this.columnConfList = this.webTableCols.map((ele) => {
        return {
          ...ele,
          widthKey: ele.minWidth ? "minWidth" : "width",
          showEnable: true, // 默认全部勾选
        };
      });
    },
    handleShow() {
      // 暂时不做 - 列设置需要与菜单进行关联，在菜单管理加入更新列操作。表格列有变动时，可以手动清空之前的设置
      const opt = {
        routeType: this.$route.path,
        tab: this.tName,
      };
      const nCols = this.tableCols.filter(
        (e) =>
          !["index", "selection", "expand"].includes(e.type) &&
          !["operation"].includes(e.prop)
      );
      this.webTableCols = nCols;
      this.firstIndex = "";
      this.lastIndex = "";
      systemColumnList(opt).then((res) => {
        const { columnFields = [], ...resData } = res.data || {};
        this.resData = resData;
        const nTableCols = columnFields.length ? columnFields : nCols;
        // const nTableCols = nCols;
        // fixed 接口需要加固定值入参
        this.columnConfList = nTableCols.map((ele, index) => {
          const obj = columnFields.length
            ? nCols.find((e) => e.prop === ele.prop) || {}
            : {
                minWidth: ele.minWidth,
              };
          if (
            obj.fixed !== "left" &&
            !this.firstIndex &&
            this.firstIndex !== 0
          ) {
            this.firstIndex = index;
          }
          if (
            obj.fixed === "right" &&
            !this.lastIndex &&
            this.lastIndex !== 0
          ) {
            this.lastIndex = index - 1;
          }
          return {
            ...obj,
            ...ele,
            widthKey: obj.minWidth ? "minWidth" : "width",
            showEnable: [0, 1].includes(ele.showEnable)
              ? ele.showEnable === 1
              : true, // 默认全部勾选
          };
        });
        if (!this.lastIndex && this.lastIndex !== 0) {
          this.lastIndex = this.columnConfList.length - 1;
        }
      });
    },
    handleClick(type, index) {
      if (type === "pre") {
        this.swapArray(this.columnConfList, index, index - 1);
      } else {
        this.swapArray(this.columnConfList, index, index + 1);
      }
    },
    swapArray(arr, index1, index2) {
      arr[index1] = arr.splice(index2, 1, arr[index1])[0];
      return arr;
    },
  },
  mounted() {
    this.$nextTick(() => {
      let that = this;
      new Sortable(document.getElementById("sortColumn"), {
        sort: true,
        animation: 150,
        // handle: '.handle', // handle's class
        filter: ".ignore-elements", // 过滤器，不需要进行拖动的元素
        preventOnFilter: false, //  在触发过滤器`filter`的时候是否调用`event.preventDefault()`，有输入框，需要设置为false
        onEnd: function (evt) {
          // 固定列不可移动
          if (!that.columnConfList[evt.newIndex].fixed) {
            that.columnConfList.splice(
              evt.newIndex,
              0,
              that.columnConfList.splice(evt.oldIndex, 1)[0]
            );
          }
          let newArr = that.columnConfList.slice(0);
          that.columnConfList = [];
          that.$nextTick(() => {
            that.columnConfList = newArr;
          });
        },
      });
    });
  },
  created() {},
};
</script>
<style lang="scss" scoped>
/* 拖拽列样式 */
// .sortable-ghost {
// 	opacity: .8;
// }
.custom-conf-list-box {
  &.en-us {
    .mandatory-check {
      flex: 0 0 80px;
    }
    .width-conf {
      flex: 0 0 175px;
    }
  }
  .conf-list {
    height: calc(100vh - 300px);
    overflow: auto;
    list-style: none;
    .conf-col-item {
      padding: 5px 10px 5px 0;
      border-top: 1px solid #e2e2e2;
      min-height: 36px;
      cursor: move;
    }
  }
  .check-label {
    flex: 0 0 200px;
    text-align: left;
    /deep/ .el-checkbox__label {
      white-space: normal;
      vertical-align: middle;
    }
  }
  .mandatory-check {
    flex: 0 0 40px;
    margin: 0 10px;
  }
  .checkbox-icon {
    i {
      font-size: 16px;
      color: #5094ff;
      cursor: pointer;
      &:nth-child(2) {
        margin-left: 7px;
      }
      &.hide {
        visibility: hidden;
      }
    }
  }
  .width-conf {
    flex: 0 0 148px;
    margin-left: 5px;
  }
  .width-inp {
    flex: 0 0 70px;
    margin: 0 3px;
  }
  .check-box-item {
    border: 1px solid #bcbcbc;
    border-radius: 2px;
    width: 14px;
    height: 14px;
    background-color: #fff;
    z-index: 1;
    cursor: pointer;
    .el-icon-check {
      color: #5094ff;
    }
  }
  .bottom-btn {
    border-top: 1px solid #e2e2e2;
    padding-top: 5px;
  }
}
.col-btn {
  margin-left: 10px;

  /deep/.iconfont {
    font-size: 13px;
  }
}
</style>
