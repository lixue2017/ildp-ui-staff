<template>
  <div class="app-content-container">
    <ComDetailTop
      :title="`打印面单`"
      ref="detailTopRef"
      class="title-sides-margin-none"
      :config="{}"
    >
      <template v-slot:subTitle>
        <span class="sub-title" v-if="searchOrderData.orderSn">
          ({{ searchOrderData.orderSn }})
        </span>
      </template>
    </ComDetailTop>

    <div class="des-content-box">
      <div class="partition-right">
        <ComForm ref="costFormRef" :formConfig="setSearchFormConf()"> </ComForm>

        <template v-if="isInitRes">
          <div
            class="base-flex-align"
            style="padding: 10px 0; max-width: 510px"
          >
            <div style="flex: 0 0 72px; text-align: right">SKU：</div>
            <el-input
              style="max-width: 296px"
              size="small"
              v-model="searchOrderData.sku"
              clearable
              placeholder="请输入SKU（按Enter键打印）"
              @keyup.enter.native="() => handlePrintSku()"
              @change="
                (val) => {
                  searchOrderData.sku = (val || '').trim();
                }
              "
            />
            <el-checkbox
              style="margin-left: 10px"
              v-model="searchOrderData.isBatchChecked"
            >
              按SKU批量打印
            </el-checkbox>
          </div>
          <div style="padding: 10px 0">
            <span v-if="tableTypeData.print.length > 0" class="printedNumClass"
              >未打单{{ `(${tableTypeData.print.length})` }}</span
            >
            <span v-if="tableTypeData.printed.length > 0" class="printNumClass"
              >已打单{{ `(${tableTypeData.printed.length})` }}</span
            >
          </div>
          <ComTable
            :ref="`tableCostRef`"
            :columnConfig="printTableColumns()"
            :columnData="tableData"
            :rowOperationBtnListFn="(row) => tableBtnList"
          >
            <template v-slot:customRow="{ slotProps }">
              <template v-if="slotProps.prop === 'printLableSign'">
                <span
                  :style="{
                    color: slotProps.row.printLableSign ? '#66B342' : '#777A7D',
                  }"
                  >{{
                    slotProps.row.printLableSign ? "已扫描" : "未扫描"
                  }}</span
                >
              </template>
            </template>
            <template v-slot:bottomTotal>
              <div class="grand-total">
                <template v-for="(tItem, i) in tableSubtotal">
                  <span :key="`t_${i}`">
                    <span>{{ tItem.totalLabel }}：</span>
                    <span>{{ tItem.totalNum }}</span>
                  </span>
                </template>
              </div>
            </template>
          </ComTable>
        </template>
      </div>
    </div>

    <template>
      <div class="footer-seize-seat"></div>
      <div class="order-footer">
        <template v-for="(btn, index) in footBtnList">
          <el-button :type="btn.type" @click="btn.handleClick" :key="index">
            {{ btn.text }}
          </el-button>
        </template>
      </div>
    </template>
  </div>
</template>

