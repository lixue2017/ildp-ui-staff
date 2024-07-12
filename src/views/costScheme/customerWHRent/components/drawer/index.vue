<template>
  <!-- 2023/11/21暂时废弃 -->
  <ComDrawer
    ref="customDrawer"
    class="add-drawer"
    :customDrawer="customDrawerConfig"
    :confirmClose="false"
  >
    <template v-slot:content>
      <div>
        <ComDetailTop title="关联客户" :config="{}" />
      </div>
      <div class="drawer-title-search">
        <div>维护客户</div>
        <div>
          <el-input
            v-model="isitParams.name"
            size="small"
            placeholder="请输入客户信息"
            @keyup.enter.native="handleSearch"
          ></el-input>
        </div>
      </div>
      <div>
        <ComTable
          ref="tableRef"
          :tableHeight="tableConfig.tableHeight"
          :columnConfig="tableConfig.columnConfig"
          :columnData="tableConfig.columnData"
          :pagination="false"
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
import {
  POSTStorageRelationOriginRelations,
  POSTStorageRelationExistRelations,
  addStorageRelation,
} from "@/api/costScheme/index.js";
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
        columnData: [],
        columnConfig: tableColumns,
        // httpRequest: (formModel) => {
        //   return new Promise(async (resolve) => {
        //     const originData = await POSTStorageRelationOriginRelations(
        //       formModel
        //     ); //未关联的客户
        //     const params = {
        //       rows: this.existData.rows.concat(originData.rows),
        //       total: originData.total + this.existData.total,
        //     };
        //     resolve(params);
        //   });
        // },
      },
      isitParams: {},
      selectAll: [],
      existData: [], //初始化已勾选数据
    };
  },
  created() {
    this["dictionary/getDictionary"](["businessOwnership"]);
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    async show(row) {
      this.isitParams = {
        ...row,
      };
      const existData=await POSTStorageRelationExistRelations(row); //已关联的客户
      this.existData = JSON.parse(JSON.stringify(existData)); //已关联的客户
      const originData = await POSTStorageRelationOriginRelations(row); //未关联的客户
      this.tableConfig.columnData =[...existData.rows,...originData.rows]
      this.$refs.tableRef?.setNewTableData(this.tableConfig.columnData);
      this.$refs.customDrawer.show();
      this.$nextTick(() => {
        this.onSelectionChange(existData.rows);
      });
    },
    hide() {
      this.$refs.customDrawer.hide();
    },
    async handleSearch() {
      const {name=undefined}=this.isitParams
      const { rows } = await POSTStorageRelationOriginRelations({
        ...this.isitParams,
        customerName:name
      }); //未关联的客户
      this.tableConfig.columnData = rows;
      this.$refs.tableRef?.setNewTableData(this.tableConfig.columnData);
    },
    onSelectionChange(rows) {
      this.selectAll = rows;
      this.$refs.tableRef?._toggleRowSelectionMixin({
        newCheckRows: rows,
      });
      this.customDrawerConfig.footer[0].disabled = !this.selectAll.length;
    },
    submit() {
      // customerType  3服务成本价格
      const { storageId } = this.isitParams;
      const isintIds = this.existData.rows.map((e) => e.customerId);
      const selectAllIds = this.selectAll.map((e) => e.customerId);
      let deletedCustomerIds = []
      let addCustomerIds = []
      isintIds.map((e) => {
        if (selectAllIds.includes(e)) {
          return false;
        } else {
          deletedCustomerIds.push(e);
        }
      });
      selectAllIds.map((e) => {
        if (isintIds.includes(e)) {
          return false;
        } else {
          addCustomerIds.push(e);
        }
      });
      const params = {
        addCustomerIds,
        deletedCustomerIds,
        storageId,
      };
      this.comRepeatedRequest(this, addStorageRelation, params).then((res) => {
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
