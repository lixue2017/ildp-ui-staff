<template>
  <div class="print">
    <div class="print-div" id="print_area">
      <div class="block">
        <div class="contacts">
          <div class="shipper-height content-padding">
            <template v-if="shipperContacts">
              <div>{{ shipperContacts.company.toUpperCase() }}</div>
              <div v-html="addressObj.shipperAddr"></div>
              <div v-if="shipperContacts.phone">
                TEL:{{ shipperContacts.phone }}
              </div>
              <div v-if="shipperContacts.email">
                FAX:{{ shipperContacts.email.toUpperCase() }}
              </div>
              <div v-if="shipperContacts.otherDes">
                OTHER:{{ shipperContacts.otherDes.toUpperCase() }}
              </div>
            </template>
          </div>
          <div class="consignee-height content-padding">
            <template v-if="consigneeContacts">
              <div>{{ consigneeContacts.company.toUpperCase() }}</div>
              <div v-html="addressObj.consigneeAddr"></div>
              <span v-if="consigneeContacts.phone"
                >TEL:{{ consigneeContacts.phone.toUpperCase() }}</span
              ><br />
              <div v-if="consigneeContacts.email">
                FAX:{{ consigneeContacts.email.toUpperCase() }}
              </div>
              <div v-if="consigneeContacts.otherDes">
                OTHER:{{ consigneeContacts.otherDes.toUpperCase() }}
              </div>
            </template>
          </div>
          <div class="notifier-height content-padding">
            <template v-if="notifierContacts">
              <div>{{ notifierContacts.company.toUpperCase() }}</div>
              <div v-html="addressObj.notifierAddr"></div>
              <div v-if="notifierContacts.phone">
                TEL:{{ notifierContacts.phone.toUpperCase() }}
              </div>
              <div v-if="notifierContacts.email">
                FAX:{{ notifierContacts.email.toUpperCase() }}
              </div>
              <div v-if="notifierContacts.otherDes">
                OTHER:{{ notifierContacts.otherDes.toUpperCase() }}
              </div>
            </template>
            <template v-else>SAME AS CONSIGNEE</template>
          </div>
        </div>
        <div class="code">
          {{ detailData.hblNo || detailData.mblNo || detailData.code }}
        </div>
      </div>
      <div class="block ship-info">
        <div class="content-padding ship-info-1">
          {{ detailData.shipName }} {{ detailData.voy }}
        </div>
        <div class="ship-info-2">
          <div class="content-padding">{{ detailData.plName }}</div>
          <div class="content-padding">{{ detailData.podName }}</div>
        </div>
        <div class="ship-info-3">
          <div class="content-padding">{{ detailData.polName }}</div>
          <div class="content-padding">{{ detailData.dapName }}</div>
        </div>
      </div>
      <div class="block total-content">
        <div class="maitou">
          <template v-if="goodsTooLong || productNameTooLong || maitouTooLong">
            SEE ATTACHMENT
          </template>
          <span v-else v-html="detailData.maitou"></span>
        </div>
        <div class="quantity">
          {{ detailData.warehousingQuantity }}{{ detailData.packTypeName }}
        </div>
        <div class="goods-desc">
          <div class="margin-bottom-5 max-height-hide">
            <template
              v-if="goodsTooLong || productNameTooLong || maitouTooLong"
            >
              SEE ATTACHMENT
            </template>
            <template v-else>
              <template
                v-if="
                  detailData.freightType == 1 ||
                  ['BS23090262B'].includes(detailData.hblNo)
                "
              >
                {{ detailData.transportationClauseName }} LCL-LCL
              </template>
              <template v-else>
                {{
                  `SHIPPER'S LOAD,COUNT & SEAL(${
                    detailData.boxSizeArr1 || "--"
                  }) CONTAINER
            S.T.C`
                }}
              </template>
            </template>
          </div>
          <div class="product-name">
            <template
              v-if="!goodsTooLong && !productNameTooLong && !maitouTooLong"
            >
              <span v-html="detailData.productName"></span>
            </template>
          </div>
        </div>
        <div class="weight">{{ detailData.warehousingTotalWeight }}KGS</div>
        <div class="volume">{{ detailData.warehousingTotalVolume }}CBM</div>
      </div>
      <div class="cntr-no">
        <template
          v-if="
            !(!detailData.boxSizeArr1 && detailData.freightType == 1) &&
            !goodsTooLong &&
            !productNameTooLong &&
            !maitouTooLong
          "
        >
          <div>CNTR NO.:</div>
          <template v-for="(item, index) in detailData.commodityInfoList">
            <div
              :key="item.id"
              v-if="index < goodsMax"
              v-html="item.text"
            ></div>
          </template>
        </template>
      </div>
      <div class="date">
        <div>SHIPPED ON BOARD</div>
        <div>{{ handleDate(detailData.shipmentTime) }}</div>
      </div>
      <div class="total">
        TOTAL:
        {{
          detailData.boxSizeArr2 &&
          detailData.freightType == 0 &&
          !["BS23090262B"].includes(detailData.hblNo)
            ? `${detailData.boxSizeArr2} CONTAINER`
            : `${numberCnToEn(detailData.warehousingQuantity)} ${
                detailData.packTypeName
              }`.toUpperCase()
        }}
        ONLY
      </div>
      <div class="block">
        <div class="width-25 content-padding pay-name">
          <div>{{ detailData.payTypeName }}</div>
          <div>{{ detailData.transportationClauseName }}</div>
        </div>
        <div class="width-25 content-padding">
          {{ detailData.tdisType === 1 ? "THREE(3)" : "ZERO(0)" }}
        </div>
        <div class="width-25 content-padding">{{ detailData.tdisId }}</div>
        <div class="width-25 content-padding">{{ detailData.tdisTime }}</div>
      </div>
      <div class="block contacts">
        <div class="consignee-height content-padding" v-if="fsaContacts">
          <div>{{ fsaContacts.company.toUpperCase() }}</div>
          <div v-html="addressObj.fsaAddr"></div>
          <div v-if="fsaContacts.phone">
            TEL:{{ fsaContacts.phone.toUpperCase() }}
          </div>
          <div v-if="fsaContacts.email">
            FAX:{{ fsaContacts.email.toUpperCase() }}
          </div>
          <div v-if="fsaContacts.otherDes">
            OTHER:{{ fsaContacts.otherDes.toUpperCase() }}
          </div>
        </div>
        <div></div>
      </div>
    </div>
    <div class="a4" v-if="goodsTooLong || productNameTooLong || maitouTooLong">
      <div class="title">ATTACH LIST</div>
      <div class="block justify-content">
        <div>HBLNO.:{{ detailData.code }}</div>
        <div>OBD:{{ detailData.shipmentTime }}</div>
        <div>VESSEL/VOYNO.:{{ detailData.shipName }}/{{ detailData.voy }}</div>
      </div>
      <div class="block table">
        <div>
          <div class="title">Marks & Nos.</div>
          <div class="content">
            <div class="margin-bottom-20">
              <span v-html="detailData.maitou"></span>
            </div>
            <template
              v-if="!(!detailData.boxSizeArr1 && detailData.freightType == 1)"
            >
              <template v-for="item in detailData.commodityInfoList">
                <div
                  :key="item.id"
                  class="margin-bottom-5"
                  v-html="item.text"
                ></div>
              </template>
            </template>
          </div>
        </div>
        <div>
          <div class="title">Description of Goods</div>
          <div class="content">
            <div class="margin-bottom-5">
              <template
                v-if="
                  detailData.freightType == 1 ||
                  ['BS23090262B'].includes(detailData.hblNo)
                "
              >
                {{ detailData.transportationClauseName }} LCL-LCL
              </template>
              <template v-else>
                {{
                  `SHIPPER'S LOAD,COUNT & SEAL(${
                    detailData.boxSizeArr1 || "--"
                  }) CONTAINER
            S.T.C`
                }}
              </template>
            </div>
            <div class="margin-bottom-20">
              <span v-html="detailData.productName"></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="order-footer">
      <el-button
        v-if="goodsTooLong || productNameTooLong || maitouTooLong"
        @click="handleExport"
        type="primary"
        size="medium"
        >导 出</el-button
      >
      <el-button @click="printSomething" type="primary" size="medium"
        >打 印</el-button
      >
    </div>
  </div>
