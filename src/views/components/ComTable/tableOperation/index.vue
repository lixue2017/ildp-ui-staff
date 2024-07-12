<template>
  <div>
    <ComTable
      :ref="`oTableRef`"
      :columnConfig="columnOpnConf"
      :selectionRow="selectionRow"
      :tableHeight="tableLentHeight()"
      @onSelectionChange="onSelectionChange"
      :selectionTableRow="[...selectionTableRow]"
      :httpRequest="httpTableRequest"
      :columnData="columnData"
      :isMountedRequest="isMountedRequest"
    >
      <template v-slot:customRow="{ slotProps }">
        <template v-if="slotProps.column.customSlot">
          <slot :name="slotProps.column.prop" :slotProps="slotProps" />
        </template>

        <template v-if="slotProps.prop === 'operation'">
          <div class="operation-content-btn" v-if="showOpnBtnFn(slotProps.row)">
            <template v-if="isExtraOpnBtns">
              <slot name="isExtraOpnBtns" :slotProps="slotProps" />
            </template>
            <template v-for="(item, index) in tableBtnArr()">
              <el-button
                :key="index"
                size="small"
                type="text"
                :style="{ color: item.color }"
                v-if="item.btnUpdate === (slotProps.row.rBtnUpdate || false)"
                @click="item.handleClick(slotProps.row, slotProps.rowIndex)"
                >{{ item.text }}</el-button
              >
            </template>
          </div>
          <span v-else>--</span>
        </template>
      </template>
      <template v-slot:bottomTotal="{ slotProps }">
        <slot name="bottomTotal" :slotProps="slotProps" />
      </template>
    </ComTable>
  </div>
</template>

