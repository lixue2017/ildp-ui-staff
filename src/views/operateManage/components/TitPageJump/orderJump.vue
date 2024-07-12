<template>
  <div class="base-flex-align tit-page-jump">
    <AutoComplete
      :formModel="pageSelectConf.formModel"
      :fieldItem="pageSelectConf.fieldItem"
      :additionalParam="
        titSelectConf.additionalParam || {
          isDataFil: 1,
          statusSearch: undefined,
          name: undefined,
        }
      "
    />
    <el-button type="text" size="mini" @click="handleView">页面跳转</el-button>
  </div>
</template>

<script>
import { paramUrl } from "@/utils/index";
import { getOrderECList } from "@/api/order/firstTransport.js";
import { getOceanTraditionList } from "@/api/trandition/oceanModel"; // 传统订单
import { getOrderOtherList } from "@/api/trandition/otherModel"; // 其他订单
import { httpOperationListSelect } from "@/comModel/httpSelect";

export default {
  props: {
    titSelectData: {
      type: Object,
      default: () => ({}),
    },
    titSelectConf: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      pageSelectConf: {
        formModel: {},
        fieldItem: {},
      },
    };
  },
  methods: {
    handleView() {
      const { bsOrderObj } = this.pageSelectConf.formModel;
      if (bsOrderObj?.value) {
        this.$route.query.id = bsOrderObj.value;
        if (this.titSelectConf?.isOrderType && bsOrderObj.orderType !== 2) {
          // 传统与其他订单
          this.$route.query.orderType = bsOrderObj.orderType;
        }
        window.history.replaceState("", "", this.newPathUrl(bsOrderObj.value));
        this.$emit("handleClick", {
          type: "titJump",
          id: bsOrderObj.value,
        });
      } else {
        this.msgError("请选择工作单号");
      }
    },
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
  },
  created() {
    const optItem = {
      id: "bsOrderObj",
      size: "mini",
      selectLabelKey: "bsOrderNo",
      placeholder: "请选择工作单号",
      isBackAll: true,
      handleSelectEnter: (obj) => {
        this.pageSelectConf.formModel.bsOrderObj = obj;
        this.handleView();
      },
    };
    if (this.titSelectConf.selectItem) {
      this.pageSelectConf.fieldItem = {
        ...optItem,
        ...this.titSelectConf.selectItem,
      };
      return;
    }

    const { orderType } = this.titSelectData;
    /** 订单详情 - 获取列表数据，下拉选择后点击跳转页面 */
    let httpRequest = getOrderOtherList; // 其他
    let labelKey = "orderNum";
    if ([2].includes(orderType)) {
      labelKey = "number";
      httpRequest = getOrderECList; // 电商
    }
    if ([3, 4].includes(orderType)) {
      httpRequest = getOceanTraditionList; // 传统
    }
    this.pageSelectConf.fieldItem = {
      ...optItem,
      ...httpOperationListSelect({
        httpRequest,
        labelKey,
      }),
    };
  },
  components: {
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
  },
};
</script>

<style lang="scss" scoped>
.tit-page-jump {
  margin-bottom: -1px;
  /deep/ {
    .el-input--mini .el-input__inner {
      border-color: #e2e2e2;
    }
  }
  .el-button {
    margin: 0 5px;
  }
}
</style>
