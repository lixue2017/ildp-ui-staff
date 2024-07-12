<template>
  <!-- 清关交接专用 -->
  <!-- 已经修改为抽屉，此组件暂时已经废弃 -->
  <ComDialog
    ref="customDialog"
    class="dialog"
    :customDialog="customDialogConfig"
    :dialogBoxCenter="true"
  >
    <template v-slot:content>
      <div class="transferClass">
        <el-transfer
          ref="roleTransfer"
          class="transferClass-content"
          filterable
          :render-content="renderFunc"
          :filter-method="filterMethod"
          :filter-placeholder="transferConfig.placeholder"
          :titles="transferConfig.titles"
          v-model="selectLists"
          :data="transferLists"
        >
        </el-transfer>
      </div>
    </template>
  </ComDialog>
</template>


<script>
import { mapState } from "vuex";
export default {
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComDialog: () => import("_comp/ComDialog"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  data() {
    return {
      customDialogConfig: {
        title: "关联仓库",
        width: "700px",
        center: false,
        appendToBody: this.appendToBody,
        footer: [
          {
            text: "保 存",
            type: "primary",
            handleClick: (formModel) => {
              this.submitFormRequest(formModel);
            },
          },
          {
            text: "取 消",
            plain: true,
            handleClick: () => {
              this.$refs.customDialog.handleClose();
            },
          },
        ],
      },
      transferLists: [], //汇总数据
      selectLists: [], //已选数据
      extraData: {}, //上个组件传递过来的参数
      transferConfig: {
        placeholder: "",
        titles: [],
      },
      transferInfo: {
        supplier: {
          title: "关联服务商",
          placeholder: "搜索服务商",
          titles: ["待选服务商", "已选服务商"],
        },
        customer: {
          title: "关联客户",
          placeholder: "搜索客户",
          titles: ["待选客户", "已选客户"],
        },
        warehouse: {
          title: "关联仓库",
          placeholder: "搜索仓库",
          titles: ["待选仓库", "已选仓库"],
        },
        enterprise: {
          title: "关联企业",
          placeholder: "搜索企业",
          titles: ["待选企业", "已选企业"],
        },
      },
    };
  },
  mounted() {},
  methods: {
    submitFormRequest(formModel) {
      const { costId, id, storageId } = this.extraData;
      const addRequest = this.extraData.requestRow["add"];
      let params = {};
      const deleteLists = this.originalSelectLists.filter((e) => {
        //删除已选数据的集合
        if (this.selectLists.includes(e)) {
          return false;
        } else {
          return true;
        }
      });
      const addLists = this.selectLists.filter((e) => {
        //新增数据的集合
        if (this.originalSelectLists.includes(e)) {
          return false;
        } else {
          return true;
        }
      });
      if (this.listType == "enterprise") {
        //关联的类型为企业
        params = {
          addCustomerIds: addLists,
          deletedCustomerIds: deleteLists,
          storageId,
        };
      } else if (
        this.listType == "supplier" ||
        this.listType == "customer" ||
        this.listType == "warehouse"
      ) {
        //关联的类型为为'服务商'或'客户'或'仓库'
        params = {
          costId, //服务成本价格-关联服务商
          customerIdList: this.selectLists, //服务成本价格-关联服务商
          id, //服务成本价格-维护仓库
          warehouseIds: this.selectLists.join(","), //服务成本价格-维护仓库
        };
      }
      this.comRepeatedRequest(this, addRequest, params).then((res) => {
        this.$emit("handleSuccess");
        this.hide();
      });
    },
    show(row = {}, requestRow, type) {
      const { costId, id, storageId } = row;
      const getRequest = requestRow["get"];
      this.extraData = {
        costId,
        id,
        storageId,
        requestRow,
      };
      this.listType = type;
      const transfer = this.transferInfo[type];
      this.customDialogConfig.title = this.transferInfo[type].title;
      const { placeholder, titles } = transfer;
      this.transferConfig = {
        placeholder,
        titles,
      };
      getRequest(row).then((res) => {
        const {
          existWarehouseList,
          originWarehouseList,
          existRelations,
          originRelations,
        } = res.data;
        const Selected = existWarehouseList || existRelations; //已选择的数据
        const Optional = originWarehouseList || originRelations; //可选且未选的数据
        const totalOptions = Selected.concat(Optional); //数据汇总
        this.transferLists = totalOptions.map((e) => {
          return {
            value: e.customerName || e.name,
            label: e.customerName || e.name,
            key: e.customerId || e.id,
            customerCode: e.customerCode || undefined,
            shortName: e.shortName || undefined,
          };
        });
        this.selectLists = Selected.map((e) => e.customerId || e.id);
        this.originalSelectLists = JSON.parse(JSON.stringify(this.selectLists));
      });
      this.$refs.roleTransfer?.clearQuery("left");
      this.$refs.roleTransfer?.clearQuery("right");
      this.$refs.customDialog.show();
    },
    hide() {
      this.$refs.customDialog.hide();
    },
    handleSuccess() {
      this.$emit("handleSuccess");
      this.hide();
    },
    filterMethod(query, item) {
      //搜索条件，根据value搜索
      let filterRules = item.value.indexOf(query) > -1;
      if (this.listType == "enterprise") {
        //客户仓租方案
        filterRules =
          item.value.indexOf(query) > -1 ||
          item.customerCode.indexOf(query) > -1 ||
          item.shortName.indexOf(query) > -1;
      }
      return filterRules;
    },
    renderFunc(h, option) {
      const { label, shortName, customerCode } = option;
      let showLabel;
      if (this.listType == "enterprise") {
        //客户仓租方案
        showLabel = `${customerCode ? `${customerCode}` : ""}${
          shortName ? `/${shortName}` : ""
        }${label ? `/${label}` : ""}`;
      } else {
        showLabel = label;
      }
      return h("span", { domProps: { title: showLabel } }, showLabel);
    },
  },
};
</script>

<style lang="scss" scoped>
.dialog {
  .transferClass {
    display: flex;
    justify-content: center;
    /deep/.el-transfer-panel {
      &__body {
        height: 400px !important;
        .el-transfer-panel__list {
          height: 400px - 50 !important;
        }
      }
    }
    /deep/.transferClass-content {
      .el-transfer-panel {
        width: 260px;
      }
      .el-transfer-panel__body {
        .el-transfer-panel__filter {
          margin: 15px 15px 10px 10px;
        }
      }
      .el-transfer-panel__list {
        border-top: 1px solid #e2e2e2;
      }
      .el-transfer__buttons {
        display: inline-flex;
        flex-direction: column;
        button {
          &:nth-child(2) {
            margin-left: 0px;
          }
        }
        .is-disabled {
          background-color: #dcdcdc;
          border-color: #dcdcdc;
        }
      }
    }
    // /deep/.transferClass-content {
    //   .el-transfer-panel {
    //     width: 260px;
    //     border: none;
    //   }
    //   .el-transfer-panel__header {
    //     background: none;
    //     border-bottom: none;
    //     padding-left: 0px;
    //   }
    //   .el-transfer-panel__body {
    //     border: 1px solid #b5b5b5;
    //     border-radius: 4px;
    //     .el-transfer-panel__filter {
    //       margin: 0px;
    //       padding: 15px 15px 10px 10px;
    //     }
    //   }
    //   .el-transfer-panel__list {
    //     border-top: 1px solid #e2e2e2;
    //   }
    //   .el-transfer__buttons {
    //     display: inline-flex;
    //     flex-direction: column;
    //     button {
    //       &:nth-child(2) {
    //         margin-left: 0px;
    //       }
    //     }
    //     .is-disabled {
    //       background-color: #dcdcdc;
    //       border-color: #dcdcdc;
    //     }
    //   }
    // }
  }
}
</style>
