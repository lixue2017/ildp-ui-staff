<template>
  <div
    :class="[
      'select-contacts',
      fieldItem.lastChild && 'lastChild',
      fieldItem.tagName &&
        !Object.keys(contactsData).length &&
        'padding-bottom-15',
    ]"
  >
    <div class="tag" v-if="fieldItem.tagName">{{ fieldItem.tagName }}</div>
    <div class="contacts-col">
      <AutoComplete
        ref="autoComplete"
        :formModel="contactsData"
        :fieldItem="{
          ...fieldItem,
          id: 'id',
          currData: true,
          showCreate: fieldItem.hideAdd ? false : true,
          httpRequest: getList,
          getCustomData,
          handle: handleSelect,
          isDisabled: fieldItem.isDisabled,
          isAutoInitRequest: true,
          handleCreate: handleCreate,
        }"
        defaultKey="id"
        v-if="!fieldItem.disable"
      />
      <div v-else>
        <TooltipOver
          :content="`${
            (formModel[fieldName] && (formModel[fieldName].company || '--')) ||
            fieldItem.placeholder
          }`"
          refName="tooltipOver"
          :style="{
            maxWidth: '100%',
          }"
        />
      </div>
      <div class="contacts-phone flex" v-if="Object.keys(contactsData).length">
        <i class="iconfont icon-dingwei"></i>
        <TooltipOver
          :content="`${contactsData.address}`"
          refName="tooltipOver"
          :style="{
            maxWidth: '100%',
          }"
        />
      </div>
    </div>
    <div
      class="contacts-col contacts-btn"
      v-if="Object.keys(contactsData).length && !fieldItem.disable"
    >
      <!-- <el-button
        type="primary"
        size="small"
        plain
        @click="handleUpLoad"
        v-if="fieldItem.showClearanceCustoms"
        >上传资料</el-button
      > -->
      <el-button
        type="text"
        size="small"
        @click="handleEdit"
        v-if="!fieldItem.hideAdd"
        >编辑</el-button
      >
    </div>
    <div
      class="contacts-col contacts-right"
      v-if="
        fieldItem.showClearanceCustoms &&
        (!fieldItem.disable || handleClearance(formModel.customsClearanceId))
      "
    >
      <slot
        v-if="Object.keys(contactsData).length"
        name="clearanceType"
        :request="{
          httpRequest: getCustomsClearance,
          getCustomData: getClearanceCustomData,
          handle: handleClearanceSelect,
          isDisabled: fieldItem.isDisabled,
          handleCreate: handleUpLoad,
        }"
      />
    </div>
    <AddContactsDialog
      appendToBody
      ref="addContacts"
      :paramObj="{
        customerId: userCustomerId,
      }"
      @handleSuccess="handleSuccess"
    />
    <EditContactsDialog
      appendToBody
      ref="editContacts"
      @handleSuccess="handleSuccess"
    />
    <!-- <ConfirmDialog ref="confirmDialog" /> -->
    <customDialog ref="confirmDlgRef" />
  </div>
</template>

<script>
import {
  getCustomsClearance,
  addCustomsClearance,
} from "@/api/order/firstTransport.js";
import { mapState } from "vuex";
import { getContactsList } from "@/api/common";
import { customsClearanceMeansCols } from "@/views/components/ConfirmDialog/model.js";
const typeList = {
  contacts: {
    id: "cusContactsId",
    cus: "cusContacts",
    request: getContactsList,
    addFormName: "addContacts",
    editFormName: "editContacts",
  },
};
export default {
  props: {
    fieldItem: {
      type: Object,
      default: () => {
        return {
          type: "contacts",
        };
      },
    },
    formModel: {
      type: Object,
      default: () => {},
    },
    fieldName: {
      type: String,
      default: "",
    },
    userCustomerId: {
      type: Number,
      default: null,
    },
  },
  components: {
    // ConfirmDialog: () => import("_comp/ConfirmDialog"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
    AddContactsDialog: () => import("_comp/ContactsDialog/AddDialog"),
    EditContactsDialog: () => import("_comp/ContactsDialog/EditDialog"),
    TooltipOver: () => import("_comp/TooltipOver"),
    customDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
  },
  data() {
    return {
      contactsData: {},
      clearanceCustoms: [],
      clearanceCustomsObj: {},
    };
  },
  watch: {
    userCustomerId(val) {
      this.contactsData.id = null;
      this.contactsRefreshRequest = !this.contactsRefreshRequest;
      if (this.fieldItem.showClearanceCustoms) {
        this.formModel.customsClearanceId = "";
        this.$refs.ClearanceAutoComplete?.querySearchAsync();
      }
    },
  },
  computed: {
    ...mapState({
      dictionary: (state) => state.dictionary,
    }),
  },
  mounted() {
    // console.log(this.formModel.customsClearanceId);
    // console.log(this.fieldItem);
    if (this.fieldItem.disable) {
      const data = this.formModel[this.fieldName];
      if (data) {
        this.contactsData = { ...data, ...this.getCustomData(data) };
      }
      this.getCustomsClearance();
    }
    this.types = {};
    this.dictionary.dicsData.customsClearanceMode &&
      this.dictionary.dicsData.customsClearanceMode.forEach((item) => {
        this.types[item.value] = item;
      });
  },
  methods: {
    getList(params) {
      let paramsObj = {
        pageNum: params.pageNum,
        pageSize: params.pageSize,
      };
      paramsObj.contactsType = this.fieldItem.contactsType;
      paramsObj.statusSearch = 1;
      paramsObj.orderSearch = params.name;
      paramsObj.customerId = this.userCustomerId; //收发通
      const { isCusDefault = true } = this.fieldItem; // 是否默认选中第一条
      return typeList[this.fieldItem.type]
        .request(paramsObj, this.fieldItem.platformType)
        .then((res) => {
          res.rows =
            res.rows &&
            res.rows.length &&
            res.rows.map((item) => ({
              ...(item[typeList[this.fieldItem.type].cus] || {}),
              ...item,
            }));
          if (!Object.keys(this.contactsData).length) {
            const data = this.formModel[this.fieldName];
            if (data) {
              this.contactsData = { ...data, ...this.getCustomData(data) };
            }
          }
          if (
            !Object.keys(this.contactsData).length &&
            res.rows &&
            res.rows.length &&
            !this.fieldItem.disable
          ) {
            if (isCusDefault) {
              this.contactsData = {
                ...res.rows[0],
                ...this.getCustomData(res.rows[0]),
              };
            }
          }
          this.$emit(
            "handleSelect",
            Object.keys(this.contactsData).length ? this.contactsData : "",
            true //第二个参数是否初始化
          );
          // this.getCustomsClearance();
          this.$refs.ClearanceAutoComplete &&
            this.$refs.ClearanceAutoComplete.querySearchAsync();
          return res;
        });
    },
    getCustomsClearance(row = {}, additionalParam = {}) {
      const { clearanceTypes } = additionalParam;
      return new Promise((resolve) => {
        if (this.contactsData.value && this.fieldItem.showClearanceCustoms) {
          getCustomsClearance(this.contactsData.value, clearanceTypes).then(
            (res) => {
              this.clearanceCustomsObj = {};
              this.clearanceCustoms = res.rows.map((item) => {
                const name = this.types[item.customsClearanceType]
                  ? this.types[item.customsClearanceType].nameCn
                  : "";
                this.clearanceCustomsObj[item.id] = {
                  ...item,
                  name,
                };
                return {
                  value: item.id,
                  label: `${item.code}[${name}]`,
                };
              });
              resolve(res);
            }
          );
        }
      });
    },
    handleClearance(ids) {
      let arr = [];
      if (ids.length && this.clearanceCustoms.length) {
        ids.forEach((id) => {
          const obj = this.clearanceCustomsObj[id];
          !obj.name && (obj.name = this.types[obj.customsClearanceType]);
          arr.push(`${obj.name}:${obj.code}`);
        });
        return arr.join(" ");
      } else {
        return "";
      }
    },
    getClearanceCustomData(item) {
      const types = {};
      this.dictionary.dicsData.customsClearanceMode &&
        this.dictionary.dicsData.customsClearanceMode.forEach((type) => {
          types[type.value] = type;
        });
      const name = types[item.customsClearanceType]
        ? types[item.customsClearanceType].nameCn
        : "";
      return {
        ...item,
        value: item.id,
        label: `${item.code}/${name || "--"}`,
      };
    },
    handleClearanceSelect(item) {
      console.log(item);
    },
    handleOperation() {
      let dialogParams;
      if (this.fieldItem.type === "contacts") {
        dialogParams = {
          contactsType: this.fieldItem.contactsType,
        };
      }
      if (!this.contactsData.id) {
        this.$refs[typeList[this.fieldItem.type].addFormName].show({
          ...dialogParams,
          customerId: this.userCustomerId,
        });
      } else {
        this.$refs[typeList[this.fieldItem.type].editFormName].show(
          this.contactsData
        );
      }
    },
    handleCreate() {
      let dialogParams;
      if (this.fieldItem.type === "contacts") {
        dialogParams = {
          contactsType: this.fieldItem.contactsType,
        };
      }
      this.$refs[typeList[this.fieldItem.type].addFormName].show({
        ...dialogParams,
        customerId: this.userCustomerId,
      });
    },
    handleEdit() {
      this.$refs[typeList[this.fieldItem.type].editFormName].show(
        this.contactsData
      );
    },
    handleSuccess(data = {}) {
      console.log("success==", data);
      let params = {};
      if (Object.keys(data).length) {
        const item = {
          ...(data[typeList[this.fieldItem.type].cus] || {}),
          ...data,
        };
        params = {
          ...item,
          ...this.getCustomData(item),
        };
      } else {
        params = data;
      }
      if (!params.address) {
        if (params.countryName && params.countryName.indexOf("中国") > -1) {
          params.address = `${params.countryName || ""} ${
            params.province || ""
          } ${params.city || ""} ${params.area || ""} ${
            params.detailsAddr || ""
          }`;
        } else {
          params.address = `${params.detailsAddr || ""} ${params.area || ""} ${
            params.city || ""
          } ${params.province || ""} ${params.countryName || ""}`;
        }
      }
      this.$set(this.contactsData, "id", params.company);
      this.$emit("handleSuccess", params);
      this.$refs.autoComplete?.querySearchAsync();
      setTimeout(() => {
        this.handleSelect(params);
      }, 500);
    },
    getCustomData(item) {
      return {
        label: `${
          item.company || `${item.contacts || "--"}(${item.phone || "--"})`
        }`,
        value: item.id,
        title: `${item.company || "--"}/${item.contacts || "--"}(${
          item.phone || "--"
        })`,
        subtitle: `${item.address}`,
      };
    },
    handleSelect(item) {
      console.log(item);
      if (item) {
        this.contactsData = {
          ...item,
        };
      } else {
        this.contactsData = {};
      }
      // this.getCustomsClearance();
      this.$emit("handleSelect", item ? { ...item } : "", false); //第二个参数是否初始化
      if (this.fieldItem.showClearanceCustoms) {
        this.formModel.customsClearanceId = "";
        this.$refs.ClearanceAutoComplete?.querySearchAsync();
      }
    },
    getData() {
      return this.contactsData;
    },
    handleUpLoad(row = {}, ref = "") {
      this.$refs.confirmDlgRef?.showCustomDialog({
        httpRequest: (formModel) => {
          return addCustomsClearance({
            ...formModel,
            cusContactsId: this.contactsData.id, // 上传清关资料使用联系人主表id
          });
        },
        successFunction: (res) => {
          if (ref == "ClearanceAutoComplete") {
            this.$refs[ref]?.querySearchAsync("", {
              addSelectVal: res?.data ? [res.data] : undefined,
            });
          } else {
            this.$emit("handleSuccessUpLoad", {
              ref,
              res,
            });
          }
        },
        customFormConfig: customsClearanceMeansCols({ ref }),
      });

      // this.$refs.confirmDialog.handleFormDialog("customsClearance", {
      //   httpRequest: (formModel) => {
      //     return addCustomsClearance({
      //       ...formModel,
      //       cusContactsId: this.contactsData.id, // 上传清关资料使用联系人主表id
      //     });
      //   },
      //   successMessage: "提交成功", // 成功提示
      //   successFunction: (res) => {
      //     // 默认选中新增数据
      //     if (ref == "ClearanceAutoComplete") {
      //       this.$refs[ref]?.querySearchAsync("", {
      //         addSelectVal: res?.data ? [res.data] : undefined,
      //       });
      //     } else {
      //       this.$emit("handleSuccessUpLoad", {
      //         ref,
      //       });
      //     }
      //   }, // 接口成功回调
      //   formModel: {},
      // });
    },
  },
};
</script>

<style lang="scss" scoped>
.select-contacts {
  width: calc(100%);
  display: flex;
  // justify-content: space-between;
  position: relative;
  .contacts-flex {
    display: flex;
    align-items: center;
  }
  &.lastChild {
    padding-bottom: 3px;
    border-bottom: 0px;
  }
  &.padding-bottom-15 {
    padding-bottom: 40px;

    &.lastChild {
      padding-bottom: 15px;
    }
  }
  .contacts-col {
    &:nth-child(1) {
      flex: 1;
      max-width: calc(100% - 38px);
    }
    &:nth-child(3) {
      // width: 150px;
      text-align: left;
    }
    &.contacts-btn {
      margin-left: 10px;
    }
    .contacts-phone {
      max-width: calc(50vw - 337px);
      margin-top: 8px;
    }
    /deep/ .clearance-select {
      display: flex;
      align-items: center;

      & > span {
        color: #8b8b8b;
      }
      .el-select {
        width: 300px !important;
        vertical-align: middle;
      }
      .clearance-content {
        width: calc(100% - 100px);
      }
      .method-left:before {
        content: "*";
        color: #ff6767;
        margin-right: 4px;
      }
    }
    &.contacts-right {
      width: calc(50% + 49px);
      padding-right: 38px;
      & > div {
        white-space: nowrap;
        overflow-x: auto;
        text-overflow: ellipsis;
        &.clearance-select {
          max-width: inherit;
          overflow: hidden;
        }
      }
      div::-webkit-scrollbar {
        height: 6px;
        width: 6px;
      }
    }
    i {
      color: #8b8b8b;
      font-size: 16px;
      margin-right: 8px;
    }
    span {
      color: #515151;
    }
  }
  .tag {
    position: absolute;
    left: -58px;
    top: 32px;
    width: 48px;
    height: 17px;
    background: #ececec;
    border-radius: 2px;
    font-size: 12px;
    text-align: center;
    line-height: 17px;
  }
  .clearance /deep/.el-select__tags {
    max-width: 180px !important;
    flex-wrap: nowrap;
  }
  .clearanceType-class {
    display: flex;
    span {
      text-align: right;
      margin-left: 20px;
      & + div {
        flex: 1;
      }
    }
    &:not(:first-child) {
      margin-top: 10px;
    }
  }
  .method-left:before {
    content: "*";
    color: #ff6767;
    margin-right: 4px;
  }
}
</style>
