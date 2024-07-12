<template>
  <div>
    <div class="partition-programme flex-space-between">
      <div>
        <template v-for="(pItem, i) in programmeList">
          <div class="partition-li base-flex-align" :key="`p_${i}`">
            <span class="partition-label">{{ pItem.label }}</span>
            <span class="tag-blue-color" v-if="pItem.tagKey">{{
              getDictObj(pItem.tagKey, leftData[pItem.tagKey]) || "--"
            }}</span>
            <el-checkbox
              v-if="pItem.type == 'singleCheckbox'"
              :value="leftData[pItem.vKey] === 2 ? true : false"
              :disabled="true"
              >{{ pItem.text }}</el-checkbox
            >
            <TooltipOver
              v-else
              :content="`${
                (pItem.vKey
                  ? leftData[pItem.vKey]
                  : pItem.txtKey
                  ? getDictObj(pItem.txtKey, leftData[pItem.txtKey])
                  : '') || '--'
              }`"
              :style="{ maxWidth: '230px' }"
            />

            <span class="tag-yellow-color" v-if="pItem.stateKey">{{
              getDictObj(pItem.stateDict, leftData[pItem.stateKey]) || "--"
            }}</span>
          </div>
        </template>
      </div>
      <div
        v-if="leftData.state === 0"
        @click="handleEdit"
        class="edit-icon base-flex-center"
      >
        <i class="iconfont xiugai1"></i>
      </div>
    </div>

    <div class="partition-tit-btn base-flex-between">
      <span>分区信息</span>
      <template v-if="leftData.webViewType === 'edit'">
        <span class="grey-tip-color">*分区信息 和 区域邮编 不能同时编辑</span>
        <el-button
          type="primary"
          size="small"
          icon="el-icon-plus"
          class="btn-type-add"
          @click="handleAddInfo"
          :disabled="isRightEditState"
        >
          新增分区
        </el-button>
      </template>
    </div>
    <ComTable
      :ref="`tableLeftRef`"
      :httpRequest="tableLeftConfig.httpRequest"
      :columnConfig="detailTableLeftColumns()"
      :rowOperationBtnListFn="
        () => {
          return isRightEditState ? [] : mixinTableRowBtnArr();
        }
      "
      :colShowBtnFn="
        (btnItem, row) => btnItem.btnUpdate === (row.rBtnUpdate || false)
      "
      :paginationConfig="tableLeftConfig.paginationConfig"
      :current-row="true"
      @onCurrentChange="(row) => onCurrentChangeEvt(row)"
      @getResult="getLeftTableResult"
      :getQueryParams="tableLeftQueryParams"
    >
      <template v-slot:customRow="{ slotProps }">
        <template
          v-if="['code', 'nameCn', 'nameEn', 'remark'].includes(slotProps.prop)"
        >
          <template v-if="!slotProps.row.rBtnUpdate">
            {{ slotProps.row[slotProps.prop] || "--" }}
          </template>
          <template v-else>
            <el-input
              type="text"
              size="mini"
              v-model="slotProps.row[slotProps.prop]"
              :placeholder="slotProps.column.label"
              :maxlength="slotProps.column.maxLength || 100"
            />
          </template>
        </template>
      </template>
    </ComTable>

    <EditDialog ref="editDlgRef" />
  </div>
</template>

<script>
import {
  costPartitionInfoList,
  saveCostPartitionInfo,
  delCostPartitionInfo,
  getCostPartitionInfoSonCount,
  saveBatchCostPartitionInfo,
} from "@/api/warehouse/basic";
import {
  mixinTableOperationRow,
  mixinTableWatchOpnBtn,
} from "_comp/ComTable/tableOperation/rowOperationMixin.js";
import { detailTableLeftCols } from "../model.js";

export default {
  mixins: [mixinTableOperationRow, mixinTableWatchOpnBtn],
  props: {
    leftData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      programmeList: [
        {
          label: "方案名称：",
          vKey: "nameCn",
          stateKey: "state",
          stateDict: "status",
        },
        {
          label: "方案名称(EN)：",
          vKey: "nameEn",
        },
        {
          text: "是否偏远",
          vKey: "type",
          type: "singleCheckbox",
        },
        // {
        // 	label: '物流产品：',
        // 	vKey: "logisticsProductName"
        // }, {
        // 	label: '服务商渠道：',
        // 	vKey: "logisticsChannelName"
        // }, {
        // 	label: '计算方式：',
        // 	tagKey: "matchingMethod",
        // 	txtKey: "matchingType",
        // }
      ],
      tableLeftConfig: {
        httpRequest: costPartitionInfoList,
        paginationConfig: {
          limit: 20,
          layout: "total, sizes, prev, jumper, next",
          className: "small-paging",
          small: true,
          total: 20,
        },
      },
      isRightEditState: false,
      curRow: {}, // 当前选中行
      mixinTableRef: "tableLeftRef",
      ruleObj: {
        ruleMsg: {
          code: "分区编码",
          nameCn: "分区名称",
        },
        otherRule: {
          nameEn: {
            label: "分区名称(EN)不能输入中文",
            checkRule: new RegExp(/^[^\u4e00-\u9fa5]*$/),
          },
        },
      },

      mixinOperationObj: {
        editCallBack: (row) => {
          // this.$emit('editLeftTableRow', row)
        },
        httpSaveRequest: (row) => this.handleRowSave(row),
        saveCallBack: () => this.tableMixinRefresh(),
        delMsgBox: true,
        handleMixinCheckDelFn: (r, delFn) => {
          this.comRepeatedRequest(
            this,
            getCostPartitionInfoSonCount,
            r.id
          ).then((res) => {
            this.mixinOperationObj.delMsgTitle = !res.data
              ? "删除提示"
              : "当前区域下存在右边信息批量删除";
            delFn && delFn();
          });
        },
        httpDelRequest: (row) => delCostPartitionInfo(row.id),
        delCallBack: () => this.tableMixinRefresh(),
        saveTableAllRequest: (eItems) => {
          // console.log('eItems===', eItems)
          const optBatch = eItems.map((e) => {
            return {
              ...e,
              costPartitionSchemeId: this.leftData.id,
            };
          });
          return saveBatchCostPartitionInfo(optBatch);
        },
      },
      delMixinFilterNew: true,
    };
  },
  methods: {
    handleRowSave(row) {
      const { temp_secondId, rBtnUpdate, ...nRow } = row || {};
      const opt = {
        ...nRow,
        costPartitionSchemeId: this.leftData.id,
      };
      return this.handleMixinRowSave(opt, saveCostPartitionInfo, this.ruleObj);
    },
    handleLeftBatchSave() {
      this.handleMixinSaveAll(this.ruleObj);
    },
    handleAddInfo() {
      this.mixinAddTableOpnData([
        {
          code: "",
          nameCn: "",
          nameEn: "",
          remark: "",
          isNewAdd: true,
          rBtnUpdate: true,
        },
      ]);
    },
    onCurrentChangeEvt(row) {
      if (this.isRightEditState) {
        this.$nextTick(() => {
          this.$refs.tableLeftRef?.setComCurrentRow(this.curRow);
        });
      } else {
        this.$emit("curLeftTableRow", row);
        this.curRow = row;
      }
    },
    getLeftTableResult({ total, tableData }) {
      this.total = total;
      this.mixinChangeTableDataFn(tableData);

      if (this.curRow.id) {
        // 编辑当前行保存后更新数据
        this.curRow = tableData.find((e) => e.id === this.curRow.id) || {};
      }

      if (!this.curRow.id) {
        // 初始与删除当前行后选中第一行，没有清空当前删除行不能用else与上面的判断关联
        this.curRow = tableData.find(
          (e) =>
            this.mixinTableDataArr.some(
              (s) => s.id === e.id && !s.rBtnUpdate
            ) || // 编辑行
            !this.mixinTableDataArr.some((s) => s.id === e.id) // 新增行
        );
      }
      // 初始化选中第一行
      this.$refs.tableLeftRef?.setComCurrentRow(this.curRow);
    },
    handleEdit() {
      this.$refs.editDlgRef.editShow(this.leftData, {
        editSuccess: () => {
          this.$emit("editSuccess");
        },
      });
    },
    onRightTableDataArr(rArr) {
      // 判断右侧是否为编辑状态
      this.isRightEditState = (rArr || []).some((e) => e.rBtnUpdate);
    },
    tableLeftQueryParams() {
      return {
        costPartitionSchemeIdEq: this.leftData.id,
      };
    },
    detailTableLeftColumns() {
      return detailTableLeftCols({
        isSee: this.leftData.webViewType !== "edit",
      });
    },
  },
  watch: {
    mixinTableDataArr: {
      deep: true,
      handler: function (newVal) {
        this.$emit("onLeftTableDataArr", newVal);
      },
    },
  },
  components: {
    TooltipOver: () => import("_comp/TooltipOver"),
    EditDialog: () => import("../editDialog"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.partition-programme {
  padding: 15px 10px 15px 16px;
  background: rgba(80, 148, 255, 0.05);
  box-shadow: 0px 0px 3px 0px rgba(20, 69, 147, 0.25);
  margin-bottom: 16px;
  color: #515151;
  .partition-li {
    line-height: 18px;
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0;
    }
    .partition-label {
      width: 95px;
      text-align: right;
      color: #8b8b8b;
    }
    .tag-blue-color {
      margin-right: 5px;
    }
    .tag-yellow-color {
      margin-left: 10px;
    }
  }
  .edit-icon {
    width: 30px;
    height: 30px;
    background: #5094ff;
    box-shadow: 0px 2px 4px 0px rgba(42, 78, 133, 0.15);
    border-radius: 16px;
    color: #fff;
    cursor: pointer;
  }
}
.partition-tit-btn {
  border-top: 1px solid #e2e2e2;
  padding: 10px 0;
}
</style>
