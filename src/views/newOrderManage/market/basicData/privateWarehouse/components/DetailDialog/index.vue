<template>
  <ComDialog
    ref="detailDialog"
    :customDialog="customDialogConfig"
    :confirmClose="false"
  >
    <template slot="title">
      {{ customDialogConfig.title }}
      <span class="title-name" v-if="formConfig.formModel.companyName">
        ({{ formConfig.formModel.companyName }})
      </span>
    </template>
    <template v-slot:content>
      <div class="primary-color detail-status-btn">
        {{
          dictionary.dicsData.status &&
          dictionary.dicsData.status[formConfig.formModel.dataStatus] &&
          dictionary.dicsData.status[formConfig.formModel.dataStatus].nameCn
        }}
      </div>
      <ComForm
        ref="dialogForm"
        :formConfig="formConfig"
        class="dialog-form"
        v-if="$refs && $refs.detailDialog && $refs.detailDialog.dialogVisible"
      />
      <div class="historical-records">
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
            <el-row>{{ slotProps.row.updateBy }} </el-row>
            <el-row> {{ slotProps.row.updateTime }}</el-row>
          </template>
          <template v-if="slotProps.prop === 'FBAName'">
            <el-row class="show-overflow-tooltip"
              >{{ slotProps.row.warehouseName || "--" }}
            </el-row>
            <el-row class="show-overflow-tooltip">
              {{ slotProps.row.company || "--" }}</el-row
            >
          </template>
          <template v-if="slotProps.prop === 'FBAContacts'">
            <el-row class="show-overflow-tooltip">{{
              slotProps.row.contacts || "--"
            }}</el-row>
            <el-row class="show-overflow-tooltip">
              {{ slotProps.row.phone || "--" }}/{{
                slotProps.row.email || "--"
              }}</el-row
            >
          </template>
          <template v-if="slotProps.prop === 'contacts'">
            <el-row class="show-overflow-tooltip"
              >{{ slotProps.row.contacts || "--" }}
            </el-row>
            <el-row class="show-overflow-tooltip">
              {{ slotProps.row.phone || "--" }}</el-row
            >
          </template>
          <template v-if="slotProps.prop === 'name'">
            <el-row class="show-overflow-tooltip">{{
              slotProps.row.warehouseName || "--"
            }}</el-row>
            <el-row class="show-overflow-tooltip">
              {{ slotProps.row.email || "--" }}</el-row
            >
          </template>
          <template v-if="slotProps.prop === 'postCode'">
            <el-row class="show-overflow-tooltip"
              >{{ slotProps.row.nationTwoCode }}[{{
                slotProps.row.nationName
              }}]</el-row
            >
            <el-row class="show-overflow-tooltip">
              {{ slotProps.row.postCode || "--" }}</el-row
            >
          </template>
          <template v-if="slotProps.prop === 'detailsAddr'">
            <el-row class="show-overflow-tooltip">
              {{ `${slotProps.row.address || "--"}` }}
            </el-row>
            <el-row class="show-overflow-tooltip">
              {{ slotProps.row.remark || "--" }}
            </el-row>
          </template>
        </template>
        <template v-slot:customHeader="{ slotProps }">
          <template
            v-if="
              /invalid|contacts|name|postCode|detailsAddr|FBAName|FBAContacts/.test(
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
</template>


<script>
import {
  getWarehouseDetail,
  getHistoryRecord,
} from "@/api/basicInfo/warehouse.js";
import { FullscreenLoading } from "@/utils/loading.js";
import { config } from "./model";
import { mapState } from "vuex";
export default {
  props: {
    isPrivateWarehouse: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    ComDialog: () => import("_comp/ComDialog"),
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  data() {
    return {
      fullscreenLoading: new FullscreenLoading(),
      customDialogConfig: {
        title: "私人仓库地址信息",
        width: "750px",
        slotTitle: true,
        footer: [
          {
            text: "取消",
            plain: true,
            handleClick: this.hide,
          },
          // {
          //   text: "修改",
          //   type: "primary",
          //   handleClick: this.handleUpdate,
          // },
        ],
        footerSpare: [
          {
            text: "取消",
            plain: true,
            handleClick: this.hide,
          },
        ],
      },
      formConfig: {
        formModel: {},
        size: "small",
        labelWidth: "100px",
        lists: [], // 表单渲染列表
        formRules: {},
      },
      detailTable: {
        // tableHeight: "206px",
        columnConfig: [],
        httpRequest: getHistoryRecord,
      },
      paginationConfig: {
        limit: 5,
        layout: "total, prev, pager, next, jumper",
      },
      ids: {},
    };
  },
  methods: {
    getDetailQueryParams() {
      return this.ids;
    },
    handleUpdate() {
      this.$emit("handleUpdate", this.detailData);
    },
    show(rows) {
      this.fullscreenLoading.show();
      this.detailId = rows.id;
      return this.getWarehouseDetail(rows)
        .then((res) => {
          const {
            id,
            dataStatus,
            warehouseId,
            warehouseCode,
            platformType,
            nationTwoCode,
            nationName,
            companyName,
            cusWarehouse: {
              warehouseName,
              contacts,
              postCode,
              province,
              city,
              area,
              street,
              detailAddress,
              company,
              phone,
              email,
              remark,
            },
          } = res.data || {};
          this.ids = {
            id,
            warehouseId,
          };
          this.detailData = res.data;
          const nation = nationTwoCode && `${nationTwoCode}[${nationName}]`;
          this.formConfig.formModel = {
            id,
            companyName,
            dataStatus,
            warehouseId,
            warehouseCode,
            warehouseName,
            nationName: nation,
            contacts,
            postCode,
            province,
            city,
            area,
            street,
            detailAddress,
            company,
            phone,
            email,
            remark,
            platformType: platformType.toString(),
          };
          this.$refs.detailDialog.show();
          this.fullscreenLoading.close();
          setTimeout(() => {
            this.$refs.detailDialogTable.refreshTable(true);
          });
        })
        .catch((err) => {
          this.fullscreenLoading.hide();
        });
    },
    getWarehouseDetail(rows) {
      if (rows.platformType == 4) {
        this.customDialogConfig.title = "私人仓库地址信息";
        this.customDialogConfig.useFooter = "footerSpare";
        this.formConfig.lists = config(true).from;
        this.detailTable.columnConfig = config(true).table;
        return getWarehouseDetail(rows.id);
      } else {
        this.customDialogConfig.title = "FBA仓库地址信息";
        this.customDialogConfig.useFooter = "footer";
        this.formConfig.lists = config().from;
        this.detailTable.columnConfig = config().table;
        return getWarehouseDetail(rows.id);
      }
    },
    hide() {
      this.$refs.detailDialog.hide();
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../../index.scss";
.dialog-form {
  padding-right: 74px;
}
</style>