<template>
  <div>
    <div class="operate-btn">
      <div v-if="!/inStoragePredic|outStoragePredic/.test(source)">
        <div class="title">{{ overseaLangObj.nky_cz || "您可以操作" }}</div>
        <el-row :gutter="14">
          <template v-for="item in btnList">
            <el-col
              :span="item.span"
              :key="item.id"
              v-if="operableBtnItem(item.nodeId, item.id)"
            >
              <el-dropdown
                v-if="item.btnType === 'dropdown'"
                trigger="click"
                placement="bottom"
                style="width: 100%"
              >
                <el-button
                  style="height: 28px"
                  size="small"
                  :disabled="item.disabled"
                  plain
                >
                  {{ item.text }}
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="dItem in item.dropdownArr"
                    :key="dItem.value"
                    @click.native="handleBtnClick(item, dItem)"
                    >{{ dItem.name }}</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>

              <template v-else-if="item.slot">
                <slot :name="item.id" :btnItem="item" />
              </template>

              <el-button
                v-else
                size="small"
                :disabled="item.disabled"
                @click="handleBtnClick(item)"
                plain
                >{{ item.text }}</el-button
              >
            </el-col>
          </template>
        </el-row>
      </div>

      <div
        class="operate-data"
        v-if="
          !/inStoragePredic|outStoragePredic/.test(source) &&
          nameArr &&
          nameArr.length
        "
      >
        <div
          class="operate-data-item"
          v-for="(n, i) in nameArr"
          :key="`n_${i}`"
        >
          <span class="label">
            {{ ["eCommerce"].includes(source) ? n.eLabel : n.label }}
          </span>
          <span class="label-item">{{ operateDetail[n.nameKey] || "--" }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { postNodeBtn } from "@/api/operateManage/common";
export default {
  props: {
    btnList: {
      type: Array,
      default: () => [],
    },
    operateDetail: {
      type: Object,
      default: () => ({}),
    },
    nameArr: {
      type: Array,
      default: () => [
        {
          nameKey: "operatorName",
          label: "操作员：",
          eLabel: "海外操作员：",
        },
        {
          nameKey: "fileMemberName",
          label: "文件员：",
          eLabel: "长沙操作员：",
        },
      ],
    },
    source: {
      type: String,
      default: () => "operation",
    },
  },
  data() {
    return {
      estimatedNodeObj: {},
    };
  },
  methods: {
    handleBtnClick(item, obj) {
      this.$emit("handleBtnClick", item, obj);
    },
    showInitBtn() {
      const { id, orderType, viewSource } = this.operateDetail;
      if (
        [2, 3, 4].includes(orderType) ||
        ["customsClearance"].includes(viewSource)
      ) {
        // 其他操作单不显示
        const showNodeBtn = this.btnList.some((e) =>
          [17, 23, 44].includes(e.nodeId)
        );
        if (showNodeBtn) {
          postNodeBtn({ operationOrderId: id }).then((res) => {
            this.estimatedNodeObj = res;
          });
        }
      }
    },
    // 判断按钮显示
    operableBtnItem(nId, btnId) {
      if (btnId === "batchExportZip") {
        return this.operateDetail.orderType === 2; // 只有电商显示
      }
      if ([17, 23, 44].includes(nId)) {
        const { data } = this.estimatedNodeObj;
        const nFind = (data || []).find((e) => e.id === nId) || {};
        return nFind && nFind.show !== 1; // 1-节点已完成-隐藏按钮
      }
      return true;
    },
  },
  created() {
    this.showInitBtn();
  },
  components: {},
};
</script>

<style lang="scss" scoped>
.operate-btn {
  border-bottom: 1px solid #e2e2e2;
  .title {
    font-size: 14px;
    font-weight: 700;
    margin: 25px 0 10px;
    color: #515151;
  }
  .el-button {
    width: 100%;
    white-space: normal;
    margin-bottom: 10px;
    color: #515151;
    border-color: transparent;
    box-shadow: 0px 0px 3px 0px rgba(203, 203, 203, 0.7);
    border-radius: 4px;
    &:hover {
      color: #5094ff;
      border-color: #5094ff;
    }
  }

  .operate-data {
    padding: 10px 0 30px;
    .operate-data-item:not(:last-child) {
      margin-bottom: 5px;
    }
    .label {
      color: #8b8b8b;
    }
    .label-item {
      color: #515151;
    }
  }
}
</style>