<script>
import { customMessageBox } from "@/utils/confirmBox.js";
export default {
  props: {
    columnOpnConf: {
      type: Array,
      default: () => [],
    },
    httpTableRequest: {
      type: Function,
      default: () => ({}),
    },
    columnData: {
      type: Array,
      default: () => [],
    },
    isMountedRequest: {
      // 初始化时是否调用表格接口
      type: Boolean,
      default: true,
    },
    tOperationObj: {
      type: Object,
      default: () => ({}),
    },
    selectionTableRow: {
      type: Array,
      default: () => [],
    },
    tableHeight: {
      type: String,
      default: undefined,
    },
    selectionRow: {
      // 多选时不同类型是否可勾选
      type: Function,
      default: (row, index) => {
        return true;
      },
    },
    onSelectionChange: {
      type: Function,
      default: () => ({}),
    },
    showOpnBtnFn: {
      // 是否显示操作按钮
      type: Function,
      default: (row) => {
        return true;
      },
    },
    filterOpnBtnArr: {
      type: Array,
      default: () => ["copyRow"],
    },
    isExtraOpnBtns: {
      // 除了基本按钮外各个组件需要根据自己的业务加入的额外按钮
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      tableBtnAll: [
        // 列表操作-第三方收货没有复制
        {
          text: this.overseaLangObj.bc_save("保存"),
          btnUpdate: true,
          webType: "save", //仅前端判断按钮,没参与后端交互
          handleClick: this.handleSave,
        },
        {
          text: this.overseaLangObj.qx_cancel("取消"),
          btnUpdate: true,
          webType: "cancel",
          handleClick: this.handleCancel,
        },
        {
          text: this.overseaLangObj.bj_edit("修改"),
          btnUpdate: false,
          webType: "edit",
          opnBtnType: "editRow",
          handleClick: this.handleEdit,
        },
        {
          text: "复制",
          btnUpdate: false,
          webType: "copy",
          opnBtnType: "copyRow",
          handleClick: this.handleCopy,
        },
        {
          text: this.overseaLangObj.yc_delete("删除"),
          webType: "delete",
          btnUpdate: false,
          handleClick: this.handleDel,
          color: "#FF6767",
        },
      ],
      tableDataArr: [], // 表格数据
      tempRow: {}, // 临时数据，用于取消是还原数据
    };
  },
  methods: {
    async handleSave(row) {
      const { httpSaveRequest, saveCallBack } = this.tOperationObj;
      if (httpSaveRequest) {
        await httpSaveRequest(row);
        this.msgSuccess(this.overseaLangObj.cg_tip("操作成功"));
      }
      row.rBtnUpdate = false;
      saveCallBack && saveCallBack(row);
    },
    handleCancel(row) {
      if (row.isNewAdd) {
        // 新增没有ID，取消时直接删除，有排序时不能直接取index值，需要用唯一key计算出排序后的index
        const rIndex = this.tableDataArr.findIndex(
          (e) => e.temp_secondId === row.temp_secondId
        );
        if (rIndex > -1) {
          this.tableDataArr.splice(rIndex, 1);
          this.setTableOpnData(this.tableDataArr);
        }
      } else {
        if (!this.tempRow[row.id]) {
          return;
        }
        Object.keys(row).forEach((e) => {
          row[e] = this.tempRow[row.id][e];
        });
        row.rBtnUpdate = false; // 是否可变更
      }
      const { cancelCallBack } = this.tOperationObj;
      cancelCallBack && cancelCallBack(row);
    },
    handleEdit(row) {
      this.tempRow[row.id] = { ...row };
      this.$refs[`oTableRef`]?.setUpdateTableVal(row, "rBtnUpdate", true);
      const { editCallBack } = this.tOperationObj;
      editCallBack && editCallBack(row);
    },
    handleCopy(row) {
      const {
        copyCallBack,
        copyParamFn,
        isCopyNoRequest = true,
      } = this.tOperationObj;
      if (isCopyNoRequest) {
        // 不调接口，只删除ID，直接复制
        const { id, temp_secondId, ...cRow } = row;
        // console.log("cRow", cRow);
        this.addTableOpnData([
          {
            ...cRow,
            ...(copyParamFn ? copyParamFn(row) : {}),
            isNewAdd: true, // 用于取消时判断直接删除
            rBtnUpdate: true, // 复制行可编辑
          },
        ]);
      }
      copyCallBack && copyCallBack(row);
    },
    setTableOpnData(arr = []) {
      this.tableDataArr = arr;
      this.$refs[`oTableRef`]?.setNewTableData(arr);
    },
    // 刷新
    tableOpnRefresh() {
      this.$refs[`oTableRef`]?.refreshTable();
    },
    // 新增
    addTableOpnData(addList = []) {
      this.setTableOpnData([...addList, ...this.tableDataArr]);
    },
    async handleAirlineDel(row) {
			// 航次同步删除多个时不能有弹窗
      const { httpDelRequest, delCallBack } = this.tOperationObj;
      if (httpDelRequest) {
        await httpDelRequest(row);
        this.msgSuccess(this.overseaLangObj.cg_tip("删除成功"));
      }
      delCallBack && delCallBack(row);
    },
    handleDel(row) {
      const { httpDelRequest, delCallBack } = this.tOperationObj;
      if (httpDelRequest) {
        customMessageBox(
          this,
          {
            msgTxt1: "删除不可逆",
            msgTxtColor: "#FF6767",
            httpMsgRequest: () => httpDelRequest(row),
          },
          () => {
            this.msgSuccess(this.overseaLangObj.cg_tip("删除成功"));
            delCallBack && delCallBack(row);
          }
        );
      } else {
        delCallBack && delCallBack(row);
      }
    },
    toggleRowOpnSelection(arr) {
      this.$refs.oTableRef?._toggleRowSelectionMixin({
        newCheckRows: arr,
      });
    },
    tableBtnArr() {
      // 操作按钮，默认过滤复制按钮
      return this.tableBtnAll.filter(
        (e) => !this.filterOpnBtnArr.includes(e.opnBtnType)
      );
    },
    tableLentHeight() {
      if (this.tableHeight !== undefined) {
        return this.tableHeight;
      }
      const lent = this.tableDataArr.length || 0;
      return lent > 12 ? `${13 * 49 + 53}px` : undefined;
    },
  },
  components: {
    ComTable: () => import("_comp/ComTable"),
  },
};
</script>

<style lang="scss" scoped></style>
