<template>
  <div
    :class="[
      'select-contacts',
      fieldItem.lastChild && 'lastChild',
      fieldItem.tagName &&
        !(contactsData && fieldItem.type === 'contacts') &&
        'padding-bottom-15',
    ]"
  >
    <div class="tag" v-if="fieldItem.tagName">{{ fieldItem.tagName }}</div>
    <div
      :class="['contacts-col', 'first-col', fieldItem.maxLine && 'maxWidth']"
    >
      <!-- fieldItem.maxLin=width:100% -->
      <template v-if="!fieldItem.disable">
        <div v-if="fieldItem.contactsNameKey" style="opacity: 0">--</div>
        <AutoComplete
          ref="autoCompleteRef"
          :formModel="formModel"
          :fieldItem="{
            ...fieldItem,
            isBackAll: true,
            showCreate: fieldItem.hideAdd ? false : true,
            httpRequest: getList,
            getCustomData,
            handle: handleSelect,
            handleCreate: handleCreate,
          }"
          defaultKey="id"
          v-else
        />
      </template>
      <div v-else-if="fieldItem.type === 'contacts'">
        <i class="el-icon-office-building"></i>
        <span>
          {{
            (formModel[fieldItem.id] && formModel[fieldItem.id].company) ||
            "--" ||
            fieldItem.placeholder
          }}
        </span>
      </div>
      <div v-else-if="fieldItem.type === 'fbaWarehouse'">
        {{
          formModel[fieldItem.id]
            ? `${formModel[fieldItem.id].code}/${formModel[fieldItem.id].name}`
            : fieldItem.placeholder
        }}
      </div>
      <div v-else>
        {{
          (formModel[fieldItem.id] &&
            `${
              formModel[fieldItem.id].warehouseCode ||
              formModel[fieldItem.id].code
            }[${
              dictionary.dicsData.warehouseType &&
              dictionary.dicsData.warehouseType[
                formModel[fieldItem.id].platformType ||
                  formModel[fieldItem.id].type
              ] &&
              dictionary.dicsData.warehouseType[
                formModel[fieldItem.id].platformType ||
                  formModel[fieldItem.id].type
              ].nameCn
            }]`) ||
          fieldItem.placeholder
        }}
      </div>
      <!-- <div
        class="contacts-phone"
        v-if="contactsData && fieldItem.type === 'contacts'"
      >
        <i class="el-icon-phone-outline"></i>
        <span>{{ contactsData.phone }}</span>
      </div> -->
      <div v-if="contactsData && fieldItem.type === 'contacts'">
        <i class="el-icon-location-outline"></i>
        <span>
          {{ `${contactsData.address}` }}
        </span>
      </div>
      <div
        class="contacts-phone"
        v-if="
          contactsData &&
          contactsData.cusContacts &&
          fieldItem.type === 'BLManage'
        "
      >
        <!-- 提单编辑 -->
        <div
          :class="[fieldItem.childrenRequiredClass]"
          style="margin-top: 10px"
        >
          <el-input
            placeholder="请输入公司"
            v-model="contactsData.cusContacts.company"
            maxlength="128"
            @change="
              (val) => {
                contactsData.cusContacts.company = val.trim();
              }
            "
          >
            <template slot="prepend">公司</template>
          </el-input>
        </div>
        <div class="contacts-phone-top contacts-addr">
          <div class="el-input-group__prepend">地址</div>
          <el-input
            type="textarea"
            :autosize="{
              minRows: 2,
              maxRows: 5,
            }"
            placeholder="请输入地址"
            v-model="contactsData.cusContacts.address"
            maxlength="255"
            resize="none"
          >
            <template slot="prepend">地址</template>
          </el-input>
        </div>
        <div
          class="contacts-phone-bottom"
          style="display: flex; margin-top: 10px"
        >
          <div style="margin-right: 10px">
            <el-input
              placeholder="请输入电话"
              v-model="contactsData.cusContacts.phone"
              maxlength="200"
            >
              <template slot="prepend">电话</template>
            </el-input>
          </div>
          <div>
            <el-input
              placeholder="请输入传真"
              v-model="contactsData.cusContacts.email"
              maxlength="50"
            >
              <template slot="prepend">传真</template>
            </el-input>
          </div>
        </div>
        <div>
          <slot
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
        <div class="contacts-phone-top" style="margin-top: 10px">
          <el-input
            placeholder="请输入其他补充"
            v-model="contactsData.cusContacts.otherDes"
            maxlength="200"
          >
            <template slot="prepend">其他</template>
          </el-input>
        </div>
      </div>
    </div>
    <div
      class="contacts-col flex-1"
      v-if="contactsData && fieldItem.type === 'contacts'"
    >
      <div :style="{ maxWidth: fieldItem.maxWidth || '320px' }">
        <i class="el-icon-phone-outline"></i>
        <span>{{
          `${contactsData.contacts || "--"}(${contactsData.phone || "--"})`
        }}</span>
      </div>
      <div
        class="clearance-select"
        v-if="
          fieldItem.showClearanceCustoms &&
          (!fieldItem.disable ||
            handleClearance(formModel.customsClearanceId).length)
        "
      >
        <span class="method-left">清关方式：</span>
        <el-select
          v-model="formModel.customsClearanceId"
          :multiple="true"
          collapse-tags
          placeholder="请选择清关方式"
          style="width: 100%"
          clearable
          v-if="!fieldItem.disable"
        >
          <el-option
            v-for="selectItem in clearanceCustoms"
            :key="selectItem.value"
            :label="selectItem.label"
            :value="selectItem.value"
          />
        </el-select>
        <template
          v-else-if="clearanceCustoms.length"
          v-for="item in handleClearance(formModel.customsClearanceId)"
        >
          <span class="clearance-content" :key="item.id">
            {{ item.name }}: {{ item.code }}
          </span>
        </template>
      </div>
    </div>
    <div
      class="contacts-col flex-1"
      v-if="contactsData && fieldItem.type === 'fbaWarehouse'"
    >
      <div :style="{ maxWidth: fieldItem.maxWidth || '500px' }">
        <i class="el-icon-location-outline"></i>
        <span>{{
          `${
            (contactsData.cusWarehouse && contactsData.cusWarehouse.address) ||
            contactsData.address
          }`
        }}</span>
      </div>
    </div>
    <!-- <div class="contacts-col" v-if="contactsData && !fieldItem.disable">
      <el-button
        type="primary"
        size="small"
        plain
        @click="handleUpLoad"
        v-if="fieldItem.showClearanceCustoms"
        >上传资料</el-button
      >
      <el-button
        type="primary"
        size="small"
        plain
        @click="handleEdit"
        v-if="!fieldItem.hideAdd"
        >编辑</el-button
      >
    </div> -->
    <AddContactsDialog
      appendToBody
      ref="addContacts"
      :paramObj="fieldItem.paramAddObj"
      @handleSuccess="handleSuccess"
    />
    <!-- <EditContactsDialog
      appendToBody
      ref="editContacts"
      @handleSuccess="handleSuccess"
    />
    <AddFbaWarehouseDialog
      appendToBody
      ref="addFbaWarehouse"
      @handleSuccess="handleSuccess"
    />
    <EditFbaWarehouseDialog
      appendToBody
      ref="editFbaWarehouse"
      @handleSuccess="handleSuccess"
    /> -->
    <ConfirmDialog ref="confirmDlgRef" />
  </div>
