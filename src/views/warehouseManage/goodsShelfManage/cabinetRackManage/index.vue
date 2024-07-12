<template>
  <div class="app-content-container" ref="container">
    <ComDetailTop
      :title="overseaLangObj.phj_info"
      class="title-sides-margin-none"
      :config="{}"
    />
    <div class="total-top">
      <div class="search-form">
        <keep-alive>
          <ComForm
            ref="myForm"
            :formConfig="searchFormConfig"
            v-if="myFormShow"
          />
        </keep-alive>
      </div>
      <div class="care">
        <template v-for="item in careList">
          <div class="care-item" :style="getBgStyle(item)" :key="item.prop">
            <div class="label">{{ item.label }}</div>
            <div class="value">{{ formData[item.prop] }}</div>
            <img :src="imgs[item.img]" class="care-img" alt="" srcset="" />
          </div>
        </template>
      </div>
    </div>
    <div class="racks" v-if="Object.keys(shelfList).length">
      <template v-for="list in shelfList">
        <div class="racks-title" :key="`racks${list[0].rowNo}`">
          <span>
            {{ list[0].freightShelfId
            }}{{ overseaLangObj.goods_shelves("排货架") }} >
            {{ list[0].rowNo }} {{ overseaLangObj.c_column("层") }}
          </span>
        </div>
        <div :key="`racksVal${list[0].rowNo}`">
          <!-- v-for="i in shelfList[k]" :key="i" -->
          <template>
            <div class="racks-line">
              <div class="line-label">
                <template v-for="n in getLabelNum(list.length)">
                  <div :key="n">
                    <div class="top">
                      <div>工作单号</div>
                      <div>SKU</div>
                      <div>{{ overseaLangObj.sl_num || "数量" }}</div>
                    </div>
                    <div class="bottom">
                      {{ overseaLangObj.kw_location("库位数") }}
                    </div>
                  </div>
                </template>
              </div>
              <div class="line-box">
                <template v-for="(item, idx) in list">
                  <div
                    :key="`${item.no}_${item.code}_${idx}`"
                    :class="`box-item ${item.sku && 'is-active'}`"
                    :style="{
                      width: `${itemWidth}px`,
                    }"
                  >
                    <div class="top">
                      <div class="no-data" v-if="!item.sku">
                        {{ overseaLangObj.no_data("空") }}
                      </div>
                      <template v-else>
                        <div class="sku-txt">
                          <TooltipOver :content="item.orderSn" class="wid200" />
                        </div>
                        <div class="sku-txt">
                          <TooltipOver
                            :content="item.sku"
                            class="wid200"
                            refName="tooltipOver"
                          />
                        </div>
                        <div>{{ item.num }}</div>
                      </template>
                    </div>
                    <div class="bottom">{{ item.code }}</div>
                  </div>
                </template>
              </div>
            </div>
          </template>
        </div>
      </template>
    </div>
    <div v-else>
      <div class="racks-empty">
        <img :src="noDataImg" alt="" srcset="" width="150px" />
        <div>
          {{ overseaLangObj.no_data("暂无排货架数据") }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { getPartitionList, getWarehouseShelfList } from "@/api/warehouse/basic";
import {
  getLocationInfoList,
  getLocationTotalList,
} from "@/api/goodsShelf/cabinetRack";
import { getWarehouseListByDeptId } from "@/api/system/dept";
// import { getPrivateWarehouseList } from "@/api/common";
import {
  warehouse,
  warehousePartition,
  warehouseTray,
  careList,
} from "./model";
import racksTotalImg from "@/assets/image/racks_total.png";
import usageImg from "@/assets/image/usage.png";
import idleNumImg from "@/assets/image/idle_num.png";
import noDataImg from "@/assets/image/noData.png";
export default {
  name: "CabinetRackManage",
  components: {
    ComDetailTop: () => import("_comp/ComDetailTop"),
    ComForm: () => import("_comp/ComForm"),
    TooltipOver: () => import("_comp/TooltipOver"),
  },
  data() {
    return {
      noDataImg,
      imgs: {
        racksTotalImg,
        usageImg,
        idleNumImg,
      },
      careList,
      formData: {
        racksTotal: 0,
        usage: 0,
        idleNum: 0,
      },
      searchFromData: {},
      searchFormConfig: {
        formModel: {}, // 表单数据
        size: "small",
        labelWidth: "70px",
        lists: [
          {
            className: "search-form-width",
            fieldList: [
              {
                rows: [
                  {
                    cols: [
                      {
                        ...warehouse,
                        handle: this.handleWarehouse,
                        httpRequest: this.httpWarehouse,
                      },
                      {
                        ...warehousePartition,
                        handle: this.handlePartition,
                        httpRequest: this.httpPartition,
                      },
                      {
                        ...warehouseTray,
                        handle: this.handleWarehouseTray,
                        httpRequest: this.httpWarehouseTray,
                      },
                      {
                        span: 8,
                        id: "useStatus",
                        label: `库位状态：`,
                        placeholder: "请选择",
                        type: "select",
                        basicType: "kwUsageStatus",
                        handle: (val) => {
                          this.usageStatus = val;
                          this.handleWarehouseTray(
                            this.tempObj.freightShelfId,
                            this.tempObj.warehouseId,
                            this.tempObj.warehousePartitionId,
                            val
                          );
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ], // 表单渲染列表
        formRules: {}, // 表单校验规则
      },
      warehouseList: {},
      partitionList: {},
      warehouseShelfList: {},
      myFormShow: false,
      currPage: {
        pageNum: 1,
        pageSize: 9999,
      },
      shelfList: {},
      tempObj: {}, // 临时数据
      itemWidth: 116,
      usageStatus: "2",
    };
  },
  mounted() {
    // console.log(this.$refs.container);
    this.getItemWidth();
    window.onresize = this.getItemWidth;
    this.getFormList();
  },
  beforeDestroy() {
    window.onresize = null;
  },
  methods: {
    // 获取货架总计
    getTotal({ warehouseId, freightShelfId, warehousePartitionId }) {
      if (!warehouseId || !warehousePartitionId) {
        this.formData = {
          racksTotal: 0,
          usage: 0,
          idleNum: 0,
        };
        return;
      }
      getLocationTotalList({
        warehouseId,
        partitionId: warehousePartitionId,
        freightShelfId,
      }).then((res) => {
        const { total = 0, use = 0, unUse = 0 } = res.data || {};
        this.formData = {
          racksTotal: total,
          usage: use,
          idleNum: unUse,
        };
      });
    },
    // 根据页面可视宽度调整样式
    getItemWidth() {
      const width = this.$refs.container.clientWidth - 30 - 52;
      const num = Math.floor(width / 122);
      this.lineNum = num;
      this.itemWidth = width / num - 6;
      const cols = this.searchFormConfig.lists[0].fieldList[0].rows[0].cols;
      if (width < 1000) {
        this.searchFormConfig.lists[0].fieldList[0].rows[0].cols = cols.map(
          (item, index) => ({
            ...item,
            span: 12,
            labelWidth: index !== 1 ? "70px" : "50px",
            className: index !== 2 ? "margin-bottom-10" : "margin-bottom-0",
          })
        );
      } else {
        this.searchFormConfig.lists[0].fieldList[0].rows[0].cols = cols.map(
          (item, index) => ({
            ...item,
            span: 8,
            labelWidth: [0, 3].includes(index) ? "70px" : "50px",
            className: [0].includes(index)
              ? "margin-bottom-10"
              : "margin-bottom-0",
          })
        );
      }
    },
    // 获取一层获取有几行
    getLabelNum(num) {
      return Math.ceil(num / this.lineNum);
    },
    // 获取配置设置样式
    getBgStyle(item) {
      return {
        color: item.color,
        background: `${item.background || item.color}26`,
        boxShadow: `0px 0px 9px 0px ${item.background || item.color}1A`,
      };
    },
    // 初始化货架筛选框默认第一条
    async getFormList() {
      const { pageNum, pageSize } = this.currPage;
      // const platformTypeList = "2";
      // this.warehouseList = await getPrivateWarehouseList(
      //   { pageNum, pageSize, statusList: "1" },
      //   platformTypeList
      // );
      this.warehouseList = await getWarehouseListByDeptId({
        pageNum,
        pageSize,
      });
      const { warehouseMainId } =
        (this.warehouseList.rows && this.warehouseList.rows[0]) || {};
      await this.handleWarehouse(warehouseMainId, true);
      const { id } =
        (this.partitionList.rows && this.partitionList.rows[0]) || {};
      const shelfId =
        (this.warehouseShelfList.rows && this.warehouseShelfList.rows[0]) || "";
      this.myFormShow = true;
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.myForm.setFormModel({
            warehouseId: warehouseMainId,
            warehousePartitionId: id,
            shelfId,
          });
          console.log(this.$refs.myForm);
        });
      });
    },
    // 当前位置下拉框数据
    httpWarehouse() {
      return new Promise((resolve) => {
        resolve(this.warehouseList);
      });
    },
    // 区域下拉框数据
    httpPartition() {
      return new Promise((resolve) => {
        resolve(this.partitionList);
      });
    },
    // 货架下来数据
    httpWarehouseTray() {
      return new Promise((resolve) => {
        resolve(this.warehouseShelfList);
      });
    },
    // 切换当前位置
    async handleWarehouse(warehouseId, type) {
      const { pageNum, pageSize } = this.currPage;
      this.partitionList = await getPartitionList({
        warehouseId,
        pageNum,
        pageSize,
        statusSearch: 1,
      });
      const { id = "" } =
        (this.partitionList.rows && this.partitionList.rows[0]) || {};
      await this.handlePartition(id, warehouseId, true);
      if (!type) {
        const shelfId =
          (this.warehouseShelfList.rows && this.warehouseShelfList.rows[0]) ||
          "";
        this.$refs.myForm.setFormModel({
          warehousePartitionId: id,
          shelfId,
        });
      }
      this.searchFormConfig.lists[0].fieldList[0].rows[0].cols[1].refreshRequest =
        !this.searchFormConfig.lists[0].fieldList[0].rows[0].cols[1]
          .refreshRequest;
    },
    // 切换区域
    async handlePartition(warehousePartitionId, warehouseId, type) {
      const { pageNum, pageSize } = this.currPage;
      let res = {};
      if (warehousePartitionId) {
        res = await getWarehouseShelfList({
          pageNum,
          pageSize,
          warehouseId,
          warehousePartitionId,
        });
      }
      this.warehouseShelfList = {
        total: (res.data || res.rows || []).length,
        rows: res.data || res.rows || [],
      };
      const shelfId =
        (this.warehouseShelfList.rows && this.warehouseShelfList.rows[0]) || "";
      if (!type) {
        this.$refs.myForm.setFormModel({
          shelfId,
        });
      }
      this.handleWarehouseTray(shelfId, warehouseId, warehousePartitionId);
      this.searchFormConfig.lists[0].fieldList[0].rows[0].cols[2].refreshRequest =
        !this.searchFormConfig.lists[0].fieldList[0].rows[0].cols[2]
          .refreshRequest;
      return this.warehouseShelfList;
    },
    // 切换货架
    handleWarehouseTray(
      freightShelfId,
      warehouseId,
      warehousePartitionId,
      uStatus
    ) {
      this.tempObj = {
        freightShelfId,
        warehouseId,
        warehousePartitionId,
      };
      if (!freightShelfId) {
        this.shelfList = {};
        this.getTotal({});
        return;
      }
      if (!warehouseId || !warehousePartitionId) {
        const data =
          (this.$refs.myForm && this.$refs.myForm.getFormParams()) || {};
        warehouseId = data.warehouseId;
        warehousePartitionId = data.warehousePartitionId;
      }
      getLocationInfoList({
        warehouseId,
        freightShelfId,
        warehousePartitionId,
        usageStatus: uStatus || this.usageStatus || "2",
      }).then((res) => {
        this.shelfList = res.data;
      });
      if (["0", "1", "2"].includes(uStatus)) {
        // 切换状态不改变总数
        return;
      }
      this.getTotal({ warehouseId, freightShelfId, warehousePartitionId });
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
  created() {
    this["dictionary/getDictionary"](["kwUsageStatus"]).then(() => {
      // this.showSearchForm = true;
    });
  },
  activated() {
    if (this.tempObj.freightShelfId) {
      this.handleWarehouseTray(
        this.tempObj.freightShelfId,
        this.tempObj.warehouseId,
        this.tempObj.warehousePartitionId
      );
    }
  },
};
</script>

<style lang="scss" scoped>
.app-content-container {
  .total-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 20px;
    .search-form {
      max-width: 800px;
      margin-right: 20px;
      /deep/ .el-form-item--small.margin-bottom-0 {
        margin-bottom: 0;
      }
      /deep/ .el-form-item--small.margin-bottom-10 {
        margin-bottom: 10px;
      }
    }
    .care {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .care-item {
        width: 190px;
        min-height: 77px;
        border-radius: 4px;
        padding: 13px 0 13px 25px;
        position: relative;

        &:not(:last-child) {
          margin-right: 20px;
        }

        .label {
          font-size: 14px;
          line-height: 20px;
        }
        .value {
          font-size: 22px;
          line-height: 30px;
        }
        .care-img {
          width: 43px;
          position: absolute;
          bottom: 2px;
          right: 5px;
        }
      }
    }
  }
  .racks {
    .racks-title {
      padding: 12px 0;
      background: #ffffff;
      box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      border: 1px solid rgba(81, 81, 81, 0.1);

      & > span {
        display: inline-block;
        font-size: 16px;
        font-weight: bold;
        line-height: 26px;
        border-left: 4px solid #515151;
        padding-left: 20px;
      }
    }
    .racks-line {
      display: flex;

      &:last-child {
        margin-bottom: 20px;
      }

      .top {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        line-height: 18px;
        flex: 1;
        & > div:not(:last-child) {
          margin-top: 2;
        }
        .sku-txt {
          width: 115px;
        }
      }
      .bottom {
        text-align: center;
        line-height: 30px;
        padding: 0 2px;
        background: rgba(255, 255, 255, 0.6);
      }

      .line-label {
        display: flex;
        flex-direction: column;

        & > div {
          display: flex;
          flex-direction: column;
          min-width: 52px;
          height: 100px;
          border-radius: 4px;
          margin-top: 5px;
          background: #8b8b8b;
          overflow: hidden;
        }
        .top {
          color: #fff;
        }
      }
      .line-box {
        width: 100%;
        .box-item {
          float: left;
          display: flex;
          flex-direction: column;
          width: 116px;
          height: 100px;
          border: 1px solid #53c88a;
          border-radius: 4px;
          margin-left: 6px;
          margin-top: 5px;
          background: rgba(83, 200, 138, 0.2);
          overflow: hidden;

          &.is-active {
            background: rgba(102, 165, 255, 0.2);
            border: 1px solid #5094ff;

            .top {
              color: #5094ff;
            }
          }

          .top {
            color: #53c88a;
          }
        }
      }
    }
  }
  .racks-empty {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, calc(-50% + 28px));
    text-align: center;
    line-height: 20px;
    color: #979797;
    img {
      padding: 30px 0 14px;
    }
    div {
      padding-bottom: 30px;
    }
  }
}
</style>
