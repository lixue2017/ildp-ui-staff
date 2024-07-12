<template>
  <div class="e-commerce-warehouse">
    <!--金额汇总信息与操作栏 -->
    <!-- show-btn-arr 右侧按钮 -->
    <!-- head-form-data 详情数据从上个组件传过来 -->
    <!-- :bill-info-list 金额汇总信息 -->
    <!-- selection-rows勾选信息 -->
    <!-- parent-event-obj操作按钮的回调 -->
    <BillingHead
      ref="headRef"
      :show-btn-arr="[20, 30, 70, 40, 50, 63]"
      :selection-rows="selectionRows"
      :head-form-data="formModel"
      :parent-event-obj="headEventObj"
      :bill-info-list="dataObj.billInfoList"
      :headTableColumnSet="{
        tableColumns: stotageBillTable(),
      }"
    />
    <div class="billing-content">
      <!-- 表格配置 -->
      <!-- columnOpnConf   表格配置 -->
      <!-- tOperationObj   操作回调 -->
      <!-- selectionRow    数据是否可勾选 -->
      <!-- showBillOpnBtn  操作栏按钮的控制，已操作过或已锁单的没有按钮 -->
      <!-- onTableSelectionChange  勾选判定 -->
      <!-- initDataRequest table请求接口 -->
      <TableOperation
        :ref="`receiptTableRef`"
        v-if="showColsHide($refs.headRef)"
        :columnOpnConf="tableColumns()"
        :tOperationObj="operationObj"
        :selectionRow="selectionRowEvt"
        :columnData="null"
        :filterOpnBtnArr="[]"
        :httpTableRequest="initDataRequest"
        :onSelectionChange="onTableSelectionChange"
      >
        <template
          v-for="(tItem, tIdx) in [
            'type', //类型
            'prepaidCollect', //到付预付
          ]"
          v-slot:[tItem]="{ slotProps }"
        >
          <div :key="tIdx">
            <template v-if="!slotProps.row.rBtnUpdate">
              <span
                :style="{
                  color: slotProps.dicsList && slotProps.dicsList.color,
                }"
                >{{ slotProps.dicsList.nameCn }}</span
              >
            </template>
            <template v-else>
              <el-select
                size="mini"
                v-model="slotProps.row[tItem]"
                style="width: 100%"
                :clearable="false"
              >
                <el-option
                  v-for="selectItem in dictArr(tItem)"
                  :key="Number(selectItem.value || 0)"
                  :label="selectItem.nameCn"
                  :value="Number(selectItem.value || 0)"
                />
              </el-select>
            </template>
          </div>
        </template>
        <template
          v-for="(aItem, aIdx) in [
            'dealingsCompanyName', //往来单位
            'costName', //费用名称
            'currency', //币种
          ]"
          v-slot:[aItem]="{ slotProps }"
        >
          <div :key="aIdx">
            <template v-if="!slotProps.row.rBtnUpdate">
              {{ slotProps.row[aItem] }}
            </template>
            <template v-else>
              <AutoComplete
                :formModel="slotProps.row"
                :fieldItem="{
                  ...slotProps.column.fieldItem,
                }"
                :additionalParam="{
                  mainId:
                    aItem == 'dealingsCompanyName'
                      ? formModel.customerId
                      : undefined, // 往来单位默认传委托人ID
                }"
              />
            </template>
          </div>
        </template>
        <template
          v-for="(nItem, aIdx) in [
            'unitPrice', //单价
            'num', //数量
            'taxRate', // 税率,
          ]"
          v-slot:[nItem]="{ slotProps }"
        >
          <div :key="aIdx">
            <el-input-number
              v-if="slotProps.row.rBtnUpdate"
              size="mini"
              v-model="slotProps.row[nItem]"
              v-input-number-limit="slotProps.column.decimal"
              :precision="slotProps.column.precision"
              :controls="false"
              :placeholder="slotProps.column.label"
              @change="(val) => handleMoney(slotProps.row, val, nItem)"
            />
            <span v-else>{{
              formatMoney(
                slotProps.row[nItem],
                slotProps.column.decimal,
                slotProps.column.colFormat
              )
            }}</span>
          </div>
        </template>
        <template v-slot:remark="{ slotProps }">
          <template v-if="!slotProps.row.rBtnUpdate">
            {{ slotProps.row.remark || "--" }}
          </template>
          <template v-else>
            <el-input
              type="text"
              size="mini"
              v-model="slotProps.row.remark"
              :placeholder="slotProps.column.label"
              maxlength="200"
            />
          </template>
        </template>
        <template v-slot:billNo="{ slotProps }">
          <!-- 对账单号，有就展示，没有就不展示 -->
          <span
            class="primary-text-btn"
            @click="handleDetail(slotProps.row)"
            v-if="slotProps.row.billNo"
          >
            {{ slotProps.row.billNo }}
          </span>
          <span v-else>--</span>
        </template>
        <template v-slot:isIncludeTax="{ slotProps }">
          <!-- 含税 -->
          <template v-if="!slotProps.row.rBtnUpdate">
            <i
              class="el-icon-circle-check"
              v-if="slotProps.row.isIncludeTax"
            ></i>
            <span v-else>--</span>
          </template>
          <template v-else>
            <el-checkbox
              :true-label="1"
              :false-label="0"
              v-model="slotProps.row.isIncludeTax"
            />
          </template>
        </template>
        <template v-slot:operationLists="{ slotProps }">
          <div
            class="operation-content-btn"
            v-if="showBillOpnBtn(slotProps.row)"
          >
            <template v-for="(item, index) in tableBtnArr(slotProps.row)">
              <el-button
                :key="index"
                size="small"
                type="text"
                v-if="item.btnUpdate === (slotProps.row.rBtnUpdate || false)"
                @click="item.handleClick(slotProps.row, slotProps.rowIndex)"
                >{{ item.text }}</el-button
              >
            </template>
          </div>
          <span v-else>
            <template v-for="(item, index) in getNoOperableBtn()">
              <el-button
                :key="index"
                size="small"
                type="text"
                v-if="item.btnUpdate === (slotProps.row.rBtnUpdate || false)"
                @click="item.handleClick(slotProps.row)"
                >{{ item.text }}</el-button
              >
            </template>
          </span>
        </template>
      </TableOperation>
    </div>
  </div>
