<template>
  <ComDrawer
    ref="customDrawer"
    class="add-drawer"
    :customDrawer="customDrawerConfig"
    :confirmClose="false"
  >
    <template v-slot:content>
      <div>
        <ComDetailTop :title="`${isitParams.customerType==3 ? '关联服务商' : '关联客户'}`" :config="{}" />
      </div>
      <div class="drawer-title-search">
        <div>{{isitParams.customerType==3?'维护服务商':'维护客户'}}</div>
        <div>
          <el-input
            v-model="isitParams.name"
            size="small"
            :placeholder="`${isitParams.customerType==3?'请输入服务商名称':'请输入客户名称'}`"
            @keyup.enter.native="handleSearch"
          ></el-input>
        </div>
      </div>
      <div>
        <ComTable
          ref="tableRef"
          :tableHeight="tableConfig.tableHeight"
          :columnConfig="tableConfig.columnConfig"
          :httpRequest="tableConfig.httpRequest"
          :getQueryParams="getQueryParams"
          :isMountedRequest="false"
          :paginationConfig="paginationConfig"
          @onSelectionChange="onSelectionChange"
          :selectionTableRow="[...selectAll]"
          rowKey="customerId"
          selectionKey="customerId"
        />
      </div>
    </template>
  </ComDrawer>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { tableColumns } from "./model.js";
import { POSTRelationOriginRelations,POSTStorageRelationOriginRelations,addStorageRelation } from "@/api/costScheme/index.js";
import { addRelation } from "@/api/costScheme/index.js";
export default {
  props: {
    dictionary: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    ComDrawer: () => import("_comp/ComDrawer"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
    ComTable: () => import("_comp/ComTable"),
  },
  data() {
    return {
      customDrawerConfig: {
        width: "685px",
        title: "slot",
        size: "small",
        showClose: false,
        wrapperClosable: true,
        footer: [
          {
            text: "确定",
            disabled: true,
            type: "primary",
            handleClick: () => {
              this.submit();
            },
          },
          {
            text: "取 消",
            plain: true,
            handleClick: () => {
              this.hide();
            },
          },
        ],
      },
      tableConfig: {
        tableHeight: "calc(100vh - 165px)",
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            const { customerType } = this.isitParams;
            const httpRequest = this.httpRequest[customerType].get;
            httpRequest(formModel).then((res)=>{
              resolve(res)
            })
          });
        },
        columnConfig: tableColumns,
      },
      paginationConfig: {
        limit: 20,
        layout: "total, prev, pager, next",
        className: "",
        small: false,
        total: 20,
      },
      isitParams: {},
      selectAll: [],
      httpRequest: {
        4:{
          get: POSTStorageRelationOriginRelations,
          add: addStorageRelation,
        },
        3: {
          get: POSTRelationOriginRelations,
          add: addRelation,
        },
        2: {
          get: POSTRelationOriginRelations,
          add: addRelation,
        },
      },
    };
  },
  created() {
    this["dictionary/getDictionary"](["businessOwnership"]);
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    show(row, relevanceType) {
        this.onSelectionChange([]);
      this.isitParams = {
        ...row,
      };
      this.$refs.customDrawer.show();
      this.$nextTick(() => {
        this.handleSearch();
      });
    },
    hide() {
      this.$refs.customDrawer.hide();
    },
    handleSearch(val) {
      this.$refs.tableRef?.refreshKeepTable();
    },
    getQueryParams() {
      const {name=undefined}=this.isitParams
      return {
        ...this.isitParams,
        customerName:name
      };
    },
    onSelectionChange(rows) {
      this.selectAll = rows;
      this.$refs.tableRef?._toggleRowSelectionMixin({
        newCheckRows: this.selectAll,
      });
      this.customDrawerConfig.footer[0].disabled = !this.selectAll.length;
    },
    submit() {
      // customerType  3服务成本价格  2客户项目费用  4仓租方案管理
      const { costId, customerType, customerIdList=[],storageId } = this.isitParams;
      const ids = this.selectAll
        .map((e) => e.customerId)
        .concat(customerIdList);
      const params = {
        costId : customerType == 4 ? undefined : costId,
        customerIdList : customerType == 4 ? undefined : ids,
        addCustomerIds : customerType == 4 ? ids : undefined,
        storageId : customerType == 4 ? storageId : undefined,
      };
      const httpRequest = this.httpRequest[customerType].add;
      this.comRepeatedRequest(this, httpRequest, params).then((res) => {
        this.$emit("handleSuccess");
        this.hide();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.add-drawer {
  /deep/ {
    .el-drawer__header {
      display: none;
    }
    .drawer-content {
      padding: 0 20px 10px;
    }
    .my-pagination-container {
      text-align: left;
      padding: 12px 0;
      position: absolute;
      bottom: 0;
    }
    .el-table::before {
      background-color: transparent;
    }
  }
  .com-detail-top {
    padding: 13px 0 0;
    margin-bottom: 5px;
    margin: 0;
  }
  .drawer-title-search {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    font-weight: bold;
    padding: 15px 0;
  }
}
</style>
