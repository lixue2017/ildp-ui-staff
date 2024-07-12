<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :formConfig="getSearchFormConfig(3)"
              v-if="showSearchForm && tabsConfig.activeName === tab.name"
            />
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              :ref="`tableRef${tab.name}`"
              v-if="tabsConfig.activeName === tab.name"
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="model[3].tableColumns"
              :httpRequest="model[3].httpRequest"
              :getQueryParams="() => getQueryParams(tab.name)"

							:rowOperationBtnListFn="(r) => tableStatusList(r)"
							@handleTableView="(r) => handleDetails(r)"
            >
              <template v-slot:customRow="{ slotProps }">
                <!-- <template v-if="slotProps.prop === 'number'">
                  <span
                    class="primary-text-btn"
                    @click="handleDetails(slotProps.row)"
                  >
                    {{ slotProps.row.number }}
                  </span>
                </template> -->
                <template v-if="slotProps.prop === 'insurance'">
                  <span
                    class="text-theme-color"
                    v-if="slotProps.row.insurance == '1'"
                  >
                    ✓保险
                  </span>
                  <span v-else>--</span>
                </template>
                <template v-if="slotProps.prop === 'product'">
                  <el-row>
                    <span
                      :class="[
                        'isComplete',
                        slotProps.row.foreignExportParam == 1
                          ? 'text-success-color'
                          : 'text-danger-color',
                      ]"
                    >
                      <i
                        :class="
                          slotProps.row.foreignExportParam == 1
                            ? 'el-icon-circle-check'
                            : 'el-icon-warning-outline'
                        "
                      ></i>
                      {{ slotProps.dicsList.nameCn }}
                    </span>
                  </el-row>
                </template>

                <!-- <template v-if="slotProps.prop === 'status'">
                  <div class="operate-status">
                    <span>
                      <i
                        class="status-dot"
                        :style="{
                          backgroundColor: slotProps.dicsList.color,
                        }"
                      ></i>
                      {{ slotProps.dicsList.nameCn }}
                    </span>
                  </div>
                </template> -->
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>

		<ComCustomDialog ref="mCustomDialogRef" />
  </div>
</template>

<script>
import mixinOverseas from "@/views/newOrderManage/overSea/components/mixinOverseas.js";
import { postOrderFbaRepulse } from "@/api/overseas/fbaOrder.js";
import { remarkDialogCols } from "_comp/ConfirmDialog/customFormDialog/model.js";
import { customMessageBox } from "@/utils/confirmBox.js";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
export default {
  name: "FBAorder",
  mixins: [mixinOverseas, mixinColsConf],
  computed: {},
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "整箱出库", // 订单列表
            name: "1",
          },
        ],
      },
			tableStatusBtnList: [
				{
					text: "打回",
					btnType: [1],
					color: "#FF6767",
					handleClick: (row) => this.handleRepulse(row),
				},
			],
    };
  },
  created() {},
  activated() {},
  methods: {
		handleRepulse({ id }) {
			this.$refs.mCustomDialogRef?.showCustomDialog({
				customFormConfig: remarkDialogCols(),
				formModel: {
					id,
				},
				httpRequest: postOrderFbaRepulse,
				errorFunction: (err) => {
					if (err.code === 1002) {
						customMessageBox(this, {
							msgTitle: err.msg,
							msgTxt1: '如需打回',
							msgTxt2: '，请先删除费用信息！',
							msgTxtColor: "#FF6767",
							showCancelButton: false,
							confirmButtonText: '关闭',
						}, () => {
							this.$refs.mCustomDialogRef.customDialogHide();
						})
					}
				},
				successFunction: () => this.mixinkeepTable(),
			})
		},
		handleDetails(row) {
      const { activeName } = this.tabsConfig
			const idList = this.$refs[
				`tableRef${activeName}`
			][0].tableData.map(e => e.id);
			this.$router.push({
				path: '/warehouseManage/outStorage/fbaOrderDetails',
				query: {
					id: row.id,
					backPath: this.$route.fullPath,
					pageSign: idList.join(','), // 详情显示上一页/下一页
				}
			})
    },
		getQueryParams(tab) {
      return {
				...this.searchFromData[tab],
				queryType: 1
			};
    },
		tableStatusList(row) {
			return this.tableStatusBtnList.filter(e =>
				e.btnType.includes(row.status)) // 订单操作
		},
	},
	components: {
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
