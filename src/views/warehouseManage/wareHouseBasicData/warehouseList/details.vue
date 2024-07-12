<template>
  <div class="proInfo-details" v-if="isInit">
    <ComDetailTop
      class="top-titles"
      :title="overseaLangObj.ck_lb(`仓库信息`)"
      :formModel="detailFormConfig.formModel"
      @handleClick="handleTopClick"
    >
      <template v-slot:subTitle>
        <span class="sub-title">
          {{
            detailFormConfig.formModel.customerComName
              ? `(${detailFormConfig.formModel.customerComName})`
              : ""
          }}
        </span>
      </template>
    </ComDetailTop>
    <div class="content">
      <div class="flex-space-between">
        <ComForm
          ref="detailsForm"
          :formConfig="detailFormConfig"
          style="width: 100%"
          class="details-form"
        >
          <template v-slot:type="slotProps">
            <div class="base-flex-align ellipsis-text">
              <TooltipOver
                :content="`${slotProps.formModel.warehouseCode || '--'}`"
                refName="tooltipOver"
                :style="{ width: 'calc(100% - 120px)', flex: '1 0 30px' }"
              />
              <span class="tag-green-color">自建仓</span>
              <span class="tag-blue-color">{{
                slotProps.dicsData.nameCn || "--"
              }}</span>
            </div>
          </template>
          <template v-slot:nameAxs="slotProps">
            <span class="tag-blue-color">{{
              slotProps.formModel.busType == 2 ? "拼柜状态" : "操作单状态"
            }}</span>
          </template>
        </ComForm>
      </div>

      <div class="warehouse-details-content">
        <div class="left-des-box">
          <p class="tit-txt">{{ overseaLangObj.fq_gl("分区信息") }}</p>
          <el-radio-group
            class="left-btn-radio"
            v-model="radioVal"
            size="small"
            @change="radioChange"
          >
            <el-radio-button :label="'-1'">{{
              overseaLangObj.qb_all || "全部"
            }}</el-radio-button>
            <el-radio-button
              v-for="(item, i) in warehousePartitionType"
              :key="i"
              :label="item.value"
              >{{ item.nameCn }}</el-radio-button
            >
          </el-radio-group>
          <ComTable
            :ref="`leftTableRef`"
            :tableHeight="leftTable.tableHeight"
            :columnConfig="leftTable.columnConfig"
            :httpRequest="leftTable.httpRequest"
            :paginationConfig="leftTable.paginationConfig"
            :getQueryParams="getLeftQueryParams"
            :current-row="true"
            @onCurrentChange="(row) => onCurrentChangeEvt(row)"
            @getResult="getLeftTableResult"
          >
            <template v-slot:customRow="{ slotProps }">
              <template v-if="slotProps.prop === 'type'">
                <div class="ellipsis-text">
                  {{ slotProps.row.code || "--" }}
                </div>
                <div>{{ slotProps.dicsList.nameCn || "--" }}</div>
              </template>
              <template v-if="slotProps.prop === 'status'">
                <span>
                  <i
                    class="status-dot"
                    :style="{
                      backgroundColor:
                        slotProps.dicsList && slotProps.dicsList.color,
                    }"
                  ></i>
                  {{ slotProps.dicsList.nameCn }}
                </span>
              </template>
            </template>
          </ComTable>
        </div>

        <div class="right-des-box">
          <div class="table-title">{{ overseaLangObj.fq_gl("库位信息") }}</div>
          <ComTable
            :ref="`rightTableRef`"
            :tableHeight="rightTable.tableHeight"
            :columnConfig="rightTable.columnConfig"
            :httpRequest="rightTable.httpRequest"
            :isMountedRequest="false"
            :getQueryParams="getRightQueryParams"
          >
            <template v-slot:customRow="{ slotProps }">
              <template v-if="slotProps.prop === 'code'">
                <span
                  class="primary-text-btn ellipsis-text"
                  @click="handleAddOrEdit(slotProps.row, true)"
                >
                  {{ slotProps.row.code || "--" }}
                </span>
              </template>

              <template v-if="slotProps.prop === 'status'">
                <span>
                  <i
                    class="status-dot"
                    :style="{
                      backgroundColor:
                        slotProps.dicsList && slotProps.dicsList.color,
                    }"
                  ></i>
                  {{ slotProps.dicsList.nameCn }}
                </span>
              </template>

              <template v-if="slotProps.prop === 'operation'">
                <div class="operation-content-btn">
                  <template v-for="(item, index) in rightTable.statusBtnList">
                    <el-button
                      :key="index"
                      size="small"
                      type="text"
                      v-if="item.btnType.includes(slotProps.row.status || 0)"
                      @click="item.handleClick(slotProps.row)"
                      >{{ item.text }}</el-button
                    >
                  </template>
                </div>
              </template>
            </template>
          </ComTable>
        </div>
      </div>
    </div>
    <editFormWarehouse ref="editFormRef" />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { getWarehouseDetail } from "@/api/basicInfo/warehouse.js";
