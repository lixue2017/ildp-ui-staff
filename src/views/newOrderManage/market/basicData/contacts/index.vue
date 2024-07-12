<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :formConfig="searchFormConfig"
              v-if="showSearchForm && tabsConfig.activeName === tab.name"
            />
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              :ref="`tableRef${tab.name}`"
              v-if="tabsConfig.activeName === tab.name"
              :tableHeight="contactsTable.tableHeight"
              :columnConfig="contactsTable.columnConfig"
              :httpRequest="contactsTable.httpRequest"
              :getQueryParams="() => getQueryParams(tab.name)"
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
                <template v-if="slotProps.prop === 'dataStatus'">
                  <span>
                    <i
                      class="status-dot"
                      :style="{
                        backgroundColor:
                          slotProps.dicsList && slotProps.dicsList.color,
                      }"
                    ></i>
                    {{ slotProps.dicsList && slotProps.dicsList.nameCn }}
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
        }}<span
          class="title-name"
          v-if="detailFormConfig.formModel.customerShortName"
        >
          ({{ detailFormConfig.formModel.customerShortName }})
        </span>
      </template>
      <template v-slot:content>
        <div class="primary-color detail-status-btn">
          {{
            dictionary.dicsData.status &&
            dictionary.dicsData.status[detailFormConfig.formModel.dataStatus] &&
            dictionary.dicsData.status &&
            dictionary.dicsData.status[detailFormConfig.formModel.dataStatus]
              .nameCn
          }}
        </div>
        <ComForm
          ref="dialogForm"
          :formConfig="detailFormConfig"
          class="dialog-form"
          :dictionary="dictionary"
          v-if="
            Object.keys(dictionary.dicsData).length &&
            $refs &&
            $refs.detailDialog &&
            $refs.detailDialog.dialogVisible
          "
        >
          <template v-slot:taxId="slotProps">
            {{
              !slotProps.formModel.taxIdType && !slotProps.formModel.taxId
                ? "--"
                : `${
                    slotProps.dicsList[slotProps.formModel.taxIdType]
                      ? `(${
                          slotProps.dicsList[slotProps.formModel.taxIdType]
                            .label
                        })`
                      : ""
                  }${slotProps.formModel.taxId || ""}`
            }}
          </template>
          <template v-slot:provinceCity="slotProps">
            {{
              `${slotProps.formModel.province || "--"}/${
                slotProps.formModel.city || "--"
              }`
            }}
          </template>
        </ComForm>
        <div class="historical-records">
          <div class="historical-records-title">清关资料</div>
        </div>
        <ComTable
          v-if="$refs && $refs.detailDialog && $refs.detailDialog.dialogVisible"
          ref="clearanceTable"
          :tableHeight="clearanceTable.tableHeight"
          :columnConfig="clearanceTable.columnConfig"
          :httpRequest="clearanceTable.httpRequest"
          :getQueryParams="clearanceTable.getQueryParams"
          :pagination="false"
          :paginationConfig="{
            limit: 999,
          }"
          class="tableData-detail"
        >
          <template v-slot:customRow="{ slotProps }">
            <template v-if="slotProps.prop === 'customsClearanceType'">
              <span> {{ slotProps.dicsList.nameCn }}文件 </span>
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
        <div class="historical-records margin-top-20">
          <div class="historical-records-title">历史修订记录</div>
          <div class="historical-records-sub">
            <i class="el-icon-info"></i>
            <span>启用之后每次修改修改记录相信信息</span>
          </div>
        </div>
        <ComTable
          v-if="$refs && $refs.detailDialog && $refs.detailDialog.dialogVisible"
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
              <el-row>{{ slotProps.row.createBy }} </el-row>
              <el-row> {{ slotProps.row.createTime }}</el-row>
            </template>
            <template v-if="slotProps.prop === 'contacts'">
              <el-row class="show-overflow-tooltip"
                >{{ slotProps.row.contacts }}
              </el-row>
              <el-row class="show-overflow-tooltip">
                {{ slotProps.row.phone || "--" }}</el-row
              >
            </template>
            <template v-if="slotProps.prop === 'taxId'">
              <el-row class="show-overflow-tooltip">
                {{
                  slotProps.dicsList
                    ? `(${slotProps.dicsList.nameCn})${slotProps.row.taxId}`
                    : "--"
                }}
              </el-row>
              <el-row class="show-overflow-tooltip">
                {{ slotProps.row.email || "--" }}</el-row
              >
            </template>
            <template v-if="slotProps.prop === 'nation'">
              <el-row class="show-overflow-tooltip"
                >{{ slotProps.row.countryName || "--" }}
              </el-row>
              <el-row class="show-overflow-tooltip">
                {{
                  `${slotProps.row.province}/${slotProps.row.city}/${
                    slotProps.row.postCode || "--"
                  }`
                }}</el-row
              >
            </template>
            <template v-if="slotProps.prop === 'detailsAddr'">
              <el-row class="show-overflow-tooltip">
                {{ `${slotProps.row.address || "--"}` }}
              </el-row>
              <el-row class="show-overflow-tooltip">
                {{ slotProps.row.company || "--" }}</el-row
              >
            </template>
          </template>
          <template v-slot:customHeader="{ slotProps }">
            <template
              v-if="
                /invalid|contacts|taxId|nation|detailsAddr|EORI/.test(
                  slotProps.column.prop
                )
              "
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
  getContactsList,
  getHistoryRecord,
  getContactsDetail,
} from "@/api/basicInfo/contacts.js";
import { getCustomsClearance } from "@/api/order/firstTransport.js";
import { DATA_STATUS, TAX_ID_OPTION } from "@/utils/mixin.js";
import { mapActions, mapState, mapMutations } from "vuex";
import { searchColumns, tableColumns, detailColumns } from "./model";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
export default {
  name: "Contacts",
  mixins: [mixinColsConf],
  components: {
    ComDialog: () => import("_comp/ComDialog"),
  },
  data() {
    return {
      dataStatus: DATA_STATUS,
      taxIdOption: TAX_ID_OPTION,
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {
          this.$nextTick(() => {
            this.mixinkeepTable();
          });
        },
        tabs: [
          {
            label: "收件人信息",
            name: "1",
          },
          {
            label: "发件人信息",
            name: "2",
          },
        ],
      },
      searchFromData: {
        1: {
          contactsType: 0,
        },
        2: {
          contactsType: 1,
        },
      },
      searchFormConfig: {
        formModel: {}, // 表单数据
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getContactsList(formModel);
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
      contactsTable: {
        tableHeight: "calc(100vh - 263px)",
        httpRequest: (query) => getContactsList(query, true),
        columnConfig: tableColumns,
      },
      customDialogConfig: {
        details: {
          title: "联系人信息",
          width: "850px",
          slotTitle: true,
          footer: [
            {
              text: "取消",
              plain: true,
              handleClick: () => {
                this.$refs.detailDialog.hide();
              },
            },
          ],
        },
      },
      detailFormConfig: {
        formModel: {},
        httpRequest: this.addOrEditContacts, // 表单提交接口
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
        layout: "total, prev, pager, next, jumper",
      },
      detailId: 0,
      clearanceTable: {
        columnConfig: detailColumns.clearanceTable,
        httpRequest: () => {
          const { cusContactsMainId } = this.ids;
          return getCustomsClearance(cusContactsMainId);
        },
      },
      ids: {},
    };
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  created() {
    this["dictionary/getDictionary"]("contactTypeEn").then(() => {
      this.showSearchForm = true;
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getContactsList(searchFrom = {}) {
      this.searchFromData[this.tabsConfig.activeName] = {
        "cusContacts.contacts": searchFrom.contacts,
        "cusContacts.company": searchFrom.company,
        customerShortName: searchFrom.customerShortName,
        beginTime: searchFrom.beginTime && searchFrom.beginTime.join("@"),
        statusSearch:
          searchFrom.statusSearch && searchFrom.statusSearch.join(","),
        contactsType: this.tabsConfig.activeName - 1,
      };
      this.mixinkeepTable(true);
    },
    getQueryParams(tab) {
      return {
        ...this.searchFromData[tab],
        contactsType: tab - 1,
      };
    },
    getDetailQueryParams() {
      const { cusContactsMainId, cusContactsId } = this.ids;
      return {
        cusContactsMainId,
        cusContactsId,
      };
    },
    // 查看单条数据详情
    handleDetails(row) {
      const { id } = row;
      const { activeName } = this.tabsConfig;
      const idList = this.$refs[`tableRef${activeName}`][0]?.tableData.map(
        (item) => item.id
      );
      this.$router.push({
        path: "/newOrderManage/market/contactsDetails",
        query: {
          id,
          backPath: this.$route.fullPath,
          pageSign: idList.join(","), // 详情显示上一页/下一页
        },
      });
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.margin-top-20 {
  margin-top: 20px;
}
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
  padding-right: 30px;
}
/deep/ .el-dialog__body {
  padding-bottom: 0;
}
</style>
