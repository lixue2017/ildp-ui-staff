<template>
  <div class="proInfo-details">
    <ComDetailTop
      :title="`${headerTit}(${detailFormConfig.formModel.orderNum})`"
      :formModel="detailFormConfig.formModel"
      @handleClick="handleTopClick"
    />

    <div>
      <ComForm
        ref="detailsForm"
        :formConfig="detailTypeFormConfig()"
        style="width: 100%"
      >
        <template v-slot:slotWMSRk="slotProps">
          <span>
            ( {{ slotProps.formModel.busType || 'DTM1/BAOSEN MJ' }})
          </span>
        </template>
        <template v-slot:slotFBARk="slotProps">
          <span>
            ( {{ slotProps.formModel.busType || 'DTM1/BAOSEN MJ' }})
          </span>
        </template>
      </ComForm>

      <ComTabs :tabsConfig="tabsConfig" class="details-tabs-btn">
        <template v-for="(tab, idx) in tabsConfig.tabs">
          <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
            <keep-alive>
              <ComTable
                v-if="tabsConfig.activeName === tab.name"
                :ref="`tableRef${tab.name}`"
                :tableHeight="tableConfig.tableHeight"
                :columnConfig="tableTabConfig(idx)"
                :httpRequest="tableConfig.httpRequest"
                :getQueryParams="getTableQueryParams"
                :paginationConfig="{ limit: 999 }"
                :pagination="false"
              >
                <template v-slot:customRow="{ slotProps }">
                  <template v-if="['slotFbark'].includes(slotProps.prop)">
                    <el-radio v-model="slotProps.row.prop" disabled label="1">{{slotProps.column.label}}</el-radio>
                  </template>
                  <template v-if="['slotXh'].includes(slotProps.prop)">
                    <div class="ellipsis-text" v-for="(xhItem, xhIdx) in ['FBA15FS6NM9T0001', 2, 3]" :key="xhIdx">
                      <span>{{xhItem}}</span>
                    </div>
                  </template>
                  <!-- FBA退仓入库 -->
                  <template v-if="['slotBgh'].includes(slotProps.prop)">
                    <div class="ellipsis-text" v-for="(xhItem, xhIdx) in ['FBA15FS6NM9T0001', 2, 3]" :key="xhIdx">
                      <span>{{xhItem}}</span>
                    </div>
                  </template>
                  <template v-if="['slotYsSKU'].includes(slotProps.prop)">
                    <div class="ellipsis-text" v-for="(xhItem, xhIdx) in [500, 2, 3]" :key="xhIdx">
                      <span>{{xhItem}}</span>
                    </div>
                  </template>
                  <template v-if="['slotYss'].includes(slotProps.prop)">
                    <div class="ellipsis-text" v-for="(xhItem, xhIdx) in [150, 2, 3]" :key="xhIdx">
                      <span>{{xhItem}}</span>
                    </div>
                  </template>
                </template>
                <template v-slot:customHeader="{ slotProps }">
                  <template v-if="/slotFbark/.test(slotProps.column.prop)">
                    <el-radio v-model="slotProps.column.prop" disabled label="1">{{slotProps.column.label}}</el-radio>
                  </template>
                </template>
              </ComTable>
            </keep-alive>
          </el-tab-pane>
        </template>
      </ComTabs>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { warehouseStorageDetail, warehouseStorageList } from "@/api/warehouse/manage"
import { detailFromCols, detailTableColumns, detailTableFBAColumns } from "./model";

export default {
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComTabs: () => import("_comp/ComTabs"),
    ComTable: () => import("_comp/ComTable"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
    TooltipOver: () => import("_comp/TooltipOver"),
  },
  data() {
    return {
      headerTit: '',
      formModel: {},
      detailFormConfig: {
        formModel: {},
        size: "small",
        labelWidth: "112px",
        formRules: {}
      },
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {}
      },
      tabsBtn: [{
        label: "按箱收货",
        name: "1"
      }, {
        label: "按SKU收货",
        name: "2"
      }],
      tableConfig: {
        tableHeight: "calc(100vh - 324px)",
        httpRequest: warehouseStorageList
      }
    };
  },
  created() {
    this["dictionary/getDictionary"]("exWarehouseManage");
    this.initRequest();
  },
  methods: {
    initRequest() {
      const { id, typeConf = 1 } = this.$route.query
      const tabsConfArr = typeConf == 1 ? ['2'] : ['1', '2']
      const titTxt = ['WMS入库单入库', 'FBA退仓入库']
      this.headerTit = titTxt[typeConf]
      this.tabsConfig = {
        ...this.tabsConfig,
        activeName: tabsConfArr[0],
        tabs: this.tabsBtn.filter(e => tabsConfArr.includes(e.name)),
      }
      warehouseStorageDetail(id).then(res => {
        this.detailFormConfig.formModel = {
          ...res.data || {}
        }
      })
    },
    handleTopClick({ type, id }) {
      if (type === "back") {
        this.reBack();
        return;
      }
      if (type === "pre" || type === "next") {
        this.$route.query.id = id
        this.initRequest();
      }
    },
    reBack() {
      const { path } = this.$route.query
      this.$router.push({
        path
      });
    },
    getTableQueryParams() {
      return {
        type: 2
      }
    },
    detailTypeFormConfig() {
      const { typeConf = 1 } = this.$route.query
      return {
        ...this.detailFormConfig,
        lists: detailFromCols(typeConf)
      }
    },
    tableTabConfig(index) {
      const { typeConf = 1 } = this.$route.query
      if (typeConf == 1) {
        return detailTableFBAColumns()
      }
      return detailTableColumns(index)
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "~@/assets/styles/variables.scss";
.proInfo-details {
  padding: 24px 36px;
  font-size: 14px;
  color: #1f1f1f;
  background-color: #ffffff;
  margin: 10px;
  .tag-green-color {
    margin-right: 5px;
  }
  .com-detail-top {
    margin-bottom: 20px;
  }
}
</style>