import {
  getPartitionList,
  getLocationList,
  delLocation,
  locationPut,
} from "@/api/warehouse/basic";
import { msgBox } from "@/utils/confirmBox.js";
import {
  detailFromCols,
  detailLeftTableConfig,
  detailRightTableConfig,
} from "./model";
import editFormWarehouse from "./components/editWarehouse.vue";

export default {
  components: {
    editFormWarehouse,
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
    TooltipOver: () => import("_comp/TooltipOver"),
  },
  data() {
    return {
      formModel: {},
      detailFormConfig: {
        formModel: {},
        labelWidth:
          this.overseaLangObj.yu_yan_lang === "en-us" ? "140px" : "90px",
        lists: detailFromCols,
      },
      radioVal: "-1",
      leftTable: {
        tableHeight: "calc(100vh - 324px)",
        httpRequest: getPartitionList,
        columnConfig: detailLeftTableConfig,
        paginationConfig: {
          limit: 20,
          layout: "total, prev, jumper, next",
          className: "small-paging",
          small: true,
        },
      },
      rightTable: {
        tableHeight: "calc(100vh - 324px)",
        httpRequest: getLocationList,
        columnConfig: detailRightTableConfig,
        statusBtnList: [
          {
            text: this.overseaLangObj.bj_edit(),
            btnType: [0, 2],
            handleClick: this.handleAddOrEdit,
          },
          {
            text: this.overseaLangObj.dy_disable(),
            btnType: [1],
            handleClick: (row) => this.changeStatus(row, 2),
          },
          {
            text: this.overseaLangObj.qy_enable(),
            btnType: [0, 2],
            handleClick: (row) => this.changeStatus(row, 1),
          },
          {
            text: this.overseaLangObj.yc_delete(),
            btnType: [0],
            handleClick: this.handleDelete,
          },
        ],
      },
      warehouseId: null,
      isInit: false, // 初始化
      leftPartitionId: null,
    };
  },
  computed: {
    ...mapState({
      // dictionary: (state) => state.dictionary,
      warehousePartitionType: (state) =>
        state.dictionary.dicsData.warehousePartitionType,
    }),
  },
  created() {
    this["dictionary/getDictionary"]("basicsWarehouse");
    this.initRequest();
  },
  methods: {
    radioChange(val) {
      this.$refs[`leftTableRef`]?.refreshTable();
    },
    onCurrentChangeEvt(row) {
      this.leftPartitionId = row.id;
      this.$refs[`rightTableRef`]?.refreshTable();
    },
    handleAddOrEdit(row = {}, isSee) {
      const opt = {
        mode_type: 2, // 库位
      };
      if (isSee) {
        opt.isSee = true;
      } else {
        opt.editSuccess = () => {
          this.$refs[`rightTableRef`]?.refreshTable(false);
        };
      }
      this.$refs.editFormRef.editShow(row, opt);
    },
    changeStatus(row = {}, status) {
      let msg = "启用之后可以被引用";
      let title = "启用提示";
      let className = "el-icon-success text-success";
      let successMsg = this.overseaLangObj.cg_tip("启用成功");
      if (status === 2) {
        msg = "禁用之后不可引用，且不影响历史数据";
        title = "禁用提示";
        className = "el-icon-warning text-warning";
        successMsg = this.overseaLangObj.cg_tip("禁用成功");
      }
      msgBox(this, { title, className, msg }, () => {
        const opt = {
          id: row.id,
          status,
        };
        locationPut(opt).then(() => {
          this.msgSuccess(successMsg);
          this.$refs[`rightTableRef`]?.refreshTable(false);
        });
      });
    },
    handleDelete(row) {
      const msg = "删除操作不可逆！";
      const title = "删除提示";
      const className = "el-icon-warning text-warning";
      msgBox(this, { title, className, msg }, () => {
        delLocation(row.id).then(() => {
          this.msgSuccess(this.overseaLangObj.cg_tip("删除成功"));
          this.$refs[`rightTableRef`]?.refreshTable(false);
        });
      });
    },
    getLeftTableResult({ tableData }) {
      if (tableData.length) {
        this.leftPartitionId = tableData[0].id;
        this.$refs[`rightTableRef`]?.refreshTable();
      } else {
        this.$refs[`rightTableRef`]?.setNewTableData([]);
      }
    },
    async initRequest() {
      this.isInit = false;
      const { id } = this.$route.query;
      const desData = (await getWarehouseDetail(id)).data || {};
      const {
        warehouseName,
        contacts,
        totalAcreage,
        detailAddress,
        phone,
        email,
        remark,
        type,
      } = desData.cusWarehouse;
      this.warehouseId = desData.cusWarehouse?.id || desData.warehouseId;
      this.$set(this.detailFormConfig, "formModel", {
        ...desData,
        warehouseName,
        contacts,
        totalAcreage,
        detailAddress,
        phone,
        email,
        remark,
        type,
      });
      this.isInit = true;
    },
    handleTopClick({ type, id }) {
      if (type === "back") {
        this.reBack();
        return;
      }
      if (type === "pre" || type === "next") {
        this.$route.query.id = id;
        this.radioVal = "-1";
        this.initRequest();
      }
    },
    reBack() {
      const { path } = this.$route.query;
      this.$router.push({
        path,
      });
    },
    getLeftQueryParams() {
      let leftTableParams = {
        warehouseId: this.warehouseId,
      };
      if (this.radioVal !== "-1") {
        leftTableParams.type = this.radioVal;
      }
      return leftTableParams;
    },
    getRightQueryParams() {
      return {
        warehousePartitionId: this.leftPartitionId,
      };
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "~@/assets/styles/variables.scss";
.proInfo-details {
  margin: 10px;
  font-size: 14px;
  color: #1f1f1f;
  background-color: #ffffff;
  .content {
    padding: 0 20px;
  }
  .tag-green-color {
    margin-right: 5px;
  }
  .warehouse-details-content {
    display: flex;
    padding-top: 15px;
    margin-top: 10px;
    position: relative;
    &::after {
      content: "";
      border-top: 1px solid $divisionBorder;
      position: absolute;
      top: 0;
      left: -20px;
      right: -20px;
    }
    .tit-txt {
      font-size: 14px;
      margin-bottom: 15px;
      color: $tabBtnTxt;
    }
    .left-des-box {
      // flex: 0 0 360px;
      width: 400px;
      padding-right: 30px;
      position: relative;
      &::after {
        content: "";
        border-right: 1px solid $divisionBorder;
        position: absolute;
        top: -15px;
        bottom: 0;
        right: 8px;
      }
      .tit-txt {
        font-weight: bold;
      }
    }
    .left-btn-radio {
      margin-bottom: 18px;
      /deep/ .el-radio-button__inner {
        border-color: $text-btn-primary;
        color: $text-btn-primary;
        font-size: 12px;
        padding: 6px 10px;
        font-weight: 400;
      }
      /deep/ .is-active {
        .el-radio-button__inner {
          color: #fff;
        }
      }
    }
    .table-title {
      font-size: 14px;
      margin-bottom: 16px;
      padding: 4px 12px;
      display: inline-block;
      border: 1px solid $text-btn-primary;
      color: $text-btn-primary;
      border-radius: 2px;
      font-weight: bold;
    }
    .right-des-box {
      width: 100%;
      overflow: hidden;
    }
  }
  /deep/.details-form .el-form-item {
    margin-bottom: 0;
  }
}
</style>
