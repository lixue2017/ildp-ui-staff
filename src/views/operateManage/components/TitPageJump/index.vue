<template>
  <div class="base-flex-align tit-page-jump">
    <AutoComplete
      :formModel="pageSelectConf.formModel"
      :fieldItem="pageSelectConf.fieldItem"
      :additionalParam="{
        operationOrderType:
          titSelectData.viewTempSource === 'ec_temp_jump'
            ? undefined
            : titSelectData.operationOrderType,
        orderType:
          titSelectData.operationOrderType === 2
            ? undefined
            : titSelectData.orderType,
        isDataFil: 1,
        statusSearch: undefined,
        name: undefined,
      }"
    />
    <el-button type="text" size="mini" @click="handleView">页面跳转</el-button>
  </div>
</template>

<script>
import { paramUrl } from "@/utils/index";
import { httpOperationListSelect } from "@/comModel/httpSelect";
import {
  getOtherOperateList,
  traditionOperationList,
  getOperationListNew,
} from "@/api/operateManage/common";

export default {
  props: {
    titSelectData: {
      type: Object,
      default: () => {},
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
      const { bsId: id } = this.pageSelectConf.formModel;
      if (id) {
        this.$route.query.id = id;
        window.history.replaceState("", "", this.newPathUrl(id));
        this.$emit("handleClick", {
          type: "titJump",
          id,
        });
      } else {
        this.msgError("请选择操作单");
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
    const { operationOrderType, orderType } = this.titSelectData;
    /** 获取列表数据，下拉选择后点击跳转页面 */
    let httpRequest = getOtherOperateList; // 其他
    if (operationOrderType !== 2) {
      if ([2].includes(orderType)) {
        httpRequest = getOperationListNew; // 电商
      } else if ([3, 4].includes(orderType)) {
        httpRequest = traditionOperationList; // 传统海运、空运
      }
    }
    this.pageSelectConf.fieldItem = {
      id: "bsId",
      size: "mini",
      selectLabelKey: "bsNo",
      placeholder: "请选择操作单",
      ...httpOperationListSelect({
        httpRequest,
      }),
      handleSelectEnter: (obj) => {
        this.pageSelectConf.formModel.bsId = obj.value;
        this.handleView();
      },
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
