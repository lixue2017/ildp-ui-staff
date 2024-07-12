<template>
  <!-- //列表修改编辑弹窗 -->
  <ComDialog
    ref="customDialog"
    :customDialog="customDialogConfig"
    class="airline-dialog"
  >
    <template v-slot:content>
      <ComForm
        ref="dialogForm"
        :formConfig="formConfig"
        class="dialog-form"
        v-if="$refs && $refs.customDialog && $refs.customDialog.dialogVisible"
      >
        <template v-slot:shipperId="slotProps">
          <SelectContacts
            ref="shipperSelectRef"
            :formModel="slotProps.formModel"
            :fieldItem="{
              ...slotProps.fieldItem,
              contactsType: 1,
              type: 'BLManage',
              contactsNameKey: 'shipperName',
              paramContactObj: {
                customerId: formConfig.formModel.customerId,
                isMainBill: formConfig.formModel.type,
              },
              paramAddObj: {
                customerId: formConfig.formModel.customerId,
                userId: formConfig.formModel.userId,
              },
              maxLine: true, //一整行
              childrenRequiredClass: 'children-required',
              hideAdd: false,
              lastChild: true,
            }"
            @handleSuccess="
              (data) => handleCreateSuccess(data, 'shipperSelectRef')
            "
          />
        </template>
        <template v-slot:BLinfo="slotProps">
          <div>
            <span class="BLinfo-label">装货类型：</span>
            <el-radio
              disabled
              v-model="slotProps.formModel.type"
              v-for="(item, index) in dictLoadGoodsType"
              :key="index"
              :label="item.value"
              >{{ item.nameCn }}</el-radio
            >
          </div>
          <div class="children-required">
            <!-- <span>运单号：</span>
            <span>{{slotProps.formModel.operationOrderId}}</span> -->

            <template
              v-if="
                slotProps.formModel.sortBoxCode &&
                slotProps.formModel.type === '1'
              "
            >
              <el-input
                placeholder="请输入整柜批次号"
                v-model="slotProps.formModel.sortBoxCode"
                :disabled="slotProps.formModel.soNo ? true : false"
                :class="[slotProps.formModel.soNo ? 'isDisabled-class' : '']"
                maxlength="200"
              >
                <template slot="prepend">整柜批次号</template>
              </el-input>
            </template>
            <template v-else>
              <template v-if="slotProps.formModel.type === '1'">
                <!-- <span class="BLinfo-label">运单号：</span>
                <span>
                  {{ slotProps.formModel.mblNo }}
                </span> -->
                <el-input
                  placeholder="请输运单号"
                  v-model="slotProps.formModel.mblNo"
                  :disabled="slotProps.formModel.soNo ? true : false"
                  :class="[slotProps.formModel.soNo ? 'isDisabled-class' : '']"
                  @input="
                    () =>
                      flag
                        ? (slotProps.formModel.mblNo = slotProps.formModel.mblNo
                            .match(/[u4E00-u9FA5]/g)
                            .join(''))
                        : ''
                  "
                  @change="
                    (val) => {
                      slotProps.formModel.hblNo = val.trim();
                    }
                  "
                  @compositionStart="flag = false"
                  @compositionEnd="flag = true"
                  maxlength="200"
                >
                  <template slot="prepend">运单号 </template>
                </el-input>
              </template>

              <el-input
                v-else
                placeholder="请输运单号"
                v-model="slotProps.formModel.hblNo"
                @input="
                  () =>
                    flag
                      ? (slotProps.formModel.hblNo = slotProps.formModel.hblNo
                          .match(/[u4E00-u9FA5\/\-\+]/g)
                          .join(''))
                      : ''
                "
                @change="
                  (val) => {
                    slotProps.formModel.hblNo = val.trim();
                  }
                "
                @compositionStart="flag = false"
                @compositionEnd="flag = true"
                maxlength="200"
              >
                <template slot="prepend">运单号 </template>
              </el-input>
            </template>
          </div>
        </template>
        <template v-slot:consigneeId="slotProps">
          <SelectContacts
            ref="consigneeSelectRef"
            :formModel="slotProps.formModel"
            :fieldItem="{
              ...slotProps.fieldItem,
              contactsType: 0,
              contactsNameKey: 'consigneeName',
              paramContactObj: {
                customerId: formConfig.formModel.customerId,
                isMainBill: formConfig.formModel.type,
              },
              paramAddObj: {
                customerId: formConfig.formModel.customerId,
                userId: formConfig.formModel.userId,
              },
              type: 'BLManage',
              childrenRequiredClass: 'children-required',
              maxLine: true,
              hideAdd: false,
              lastChild: true,
              showClearanceCustoms: showClearanceList,
            }"
            @handleSuccess="
              (data) => handleCreateSuccess(data, 'consigneeSelectRef')
            "
            @handleSuccessUpLoad="handleSuccessUpLoad"
          >
            <template
              v-slot:clearanceType="{ request }"
              v-if="showClearanceList"
            >
              <div class="clearance-type">
                <div class="clearanceType-class">
                  <span class="method-left">VAT</span>
                  <AutoComplete
                    ref="vatClearanceListRef"
                    :formModel="slotProps.formModel"
                    :fieldItem="{
                      id: 'vatClearanceList',
                      placeholder: '请选择VAT',
                      multiple: true,
                      collapseTags: true,
                      showCreate: slotProps.fieldItem.hideAdd ? false : true,
                      ...request,
                      httpRequest: (row) =>
                        request.httpRequest(row, { clearanceTypes: '1' }),
                      handleCreate: (row) =>
                        request.handleCreate(row, 'vatClearanceListRef'),
                    }"
                    defaultKey="id"
                    v-if="!slotProps.fieldItem.disable"
                  />
                </div>
                <div class="clearanceType-class">
                  <span class="method-left">EORI</span>
                  <AutoComplete
                    ref="eoriClearanceListRef"
                    :formModel="slotProps.formModel"
                    :fieldItem="{
                      id: 'eoriClearanceList',
                      placeholder: '请选择EORI',
                      multiple: true,
                      collapseTags: true,
                      showCreate: slotProps.fieldItem.hideAdd ? false : true,
                      ...request,
                      httpRequest: (row) =>
                        request.httpRequest(row, { clearanceTypes: '2' }),
                      handleCreate: (row) =>
                        request.handleCreate(row, 'eoriClearanceListRef'),
                    }"
                    defaultKey="id"
                    v-if="!slotProps.fieldItem.disable"
                  />
                </div>
                <!-- v-if="
                    slotProps.formModel.routeCode == 8 ||
                    slotProps.formModel.routeCode == 9
                  "
                <div v-else class="clearanceType-class">
                  <span class="method-left">POA：</span>
                  <AutoComplete
                    ref="bondClearanceListRef"
                    :formModel="slotProps.formModel"
                    :fieldItem="{
                      id: 'bondClearanceList',
                      placeholder: '请选择POA',
                      multiple: true,
                      showCreate: slotProps.fieldItem.hideAdd ? false : true,
                      ...request,
                      httpRequest: (row) =>
                        request.httpRequest(row, { clearanceTypes: '3,4' }),
                      handleCreate: (row) =>
                        request.handleCreate(row, 'bondClearanceListRef'),
                    }"
                    defaultKey="id"
                    v-if="!slotProps.fieldItem.disable"
                  />
                </div> -->
              </div>
            </template>
          </SelectContacts>
        </template>
        <template v-slot:notifierId="slotProps">
          <template v-if="['add_tax', 'edit_tax'].includes(vType)">
            SAME AS CONSIGNEE
          </template>
          <SelectContacts
            v-else
            ref="notifierSelectRef"
            :formModel="slotProps.formModel"
            :fieldItem="{
              ...slotProps.fieldItem,
              type: 'BLManage',
              contactsNameKey: 'notifierName',
              paramContactObj: {
                customerId: formConfig.formModel.customerId,
                isMainBill: formConfig.formModel.type,
              },
              paramAddObj: {
                customerId: formConfig.formModel.customerId,
                userId: formConfig.formModel.userId,
              },
              hideAdd: false,
              maxLine: true,
              lastChild: true,
            }"
            @handleSuccess="
              (data) => handleCreateSuccess(data, 'notifierSelectRef')
            "
          />
        </template>
        <template v-slot:goodsTable>
          <editDlgTable ref="goodsTableRef" />
        </template>
        <!-- <template v-slot:tableData>
          <editDlgTable ref="containerTableRef" />
        </template> -->
        <template v-slot:fsaId="slotProps">
          <SelectContacts
            ref="fsaSelectRef"
            :formModel="slotProps.formModel"
            :fieldItem="{
              ...slotProps.fieldItem,
              type: 'BLManage',
              overseas: 1,
              maxLine: true, //一整行
              hideAdd: true,
              lastChild: true,
            }"
          />
        </template>
      </ComForm>
    </template>
  </ComDialog>
