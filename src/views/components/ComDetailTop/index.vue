<template>
  <div class="com-detail-top">
    <div class="title">
      {{ title }}
      <slot name="subTitle" />
    </div>
    <slot name="middleInfo" />
    <div class="create-info">
      <template v-for="item in titConfig.columnConfig || config.columnConfig">
        <span :key="item.prop">
          <span class="label">{{ item.label }}：</span>
          <span
            class="value"
            :style="{ color: item.color ? item.color : '#515151' }"
            >{{ formModel[item.prop] || "--" }}</span
          >
        </span>
      </template>
      <slot name="info" />
    </div>

    <slot name="titContentSlot" />

    <div class="page-turn">
      <template
        v-if="idOrderList.length || (config.rightBtn && config.rightBtn.length)"
      >
        <template v-for="item in config.rightBtn">
          <el-button
            size="small"
            :type="item.btnType || 'text'"
            :icon="item.iconPosition && item.icon"
            @click="handleClick(item.type)"
            :key="item.text"
            :class="{
              'disable-change': handleShow(item.type),
              [item.className]: item.className,
            }"
            :plain="item.plain"
            :round="item.round"
          >
            {{ item.text }}
            <i
              v-if="item.icon && item.iconPosition !== 'left'"
              :class="item.icon"
            ></i>
          </el-button>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
import { paramUrl } from "@/utils/index";
import { msgBox } from "@/utils/confirmBox.js";
import { mapActions } from "vuex";
import basicLangObj from "@/language/basicLang.js";
import qs from "qs";

