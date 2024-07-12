<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :formConfig="searchFormConfig"
              v-if="showSearchForm && tabsConfig.activeName === tab.name"
            >
            </ComForm>
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              :ref="`tableRef${tab.name}`"
              v-if="tabsConfig.activeName === tab.name"
              :tableHeight="consigneeTable.tableHeight"
              :columnConfig="tableMixinConfig(tab.name)"
              :httpRequest="consigneeTable.httpRequest"
              :getQueryParams="consigneeTable.getQueryParams"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'code'">
                  <div
                    class="display-flex"
                    @click="handleDetails(slotProps.row)"
                  >
                    <span
                      class="primary-text-btn ellipsis-text"
                      :title="slotProps.row.code"
                    >
                      {{ slotProps.row.code }}
                    </span>
                    <el-button
                      v-if="slotProps.row.isDefault"
                      type="primary"
                      size="mini"
                      plain
                      >默认</el-button
                    >
                  </div>
                </template>
                <template v-if="slotProps.prop === 'status'">
                  <span>
                    <i
                      class="status-dot"
                      :style="{
                        backgroundColor: slotProps.dicsList.color,
                      }"
                    ></i>
                    {{ slotProps.dicsList.nameCn }}
                  </span>
                </template>
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>

    <ComDialog
			ref="detailDialog"
			:customDialog="customDialogConfig.details"
			:confirmClose="false"
		>
		<template slot="title">
        {{ customDialogConfig.details.title
        }}<span class="title-name" v-if="detailFormConfig.formModel.nickName">
          ({{ detailFormConfig.formModel.nickName }})
        </span>
      </template>
			<template v-slot:content>
				<ComForm
					ref="dialogForm"
					:formConfig="detailFormConfig"
					class="dialog-form"
					v-if="$refs.detailDialog && $refs.detailDialog.dialogVisible"
				>
					<template v-slot:slotStatus="slotProps">
						<div
							class="tag-blue-color"
						>
							{{ slotProps.dicsData.nameCn || '--' }}
						</div>
					</template>
				</ComForm>
				<div class="historical-records">
					<div class="historical-records-title">历史修订记录</div>
					<div class="historical-records-sub">
						<i class="el-icon-info"></i>
						<span>启用之后每次修改修改记录相信信息</span>
					</div>
				</div>
				<ComTable
					v-if="$refs.detailDialog && $refs.detailDialog.dialogVisible"
					ref="detailDialogTable"
					:tableHeight="detailTable.tableHeight"
					:columnConfig="detailTable.columnConfig"
					:httpRequest="detailTable.httpRequest"
					:getQueryParams="getDetailQueryParams"
					:paginationConfig="paginationConfig"
					class="tableData-detail"
				>
					<template v-slot:customRow="{ slotProps }">
						<template v-if="slotProps.prop === 'invalid'">
							<el-row>{{ slotProps.row.updateBy || "--" }} </el-row>
							<el-row> {{ slotProps.row.updateTime || "--" }}</el-row>
						</template>
						<template v-if="slotProps.prop === 'contacts'">
							<el-row>{{ slotProps.row.addresName || "--" }} </el-row>
							<el-row> {{ slotProps.row.contacts }}/{{ slotProps.row.phone }}</el-row>
						</template>
						<template v-if="slotProps.prop === 'addr'">
							<el-row class="show-overflow-tooltip">
								{{ slotProps.row.address || "--" }}
							</el-row>
							<el-row class="show-overflow-tooltip">
								{{ slotProps.row.remark || "--" }}
							</el-row>
						</template>
					</template>
					<template v-slot:customHeader="{ slotProps }">
						<template
							v-if="/invalid|contacts|addr/.test(slotProps.column.prop)"
						>
							<div>{{ slotProps.column.labelTop }}</div>
							<div>{{ slotProps.column.labelBtm }}</div>
						</template>
					</template>
				</ComTable>
			</template>
		</ComDialog>
  </div>
</template>