</template>

<script>
import { configLists, configFormRules } from "./model";
import { parseTime } from "@/utils/ruoyi";
import { typeConversion } from "@/utils/index";
import { mapActions, mapState } from "vuex";
import {
  addPopBill,
  updatePopBill,
  getHblorMblDetail,
  postTaxRefundBill,
  getBillByOperationOrderinfo,
  getTaxRefundBillById,
} from "@/api/operateRecord/BOLManage.js";
import { previewDownloadRequest } from "@/api/download/download";
import { download, viewFile } from "@/utils/ruoyi.js";
export default {
  components: {
    editDlgTable: () => import("../FormTable"),
    ComForm: () => import("_comp/ComForm"),
    ComDialog: () => import("_comp/ComDialog"),
    ComUpload: () => import("_comp/ComUpload"),
    ComTable: () => import("_comp/ComTable"),
    SelectContacts: () => import("_comp/ComForm/SelectContacts"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
  },
  props: {
    appendToBody: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    ...mapState({
      dictLoadGoodsType: (state) =>
        state.dictionary.dicsData.loadGoodsType || [],
    }),
  },
  data() {
    return {
      flag: true,
      status: 0,
      customDialogConfig: {
        width: "1100px",
        dataStatus: 0,
        appendToBody: this.appendToBody,
        footer: [
          // {
          //   text: "预 览",
          //   type: "primary",
          //   handleClick: (rows) => {
          //     this.getDownload(rows);
          //   },
          // },
          {
            text: "保 存",
            type: "primary",
            handleClick: () => {
              this.$refs.dialogForm.submitForm();
            },
          },
          {
            text: "取 消",
            plain: true,
            handleClick: () => {
              this.hide();
            },
          },
        ],
        footerSpare: [
          // {
          //   text: "预 览",
          //   type: "primary",
          //   handleClick: () => {
          //     this.getDownload();
          //   },
          // },
          {
            text: "保 存",
            type: "primary",
            handleClick: () => {
              // this.customDialogConfig.dataStatus = 1;
              this.$refs.dialogForm.submitForm();
            },
          },
          {
            text: "取 消",
            plain: true,
            handleClick: () => {
              this.hide();
              // this.$refs.customDialog.handleClose();
            },
          },
        ],
        vType: "",
      },
      formConfig: {
        formModel: {},
        httpRequest: this.submitFormRequest, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        isCheckTip: true,
        labelWidth: "85px",
        formRules: configFormRules, // 表单校验规则
      },
      showClearanceList: false,
    };
  },
  created() {
    this["dictionary/getDictionary"]("BLinfoTypeEn");
    // this.changeAirline();
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    verifyContacts(row) {
      const reg = new RegExp(/^[^\u4e00-\u9fa5]*$/);
      const index = [
        "company",
        "address",
        "phone",
        "email",
        "otherDes",
      ].findIndex((k) => row[k] && !reg.test(row[k]));
      if (index > -1) return false;
      return true;
    },
    submitFormRequest(formModel) {
      //提交提单
      // console.log("formModel", formModel);
      const { cusContactsId: shipperId } = formModel.shipperId || {};
      const { cusContactsId: consigneeId } = formModel.consigneeId || {};
      const { cusContactsId: notifierId } = formModel.notifierId || {};
      const { cusContactsId: fsaId } = formModel.fsaId || {};
      // 新增时formModel里无法取得改变后的值
      const { cusContacts: shipperObj } =
        this.$refs.shipperSelectRef?.contactsData || {};
      const { cusContacts: consigneeObj } =
        this.$refs.consigneeSelectRef?.contactsData || {};
      const { cusContacts: notifierObj } =
        this.$refs.notifierSelectRef?.contactsData || {};
      const { cusContacts: fsaObj } =
        this.$refs.fsaSelectRef?.contactsData || {};
      if (!shipperObj?.company || !consigneeObj?.company) {
        let msgTxt = "";
        if (!shipperObj?.company) {
          msgTxt += "发货人公司";
        }
        if (!consigneeObj?.company) {
          msgTxt += `${msgTxt && "、"}收货人公司`;
        }
        // if (notifierObj && !notifierObj.company) {
        //   msgTxt += `${msgTxt && "、"}通知人公司`;
        // }
        this.msgError(`请输入${msgTxt}`);
        return new Promise((resolve, reject) => {
          return reject();
        });
      }
      if (!this.verifyContacts(shipperObj)) {
        this.msgError("发货人不可输入中文");
        return new Promise((resolve, reject) => {
          return reject();
        });
      }
      if (!this.verifyContacts(consigneeObj)) {
        this.msgError("收货人不可输入中文");
        return new Promise((resolve, reject) => {
          return reject();
        });
      }
      if (notifierObj && !this.verifyContacts(notifierObj)) {
        this.msgError("通知人不可输入中文");
        return new Promise((resolve, reject) => {
          return reject();
        });
      }
      if (fsaObj && !this.verifyContacts(fsaObj)) {
        this.msgError("海外代理不可输入中文");
        return new Promise((resolve, reject) => {
          return reject();
        });
      }
      const {
        plName,
        polName,
        podName,
        dapName,
        maitou,
        productName,
        sortBoxCode,
        hblNo,
        type,
        orderId,
        orderType,
        tdisId,
        tdisType,
        payType,
        freightType,
        transportationClause,
        isMainBill,
        mblNo,
        vatClearanceList,
        eoriClearanceList,
      } = formModel;
      const customsClearanceId = [...(vatClearanceList || [])].concat([
        ...(eoriClearanceList || []),
      ]);
      if (type === "0") {
        if (!hblNo) {
          this.msgError(`请输入运单号`);
          return new Promise((resolve, reject) => {
            return reject();
          });
        }
      }
      if (!this.handleDataArr()) {
        return new Promise((resolve, reject) => {
          return reject();
        });
      }
      const params = {
        id: formModel.id,
        type, //装货类型
        shipName: formModel.shipName, //船名
        voy: formModel.voy, //船次
        // plId:  formModel.plId?.value, //发货地
        plName,
        // polId:  formModel.polId?.value, //装货港
        polName,
        // podId: formModel.podId?.value, //卸货港
        podName,
        // dapId: formModel.dapId?.value, //交货地点
        dapName,
        orderId,
        orderType, // 2-电商，其他为传统
        freightType, // 0-FCL整柜 1-LCL散货
        transportationClause: +transportationClause, //运输条款
        tdisType, //签发方式
        payType, //付款方式
        tdisId, //签发地
        maitou,
        productName,
        status: formModel.status ? formModel.status : "0", //提单状态
        tdisTime: parseTime(formModel.tdisTime, "{y}-{m}-{d}"), //签发日期
        shipmentTime: parseTime(formModel.shipmentTime, "{y}-{m}-{d}"), //装船日期
        shipperId, //发货人ID
        shipperName: shipperObj && shipperObj.contacts + shipperObj.phone, //发货人回显
        shipperValue1: shipperObj?.address || "", //发货人地址
        shipperValue2: shipperObj?.phone || "", //发货人电话
        shipperValue3: shipperObj?.email || "", //发货人传真
        shipperValue4: shipperObj?.company || "", //发货人公司
        shipperValue5: shipperObj?.otherDes || "",
        consigneeId, //收货人ID
        consigneeName:
          consigneeObj && consigneeObj.contacts + consigneeObj.phone,
        consigneeValue1: consigneeObj?.address || "",
        consigneeValue2: consigneeObj?.phone || "",
        consigneeValue3: consigneeObj?.email || "",
        consigneeValue4: consigneeObj?.company || "",
        consigneeValue5: consigneeObj?.otherDes || "",
        customsClearanceId: customsClearanceId.join(","),
        vatIds: vatClearanceList || [],
        eoriIds: eoriClearanceList || [],
        notifierId, //通知人ID
        notifierName: notifierObj && notifierObj.contacts + notifierObj.phone,
        notifierValue1: notifierObj?.address || "",
        notifierValue2: notifierObj?.phone || "",
        notifierValue3: notifierObj?.email || "",
        notifierValue4: notifierObj?.company || "",
        notifierValue5: notifierObj?.otherDes || "",
        fsaId, //海外代理ID
        fsaName: fsaObj && fsaObj.contacts + fsaObj.phone,
        fsaValue1: fsaObj?.address || "",
        fsaValue2: fsaObj?.phone || "",
        fsaValue3: fsaObj?.email || "",
        fsaValue4: fsaObj?.company || "",
        fsaValue5: fsaObj?.otherDes || "",
        operationOrderId: formModel.operationOrderId, //操作单
        operationOrderNum: formModel.operationOrderNum,
        hblNo, //运单号
        sortBoxCode, //整柜批次号
        sortBoxId: formModel.sortBoxId || "", //拼柜ID
        state: null,
        mergeOperationId: formModel.mergeOperationId || "",
        busType: formModel.sortBoxCode ? "1" : "0",
        commodityInfoList: this.handleDataArr().commodityInfoList, //货物信息
        fclOrderGoodsList: this.handleDataArr().fclOrderGoodsList, //集装箱信息
        deleteIdList: this.handleDataArr().deleteIdList, // 删除信息
        isMainBill,
        mblNo,
      };
      delete params.undefined;
      delete params.airGroup;
      const editList = {
        add: addPopBill,
        edit: updatePopBill,
        // merge: addPopBill, //暂时移除
        add_tax: postTaxRefundBill,
        edit_tax: postTaxRefundBill,
      };
      if (this.vType === "add_tax") {
        params.code = formModel.code;
        params.operationOrderIds = formModel.operationOrderIds;
        (params.commodityInfoList || []).forEach((c) => {
          delete c.billId;
          delete c.id;
        });
        (params.fclOrderGoodsList || []).forEach((f) => {
          delete f.billId;
          delete f.id;
        });
      }
      return editList[this.vType](params);
    },
    handleDataArr() {
      if (!this.$refs.goodsTableRef?.getTableList()) {
        return false;
      }
      const {
        commodityInfoList = [],
        fclOrderGoodsList = [],
        deleteIdList = [],
      } = this.$refs.goodsTableRef?.getTableList();
      return {
        commodityInfoList,
        fclOrderGoodsList,
        deleteIdList,
      };
    },
    async show(row, vType) {
      //打开提单新增或编辑
      const { operationOrderId, queryType } = row || {};
      let data = {};
      this.vType = vType; //仅用于弹窗初始化取值和保存的时候决定调哪个接口
      if (["add", "add_tax"].includes(vType)) {
        // 只能新增HBL
        let addResData = [];
        if (vType === "add") {
          addResData = (
            await getBillByOperationOrderinfo({
              operationOrderId,
              type: 0,
              queryType,
              // isRefund: vType === "add_tax" ? 1 : undefined, // 是否退税提单
            })
          ).data;
        }
        const addResObj = vType === "add_tax" ? row : addResData[0] || {};
        if (vType === "add_tax") {
          delete addResObj.id;
        } else {
          if (addResObj.id) {
            // 接口返回id就走修改 没返回id就走新增
            this.vType = "edit";
          }
        }
        const dataObj = this.ladingData(addResObj);
        data = dataObj.nData;
        const { vatClearanceList, eoriClearanceList, bondClearanceList } = data;
        let addParams = {
          ...dataObj.formModel,
          vatClearanceList: (vatClearanceList || []).map((e) => e.id),
          eoriClearanceList: (eoriClearanceList || []).map((e) => e.id),
          bondClearanceList: (bondClearanceList || []).map((e) => e.id),
          transportationClause: typeConversion(row.transportationClause),
          isBookingSpace: row.isBookingSpace,
          operationOrderId: data.operationOrderId,
          mergeOperationId: row.mergeOperationId || "",
        };
        if (vType === "add_tax") {
          addParams.code = row.code;
          addParams.operationOrderIds = row.taxOperationOrderIds || []; // 批量新增退税
        }
        this.formConfig.formModel = {
          ...addParams,
        };
      } else if (["edit", "edit_tax"].includes(vType)) {
        let editData = {};
        if (vType === "edit_tax") {
          delete row.showClearanceList;
          editData = { ...row };
        } else {
          if (row.type == 2) {
            // 提单列表退税类型修改
            this.vType === "edit_tax";
            editData = (await getTaxRefundBillById({ id: row.id })).data;
          } else {
            const editRes = (await getHblorMblDetail({ id: row.id })).data;
            editData = editRes[0];
          }
        }
        const eDataObj = this.ladingData(editData, {
          tit: "编辑",
          uFooter: "footerSpare",
        });
        data = eDataObj.nData;
        const { vatClearanceList, eoriClearanceList, bondClearanceList } = data;
        this.formConfig.formModel = {
          ...eDataObj.formModel,
          vatClearanceList: (vatClearanceList || []).map((e) => e.id),
          eoriClearanceList: (eoriClearanceList || []).map((e) => e.id),
          bondClearanceList: (bondClearanceList || []).map((e) => e.id),
          transportationClause: typeConversion(row.transportationClause),
          type: typeConversion(row.type),
          tdisId: data.tdisId,
          id: row.id,
        };
      }
      const { isMainBill, type: oType } = this.formConfig.formModel;
      this.showClearanceList = isMainBill != 1 && oType == 0;
      // else if (type === "merge") {
      //   合并功能暂时没用到移除了，之后有使用需求再放开     代码不删除
      //   const { mergeOperationId } = row;
      //   const res = await getBillByOperationOrderinfo(mergeOperationId, 0);
      //   const dataObj = this.ladingData(res.data[0]);
      //   data = dataObj.nData;
      //   this.formConfig.formModel = {
      //     ...dataObj.formModel,
      //     transportationClause: typeConversion(row.transportationClause),
      //     isBookingSpace: row.isBookingSpace,
      //     operationOrderId: data.operationOrderId,
      //     mergeOperationId: row.mergeOperationId || "",
      //   };
      // }
      this.formConfig = {
        ...this.formConfig,
        lists: configLists(data.orderType, data.type), // 表单渲染列表 2-电商 其他都为传统 type: '0 HBL   1  MBL',
        afterMounted: () => {
          setTimeout(() => {
            // 子组件加载后再调用
            // const table_obj = {
            //   mode_type: 0,
            //   tableList: data.commodityInfoList || [],
            //   operationOrderId: data.operationOrderId,
            //   order_type: data.orderType,
            // };
            this.$refs.goodsTableRef?.setTableData(data);
            // this.$refs.goodsTableRef?.setTableData(table_obj);
            // this.$refs.containerTableRef?.setTableData({
            //   ...table_obj,
            //   tableList: data.fclOrderGoodsList || [],
            //   mode_type: 1,
            // });
          }, 20);
        },
      };
      this.$refs.customDialog.show();
    },
    hide() {
      //关闭弹出框
      this.$refs.customDialog.hide();
    },
    handleSuccess(res = {}) {
      //提交成功后刷新列表
      this.$emit("handleSuccess", res.data);
      this.hide();
    },
    ladingData(resData, dlgConf = {}) {
      this.customDialogConfig = {
        ...this.customDialogConfig,
        title: `提单信息(${dlgConf.tit || "新增"})`,
        useFooter: dlgConf.uFooter || "footer",
      };
      const { sailOpenTime, ...nResData } = resData;

      const nData = {
        ...nResData,
      };
      if (["add"].includes(this.vType)) {
        // 新增时的默认值
        nData.shipmentTime = sailOpenTime;
        nData.tdisTime = sailOpenTime;
        // nData.tdisId = nData.plName;
      }
      const formModel = {
        ...nData,
        type: typeConversion(nData.type) || "0", // 默认只能新增HBL，新增HBL自动生成MBL
        tdisType: typeConversion(nData.tdisType || 0),
        payType: typeConversion(nData.payType || 0),
        fsaId: {
          ...nData.fsaContacts,
          cusContacts: nData.fsaContacts,
          cusContactsId: nData.fsaContacts?.id,
          id: nData.fsaContacts?.cusContactsMainId,
        },
        shipperId: {
          ...nData.shipperContacts,
          cusContacts: nData.shipperContacts || {},
          cusContactsId: nData.shipperContacts?.id,
          id: nData.shipperContacts?.cusContactsMainId,
        },
        consigneeId: {
          ...nData.consigneeContacts,
          cusContacts: nData.consigneeContacts || {},
          cusContactsId: nData.consigneeContacts?.id,
          id: nData.consigneeContacts?.cusContactsMainId,
        },
        notifierId: {
          ...nData.notifierContacts,
          cusContacts: nData.notifierContacts || {
            address: nData.notifierValue1 || "",
            phone: nData.notifierValue2 || "",
            email: nData.notifierValue3 || "",
            company: nData.notifierValue4 || "",
            otherDes: nData.notifierValue5 || "",
          },
          cusContactsId: nData.notifierContacts?.id,
          id: nData.notifierContacts?.cusContactsMainId,
        },
      };
      return {
        nData,
        formModel,
      };
    },
    getDownload() {
      const { operationOrderId, type } = this.formConfig.formModel;
      previewDownloadRequest({ operationOrderId, type }).then((res) => {
        download(res.msg);
      });
    },
    handleCreateSuccess(data, refName) {
      if (!refName) {
        refName = !data.contactsType
          ? "consigneeSelectRef"
          : "shipperSelectRef";
      }
      const cusNotifier = this.$refs[refName].getData() || {};
      if (data.id && cusNotifier.id === data.id) {
        this.$set(this.$refs[refName].contactsData, "id", data.company);
        setTimeout(() => {
          this.$refs[refName].handleSelect(data);
        }, 500);
      }
      // this.$refs[refName].$refs &&
      //   this.$refs[refName].$refs.autoCompleteRef &&
      //   this.$refs[refName].$refs.autoCompleteRef.querySearchAsync();
    },
    handleSuccessUpLoad(row) {
      const { ref, res } = row;
      this.$refs[ref]?.querySearchAsync("", {
        addSelectVal: res?.data ? [res.data] : undefined,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.airline-dialog {
  /deep/.el-radio {
    margin-right: 10px;
  }
  .mark-icon {
    border-radius: 12px;
    padding: 2px 12px;
    font-size: 12px;
    margin-left: 5px;
  }
  .line-type {
    background: rgba(33, 194, 93, 0.1);
    color: #35d06f;
  }
  .route-proxy {
    background: rgba(102, 165, 255, 0.1);
    color: #66a5ff;
  }
  .children-required {
    margin-top: 10px;
    & > .el-input:before {
      content: "*";
      color: #fa7a7a;
      margin-right: 4px;
    }
  }
  .BLinfo-label {
    display: inline-block;
    width: 80px;
    text-align: right;
  }
}
/deep/ {
  .form-class .el-row.custom-form {
    display: block;
    & > .fsa-custom {
      height: 223px;
    }
  }
  .form-class .border-bottom-solid {
    margin-bottom: 0px;
    &::after {
      margin-top: 3px;
    }
    &::before {
      width: calc(100% - 20px);
      margin-bottom: 19px;
      border-top: 1px solid #e2e2e2;
      transform: translateX(10px);
    }
  }
  .form-cols-2 .el-form-item--small.el-form-item {
    margin-bottom: 16px;
  }
  .isDisabled-class {
    .el-input__inner {
      cursor: not-allowed !important;
      background-color: #f2f2f2 !important;
      border: 1px solid #bcbcbc !important;
      padding-right: 30px !important;
      padding-left: 15px !important;
      border-radius: 0px 4px 4px 0px !important;
    }
  }
}
.clearance-type {
  display: flex;
  margin-top: 10px;
  .clearanceType-class {
    display: flex;

    &:nth-child(1) {
      margin-right: 10px;
    }
    .method-left {
      width: 57px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      background: rgba(188, 188, 188, 0.2);
      color: #8b8b8b;
      border: 1px solid #bcbcbc;
      border-right: none;
      border-radius: 4px 0 0 4px;
      padding: 0 15px;
      white-space: nowrap;
    }
    /deep/ {
      .el-select {
        .el-input__inner {
          height: 32px;
          border-radius: 0 4px 4px 0;
        }
        .el-select__tags {
          .el-select__tags-text {
            display: inline-block;
            vertical-align: middle;
            white-space: nowrap;
            max-width: 50px;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .el-select__input {
            margin: 0;
          }
        }
      }
    }
  }
}
</style>
