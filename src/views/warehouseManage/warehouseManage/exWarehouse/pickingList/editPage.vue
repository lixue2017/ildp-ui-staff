<template>
  <div class="app-container">
    <ComDetailTop
      :title="`${
        isSeePrint ? overseaLangObj.dy_print() : overseaLangObj.jhd_bj
      }`"
      ref="detailTopRef"
      :config="{}"
    >
      <template v-if="!isSeePrint" v-slot:subTitle>
        <span class="primary-text-color">
          ({{ pickingWarehouse.warehouseCode }}/{{
            pickingWarehouse.warehouseName
          }})
        </span>
      </template>
    </ComDetailTop>
    <div class="form">
      <ComForm ref="editFormRef" :formConfig="editFormConfig" v-if="isInitRes">
        <template v-slot:pickingMemberId="slotProps">
          <AutoComplete
            ref="pickingMemberIdRef"
            :formModel="slotProps.formModel"
            :fieldItem="slotProps.fieldItem"
            :additionalParam="{
              roleIdList:roleIdList
            }"
          />
          </template>

      </ComForm>
    </div>

    <div class="base-flex-between footer-btn">
      <div>
        <span class="table-tit-txt">{{ overseaLangObj.dd_mx }}</span>
        <!-- <template v-if="!isSeePrint">
          <span>订单总数：{{ orderTotal }}</span>
          <span class="table-tit-num">产品总数：{{ skuTotal }}</span>
        </template> -->
      </div>
      <div v-if="!isSeePrint">
        <el-button type="primary" @click="addContainerEvt" size="small">
          {{ overseaLangObj.xz_add("添 加") }}
        </el-button>
      </div>
      <div v-if="isSeePrint">
        <el-button class="print-btn" @click="handlePrint" size="small">
          {{
            modeType === 4 ? overseaLangObj.dy_jhd() : overseaLangObj.print_chd
          }}
        </el-button>
      </div>
    </div>
    <div>
      <ComTable
        :ref="`tableRef`"
        :tableHeight="tableConfig.tableHeight"
        :columnConfig="tableConfig.columnConfig"
        :paginationConfig="{ limit: 999 }"
        :pagination="false"
        :columnData="tableList"
      >
        <template v-slot:customRow="{ slotProps }">
          <template v-if="slotProps.prop === 'operation'">
            <div class="operation-content-btn">
              <template v-for="(item, index) in tableConfig.statusBtnList">
                <el-button
                  :key="index"
                  size="small"
                  type="text"
                  @click="item.handleClick(slotProps.row)"
                  >{{ item.text }}</el-button
                >
              </template>
            </div>
          </template>
        </template>
      </ComTable>
      <div class="grand-total" v-if="this.tableList.length > 0">
        <template v-for="(tItem, i) in tableSubtotal">
          <span :key="`t_${i}`">
            <span>{{ tItem.totalLabel }}：</span>
            <span>{{ tItem.totalNum }}</span>
          </span>
        </template>
      </div>
    </div>
    <template>
      <div class="footer-seize-seat"></div>
      <div class="order-footer">
        <template v-for="(btn, index) in getFootBtn()">
          <el-button :type="btn.type" @click="btn.handleClick" :key="index">
            <!-- v-hasPermi="btn.hasPermission" -->
            {{ btn.text }}
          </el-button>
        </template>
      </div>
    </template>
    <addDrawerOrder ref="addDrawerRef" @handleCheckClick="addTableClick" />
    <!-- <div class="base-flex-between footer-btn">
      <div>
        <el-button
          type="primary"
          @click="submitForm"
          v-if="!isSeePrint"
          size="small"
        >
          保 存
        </el-button>
        <el-button @click="cancelEvt" size="small">
          {{ isSeePrint ? "返 回" : "取 消" }}
        </el-button>
      </div>
    </div> -->
  </div>
</template>

<script>
import {
  getPickingList,
  getPickingOrderList,
  pickingPost,
  pickingPut,
} from "@/api/warehouse/manage";
import { getUserWarehouse } from "@/api/common";
import { duplicateRemoval, typeConversion,hostCurrentEnv } from "@/utils/index";
import { mapActions, mapState } from "vuex";
import { msgBox } from "@/utils/confirmBox.js";
import { uploadPickingBill } from "@/api/common.js";
import { editFormColumns, editFormRules, editTableColumns } from "./model";
import addDrawerOrder from "./addDrawer.vue";
import { accumulationFn } from "@/utils/instructions";

export default {
	// name: "PickingEdit",
  data() {
    return {
      editFormConfig: {
        formModel: {},
        httpRequest: this.editFormSubmit, // 表单提交接口
        successFunction: (aRes) => {
          this.msgSuccess(
            this.overseaLangObj.cg_tip(
              `${this.isSeePrint ? "打印" : "保存"}成功`
            )
          );
          const { onOrderIds, id, ...nQuery } = this.$route.query;
          if (onOrderIds && !id && aRes.data) {
            // 新增成功跳转到编辑页
            this.$refs.detailTopRef?.toPageRoute(
              "/warehouseManage/exWarehouse/pickingEdit",
              {
                id: aRes.data,
                ...nQuery,
              }
            );
          } else {
            this.cancelEvt();
          }
        }, // 表单提交成功回调
        labelWidth:
          this.overseaLangObj.yu_yan_lang === "en-us" ? "122px" : "102px",
      },
      tableConfig: {
        tableHeight: "calc(100vh - 375px)",
        statusBtnList: [
          {
            text: this.overseaLangObj.yc_delete("移除"),
            handleClick: this.handleDelete,
          },
        ],
      },
      tableList: [],
      pickingWarehouse: {},
      modeType: null,
      isSeePrint: false, // 是否为打印查看
      isInitRes: false, // 是否完成初始化
      footBtn: [
        {
          text: this.overseaLangObj.bc_save("保 存"),
          isSeePrint: false,
          handleClick: () => {
            this.submitForm();
          },
        },
        {
          text: this.overseaLangObj.bc_close("返 回"),
          isAllBtn: true,
          isSeePrint: true,
          handleClick: () => {
            this.cancelEvt();
          },
        },
        {
          text: this.overseaLangObj.qx_cancel() || "取 消",
          isAllBtn: true,
          isSeePrint: false,
          handleClick: () => {
            this.cancelEvt();
          },
        },
      ],
      tableSubtotal: [],
      roleIdList:''
    };
  },
  methods: {
    // 提交表单
    submitForm() {
      if (this.tableList.length) {
        this.$refs.editFormRef?.submitForm();
      } else {
        this.msgError(
          this.overseaLangObj.jhd_hw_tip ||
            "当前拣货单不存在货物，请至少关联1个货物"
        );
      }
    },
    editFormSubmit(formModel) {
      let { pickingNumber, userName,pickingMemberId, ...nFormModel } = formModel;
      // const {pickingMemberId:submitId,pickingMemberName:submitName}=this.editFormConfig.formModel
      // let ids=[]
      // pickingMemberId.map((e)=>{ //后续需要跟进修改一下，目前时间过于急促，同时改3个模块没时间改标记:XH
      //   const index=submitName.findIndex((sRes)=>sRes==e)
      //   if(index==-1){
      //     ids.push(e)
      //   }else{
      //     ids.push(submitId[index])
      //   }
      // })
      const opt = {
        ...nFormModel,
        warehouseId: this.pickingWarehouse?.id,
        warehousePickingSelectParamList: this.tableList.map((e) => ({
          id: e.id,
          trayNumber: e.trayNumber,
          locationCode: e.locationCode,
          fbaFreightId: e.fbaFreightId,
        })),
        pickingMemberId:pickingMemberId.join(',')
      };
      if (this.isSeePrint) {
        return pickingPut({
          id: opt.id,
          orderType: opt.orderType,
          pickingStatus: this.modeType - 2, // 1-待拣货，2-拣货中，3-已拣货，4-待出库
        });
      }
      if (opt.id) {
        return pickingPut(opt);
      }
      return new Promise((resolve, reject) => {
        pickingPost(opt)
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            const { code, data } = error;
            if (code == 1002) {
              error.msg && this.msgError(error.msg);
              const tableData = this.tableList.filter((e) => {
                return !data.includes(e.id);
              });
              this.tableList = tableData;
              this.$refs[`tableRef`]?.setNewTableData(this.tableList);
            }
            reject(error);
          });
      });
    },
    getTableResult(rows) {
      const productNum = {
        totalLabel: this.overseaLangObj.product_total || "产品总数",
        totalNum: accumulationFn(rows.map((e) => e.quantity)),
      };
      this.tableSubtotal = [productNum];
    },
    getFootBtn() {
      const arr = this.footBtn.filter((e) => {
        if (e.isSeePrint == this.isSeePrint) {
          return true;
        }
      });
      return arr;
    },
    addContainerEvt() {
      const pageFormRef = this.$refs.editFormRef;
      pageFormRef?.$refs["myForm"].validate((valid) => {
        if (valid) {
          // 传入已选的值过滤列表
          this.$refs.addDrawerRef?.showDrawer([...this.tableList], {
            warehouseId: this.pickingWarehouse?.id,
            orderType: pageFormRef?.getFormModelVal("orderType"),
            pickingType: pageFormRef?.getFormModelVal("pickingType"),
          });
        }
      });
    },
    addTableClick(arr, objSearch = {}) {
      // 添加后刷新列表
      this.getTableList({
        pageNum: 1,
        pageSize: 999,
        onOrderIds: arr.map((e) => e.id).join(","),
        ...objSearch,
      });
    },
    getTableList(param) {
      //详情查询
      getPickingOrderList(param).then((res) => {
        this.tableList = res.rows;
        this.getTableResult(this.tableList);
        this.$refs[`tableRef`]?.setNewTableData(res.rows);
      });
    },
    handleDelete(row = {}) {
      //手动删除
      this.tableList = this.tableList.filter((e) => e.id !== row.id);
      this.getTableResult(this.tableList);
      this.$refs[`tableRef`]?.setNewTableData(this.tableList);
    },
    emptyTable(txt) {
      if (this.tableList.length) {
        this.tableList = [];
        this.$refs.tableRef.setNewTableData([]);
        this.msgError(
          this.overseaLangObj.jhd_gh_lx_tip ||
            `你已更换${txt}类型，请重新添加拣货单数据`
        );
      }
    },
    async getInitRequest(id) {
      // 初始化
      const { warehouseCode, warehouseName, warehouseId,onOrderIds=undefined } = this.$route.query;
      if (id) {
        // 修改
        const editData = (await getPickingList({ id })).rows[0] || {};
        const {
          warehouseId,
          orderType,
          pickingType,
          pickingMemberId,
          pickingNumber,
          userName,
        } = editData;
        this.pickingWarehouse = {
          id: warehouseId,
          warehouseName,
          warehouseCode,
        };
        this.editFormConfig.formModel = {
          orderType: typeConversion(orderType),
					pickingType: typeConversion(pickingType),
          pickingMemberId:(pickingMemberId.split(',')).map(Number)||[],
          pickingMemberName:(userName.split(',')),
          id: editData.id,
          pickingNumber,
        };
        this.getTableList({ id, orderType });
      } else {
        // 新增 - 获取当前用户所在地仓库
        const { orderType, pickingType } = this.$route.query;
        console.log('this.$route.query', this.$route.query)
        const { data: addData } = await getUserWarehouse({ warehouseId }) || {}
        this.pickingWarehouse = {
          ...addData,
          warehouseName,
          warehouseCode
        }
        if (onOrderIds) {
          this.editFormConfig.formModel = {
            orderType: typeConversion(orderType),
						pickingType: typeConversion(pickingType),
          };
          this.getTableList({onOrderIds,warehouseId,orderType})
        }
      }
      this.isInitRes = true;
    },
    async getInitPrintRequest(id) {
      this.getInitRequest(id);
    },
    handlePrint() {
      const msg = `确定打印${this.modeType === 6 ? "出货" : "拣货"}单？`;
      const title = "提示（Tip）";
      const className = "el-icon-warning text-warning";
      msgBox(this, { title, className, msg }, () => {
        // 打印之后改变状态
        this.uploadPickingBill();
      });
    },
    cancelEvt() {
      this.$refs.detailTopRef?.comReBack();
    },
    uploadPickingBill() {
      const { id, orderType, pickingNumber, userName } =
        this.editFormConfig.formModel;
      uploadPickingBill({ id, orderType, pickingNumber, userName }).then(
        (res) => {
          window.open(res.data);
          // download(res.msg);
          const { pickingStatus } = this.$route.query;
          if (pickingStatus == 1 || pickingStatus == 3) {
            // 状态改变后，再次打印不需要更新状态
            this.$refs.editFormRef?.submitForm();
          }
        }
      );
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
  computed: {
    ...mapState({
      dictionary: (state) => state.dictionary.dicsData,
      roleIdOneByOne: (state) => state.dictionary.dicsData.roleIdOneByOne
    }),
    orderTotal() {
      return duplicateRemoval(this.tableList, "id").length;
    },
    skuTotal() {
      // 产品总数需要去重
      return duplicateRemoval(this.tableList, "productSKU").length;
    },
  },
  watch: {
    "tableList.length"(len) {
      if (this.isInitRes && !this.isSeePrint) {
        this.$set(
          this.editFormConfig.lists[0].fieldList[0].rows[0].cols[1],
          "disabled",
          !!len
        );
        this.$set(
          this.editFormConfig.lists[0].fieldList[0].rows[0].cols[2],
          "disabled",
          !!len
        );
      }
    },
  },
  components: {
    addDrawerOrder,
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
  },
  created() {
    const { id, modeType } = this.$route.query;
    this.modeType = Number(modeType);
    const isPrint = [4, 6, "4", "6"].includes(this.modeType); // 打印页面
    this.isSeePrint = isPrint;
    this.editFormConfig = {
      ...this.editFormConfig,
      formRules: isPrint ? {} : editFormRules(),
      lists: editFormColumns({
        isPrint,
        orderTypeFn: () => this.emptyTable("订单"),
        pickingTypeFn: () => this.emptyTable("拣货"),
      }),
    };
    this.tableConfig = {
      ...this.tableConfig,
      columnConfig: editTableColumns(isPrint),
    };
    this["dictionary/getDictionary"]("exWarehouseDict").then(() => {
      const routeEnv=hostCurrentEnv()
      const {value}=this.roleIdOneByOne.find((e)=>routeEnv==e.nameCn&&e.nameEn=="HWCKTS")
      this.roleIdList=value
      if (isPrint) {
        // 打印
        this.getInitPrintRequest(id);
      } else {
        // 新增/修改
        this.getInitRequest(id);
      }
    });
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-container {
  .form {
    border-bottom: 1px solid #e2e2e2;
  }
  .com-detail-top {
    margin: 0px 0px 15px;
  }
  .footer-btn {
    padding: 15px 0 18px;
  }
  .operation-content {
    .iconfont {
      font-size: 13px;
      margin-right: 2px;
    }
  }
  .table-tit-txt {
    font-size: 14px;
    margin-right: 30px;
    font-weight: bold;
  }
  .table-tit-num {
    margin: 0 10px;
  }
  .print-btn {
    border-radius: 12px;
    border: 1px solid #66a5ff;
    color: #66a5ff;
  }
}
</style>
