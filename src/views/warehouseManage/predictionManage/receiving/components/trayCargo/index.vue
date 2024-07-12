<template>
  <div>
    <ComDrawer
      class="add-cabinet-arrangement"
      ref="drawerRef"
      :customDrawer="drawerConfig"
      :confirmClose="false"
    >
      <template v-slot:content>
        <ComDetailTop
          :title="'托盘货物信息'"
          class="title-sides-margin-none"
          :config="{}"
        />
        <div v-if="$refs.drawerRef && $refs.drawerRef.drawerVisible">
          <ComForm :formConfig="trayFormConfig" />
          <ComTable
            :ref="`tableDrawerRef`"
            :tableHeight="tableConfig.tableHeight"
            :columnConfig="tableConfig.columnConfig"
            :columnData="tableConfig.columnData"
          >
          </ComTable>
        </div>
      </template>
    </ComDrawer>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { getWarehouseTrayGoods } from "@/api/warehouse/basic";
import { drawerFormCols, tableDrawerCols } from "./model";
export default {
  props: {},
  data() {
    return {
      drawerConfig: {
        width: "1080px",
        footer: [
          {
            text: this.overseaLangObj.qx_cancel(),
            plain: true,
            handleClick: () => {
              this.$refs.drawerRef.hide();
            },
          },
        ],
      },
      trayFormConfig: {
        formModel: {},
        labelWidth:
          this.overseaLangObj.yu_yan_lang === "en-us" ? "105px" : "95px",
        lists: drawerFormCols(),
      },
      tableConfig: {
        tableHeight: "calc(100vh - 236px)",
        columnData: [],
        columnConfig: tableDrawerCols(),
      },
      drawerObj: {},
    };
  },
  methods: {
    async show(row) {
      const { goodsList, ...rData } = (await getWarehouseTrayGoods(row.trayId))
        .data;
      this.tableConfig.columnData = (goodsList || []).map((e) => ({
        ...e,
        tempMovingNum: e.movingNum,
      }));
      this.trayFormConfig.formModel = {
        ...rData,
      };
      this.$refs.drawerRef.show();
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
  created() {
    this["dictionary/getDictionary"](["wmsStorageMode", "warehousingSource"]);
  },
  components: {
    ComDrawer: () => import("_comp/ComDrawer"),
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.add-cabinet-arrangement {
  /deep/ .el-drawer {
    .com-detail-top {
      margin-bottom: 20px;
      padding: 20px 0 0 0;
    }
    .el-table--medium td {
      padding: 7px 0;
    }
    .el-drawer__header {
      display: none;
    }
    .my-pagination-container {
      text-align: left;
      padding: 12px 0;
      position: absolute;
      bottom: 0;
    }
  }
}
</style>