<script>
import {
  getConsigneeList,
  getConsigneeDetail,
  getHistoryRecord,
} from "@/api/basicInfo/consignee.js";
import { searchColumns, tableColumns, detailColumns } from "./model";
import { mapActions, mapState } from "vuex";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
export default {
  name: "Consignee",
  mixins: [mixinColsConf],
  components: {
    ComDialog: () => import("_comp/ComDialog"),
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "提货地址信息",
            name: "1",
          },
        ],
      },
      searchFromData: {},
      searchFormConfig: {
        formModel: {}, // 表单数据
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getConsigneeList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        fold: true,
        // expansion: false,
        size: "small",
        labelWidth: "85px",
        lists: [
          {
            className: "search-form-width",
            fieldList: [
              {
                rows: [
                  {
                    cols: searchColumns,
                  },
                ],
              },
            ],
          },
        ], // 表单渲染列表
        formRules: {}, // 表单校验规则
      },
      consigneeTable: {
        tableHeight: "calc(100vh - 262px)",
        getQueryParams: this.getQueryParams,
        httpRequest: (query) => getConsigneeList(query, true),
      },
      mixinTableColArr: [tableColumns],
      customDialogConfig: {
        details: {
          title: "提货地址信息",
          width: "950px",
          slotTitle: true,
          footer: [
            {
              text: "取消",
              plain: true,
              handleClick: () => {
                this.$refs.detailDialog.handleClose();
              },
            },
          ],
        },
      },
      detailFormConfig: {
        formModel: {},
        httpRequest: this.addOrEditConsignee, // 表单提交接口
        size: "small",
        labelWidth: "100px",
        lists: [
          {
            fieldList: [
              {
                rows: [
                  {
                    cols: detailColumns.from,
                  },
                ],
              },
            ],
          },
        ], // 表单渲染列表
        formRules: {},
      },
      detailTable: {
        tableHeight: "206px",
        columnConfig: detailColumns.table,
        httpRequest: getHistoryRecord,
      },
      paginationConfig: {
        limit: 5,
        layout: "total, sizes, prev, pager, next, jumper",
        className: "",
        small: false,
      },
      ids: {},
    };
  },
  created() {
    this["dictionary/getDictionary"]("consigneeTypeEn").then(() => {
      this.showSearchForm = true;
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getConsigneeList(searchFrom = {}) {
      this.searchFromData = { ...searchFrom };
      this.searchFromData.beginTime &&
        (this.searchFromData.beginTime =
          this.searchFromData.beginTime.join("@"));
      this.searchFromData.state &&
        (this.searchFromData.state = this.searchFromData.state.join(","));
      this.mixinkeepTable(true);
    },
    getQueryParams() {
      return this.searchFromData;
    },
    getDetailQueryParams() {
      return this.ids;
    },
    // 查看单条数据详情
    handleDetails(rows) {
      this.fullscreenLoading.show();
      return getConsigneeDetail(rows.id, true)
        .then((res) => {
          const data = res.data || {};
          this.detailFormConfig.formModel = {
            ...(data || {}),
            isDefault: data.isDefault ? true : false,
          };
          this.ids = {
            id: data.id,
            consigneeId: data.consigneeId,
          };
          this.$refs.detailDialog.show();
          this.fullscreenLoading.close();
          setTimeout(() => {
            this.$refs.detailDialogTable.refreshTable();
          });
        })
        .catch((err) => {
          this.fullscreenLoading.hide();
        });
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.operation-content {
  .btn {
    display: flex;

    .operate-icon {
      display: flex;
      align-items: center;
      margin-right: 14px;

      &.operate-icon-info {
        color: #606060;
      }

      /deep/ span {
        font-size: 12px;
      }
    }
  }
}
.dialog-form {
  padding-right: 60px;
}
/deep/ .el-dialog__body {
  padding-bottom: 0;
}
.historical-records {
  display: flex;
  align-items: center;
  margin-bottom: 12px;

  .historical-records-title {
    font-size: 16px;
    margin-right: 21px;
    color: #1f1f1f;
  }

  .historical-records-sub {
    color: #666;

    i {
      margin-right: 10px;
    }
  }
}
</style>
