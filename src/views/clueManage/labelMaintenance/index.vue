<template>
  <div class="app-container">
    <ComDetailTop title="自定义业务标签" ref="detailTopRef" :config="{}" />
    <div class="hot-tip">
      <div class="tip-title">
        <i class="el-icon-warning-outline"></i>
        <span>特别提示</span>
      </div>
      <div class="tip-content">
        1.您最多可以创建30个分组，200个标签，每个分组所容纳的标签不限。
      </div>
      <div class="tip-content">
        2.对标签组设定不同的颜色，有助于销售员在客户资料上快速确认标签分给信息。
      </div>
    </div>
    <div class="flex-space-between">
      <div class="tags-left">
        <div class="base-flex-between">
          <span class="tags-left-title">标签分组</span>
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="small"
            @click="handleGrouping()"
            >添加分组</el-button
          >
        </div>
        <div class="tags-parent">
          <template v-for="item in parentList">
            <div
              class="parent-item"
              :class="parentSelectId === item.id && 'parent_select'"
              :key="item.id"
              @click="getChildList(item.id)"
            >
              <div>{{ item.name }}</div>
              <div class="operation">
                <i
                  class="el-icon-edit-outline"
                  @click="handleGrouping(item)"
                ></i>
                <i class="el-icon-delete" @click="handleDelete(item)"></i>
              </div>
            </div>
          </template>
        </div>
      </div>
      <div class="tags-right">
        <div class="base-flex-between">
          <span class="tags-right-title">
            <span>{{
              parentObj[parentSelectId] && parentObj[parentSelectId].name
            }}</span
            ><span class="grey-text-color">({{ childList.length }}个标签)</span>
          </span>
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="small"
            @click="handleEdit()"
            >添加标签</el-button
          >
        </div>
        <div class="tags-child">
          <div class="tags-child-dropdown">
            <template v-for="(item, i) in childList">
              <el-dropdown :key="item.id" trigger="click" placement="bottom">
                <el-button
                  type="info"
                  @click="handleSelect(item)"
                  :class="
                    isBatch && selectList.includes(item.id) && 'is-active'
                  "
                  size="small"
                  plain
                  round
                >
                  {{ item.name }}
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown" v-if="!isBatch">
                  <template v-for="(dItem, dI) in dropdownArr">
                    <el-dropdown-item
                      v-if="
                        ![0, 1].includes(dI) ||
                        (dI === 0 && i !== 0) ||
                        (dI === 1 && childList.length - 1 !== i)
                      "
                      :key="`dItem${dI}`"
                      @click.native="
                        dItem.handleClick && dItem.handleClick(item)
                      "
                      >{{ dItem.label }}</el-dropdown-item
                    >
                  </template>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
            <template v-if="!childList.length">
              <div class="child-empty">
                <img :src="noDataImg" alt="" srcset="" width="150px" />
                <div>暂无数据～</div>
              </div>
            </template>
          </div>
          <div class="tags-child-operation base-flex-between">
            <div class="">
              <template v-if="isBatch">
                <el-button
                  class="select-tag"
                  type="primary"
                  size="small"
                  plain
                  @click="handleSelectAll"
                >
                  <el-checkbox v-model="checked" disabled> </el-checkbox>
                  全部标签
                </el-button>
                <el-dropdown trigger="click" placement="bottom">
                  <el-button
                    type="primary"
                    size="small"
                    plain
                    :disabled="!selectList.length"
                    >设置分组<i class="el-icon-arrow-down el-icon--right"></i
                  ></el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-for="item in parentList"
                      :key="item.id"
                      @click.native="handleSetGrouping(item)"
                      >{{ item.name }}</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </el-dropdown>
                <el-button
                  type="danger"
                  size="small"
                  plain
                  @click="handleBatch"
                  :disabled="!selectList.length"
                  >删 除</el-button
                >
              </template>
            </div>
            <div>
              <el-button type="primary" size="small" @click="handleShowBatch">{{
                isBatch ? "取消批量管理" : "批量管理"
              }}</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <GroupingDialog ref="groupingDialogRef" @handleSuccess="getList" />
    <ConfirmDialog ref="confirmDialog" />
  </div>