</template>

<script>
// import { mapActions } from "vuex";
import { hasBtnPermits } from "@/directive/permission/hasPermi.js"; //仅用来判断按钮权限，不参与其他任何判断
import { mixinHeadContent } from "./headContentMixin";
import { stotageBillTable } from "../model";
import {
  addSettleAccounts,
  updateSettleAccounts,
} from "@/api/settlementManage/statementManage";
export default {
  mixins: [mixinHeadContent],
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
  },
  props: {
    // isBussiness: {
    //   required: true,
    //   type: Number,
    // },
  },
  data() {
    return {
      stotageBillTable,
      customerIsBs: true,
      addAuthorityLists: [
        {
          text: "保存",
          webType: "save",
          hasPermission: ["storageRentBillDetail:edit"],
        },
        {
          text: "取消",
          webType: "cancel",
          hasPermission: ["storageRentBillDetail:edit"],
        },
        {
          text: "修改",
          webType: "edit",
          hasPermission: ["storageRentBillDetail:edit"],
        },
        {
          text: "复制",
          webType: "copy",
          handleClick: this.handleCopy,
          hasPermission: ["storageRentBillDetail:copy"],
        },
        {
          text: "删除",
          webType: "delete",
          hasPermission: ["storageRentBillDetail:delete"],
        },
      ],
      addtableBtn: [
        {
          text: "查看货物",
          btnUpdate: false,
          // hasPermission: ["storageRentBillDetail:viewGoods"],
          handleClick: (row) => {
            const { orderNum, createTime, matchId } = row;
            this.$emit("viewGoods", {
              queryType: 2,
              // businessNum: orderNum,
              matchId,
              accountingTime: createTime,
            });
          },
        },
      ],
      saveHttpObj: {
        //保存与修改账单明细的接口
        addHttp: addSettleAccounts,
        editHttp: updateSettleAccounts,
      },
      addRowParam: {
        // 新增行附加参数
        businessType: 11, //仓租
        orderNum: this.formModel.businessNum,
        customerId: this.formModel.customerId,
        billingMain: this.formModel.customerBelongCompanyId,
        isBussiness: this.formModel.isBussiness,
        dealingsCompany: this.formModel.customerId,
        dealingsCompanyName: this.formModel.customerName,
      },
      additionalParams: {
        //获取列表附加参数
        businessType: 11, //仓租
      },
    };
  },
  methods: {
    handleCopy(row) {
      delete row.id;
      this.$refs.receiptTableRef.handleSave(row);
    },
    tableBtnArr(row) {
      console.log("row", row);
      const { billWarehouseId } = row;
      const { tableBtnAll } = this.$refs.receiptTableRef;
      let btnLists = [...tableBtnAll, ...this.addtableBtn];
      // }
      if (this.addAuthorityLists.length > 0) {
        //给操作栏需要加权限的按钮加权限
        this.addAuthorityLists.map((e) => {
          btnLists.find((item) => {
            if (e.webType == item.webType) {
              e.hasPermission &&
                this.$set(item, "hasPermission", e.hasPermission);
              e.handleClick && this.$set(item, "handleClick", e.handleClick);
            }
          });
        });
      }
      if (!billWarehouseId) {
        return btnLists.filter(
          (e) =>
            ![].includes(e.opnBtnType) &&
            (e.hasPermission ? hasBtnPermits(e.hasPermission) : true)
        );
      } else {
        return this.addtableBtn;
      }
    },
    getNoOperableBtn() {
      //已经生成对账单之后的数据所能点击的操作按钮
      return this.addtableBtn;
    },
    tableColumns() {
      return this.$refs.headRef?.childTableColumnConfig();
    },
  },
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped></style>