<script>
import printJS from "print-js";
import axios from "axios";
import { mapActions, mapState } from "vuex";
import { mixinEditCache } from "@/views/ComMixins/editPageCache.js";
import {
  postSearchPicking,
  postSetUrlList,
  POSTMergeLablePdf,
  postWpcSkuPrinting,
  PUTEditPrintLableSign,
} from "@/api/warehouse/manage";
import { printSearchColumns, formRules, printTableColumns } from "./model.js";
import { msgBox } from "@/utils/confirmBox.js";
export default {
  name: "PrintWaybill",
  mixins: [mixinEditCache],
  data() {
    return {
      searchFormConfig: {
        formModel: {
          // printerName: localStorage.printerName,
        }, // 表单数据
        httpRequest: (searchVal) => {
          return new Promise((resolve) => {
            this.getSearchList(searchVal);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        noSearchReset: true,
        labelWidth: "80px",
        formRules,
      },
      searchOrderData: {},
      printTableColumns,
      tableBtnList: [
        {
          text: "打印",
          handleClick: (r) => {
            // this.handleSilentPrinting(row.urlList);
            this.handlePrintSku("row", [r]);
          },
        },
      ],
      footBtnList: [
        {
          text: "批量打印全部",
          handleClick: () => {
            this.handlePrintSku("all");
          },
        },
        {
          text: "关闭",
          handleClick: this.reBack,
        },
      ],
      tableSubtotal: [
        {
          totalLabel: "产品总数",
          totalNum: 0,
        },
      ],
      tableData: [],
      tableTypeData: {},
      allPrinterList: [], // 打印机列表
      // isGetPrinter: false,
      isInitRes: false,
    };
  },
  methods: {
    mixinInitData() {
      this["dictionary/getDictionary"]([
        "billType",
        "paymentType",
        "accountBillStatus",
      ]);
    },
    getSearchList(searchFrom) {
      if (!searchFrom.orderSn) {
        return this.msgError("请输入工作单号");
      }
      this.isInitRes = false;
      postSearchPicking({
        ...searchFrom,
        wmsId: this.$route.query.warehouseId,
      }).then((res) => {
        this.tableData = res.data || [];
        this.calcNumTotal(this.tableData);
        this.tableTypeData = {
          printed: this.tableData.filter((e) => e.printLableSign),
          print: this.tableData.filter((e) => !e.printLableSign),
        };
        this.isInitRes = true;
      });
    },
    handlePrintSku(str, rows) {
      const { sku, isBatchChecked } = this.searchOrderData;
      const { isReprint } = this.$refs.costFormRef?.getFormParams();
      let pageData = [];
      if (isReprint) {
        pageData = rows || this.tableData;
      } else {
        pageData = (rows || this.tableData).filter((e) => !e.printLableSign);
        if (!pageData.length) {
          return this.msgError("暂无未扫描的打印数据");
        }
      }
      let opt = {
        sku: sku?.trim(),
        batch: isBatchChecked || false,
      };
      if (["all", "row"].includes(str)) {
        opt = {};
      }
      if (sku || ["all", "row"].includes(str)) {
        postWpcSkuPrinting({
          ...opt,
          pageData,
        })
          .then((res) => {
            printJS({
              printable: res.data,
              type: "pdf",
              onPrintDialogClose: () => {
                this.$refs.costFormRef?.submitForm();
              },
            });
          })
          .finally(() => {
            // setTimeout(() => {
            //   this.searchOrderData.sku = "";
            // }, 3000);
          });
      }
    },
    handleChangeChecked(val) {
      // console.log("===val", val);
      if (val) {
        let allUrlArr = [];
        this.tableData.forEach((ele) => {
          allUrlArr = [...allUrlArr, ...ele.urlList];
        });
        if (allUrlArr.length) {
          this.handleSilentPrinting(allUrlArr);
        } else {
          this.msgError("暂无打印数据");
        }
      }
    },
    handleSilentPrinting(rows) {
      POSTMergeLablePdf(rows).then((res) => {
        const { data: url } = res;
        printJS({
          printable: url,
          type: "pdf",
          onPrintDialogClose: () => {
            const title = "确认提示";
            const className = "el-icon-warning text-warning";
            const msg = "是否已经打印文件？";
            msgBox(
              this,
              {
                title,
                className,
                msg,
                showCancelButton: true,
              },
              (confirm) => {
                const orderSn = this.tableData.map((e) => e.orderSn);
                PUTEditPrintLableSign(orderSn).then((res) => {
                  this.$refs.costFormRef?.submitForm();
                });
              },
              (cancel) => {
                // this.handleSilentPrinting(rows);
                this.$refs.costFormRef?.submitForm();
              }
            );
          },
        });
      });

      // 静默打印 需要安装后台(谭康)提供的程序tkplint-setup.exe - 用于代理本机域名与连接打印机
      // postSetUrlList({ urlList: rows || [] }).then((res) => {
      //   res.data &&
      //     window.open(`http://127.0.0.1:8989/web/index?tag=${res.data}`);
      // });
      // const { printerName } = this.$refs.costFormRef?.getFormParams();
      // if (!printerName) {
      //   return this.msgError("请选择打印机名称");
      // }
      // localStorage.printerName = printerName; // 本地存储打印机
      // const opt = {
      //   printerName,
      //   urlList: r.urlList || [],
      // };
      // axios
      //   .post("http://127.0.0.1:8989/print/file", opt)
      //   .then(({ data: res }) => {
      //     if (res != 200) {
      //       this.msgError(res.msg || "打印失败");
      //     }
      //   })
      //   .catch((err) => {
      //     this.msgError("打印失败");
      //   });
    },

    setSearchFormConf() {
      return {
        ...this.searchFormConfig,
        lists: printSearchColumns(this.allPrinterList),
      };
    },

    calcNumTotal(arr = []) {
      this.tableSubtotal = [
        {
          totalLabel: "产品总数",
          totalNum: arr.length,
        },
      ];
    },
    reBack() {
      this.$refs.detailTopRef?.comReBack();
    },
    // 获取本机打印机
    // getNativeAllPrinterName() {
    //   axios
    //     .get("http://127.0.0.1:8989/print/getAllPrinterName")
    //     .then(({ data: res }) => {
    //       // console.log("===w", res);
    //       this.isGetPrinter = true;
    //       this.allPrinterList = (res.data || []).map((ele) => ({
    //         label: ele,
    //         value: ele,
    //       }));
    //     });
    // },
    ...mapActions(["dictionary/getDictionary"]),
  },
  created() {
    // this.getNativeAllPrinterName();
  },
  computed: {
    ...mapState({
      // isBtnLoading: (state) => state.settings.isRepeatedClick,
    }),
  },
  components: {
    ComTable: () => import("_comp/ComTable"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-content-container {
  min-height: calc(100vh - 80px);
  // .title-txt {
  //   font-size: 14px;
  //   font-weight: 600;
  //   line-height: 22px;
  // }
  .printedNumClass {
    color: #f99223;
    font-size: 16px;
    padding-right: 15px;
  }
  .printNumClass {
    color: #81a722;
    font-size: 16px;
  }
}
</style>
