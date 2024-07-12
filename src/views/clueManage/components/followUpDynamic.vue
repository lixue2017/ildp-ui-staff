<template>
  <div class="dynamic">
    <div class="title">跟进记录</div>
    <div class="operation base-flex-align">
      <span>时间范围：</span>
      <el-date-picker
        v-model="selectTime"
        type="datetimerange"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        value-format="yyyy-MM-dd HH:mm:ss"
        size="small"
        @change="refreshTable"
      >
      </el-date-picker>
      <span>搜索内容：</span>
      <el-input
        v-model="searchValue"
        placeholder="请输入搜索关键词"
        size="small"
        @change="refreshTable"
      ></el-input>
      <el-button type="primary" size="small" @click="handleExport">
        <i class="iconfont daochu"></i>
        导出
      </el-button>
    </div>
    <div class="dynamic-context">
      <template v-for="(item, i) in list">
        <div class="" :key="item.id">
          <div class="time-line" v-if="i !== list.length - 1"></div>
          <div
            :class="item.displayType === 1 ? 'dor-date' : 'time-line-dor'"
          ></div>
          <div
            class="display-date"
            :class="i === list.length - 1 && 'margin-0'"
            v-if="item.displayType === 1"
          >
            {{ item.displayDate }}
          </div>
          <template v-else>
            <div class="context" :class="i === list.length - 1 && 'margin-0'">
              <div class="base-flex">
                <div class="user-logo">
                  <img
                    :src="userLogo"
                    alt=""
                    srcset=""
                    width="28px"
                    height="28px"
                  />
                </div>
                <div class="context-center">
                  <div>
                    <span>{{ item.createUserName }}</span>
                    <span class="context-time"
                      >跟进{{ handleType(crmFollowType, item.type) }}</span
                    >
                  </div>
                  <div v-html="item.remark"></div>
                  <div>来自客户：{{ item.customerName }}</div>
                </div>
                <div class="flex-between-end context-right">
                  <div>{{ item.createTime }}</div>
                  <div>
                    <template v-for="(btn, i) in handleBtn(btnList)">
                      <el-button
                        v-if="!btn.hide"
                        :key="i"
                        type="info"
                        size="small"
                        plain
                        @click="btn.handleClick(item)"
                      >
                        <i :class="btn.icon"></i
                        ><span :class="btn.className">{{ btn.label }}</span>
                      </el-button>
                    </template>
                  </div>
                </div>
              </div>
              <template v-if="item.showComment">
                <div
                  class="comment base-flex"
                  :key="comment.id"
                  v-for="comment in item.commentList || []"
                >
                  <div class="user-logo">
                    <img
                      :src="userLogo"
                      alt=""
                      srcset=""
                      width="28px"
                      height="28px"
                    />
                  </div>
                  <div class="context-center">
                    <div class="">
                      <span>{{ comment.createUserName }}</span>
                      <span class="context-time">{{ comment.createTime }}</span>
                    </div>
                    <div>
                      <TooltipOver
                        :content="comment.context"
                        :style="{ maxWidth: '889px' }"
                        refName="tooltipOverTit"
                      />
                    </div>
                  </div>
                  <div>
                    <i
                      class="el-icon-close del-comment"
                      @click="handleDeleteComment(item, comment)"
                    ></i>
                  </div>
                </div>
                <div class="base-flex publish-comment" v-if="!isCommunal">
                  <el-input
                    v-model="item.publishComment"
                    size="small"
                    placeholder="请输入评论内容"
                  ></el-input>
                  <el-button
                    type="primary"
                    size="small"
                    @click="handlePublish(item, item.publishComment)"
                  >
                    发表评论
                  </el-button>
                </div>
              </template>
            </div>
          </template>
        </div>
      </template>
      <div v-if="!list.length">
        <div class="list-empty">
          <img :src="noDataImg" alt="" srcset="" width="150px" />
          <div>暂无数据～</div>
        </div>
      </div>
    </div>
    <my-pagination
      v-if="total > (paginationConfig.total || paginationConfig.limit)"
      :page="start"
      :limit="paginationConfig.limit"
      :total="total"
      :small="paginationConfig.small"
      :className="paginationConfig.className"
      :layout="paginationConfig.layout"
      :pageSizes="paginationConfig.pageSizes"
      @pagination="handlePagination"
    />
    <FollowDetailDialog
      ref="followDetailDialogRef"
      @handleSuccess="refreshTable"
    />
  </div>
</template>