</template>
<script>
import {
  getTagPage,
  saveOrUpdateTag,
  delTag,
  batchDelTag,
  setTagGroup,
  moveTagForward,
  moveTagBackward,
} from "@/api/clueManage/labelMaintenance.js";
import { tagsForm } from "./components/GroupingDialog/model.js";
import { customMessageBox } from "@/utils/confirmBox.js";
import noDataImg from "@/assets/image/noData.png";
export default {
  components: {
    ComDetailTop: () => import("_comp/ComDetailTop"),
    GroupingDialog: () => import("./components/GroupingDialog"),
    ConfirmDialog: () => import("@/views/components/ConfirmDialog"),
  },
  data() {
    return {
      noDataImg,
      parentList: [],
      parentSelectId: 0,
      parentSelect: {},
      childList: [],
      selectList: [],
      checked: false,
      isBatch: false,
      dropdownArr: [
        {
          label: "向前移动",
          handleClick: this.moveTagForward,
        },
        {
          label: "向后移动",
          handleClick: this.moveTagBackward,
        },
        {
          label: "重命名",
          handleClick: this.handleEdit,
        },
        {
          label: "删除",
          handleClick: this.handleDelete,
        },
      ],
      parentObj: {},
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      getTagPage({}).then((res) => {
        this.parentList = res.rows || [];
        this.parentList.forEach((item) => {
          this.parentObj[item.id] = item;
        });
        if (!this.parentSelectId && this.parentList[0]) {
          this.getChildList(this.parentList[0].id);
        }
      });
    },
    getChildList(parentId) {
      this.parentSelectId = parentId;
      this.selectList = [];
      getTagPage({
        parentId,
      }).then((res) => {
        this.childList = res.rows || [];
      });
    },
    handleDropdown() {},
    handleShowBatch() {
      this.isBatch = !this.isBatch;
    },
    handleGrouping(row) {
      this.$refs.groupingDialogRef.show(row);
    },
    handleEdit(row) {
      const { id, name } = row || {};
      this.$refs.confirmDialog.handleFormDialog("customConfirmModel", {
        dialogTitle: "添加标签",
        formModel: {
          name,
        },
        customFormConfig: tagsForm(),
        httpRequest: (formData) => {
          // console.log(1111, formData);
          const { name } = formData;
          const params = {
            parentId: this.parentSelectId,
            id,
            name,
          };
          return saveOrUpdateTag(params);
        },
        successFunction: () => this.getChildList(this.parentSelectId),
      });
    },
    handleDelete(row) {
      if (!row.parentId && this.childList.length) {
        this.$message.error("请先删除关联的标签,再删除分组");
        return;
      }
      customMessageBox(
        this,
        {
          msgTitle: "删除提示",
          msgTxtColor: "#FF6767",
          httpMsgRequest: () => delTag(row.id),
        },
        () => {
          this.msgSuccess("删除成功");
          if (row.parentId) {
            this.getChildList(this.parentSelectId);
          } else {
            this.parentSelectId = 0;
            this.getList();
          }
        }
      );
    },
    handleBatch() {
      if (!this.selectList.length) {
        this.$message.error("请选择删除标签！");
        return;
      }
      customMessageBox(
        this,
        {
          msgTitle: "删除提示",
          msgTxtColor: "#FF6767",
          httpMsgRequest: () => batchDelTag(this.selectList),
        },
        () => {
          this.msgSuccess("删除成功");
          this.selectList = [];
          this.checked = false;
          this.getChildList(this.parentSelectId);
        }
      );
    },
    handleSelect(row) {
      if (!this.isBatch) return;
      const index = this.selectList.findIndex((id) => id === row.id);
      if (index === -1) {
        this.selectList.push(row.id);
      } else {
        this.selectList.splice(index, 1);
      }
      this.checked = this.selectList.length === this.childList.length;
    },
    handleSelectAll() {
      this.checked = !this.checked;
      if (this.checked) {
        this.selectList = this.childList.map((item) => item.id);
      } else {
        this.selectList = [];
      }
    },
    handleSetGrouping(item) {
      setTagGroup({
        ids: this.selectList,
        parentId: item.id,
      }).then(() => {
        this.selectList = [];
        this.getChildList(this.parentSelectId);
      });
    },
    moveTagForward(item) {
      moveTagForward(item.id).then(() => {
        this.getChildList(item.parentId);
      });
    },
    moveTagBackward(item) {
      moveTagBackward(item.id).then(() => {
        this.getChildList(item.parentId);
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.app-container {
  /deep/ {
    .com-detail-top {
      margin: 0 0 15px;
      padding: 0;
    }
  }
  .hot-tip {
    padding: 17px 20px 10px;
    background: #fff5f0;
    border-radius: 2px;
    border: 1px solid #ffb48f;
    margin-bottom: 20px;

    .tip-title {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      i {
        color: #ff813d;
        font-size: 18px;
        margin-right: 5px;
      }
      span {
        font-size: 16px;
        font-weight: bold;
      }
    }
    .tip-content {
      line-height: 19px;
      white-space: nowrap;
      color: #8b8b8b;
      margin-left: 23px;
    }
  }
  .tags-left {
    width: 350px;
    .tags-left-title {
      font-size: 14px;
      font-weight: bold;
    }
    .tags-parent {
      height: calc(100vh - 310px);
      border: 1px solid #bcbcbc;
      margin-top: 4px;
      overflow-y: auto;
      .parent-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 42px;
        padding: 0 17px 0 14px;
        border-bottom: 1px solid #e2e2e2;
        cursor: pointer;
        &:hover {
          background: #e3edff;
        }
        &.parent_select {
          background: #e3edff;
        }
        .operation {
          color: #a5a5a5;
          i {
            font-size: 18px;
            margin-left: 12px;
          }
        }
      }
    }
  }
  .tags-right {
    flex: 1;
    margin-left: 20px;
    .tags-right-title {
      font-size: 14px;
      font-weight: bold;
      line-height: 29px;
    }
    .tags-child {
      height: calc(100vh - 310px);
      padding: 25px 28px 30px;
      border: 1px solid #bcbcbc;
      margin-top: 4px;
      .tags-child-dropdown {
        width: calc(100% + 60px);
        height: calc(100% - 62px);
        margin-left: -30px;
        margin-bottom: 30px;
        overflow-y: auto;
        /deep/ {
          .el-dropdown {
            margin-left: 30px;
            margin-bottom: 30px;
            .el-button--info.is-plain {
              color: #515151;
            }

            .el-button--info.is-plain:hover,
            .el-button--info.is-plain.is-active,
            .el-button--info.is-plain.is-active:focus {
              background: #e3edff;
              border-color: #5094ff;
              color: #515151;
            }
            .el-button--info.is-plain:focus,
            .el-button--info.is-plain:active {
              background: #f4f4f4;
              border-color: #d3d3d3;
            }
          }
        }
      }
      .tags-child-operation {
        .el-button.select-tag {
          padding: 6px 12px 4px;
          /deep/ {
            .el-checkbox__input.is-disabled .el-checkbox__inner {
              cursor: pointer;
            }
          }
        }
        .el-dropdown {
          margin: 0 10px;
        }
      }
    }
  }
  .child-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    justify-content: center;
    line-height: 20px;
    img {
      width: 100px;
      padding: 30px 0 14px;
    }
    div {
      padding-bottom: 30px;
    }
  }
}
</style>
