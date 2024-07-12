<template>
  <div class="cost-table">
    <div class="top">
      <div class="tabs">
        <el-button
          size="small"
          plain
          v-for="item in tabsConfig.columns"
          :key="item.key"
          class="tabs-change"
          :type="item.key === tabsConfig.active ? 'activation' : ''"
          @click="changeTabs(item.key)"
        >
          {{ item.label }}
        </el-button>
        <div class="customer-tip" v-if="tabsConfig.active === 1">
          * 规则参数说明： L=最长边(CM)， M=第二长边(CM)， S=最短边(CM)
        </div>
        <div class="customer-tip" v-if="tabsConfig.active === 2">
          * 未选择客户时默认适用所有客户
        </div>
      </div>
      <div class="tabs-btn">
        <template v-for="item in tabsConfig.btnArr">
          <el-button
            size="mini"
            :key="item.key"
            :disabled="item.disabled"
            class="btn"
            type="primary"
            :class="item.className"
            :icon="item.icon"
            :round="item.round === false ? false : true"
            @click="item.handleClick(item)"
            v-if="item.showTabName === tabsConfig.active"
            >{{ item.label }}</el-button
          >
        </template>
      </div>
    </div>
    <!-- <div class="tip" v-if="tabsConfig.active === 1">
      <div class="top">
        <div class="title">规则参数说明</div>
        <div class="tip-btn" @click="handleToggle">
          <span>{{ showIllustrate ? "收起" : "展开" }}</span>
          <i
            :class="showIllustrate ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
          ></i>
        </div>
      </div>
      <div class="illustrate" v-if="showIllustrate">
        <div class="left">
          <i></i>
          <span>
            L=最长边(CM)， M=第二长边(CM)， S=最短边(CM)， CW=计费重量(KG)，
            GW=实重(KG)，VT=体积重量(KG)，M3=第二长边之和(CM)，
            S3=最短边之和(CM), L3=最长边和(CM), VW=SKU长宽高*数量
          </span>
        </div>
        <div class="right">
          <i></i>
          <span>
            例如：当最长边大于200时，则公式为：L>200
            <br />
            公式支持操作符：and(且)，or(或) 例如：L>200 and M>150 and GW>2
            <br />
            NT=最长边(CM)+第二长边(CM)*2+最短边(CM)*2*订单内件数
            ,例如：L+M*2+S*2*订单内件数>317
          </span>
        </div>
      </div>
    </div> -->
    <ChargingInfo
      ref="chargingInfoRef"
      :formData="formData"
      :isDetail="isDetail"
      v-show="tabsConfig.active === 1"
    />
    <RelatedCustomers
      ref="relatedCustomersRef"
      :businessType="2"
      :formData="formData"
      v-show="tabsConfig.active === 2"
      @handleSelection="handleSelection"
    />
    <OperationRecord v-if="tabsConfig.active === 3" />
  </div>
</template>

<script>
export default {
  props: {
    formData: {
      type: Object,
      default: () => {},
    },
    isDetail: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    ChargingInfo: () => import("../ChargingInfo"),
    RelatedCustomers: () =>
      import("@/views/oneConsignmentPlan/components/RelatedCustomers"),
    OperationRecord: () =>
      import("@/views/oneConsignmentPlan/components/OperationRecord"),
  },
  data() {
    return {
      showIllustrate: true,
      tabsConfig: {
        active: 1,
        columns: [
          {
            label: "计费规则",
            key: 1,
          },
          // {
          //   label: "关联客户",
          //   key: 2,
          // },
        ],
        btnArr: [
          // ...(this.isDetail
          //   ? []
          //   : [
          //       {
          //         label: "新增",
          //         className: "btn-type-add",
          //         icon: "el-icon-plus",
          //         round: false,
          //         handleClick: () => {
          //           this.$refs.chargingInfoRef?.handleAdd();
          //         },
          //         showTabName: 1,
          //       },
          //     ]),
          {
            label: "批量移除",
            type: "delete",
            handleClick: this.handleDelete,
            showTabName: 2,
            disabled: true,
          },
          {
            label: "维护客户",
            handleClick: () => {
              this.$refs.relatedCustomersRef.drawerShow();
            },
            showTabName: 2,
          },
        ],
      },
    };
  },
  methods: {
    changeTabs(key) {
      this.tabsConfig.active = key;
    },
    getChargingTableList() {
      return this.$refs.chargingInfoRef.getTableList();
    },
    getRelatedCustomersTableList() {
      return this.$refs.relatedCustomersRef.getTableList();
    },
    handleSelection(row) {
      const index = this.tabsConfig.btnArr.findIndex(
        (item) => item.showTabName === 2 && item.type === "delete"
      );
      if (index < 0) return;
      if (row.length) {
        this.selectList = row.map((item) => item.id || item.customerId);
        this.tabsConfig.btnArr[index].disabled = false;
      } else {
        this.tabsConfig.btnArr[index].disabled = true;
      }
    },
    handleDelete() {
      this.$refs.relatedCustomersRef.handleDelete(this.selectList);
    },
    handleToggle() {
      this.showIllustrate = !this.showIllustrate;
    },
  },
};
</script>

<style lang="scss" scoped>
.cost-table {
  border-top: 1px solid #e2e2e2;
}
.top {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .title {
    font-size: 14px;
    font-weight: bold;
  }
  .btn {
    padding: 24px 0 15px;
  }
  .tabs {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    border-bottom: none;
  }
  .tabs-btn {
    white-space: nowrap;
    padding-top: 16px;

    .btn {
      padding: 5.5px 12px;
    }
  }
  .customer-tip {
    color: #5094ff;
    margin-left: 15px;
  }
}
.tip {
  background: rgba(80, 148, 255, 0.05);
  border-radius: 4px;
  border: 1px solid rgba(80, 148, 255, 0.6);
  padding: 15px 30px 3px 30px;
  margin-bottom: 10px;
  .top {
    height: auto;
    padding-bottom: 12px;
    .tip-btn {
      cursor: pointer;
      color: #5094ff;
      i {
        margin-left: 2px;
      }
    }
  }
  .illustrate {
    display: flex;
    color: #8b8b8b;
    padding-bottom: 12px;

    i {
      width: 3px;
      height: 13px;
      border-radius: 2px;
      margin-right: 8px;
      margin-top: 2.5px;
    }
    span {
      flex: 1;
      line-height: 18px;
    }
    .left {
      display: flex;
      width: 560px;
      i {
        background: #5094ff;
      }
    }
    .right {
      display: flex;
      margin-left: 70px;
      i {
        background: #ff813d;
      }
    }
  }
}
</style>