</template>

<script>
import {
  getCustomsClearance,
  addCustomsClearance,
} from "@/api/order/firstTransport.js";
import { mapState } from "vuex";
import { getPrivateWarehouseList, getContactsList } from "@/api/common";
import customer from "../../../../store/modules/customer";
import { customsClearanceMeansCols } from "@/views/components/ConfirmDialog/model.js";
const typeList = {
  contacts: {
    request: getContactsList,
    addFormName: "addContacts",
    editFormName: "editContacts",
  },
  fbaWarehouse: {
    request: getPrivateWarehouseList,
    addFormName: "addFbaWarehouse",
    editFormName: "editFbaWarehouse",
  },
  BLManage: {
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
  },
  components: {
    ConfirmDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
    AutoComplete: () => import("../AutoComplete"),
    TooltipOver: () => import("_comp/TooltipOver"),
    AddContactsDialog: () => import("_comp/ContactsDialog/AddDialog"),
    // EditContactsDialog: () =>
    //   import("@/views/basic/contacts/components/EditDialog"),
    // AddFbaWarehouseDialog: () => import("@/views/basic/fbaWarehouse/AddDialog"),
    // EditFbaWarehouseDialog: () =>
    //   import("@/views/basic/fbaWarehouse/EditDialog"),
  },
  data() {
    return {
      contactsData: "",
      clearanceCustoms: [],
      clearanceCustomsObj: {},
    };
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  mounted() {
    // console.log(this.fieldItem);
    this.contactsData = this.formModel[this.fieldItem.id];
    if (this.fieldItem.disable) {
      this.getCustomsClearance();
    }
  },
  methods: {
    getList(params) {
      let paramsObj = {
        name: params.name,
        pageNum: params.pageNum,
        pageSize: params.pageSize,
        dataStatus: 1, // 过滤已启用
      };
      if (this.fieldItem.type === "contacts") {
        paramsObj.contactsType = this.fieldItem.contactsType;
        paramsObj.orderSearch = params.name;
      }
      if (this.fieldItem.type === "BLManage") {
        paramsObj.contactsType = this.fieldItem.contactsType;
        paramsObj.overseas = this.fieldItem.overseas;
        paramsObj.orderSearch = params.name;
      }
      if (this.fieldItem.customerId) {
        paramsObj.customerId = this.fieldItem.customerId;
      }
      if (this.fieldItem.paramContactObj) {
        Object.assign(paramsObj, this.fieldItem.paramContactObj);
      }
      this.contactsData = this.formModel[this.fieldItem.id];
      return typeList[this.fieldItem.type]
        .request(paramsObj, this.fieldItem.platformType)
        .then((res) => {
          if (
            !this.formModel[this.fieldItem.id] &&
            res.rows &&
            res.rows.length &&
            !this.fieldItem.disable
          ) {
            this.contactsData = { ...res.rows[0] };
            this.formModel[this.fieldItem.id] = res.rows[0];
          } else {
            this.contactsData =
              this.contactsData || this.formModel[this.fieldItem.id];
          }
          // this.getCustomsClearance();
          this.$refs.ClearanceAutoComplete &&
            this.$refs.ClearanceAutoComplete.querySearchAsync();
          return res;
        });
    },
    getCustomsClearance(row = {}, additionalParam = {}) {
      const { clearanceTypes } = additionalParam;
      return new Promise((resolve) => {
        if (this.contactsData.id && this.fieldItem.showClearanceCustoms) {
          getCustomsClearance(this.contactsData.id, { clearanceTypes }).then(
            (res) => {
              const types = {};
              this.dictionary.dicsData.customsClearanceMode &&
                this.dictionary.dicsData.customsClearanceMode.forEach(
                  (item) => {
                    types[item.value] = item;
                  }
                );
              this.clearanceCustomsObj = {};
              this.clearanceCustoms = res.rows.map((item) => {
                const name = types[item.customsClearanceType]
                  ? types[item.customsClearanceType].nameCn
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
    handleClearance(ids) {
      if (ids.length && this.clearanceCustoms.length) {
        return ids.map((id) => this.clearanceCustomsObj[id]);
      } else {
        return [];
      }
    },
    handleOperation() {
      let dialogParams;
      if (this.fieldItem.type === "contacts") {
        dialogParams = {
          contactsType: this.fieldItem.contactsType,
        };
      }
      if (!this.contactsData.id) {
        this.$refs[typeList[this.fieldItem.type].addFormName].show(
          dialogParams
        );
      } else {
        this.$refs[typeList[this.fieldItem.type].editFormName].show(
          this.contactsData
        );
      }
    },
    handleCreate() {
      const { customerId = undefined } = this.formModel;
      let dialogParams = {
        contactsType: this.fieldItem.contactsType,
        customerId, //客户ID必传,收发通有做数据隔离需要绑定客户ID
      };
      // if (this.fieldItem.type === "contacts") {
      //   dialogParams = {
      //     contactsType: this.fieldItem.contactsType,
      //   };
      // }
      this.$refs[typeList[this.fieldItem.type].addFormName].show(dialogParams);
    },
    handleEdit() {
      this.$refs[typeList[this.fieldItem.type].editFormName].show(
        this.contactsData
      );
    },
    getData() {
      return this.contactsData;
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
      this.$refs.autoCompleteRef?.querySearchAsync();
      setTimeout(() => {
        this.handleSelect(params);
      }, 500);
    },
    getCustomData(item) {
      if (this.fieldItem.type === "fbaWarehouse") {
        return {
          key: item.id,
          label: `${item.warehouseCode}/${
            this.dictionary.dicsData.warehouseType[item.platformType].nameCn
          }`,
          value: item.id,
          title: `${item.warehouseCode}/${
            this.dictionary.dicsData.warehouseType[item.platformType].nameCn
          }`,
          subtitle: `${item.nation}/${item.address}`,
        };
      } else if (this.fieldItem.type === "BLManage") {
        return {
          label: `${
            item.cusContacts?.company ||
            `${item.cusContacts?.contacts}(${item.cusContacts?.phone})`
          }`,
          value: item.id,
          title: `${item.cusContacts?.company || "--"}/${
            item.cusContacts?.contacts
          }(${item.cusContacts?.phone})`,
          subtitle: `${item.cusContacts?.address}`,
        };
      }
      return {
        label: `${item.contacts}(${item.phone})`,
        value: item.id,
        title: `${item.contacts}(${item.phone})/${item.company}`,
        subtitle: `${item.countryName}/${item.province}/${item.city}/${item.detailsAddr}`,
      };
    },
    handleSelect(item) {
      // console.log(JSON.stringify(item));
      if (item) {
        this.contactsData = {
          ...item,
        };
      } else {
        this.contactsData = "";
      }
      this.formModel[this.fieldItem.id] = item || "";
      this.formModel.customsClearanceId = [];
      // this.getCustomsClearance();
      this.$emit("handleSelect", item ? { ...item } : "");
    },
    handleClearanceChange() {},
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
  display: flex;
  justify-content: space-between;
  padding-bottom: 25px;
  border-bottom: 1px solid #e2e2e2;
  position: relative;
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
  .contacts-phone .contacts-addr {
    display: flex;
    margin-top: 10px;
    .el-input-group__prepend {
      width: 57px;
      line-height: 48px;
    }
    /deep/ .el-textarea__inner {
      border-radius: 0px 4px 4px 0;
    }
  }
  .contacts-col {
    &:nth-child(1) {
      // width: 202px;
    }
    &:nth-child(3) {
      width: 150px;
      text-align: left;
    }
    /deep/ .clearance-select {
      span {
        color: #8b8b8b;
      }
      .el-select {
        width: 300px !important;
        vertical-align: middle;
      }
      .clearance-content {
        color: #515151;
      }
    }
    &.flex-1 {
      flex: 1;
      margin-left: 81px;
      margin-right: 30px;
      & > div {
        white-space: nowrap;
        overflow-x: auto;
        &.clearance-select {
          max-width: inherit;
          overflow: hidden;
        }
      }
      div::-webkit-scrollbar {
        height: 6px;
        width: 10px;
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
  .first-col {
    // width: 202px;
  }
  .maxWidth {
    width: 100%;
  }
  .tag {
    position: absolute;
    left: -57px;
    top: 32px;
    width: 48px;
    height: 17px;
    background: #ececec;
    border-radius: 2px;
    font-size: 12px;
    text-align: center;
    line-height: 17px;
  }
  .children-required {
    & > .el-input:before {
      content: "*";
      color: #fa7a7a;
      margin-right: 4px;
    }
  }
}
</style>
