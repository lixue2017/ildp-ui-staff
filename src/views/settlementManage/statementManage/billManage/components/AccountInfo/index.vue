<template>
  <div class="account-info">
    <AutoComplete
      ref="autoComplete"
      :formModel="formModel"
      :fieldItem="{
        ...fieldItem,
        ...getFieldAccountList(),
        id: 'account',
        isBackAll: true,
        handle: handleSelect,
      }"
      defaultKey="id"
      v-if="!fieldItem.disable"
    />
    <div class="sub-placeholder" v-if="!fieldItem.disable">
      <i class="el-icon-warning-outline text-warning-color"></i>
      <span>最多支持选择{{ maxLength }}个账号</span>
    </div>
    <div class="care">
      <template v-for="(item, index) in selectAccounts">
        <div class="care-item" :key="index">
          <div class="name">
            {{ item.openingBank }} {{ item.code || item.currencyName }}
          </div>
          <div class="account">{{ item.bankAccount }}</div>
          <div class="addr">{{ item.accountName }}</div>
					<div class="addr" v-if="fieldItem.disable">SWIFT CODE：{{ item.invoiceTitle || '--' }}</div>
          <div
            class="close el-icon-error"
            v-if="!fieldItem.disable"
            @click="handleClose(index)"
          ></div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import { httpAccountSelect } from "@/comModel/httpSelect";
export default {
  props: {
    fieldItem: {
      type: Object,
      default: () => {},
    },
    maxLength: {
      type: Number,
      default: 3,
    },
    // formModel: {
    //   type: Object,
    //   default: () => {
    //     return {};
    //   },
    // },
    accountInfoList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    getQueryParams: {
      type: Function,
      default: () => ({}),
    },
  },
  components: {
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
  },
  data() {
    return {
      selectAccounts: [],
      formModel: {
        account: "",
      },
    };
  },
  watch: {
    accountInfoList: {
      deep: true,
      handler: function (newVal, oldVal) {
        this.selectAccounts = newVal || [];
      },
    },
    maxLength: {
      deep: true,
      handler: function (newVal, oldVal) {
        this.$emit("handleSelect", []);
        this.$refs.autoComplete?.changeFocusRequest()
      },
    },
  },
  mounted() {
    this.selectAccounts = this.accountInfoList || [];
    // this.formModel[this.fieldItem.id] = [...this.selectAccounts];
    // console.log(this.accountInfoList);
  },
  methods: {
    getFieldAccountList() {
      return {
        ...httpAccountSelect({ ...this.getQueryParams(), labelKey: 'accountName'})
      };
    },
    handleSelect(row) {
      // const autoComplete = this.$refs.autoComplete;
      // console.log(autoComplete.$refs.selectSearch);
      const index = this.selectAccounts.findIndex((e) => row.id === e.id);
      this.formModel.account = "";
      if (index > -1) {
        return;
      }
      const accountArr = this.accountInfoList;
      if (row && accountArr.length < this.maxLength) {
        this.selectAccounts.push(row);
        this.$emit("handleSelect", this.selectAccounts);
        // this.formModel[this.fieldItem.id] = [...this.selectAccounts];
      }
    },
    handleClose(index) {
      this.selectAccounts.splice(index, 1);
      this.$emit("handleSelect", this.selectAccounts);
      // this.formModel[this.fieldItem.id] = [...this.selectAccounts];
    },
    refresh() {
      //防止用户先请求所有数据再新增后无法重新获取新增的数据
      this.$refs.autoComplete.selectChange();
      this.$refs.autoComplete.querySearchAsync();
    },
  },
};
</script>
<style lang="scss" scoped>
.sub-placeholder {
  font-size: 13px;
  color: #a5a5a5;
  i {
    font-size: 14px;
    margin-right: 2px;
  }
}
.account-info {
  /deep/ .el-select.auto-search {
    width: 200px;
  }
}
.care {
  display: flex;
  margin-left: -80px;
  .care-item {
    position: relative;
    width: 196px;
    min-height: 83px;
    background: linear-gradient(
      135deg,
      rgba(80, 148, 255, 0.5) 0%,
      rgba(80, 148, 255, 0.3) 100%
    );
    border-radius: 4px;
    color: #fff;
    padding: 10px 8px 7px 10px;

    &:not(:last-child) {
      margin-right: 12px;
    }
    .name {
      line-height: 20px;
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 8px;
    }

    .account {
      font-size: 13px;
      line-height: 18px;
      margin-bottom: 3px;
    }

    .addr {
      font-size: 12px;
      line-height: 17px;
      color: rgba(255, 255, 255, 0.7);
    }

    .close {
      position: absolute;
      top: -5px;
      right: -5px;
      font-size: 18px;
      color: #c6c6c6;
      background-color: #fff;
      border-radius: 50%;
      cursor: pointer;
    }
  }
}
</style>