<script>
import {
  getFollowPage,
  followExport,
} from "@/api/clueManage/followUpRecords.js";
import { comFileDownload } from "@/utils/download.js";
import { customMessageBox } from "@/utils/confirmBox.js";
import { delFollow } from "@/api/clueManage/followUpRecords.js";
import userLogo from "@/assets/image/user_logo.png";
import noDataImg from "@/assets/image/noData.png";
import {
  getCommentPage,
  saveOrUpdateComment,
  delComment,
} from "@/api/clueManage/comment.js";
import { hasBtnPermits } from "@/directive/permission/hasPermi.js";
import { mapState } from "vuex";
export default {
  props: {
    formData: {
      type: Object,
      default: () => ({}),
    },
    businessType: {
      type: Number,
      default: 1,
    },
    isCommunal: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    MyPagination: () => import("_comp/ComTable/MyPagination"),
    TooltipOver: () => import("_comp/TooltipOver"),
    FollowDetailDialog: () =>
      import("@/views/clueManage/components/detailDialog/followInfo"),
  },
  data() {
    return {
      userLogo,
      noDataImg,
      paginationConfig: {
        limit: 15,
        layout: "total, sizes, prev, pager, next, jumper",
        className: "",
        small: false,
        total: 15,
        pageSizes: [15, 30, 50, 100],
      },
      start: 1,
      total: 0,
      selectTime: [],
      searchValue: "",
      list: [],
      btnList: [
        {
          label: "详情",
          icon: "el-icon-info",
          className: "text-theme-color",
          handleClick: this.handleInfo,
        },
        {
          label: "评论",
          icon: "el-icon-chat-dot-round",
          className: "text-theme-color",
          handleClick: this.handleComment,
          hide: this.isCommunal,
          hasPermission: ["clueManage:followUpRecords:comment"],
        },
        {
          label: "删除",
          icon: "el-icon-delete",
          className: "text-danger-color",
          handleClick: this.handleDelete,
          hide: this.isCommunal,
          hasPermission: ["clueManage:followUpRecords:delete"],
        },
      ],
    };
  },
  computed: {
    ...mapState({
      crmFollowType: (state) => state.dictionary.dicsData.crmFollowType,
    }),
  },
  created() {
    this.getFollowPage();
  },
  methods: {
    handleBtn(btnList) {
      return btnList.filter(
        (btn) => !btn.hasPermission || hasBtnPermits(btn.hasPermission)
      );
    },
    getFollowPage() {
      const { id } = this.formData;
      const [startTime, endTime] = this.selectTime || [];
      getFollowPage({
        businessId: id,
        businessType: this.businessType,
        isInterval: true, // 是否时间间隔
        startTime,
        endTime,
        searchValue: this.searchValue,
        pageNum: this.start,
        pageSize: this.paginationConfig.limit,
      }).then((res) => {
        const { rows, total } = res;
        this.total = total || 0;
        this.list = (rows || []).map((item) => ({
          ...item,
          commentList: [],
          showComment: false,
        }));
      });
    },
    handlePagination({ page, limit }) {
      this.start = page;
      this.paginationConfig.limit = limit;
      this.getFollowPage();
    },
    refreshTable() {
      this.start = 1;
      this.getFollowPage();
    },
    handleExport() {
      const [startTime, endTime] = this.selectTime || [];
      comFileDownload(this, followExport, {
        id: this.formData.id,
        searchValue: this.searchValue,
        startTime,
        endTime,
      });
    },
    handleInfo(row) {
      this.$refs.followDetailDialogRef.show(row);
    },
    handleComment(row, isBol) {
      if (!isBol) {
        row.showComment = !row.showComment;
        if (!row.showComment) return;
      }
      getCommentPage({
        businessId: row.id,
        businessType: 3,
      }).then((res) => {
        row.commentList = res.rows;
      });
    },
    handleDeleteComment(row, comment) {
      customMessageBox(
        this,
        {
          msgTitle: "删除提示",
          msgTxtColor: "#FF6767",
          httpMsgRequest: () => delComment(comment),
        },
        () => {
          this.msgSuccess("删除评论成功");
          this.handleComment(row, true);
        }
      );
    },
    handlePublish(row, text) {
      const context = text.trim();
      if (!context) {
        this.msgError("请输入评论内容!");
        return;
      }
      saveOrUpdateComment({
        businessId: row.id,
        businessType: 3,
        context,
      }).then(() => {
        row.publishComment = "";
        this.handleComment(row, true);
      });
    },
    handleDelete(row) {
      customMessageBox(
        this,
        {
          msgTitle: "确认提示",
          msgTxt1: "是否确定删除对应的记录？",
          msgTxt2: "",
          httpMsgRequest: () => delFollow(row),
        },
        () => {
          this.msgSuccess("删除成功");
          this.refreshTable();
        }
      );
    },
    handleType(list, type) {
      const item = list.find((item) => item.value == type);
      if (item) {
        return `(${item.nameCn})`;
      }
      return "";
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/views/clueManage/components/dynamic.scss";

.operation {
  margin-bottom: 14px;
  .el-date-editor {
    max-width: 350px;
    margin-right: 28px;
  }
  .el-input {
    max-width: 220px;
    margin-right: 15px;
  }
  .el-button {
    i {
      font-size: 13px;
    }
  }
}
</style>
