<template>
  <!-- 新页面 -->
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :formConfig="getSearchFormConfig(tab.name)"
							@searchHeight="searchHeight"
              v-if="showSearchForm && tabsConfig.activeName === tab.name"
            >
              <template v-slot:form-submit>
                <ComColumnConf
                  :tableCols="tableAllMixinConfig(tab.name)"
                  :tName="tab.name"
                  @setColumnConf="(arr) => setColumnMixinConf(arr)"
                />
              </template>
            </ComForm>
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              :ref="`tableRef${tab.name}`"
              v-if="showSearchForm && tabsConfig.activeName === tab.name"
              :tableHeight="`calc(100vh - ${extraHeight + formHeight}px)`"
              :columnConfig="tableMixinConfig(tab.name)"
              :getQueryParams="getTableQueryParams"
              :httpRequest="httpRequest"
              :rowOperationBtnListFn="
                (row) => statusBtnListFn(tab.name, row)
              "
              @handleTableView="(r) => handleView(r)"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'isBookingSpace'">
                  <div>
                    <div
                      v-if="slotProps.row.isBookingSpace||slotProps.row.isBookingSpace===0"
                      :style="{ color: slotProps.dicsList.color }"
                    >
                      <template v-if="slotProps.row.isBookingSpace == 2">
                        <el-tooltip
                          class="item"
                          effect="dark"
                          :content="slotProps.row.refuseRemark"
                          placement="top"
                        >
                          <span>
                            {{ getDictObj( isBookingSpaceStatus, slotProps.row.isBookingSpace ) }}
                          </span>
                        </el-tooltip>
                      </template>
                      <template v-else>
                        <span>{{getDictObj(isBookingSpaceStatus, slotProps.row.isBookingSpace)}}</span>
                      </template>
                    </div>
                    <div v-else>--</div>
                  </div>
                </template>
                <!-- <template v-if="slotProps.prop === 'sono'">
                  <span
                    v-if="slotProps.row.sono"
                    class="primary-text-btn"
                    @click="handleView(slotProps.row)"
                  >
                    {{ slotProps.row.sono }}
                  </span>
                  <span v-else>--</span>
                </template> -->
                <!-- <template v-if="slotProps.prop === 'operation'">
                  <div class="operate-btn-list">
                    <div
                      class="btn"
                      v-for="(item, index) in statusList"
                      :key="index"
                    >
                      <el-button
                        :class="`operate-icon ${
                          item.info ? 'operate-icon-info' : ''
                        }`"
                        size="small"
                        type="text"
                        @click="item.handleClick(slotProps.row)"
                      >
                        {{ item.text }}
                      </el-button>
                    </div>
                  </div>
                </template> -->
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
    <AddEditDialog ref="dialog" @handleSuccess="mixinkeepTable" />
    <SoNoCheckIn
      ref="soNoCkInDialog"
      :isOnlySoNo="true"
      @close="
        (val) => {
          val && mixinkeepTable();
        }
      "
      @handleSuccess="mixinkeepTable"
    />
    <ConfirmDialog ref="confirmDlgRef" />
    <BookingDialog ref="BookingDialog" @handleSuccess="mixinkeepTable"/>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { mixinBroking } from "@/views/marketManage/components/broking/mixin.js";
import { marketBookingLcl } from "@/views/marketManage/components/broking/model.js";
export default {
  name: "MarketBookingLcl",
  mixins: [mixinBroking, mixinColsConf],
  components: {
    SoNoCheckIn: () =>
      import(
        "@/views/marketManage/forBooking/components/SoNoCheckIn/index.vue"
      ),
    ConfirmDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
    BookingDialog: () =>
      import(
        "../components/bookingRegistration"
      ),
  },
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        type: "marketBookingLcl",
        handleTabsClick: () => {
          this.initMixinColumnConf();
        },
        tabs: [
          {
            label: "市场订舱(LCL)",
            name: "1",
          },
          {
            label: "已订舱",
            name: "2",
          },
        ],
        // btnArr: [
        //   {
        //     table: "名字",
        //     handleClick: () => this.handleClick(),
        //   },
        // ],
      },
      searchFromData: {},
      searchFormConfig: {
        formModel: {}, // 表单数据
        fold: true, // 模糊搜索是否需要展开按钮
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.searchList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        labelWidth: "85px",
        searchColsHeight: true,
      },
      tableConfig: {},
      mixinTableColArr: [
        marketBookingLcl().tableColumns[1],
        marketBookingLcl().tableColumns[2],
      ],
    };
  },
  computed: {
    // ...mapState(["dictionary"]),
    ...mapState({
      isBookingSpaceStatus: (state) => state.dictionary.dicsData.isBookingSpaceStatus,
      dictData: (state) => state.dictionary.dicsData,
    }),
  },
  created() {
    this["dictionary/getDictionary"]("customsClearance").then((res) => {
      this.showSearchForm = true;
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