export default {
  props: {
    title: {
      // 标题
      type: String,
      default: "",
    },
    formModel: {
      // 数据
      type: Object,
      default: () => ({}),
    },
    config: {
      // 配置
      type: Object,
      default: (data = {}) => {
        return {
          columnConfig: [
            // 标题右侧label，数据取值formModel
            {
              label: basicLangObj.cjr_create || "创建人",
              prop: "createBy",
            },
            {
              label: basicLangObj.cj_date || "创建时间",
              prop: "createTime",
            },
          ],
          rightBtn: [
            // 右侧按钮集合
            {
              icon: "el-icon-arrow-left",
              text: basicLangObj.syt_previous || "上一条",
              iconPosition: "left",
              type: "pre",
            },
            {
              icon: "el-icon-arrow-right el-icon--right",
              text: basicLangObj.xyt_next || "下一条",
              type: "next",
            },
            {
              icon: "iconfont icon-fanhui",
              text: basicLangObj.fh_back || "返回",
              type: "back",
              className: "back",
            },
          ],
          ...data,
        };
      },
    },
    titConfig: {
      type: Object,
      default: () => ({}),
    },
    orderIdList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      currentIndex: 0,
      idOrderList: this.orderIdList,
    };
  },
  mounted() {
    const { id, pageSign } = this.$route.query;
    const pageArr = (pageSign || "").split(",").filter((e) => e);
    if (pageArr.length) {
      if (pageArr.some((s) => s == id)) {
        this.idOrderList = pageArr;
      } else {
        this.idOrderList = pageArr.concat([id]);
      }
    } else {
      if (!this.orderIdList.length) {
        this.idOrderList = [id];
      }
    }
    this.currentIndex = this.idOrderList.findIndex((item) => item == id);
  },
  methods: {
    ...mapActions(["tagsView/delView", "operateDetails/storeBackRefresh"]),
    handleShow(type) {
      if (type === "pre" && this.currentIndex === 0) {
        return true;
      }
      if (
        type === "next" &&
        this.currentIndex === this.idOrderList.length - 1
      ) {
        return true;
      }
      return false;
    },
    handleClick(type) {
      if (type === "back") {
        const { backPath, isBackTip } = this.$route.query;
        if (backPath) {
          this.comReBack({ isBackTip });
        } else {
          this.$emit("handleClick", { type });
        }
        return;
      }
      if (type === "pre") {
        if (this.currentIndex == 0) return;
        this.currentIndex--;
      }
      if (type === "next") {
        if (this.currentIndex == this.idOrderList.length - 1) return;
        this.currentIndex++;
      }
      if (type === "pre" || type === "next") {
        const id = this.idOrderList[this.currentIndex];
        const { query } = this.$route;
        if (query.pageSign) {
          this.$route.query.id = id;
          window.history.replaceState("", "", this.newPathUrl(id));
          // let _route = { ...this.$route };
          // _route.fullPath = this.newPathUrl(id)
          // this.$router.history.cb(_route); // 更新URL刷新页面会初始化页签 - 需要取消上下页handleClick事件
        }
        this.$emit("handleClick", {
          type,
          id,
        });
      }
    },
    // 上下页切换后点击修改的返回路径
    newPathUrl(nId) {
      const { query, path } = this.$route;
      return (
        path +
        `?${paramUrl({
          ...query,
          id: nId || query.id,
        })}`
      );
    },
    deleteUrlIdList(delId) {
      // 详情页点击删除，同时删除pageSign中的当前页ID
      const nPageSign = this.idOrderList.filter(
        (id) => delId != id // 有Number与String，不能用三等号
      );
      this.$route.query.pageSign = nPageSign.join(",");
      if (this.currentIndex > 0) {
        this.currentIndex--;
      }
      this.idOrderList = nPageSign;
    },
    // 返回
    comReBack(backObj) {
      const { isBackTip = false, isBackRefresh } = backObj || {};
      // 父组件调用 this.$refs.detailTopRef?.comReBack();
      /**
       * isBackRefresh - 操作后刷新返回的缓存页面
       */
      const { backPath, data } = this.$route.query;
      let query = {};
      try {
        query = qs.parse(decodeURI(data || "") || {});
      } catch {}
      if (backPath) {
        if (isBackTip) {
          const title = "取消提示";
          const className = "el-icon-warning text-warning";
          const msg = "取消之后当前页面将不会保存!";
          msgBox(
            this,
            { title, className, msg, showCancelButton: true },
            () => {
              this.toPageRoute(backPath, query);
            }
          );
        } else {
          if (isBackRefresh) {
            this["operateDetails/storeBackRefresh"]({
              pathKey: backPath.split("?")[0],
              isBackRefresh,
            });
          }
          this.toPageRoute(backPath, query);
        }
      } else {
        this.$router.go(-1);
      }
    },
    toPageRoute(path, query) {
      this["tagsView/delView"](this.$route).then(() => {
        // 返回时关闭当前页面，防止反复保存
        this.$router.replace({
          path,
          query,
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.com-detail-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding-top: 10px;
  margin: 0 20px 15px;

  color: #515151;
  border-bottom: 1px solid #e2e2e2;
  &.title-sides-margin-none {
    margin-left: 0;
    margin-right: 0;
  }
  &.detail-top-right-none {
    // 隐藏右侧上下页与返回按钮
    padding-top: 16px;
    .page-turn {
      display: none;
    }
  }
  .title {
    padding-top: 7px; // 没有返回按钮时，使距离顶部高度保持一致
    font-size: 14px;
    font-weight: 600;
    padding-bottom: 3px;
    border-bottom: 2px solid #515151;

    .sub-title {
      color: #5094ff;
    }
  }
  .create-info {
    flex: 1;
    color: #515151;
    padding-bottom: 3px;
    // border-bottom: 1px solid #e2e2e2;

    & > span {
      margin-left: 20px;
    }
    .label {
      font-size: 12px;
      color: #8b8b8b;
    }
  }
  .page-turn {
    // border-bottom: 1px solid #e2e2e2;
    padding-right: 11px;
    .el-button {
      color: #00adb2;
      margin-left: 22px;
      margin-bottom: -3px;
    }
    .back {
      color: #8b8b8b;
    }
    .disable-change {
      color: #8b8b8b;
      cursor: no-drop;
    }
  }
}
</style>