</template>

<script>
import Print from "print-js"; //打印
import { comFileDownload } from "@/utils/download.js";
import { characterWrapping } from "@/utils/ruoyi.js";
import {
  getBillDetailPreview,
  getHblorMblDetail,
} from "@/api/operateRecord/BOLManage.js";
import { numberCnToEn } from "@/utils/instructions.js";
export default {
  data() {
    return {
      detailData: {},
      shipperContacts: "",
      consigneeContacts: "",
      notifierContacts: "",
      fsaContacts: "",
      addressObj: {},
      numberCnToEn,
      productNameMax: 600,
      productNameMaxLine: 15,
      productNameTooLong: false,
      maitouMax: 300,
      maitouTooLong: false,
      goodsMax: 6,
      goodsTooLong: false,
    };
  },
  created() {
    this.getInitHblorMblDetail();
  },
  methods: {
    getInitHblorMblDetail() {
      const { id } = this.$route.query;
      getHblorMblDetail({ id }).then((res) => {
        const rows = res.data[0];
        const { maitouMax } = this;
        for (let k in rows) {
          if (typeof rows[k] === "string") {
            rows[k] = rows[k].toUpperCase();
          }
        }
        if (rows.freightType == 0) {
          this.productNameMax = 540;
        }

        if (rows.productName) {
          const len = rows.productName.split("\n").length;
          if (rows.productName.length > this.productNameMax) {
            this.productNameTooLong = true;
          } else if (len > this.productNameMaxLine) {
            this.productNameTooLong = true;
          }
        }
        if (rows.maitou && rows.maitou.length > maitouMax) {
          this.maitouTooLong = true;
        }
        rows.commodityInfoList.forEach((item) => {
          if (item.ontainerSno || item.sealingStripSno) {
            item.text = `${item.ontainerSno || "--"}/${
              item.sealingStripSno || "--"
            }/${item.boxSizeCode || "--"}/<br>${item.warehousingQuantity || 0}${
              item.packTypeName || "--"
            }/${
              item.warehousingTotalWeight.toFixed(2) || "--"
            }KGS/${item.warehousingTotalVolume.toFixed(3)}CBM`.toUpperCase();
            // this.goodsMax -= 1;
          } else {
            item.text = `${item.ontainerSno || "--"}/${
              item.sealingStripSno || "--"
            }/${item.boxSizeCode || "--"}/${item.warehousingQuantity || 0}${
              item.packTypeName || "--"
            }/${
              item.warehousingTotalWeight.toFixed(2) || "--"
            }KGS/${item.warehousingTotalVolume.toFixed(3)}CBM`.toUpperCase();
          }
        });
        if (
          rows.commodityInfoList &&
          rows.commodityInfoList.length > this.goodsMax
        ) {
          this.goodsTooLong = true;
        }
        this.shipperContacts = rows.shipperContacts;
        this.addressObj.shipperAddr = characterWrapping(
          rows.shipperContacts?.address,
          "capitalize"
        );
        this.consigneeContacts = rows.consigneeContacts;
        this.addressObj.consigneeAddr = characterWrapping(
          rows.consigneeContacts?.address,
          "capitalize"
        );
        this.notifierContacts = rows.notifierContacts;
        this.addressObj.notifierAddr = characterWrapping(
          rows.notifierContacts?.address,
          "capitalize"
        );
        this.fsaContacts = rows.fsaContacts;
        this.addressObj.fsaAddr = characterWrapping(
          rows.fsaContacts?.address,
          "capitalize"
        );

        const payType = ["FREIGHT PREPAID", "FREIGHT COLLECT"];
        rows.payTypeName = payType[rows.payType];
        const regex = /\n/g;
        this.detailData = {
          ...rows,
          maitou: rows.maitou ? rows.maitou.replace(regex, "<br/>") : "N/M",
          productName: rows.productName
            ? rows.productName.replace(regex, "<br/>")
            : "",
          ...this.getResult(rows.commodityInfoList),
        };
      });
    },
    handleDate(oDate) {
      const arr = new Date(oDate).toDateString().split(" ");
      return `${arr[1]}.${arr[2]},${arr[3]}`.toUpperCase();
    },
    getResult(rows = []) {
      //计算table总数量
      let warehousingQuantity = 0;
      let warehousingTotalWeight = 0;
      let warehousingTotalVolume = 0;
      let packTypeName = rows[0]?.packTypeName;
      let boxSize = {};
      rows.forEach((row) => {
        if (row.warehousingQuantity) {
          warehousingQuantity += row.warehousingQuantity;
        }
        if (row.warehousingTotalWeight) {
          warehousingTotalWeight += row.warehousingTotalWeight;
        }
        if (row.warehousingTotalVolume) {
          warehousingTotalVolume += row.warehousingTotalVolume;
        }
        if (packTypeName && packTypeName !== row.packTypeName) {
          packTypeName = "";
        }
        if (row.boxSizeCode) {
          if (!boxSize[row.boxSizeCode]) boxSize[row.boxSizeCode] = 0;
          boxSize[row.boxSizeCode] += 1;
        }
      });
      let boxSizeArr1 = [];
      let boxSizeArr2 = [];
      for (let k in boxSize) {
        boxSizeArr1.push(`${boxSize[k]}X${k}`);
        boxSizeArr2.push(
          `${this.numberCnToEn(boxSize[k])}(${boxSize[k]}X${k})`
        );
      }
      return {
        warehousingQuantity: warehousingQuantity.toFixed(0),
        warehousingTotalWeight: warehousingTotalWeight.toFixed(2),
        warehousingTotalVolume: warehousingTotalVolume.toFixed(3),
        packTypeName: packTypeName || "PACKAGES",
        boxSizeArr1: boxSizeArr1.length && boxSizeArr1.join("+"),
        boxSizeArr2: boxSizeArr2.length && boxSizeArr2.join(" AND "),
      };
    },
    printSomething() {
      // 此处的style即为打印时的样式
      const style =
        "@page {margin:0;} " +
        "@media print { .print-div {font-family: Courier New;color: #000;font-size: 14px;font-weight: 500;background: #fff;line-height: 16px;padding: 40px 120px 31px 0px;}.block {display: flex;}.contacts {width: 398px;}.content-padding {padding: 14px 15px 0 6px;}.shipper-height,.notifier-height {height: 98px;}.consignee-height {height: 85px;}.code {padding: 55px 0 0 150px;}.ship-info {padding-top: 5px;height: 60px;}.ship-info-1.content-padding,.ship-info-2 .content-padding,.ship-info-3 .content-padding {line-height: 12px;padding-top: 10px;}.ship-info-1{width: 245px;}.ship-info-3 {width: 255px;}.ship-info-2 {width: 260px;}.ship-info-2 > div,.ship-info-3 > div {height: 30px;}.ship-info-2 > div:nth-child(1),.ship-info-3 > div:nth-child(1) {height: 27px;}.ship-info-2 > div:nth-child(2),.ship-info-3 > div:nth-child(2) {padding-top: 3px;}.total-content {height: 220px;padding: 28px 0 0 6px;}.total-content > div {padding-right: 10px;}.maitou {width: 201px;height:192px;overflow: hidden;}.quantity {width: 108px;}.goods-desc {width: 210px;}.max-height-hide{margin-bottom: 5px;overflow: hidden;max-height: 192px;}.product-name {width: 400px;height: 340px;word-break: break-word;}.weight {width: 108px;}.cntr-no {width: 300px;height: 170px;padding: 10px 0 0 6px;}.date {margin-top: 10px;width: 225px;text-align: center;float: right;}.total {height: 16px;clear: both;padding: 10px 50px 19px 20px;text-align: center;word-break: break-word;}.width-25 {white-space: nowrap;width: 25%;}.pay-name {margin-top: -2px;line-height: 12px;}.margin-bottom-5 {margin-bottom: 5px;}}";
      Print({
        printable: "print_area",
        type: "html",
        style: style, // 亦可使用引入的外部css;
        scanStyles: false,
        onStart: () => {
          console.log("打印开始");
        },
        onEnd: () => {
          console.log("打印完成");
        },
      });
    },
    handleExport() {
      const { id, operationOrderId, type } = this.detailData;
      comFileDownload(this, getBillDetailPreview, {
        id,
        operationOrderId,
        type,
        tdisType: 3,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.print {
  background-color: #f0f2f5;
  padding: 20px 0 120px;
}
.print-div {
  width: 848px;
  height: 1070px;
  line-height: 16px;
  padding: 40px 27px 31px;
  border: 1px solid #515151;
  margin: auto;
  color: #515151;
  font-size: 14px;
  font-weight: 500;
  background: #fff;
  font-family: Courier New;
}
.block {
  display: flex;
}
.contacts {
  width: 398px;
}
.contacts .content-padding {
  padding-top: 8px;
}
.content-padding {
  padding: 14px 15px 0 6px;
}
.shipper-height,
.notifier-height {
  height: 100px;
}
.consignee-height {
  height: 85px;
}
.code {
  padding: 55px 0 0 150px;
}
.ship-info {
  padding-top: 5px;
  height: 60px;
}
.ship-info-1.content-padding,
.ship-info-2 .content-padding,
.ship-info-3 .content-padding {
  line-height: 12px;
  padding-top: 10px;
}
.ship-info-1 {
  width: 245px;
}
.ship-info-3 {
  width: 265px;
}
.ship-info-2 {
  width: 250px;
}
.ship-info-2 > div,
.ship-info-3 > div {
  height: 30px;
}
.ship-info-2 > div:nth-child(1),
.ship-info-3 > div:nth-child(1) {
  height: 27px;
}
.ship-info-2 > div:nth-child(2),
.ship-info-3 > div:nth-child(2) {
  padding-top: 3px;
}
.total-content {
  height: 220px;
  padding: 28px 0 0 6px;
}
.total-content > div {
  padding-right: 10px;
}
.maitou {
  width: 201px;
  height: 192px;
  overflow: hidden;
}
.quantity {
  width: 108px;
}
.goods-desc {
  width: 210px;
}
.max-height-hide {
  margin-bottom: 5px;
  overflow: hidden;
  max-height: 192px;
}
.product-name {
  width: 400px;
  height: 340px;
  word-break: break-word;
  // overflow: hidden;
}
.weight {
  width: 108px;
}
.cntr-no {
  width: 300px;
  height: 210px;
  padding: 10px 0 0 6px;
  // overflow: hidden;
}
.date {
  margin-top: 10px;
  width: 225px;
  text-align: center;
  float: right;
}
.total {
  clear: both;
  padding: 10px 50px 19px 20px;
  text-align: center;
  height: 45px;
  word-break: break-word;
}
.width-25 {
  white-space: nowrap;
  width: 25%;
}
.pay-name {
  margin-top: -2px;
  line-height: 12px;
}
.margin-bottom-5 {
  margin-bottom: 5px;
}
.margin-bottom-20 {
  margin-bottom: 20px;
}
.justify-content {
  justify-content: space-between;
}
.a4 {
  width: 595px;
  min-height: calc(595px * 1.4136);
  padding: 20px;
  border: 1px solid #515151;
  margin: auto;
  color: #000;
  font-size: 12px;
  background: #fff;
  margin-top: 20px;
  .title {
    font-size: 14px;
    font-weight: bold;
  }
  .block > div {
    margin: 0.8rem 0;
  }
  .table {
    border: 1px solid #000;
    height: calc(100% - 50px);
    &.block > div {
      margin: 0;
      width: 50%;
      overflow: hidden;
      &:first-child {
        border-right: 1px solid;
      }
    }
    .title {
      border-bottom: 1px solid;
      line-height: 32px;
      text-align: center;
      font-weight: bold;
    }
    .content {
      padding: 10px;
      word-break: break-word;
    }
  }
}
</style>
