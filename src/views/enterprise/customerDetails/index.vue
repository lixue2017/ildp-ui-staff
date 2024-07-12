<template>
  <div
    class="cust-details"
    v-if="Object.keys(custInfo).length && Object.keys(showInfo).length"
  >
    <!-- 客户详情 -->
    <ComDetailTop
      class="top-titles"
      :title="detailsType[listType].title"
      :formModel="custInfo"
      @handleClick="handleTopClick"
    />
    <div class="content-flex">
      <div class="order-left">
        <el-card>
          <div class="basic-info">
            <div class="pics-box table-preview-image">
              <el-image
                :src="custInfo.logoUrl || customerLogo"
                :preview-src-list="[custInfo.logoUrl || customerLogo]"
              />
            </div>
            <div class="info-content">
              <ComForm
                ref="titleInfoForm"
                :formConfig="titleInfoForm"
                :dictionary="dictionary.dicsData"
                v-if="Object.keys(dictionary.dicsData).length"
              >
                <template v-slot:title>
                  <span class="content-title">{{
                    ` ${custInfo.shortName}(${custInfo.code})`
                  }}</span>
                  <span class="identify identify-blue" v-if="custInfo.level">{{
                    `${getDictObj(level, custInfo.level)}等级`
                  }}</span>
                  <span
                    class="identify identify-blue"
                    v-for="item in custInfo.clientIdentityList || []"
                    :key="item"
                    >{{ `${getDictObj(clientIdentity, item)}` }}</span
                  >
                  <span
                    class="identify identify-green"
                    v-if="showInfo.customerBusinessBicenseStatus"
                    >√营业执照</span
                  >
                  <span
                    class="identify identify-green"
                    v-if="showInfo.customerContractStatus"
                    >√合同</span
                  >
                </template>
              </ComForm>
            </div>
            <div class="tags-ui-btn">
              <!-- 待审核状态不显示编辑 -->
              <el-button
                size="small"
                v-if="custInfo.status != 1"
                class="tabs-change is-plain"
                @click="
                  handleUpdate({
                    ...custInfo,
                    ...custInfoExtend,
                    id: custInfo.id,
                  })
                "
                >编 辑</el-button
              >
            </div>
          </div>
        </el-card>
        <div class="main">
          <el-card class="main-left">
            <div
              :class="[
                'custom-tabs-btn',
                `${tabs.active != 1 ? 'border-none' : ''}`,
              ]"
            >
              <template v-for="item in tabs.columns">
                <el-button
                  size="small"
                  plain
                  :key="item.key"
                  v-if="item.showStatus.includes(listType)"
                  @click="changeTabs(item.key)"
                  class="tabs-change"
                  :type="tabs.active == item.key ? 'activation' : ''"
                  >{{ item.label }}</el-button
                >
              </template>
            </div>
            <div v-show="tabs.active === 1">
              <!-- <ModulsTitle title="基本信息" /> -->
              <div>
                <ComForm
                  ref="basicInfoForm"
                  :formConfig="basicInfoForm"
                  :dictionary="dictionary.dicsData"
                  v-if="Object.keys(dictionary.dicsData).length"
                />
              </div>
              <div v-if="['0', '2', '3'].includes(listType)">
                <div class="form-title">
                  <span> 客户费用方案(海外仓) </span>
                </div>
                <div>
                  <ComTable
                    ref="basicInfoTableRef"
                    :columnConfig="basicInfoTable.columnConfig"
                    :httpRequest="basicInfoTable.httpRequest"
                    :getQueryParams="basicInfoTable.getQueryParams"
                    @handleTableView="(row, item) => handleView(row, item)"
                    v-if="showSearchForm"
                  />
                </div>
              </div>
            </div>
            <div v-show="tabs.active === 2">
              <!-- 详情银行开票信息定位 -->
              <BankInvoice
                ref="bankTable"
                :formData="custInfo"
                @showConfirmDialog="showConfirmDialog"
                @handleDelete="handleDelete"
                v-if="showSearchForm"
              />
            </div>
            <div v-show="tabs.active === 3">
              <ComTable
                ref="contactsTable"
                :columnConfig="contactsTable.columnConfig"
                :httpRequest="contactsTable.httpRequest"
                :getQueryParams="getQueryParams"
              >
                <template v-slot:customRow="{ slotProps }">
                  <template v-if="slotProps.prop === 'isDefault'">
                    <el-button
                      v-if="slotProps.row.isDefault == '1'"
                      type="primary"
                      size="mini"
                      plain
                      >默认</el-button
                    >
                  </template>
                  <template v-if="slotProps.prop === 'gender'">
                    {{
                      slotProps.row.gender &&
                      (dicsListName(
                        dicsListParams("gender", slotProps.row.gender)
                      ) ||
                        "--")
                    }}
                  </template>
                  <template v-if="slotProps.prop === 'operation'">
                    <div class="operate-btn-list">
                      <div
                        class="btn"
                        v-for="(item, index) in contactsTable.btnList"
                        :key="index"
                      >
                        <el-button
                          :class="`operate-icon ${
                            item.info ? 'operate-icon-info' : ''
                          }`"
                          size="small"
                          type="text"
                          :icon="item.icon"
                          @click="item.handleClick(slotProps.row)"
                          >{{ item.text }}</el-button
                        >
                      </div>
                    </div>
                  </template>
                </template>
              </ComTable>
            </div>
            <div v-show="tabs.active === 4">
              <ComTable
                ref="addressTable"
                :columnConfig="addressTable.columnConfig"
                :httpRequest="addressTable.httpRequest"
                :getQueryParams="getQueryParams"
              >
                <template v-slot:customRow="{ slotProps }">
                  <template v-if="slotProps.prop === 'isDefault'">
                    <el-button
                      v-if="slotProps.row.isDefault == '1'"
                      type="primary"
                      size="mini"
                      plain
                      >默认</el-button
                    >
                  </template>
                  <template v-if="slotProps.prop === 'detailsAddr'">
                    {{
                      slotProps.row.province +
                      slotProps.row.city +
                      slotProps.row.area +
                      slotProps.row.street +
                      slotProps.row.detailsAddr
                    }}
                  </template>
                  <template v-if="slotProps.prop === 'operation'">
                    <div class="operate-btn-list">
                      <div
                        class="btn"
                        v-for="(item, index) in addressTable.btnList"
                        :key="index"
                      >
                        <el-button
                          :class="`operate-icon ${
                            item.info ? 'operate-icon-info' : ''
                          }`"
                          size="small"
                          type="text"
                          :icon="item.icon"
                          @click="item.handleClick(slotProps.row)"
                          >{{ item.text }}</el-button
                        >
                      </div>
                    </div>
                  </template>
                </template>
              </ComTable>
            </div>
            <div v-show="tabs.active === 5" class="attach-resource">
              <ComTable
                ref="attachTable"
                :columnConfig="attachTable.columnConfig"
                :httpRequest="attachTable.httpRequest"
                :getQueryParams="getQueryParams"
              >
                <template v-slot:customRow="{ slotProps }">
                  <template v-if="slotProps.prop === 'content'">
                    <ul class="attach-list">
                      <li>
                        <div class="pics-box table-preview-image">
                          <el-image
                            :src="handleFile(slotProps.row.filePath)"
                            :preview-src-list="[
                              handleFile(slotProps.row.filePath),
                            ]"
                          />
                        </div>
                        <div class="attach-content">
                          <el-row>
                            <div
                              @click="openUrl(slotProps.row)"
                              class="cursorPointer attach-file"
                            >
                              {{
                                `${slotProps.row.name}${slotProps.row.suffix}`
                              }}
                            </div>
                          </el-row>
                          <el-row>
                            <span class="conts">
                              {{
                                `${slotProps.row.fileSize}.${
                                  slotProps.row.createBy || "--"
                                }.${slotProps.row.createTime}`
                              }}
                            </span>
                            <span class="type">
                              类型：{{
                                getAttachType(slotProps.row.attentmentType)
                              }}
                            </span>
                          </el-row>
                        </div>
                      </li>
                    </ul>
                  </template>
                  <template v-if="slotProps.prop === 'operation'">
                    <div class="operate-btn-list">
                      <div
                        class="btn"
                        v-for="(item, index) in attachTable.btnList"
                        :key="index"
                      >
                        <el-button
                          :class="`operate-icon ${
                            item.info ? 'operate-icon-info' : ''
                          }`"
                          size="small"
                          type="text"
                          :icon="item.icon"
                          @click="item.handleClick(slotProps.row)"
                          >{{ item.text }}</el-button
                        >
                      </div>
                    </div>
                  </template>
                </template>
                <template v-slot:customHeader="{ slotProps }">
                  <template v-if="/content/.test(slotProps.column.prop)">
                    <div>{{ `${slotProps.column.label}` }}</div>
                  </template>
                </template>
              </ComTable>
            </div>

            <div v-if="tabs.active === 6">
              <BillLadingContact
                ref="billLadingContactRef"
                :billContactObj="{ customerId: this.$route.query.id }"
                @editMainContacts="
                  (row) => showConfirmDialog('mainContacts', row)
                "
              />
            </div>
            <div v-if="tabs.active === 7">
              <WalletInfo :formData="{ customerId: this.$route.query.id }" />
            </div>
            <div v-if="tabs.active === 10">
              <EnterpriseTableContract
                ref="contractTabRef"
                :billContactObj="{ customerId: custInfo.id }"
              />
            </div>
          </el-card>
        </div>
      </div>

      <div>
        <OperateSidebarCard>
          <template v-slot:slideCard>
            <el-card class="main-right">
              <div class="btn-list">
                <el-button
                  size="small"
                  class="login-client"
                  v-if="custInfo.relationUserId && showInfo.userStatus == '0'"
                  @click="goCustomer"
                >
                  登录客户端
                  <i class="iconfont quchaigui"></i>
                </el-button>
                <div>
                  <el-row>
                    <el-col :span="7">
                      <span class="stats-label">状态</span>
                    </el-col>
                    <el-col :span="17">
                      <el-button
                        v-if="/0|2/.test(custInfo.status)"
                        @click="submitAudit(custInfo.status)"
                        class="stats-text cursorPointer"
                      >
                        {{
                          getDictObj("customerStatus", custInfo.status) || "--"
                        }}
                      </el-button>
                      <span v-else class="stats-text stats-disabled">
                        {{
                          getDictObj("customerStatus", custInfo.status) || "--"
                        }}
                      </span>
                    </el-col>
                  </el-row>
                </div>
                <div class="btn-list-operationBtn">
                  <span v-if="getBtnShow(showInfo, custInfo).length"
                    >您可以操作</span
                  >
                  <el-row :gutter="12">
                    <el-col
                      :span="item.span"
                      v-for="(item, index) in getBtnShow(showInfo, custInfo)"
                      :key="index"
                    >
                      <el-row v-if="item.type == 'customUploadFile'">
                        <el-dropdown
                          @command="handleCommand"
                          trigger="click"
                          placement="bottom"
                        >
                          <el-button>
                            {{ item.label }}
                            <i class="el-icon-arrow-down el-icon--right"></i>
                          </el-button>
                          <el-dropdown-menu slot="dropdown">
                            <template v-for="fItem in fileTypeBtnArr()">
                              <el-dropdown-item
                                :key="fItem.value"
                                :command="fItem.value"
                                >{{ fItem.label }}</el-dropdown-item
                              >
                            </template>
                          </el-dropdown-menu>
                        </el-dropdown>
                        <ComUpload
                          style="display: none"
                          ref="dropdownUploadRef"
                          :uploadConfig="contractUploadConfig"
                          @handleSuccess="uploadSuccess"
                        />
                      </el-row>
                      <el-button
                        v-else
                        v-hasPermi="item.hasPermission"
                        @click="item.handleClick(showInfo, custInfo)"
                        >{{ item.label }}</el-button
                      >
                    </el-col>
                  </el-row>
                </div>
                <!-- <el-row>
            <el-button @click="$refs.myComLog.show()" class="cursorPointer"
              >操作日志</el-button
            >
                </el-row>-->
              </div>

              <div class="main-right-account">
                <div class="remark-tit">企业备注：</div>
                <TooltipOver
                  :content="basicInfoForm.formModel.remark"
                  :textLineClamp="6"
                  :showMoreTextBtn="true"
                />
              </div>

              <div class="main-right-account" v-if="listType === '2'">
                <!-- 客户身份才显示 -->
                <div class="account-info">
                  <span class="status">账号信息：</span>
                  <span
                    class="account-info-status"
                    :style="`color:${
                      getDictObj(accountStatus, showInfo.userStatus, false)
                        .color
                    };background-color:${
                      getDictObj(accountStatus, showInfo.userStatus, false)
                        .nameEn
                    }`"
                    >{{ getDictObj(accountStatus, showInfo.userStatus) }}</span
                  >
                </div>
                <div class="account-info">
                  <span class="title">登录账号：</span>
                  <span class="content">{{ custInfo.loginName || "--" }}</span>
                </div>
                <div class="account-info">
                  <span class="title">最后登录时间：</span>
                  <span class="content">{{ showInfo.updateTime || "--" }}</span>
                </div>
              </div>
              <div class="main-right-account">
                <div class="account-info">
                  <span class="title">客户归属：</span>
                  <span class="content">
                    {{ custInfo.businessOwnershipName || "--" }}
                  </span>
                </div>
                <div class="account-info">
                  <span class="title">负责员工：</span>
                  <span class="content">{{
                    custInfo.userNickName || "--"
                  }}</span>
                </div>
              </div>
            </el-card>
          </template>
        </OperateSidebarCard>
      </div>
    </div>

    <ConfirmDialog
      ref="confirmDialog"
      :dictionary="dictionary.dicsData"
    ></ConfirmDialog>
    <EditDrawer
      ref="editDrawer"
      @handleSuccess="editSuccess"
      :dictionary="dictionary.dicsData"
    />
    <ComplexDialog
      ref="complexDlgRef"
      @handleSuccess="billContactsRefreshTable"
      :dictionary="dictionary.dicsData"
    ></ComplexDialog>
    <ComLog ref="myComLog" :activities="activities">
      <template v-slot:title="slotProps">
        <span>{{ slotProps.activity.title }}</span>
      </template>
      <template v-slot:operationDate="slotProps">
        <span>
          {{ slotProps.activity.updateBy }} 操作于
          {{ slotProps.activity.updateTime }}
        </span>
      </template>
      <template v-slot:operationContent="slotProps">
        <span>
          {{ slotProps.activity.status && `[${slotProps.activity.status}]`
          }}{{ slotProps.activity.content }}
        </span>
      </template>
    </ComLog>

    <EnterpriseContract ref="contractRef" :fileData="custInfo" />
  </div>
</template>

<script>
import commonMixin from "@/utils/mixin";
import {
  basicInfoConfig,
  titleInfoConfig,
  custOrderConfig,
  bankInvoiceConfig,
  specialConfig,
  bankTableConfig,
  contactsTableConfig,
  addressTableConfig,
  attachTableConfig,
  basicInfoTableConfig,
} from "./model";
import {
  getCustomerDetail,
  getBankInfo,
  addBankInfo,
  editBankInfo,
  removeBankInfo,
  getContactsInfo,
  addContacts,
  editContacts,
  removeContacts,
  getAddressInfo,
  addAddress,
  editAddress,
  removeAddress,
  getAttachInfo,
  removeAttach,
  modifyCustStatus,
  resetPwd,
  changeAccountStatus,
  openAccount,
  getShowInfo,
  changeBelong,
  addMainContacts,
  updateMainContacts,
  POSTCustomerInfoLevelPage,
} from "@/api/customerManage/customerList.js";
import { FullscreenLoading } from "@/utils/loading.js";
import { mapActions, mapState } from "vuex";
import customerLogo from "@/assets/image/customer_logo.svg";
import productDefaultLogo from "@/assets/image/product_default.svg";
import { defaultTextParams } from "_comp/ComUpload/model";
import { download } from "@/utils/download";
import { hostLoginClient } from "@/utils/index";
import { msgBox } from "@/utils/confirmBox.js";
import { mixinEditCache } from "@/views/ComMixins/editPageCache.js";

export default {
  name: "CustDetails",
  mixins: [commonMixin, mixinEditCache],
  components: {
    ModulsTitle: () => import("@/components/ModulsTitle"),
    ComTable: () => import("_comp/ComTable"),
    ConfirmDialog: () => import("_comp/ConfirmDialog"),
    EditDrawer: () => import("../customerList/components/EditDrawer"),
    ComLog: () => import("_comp/ComLog"),
    ComUpload: () => import("_comp/ComUpload"),
    TooltipOver: () => import("_comp/TooltipOver"),
    OperateSidebarCard: () =>
      import("@/views/components/ComOperate/components/operateCard"),
    BillLadingContact: () => import("./billLadingContact.vue"),
    ComplexDialog: () => import("../components/complexDialog"), //复杂弹框，不复杂直接使用this.$refs.confirmDialog.handleFormDialog自定义弹窗
    WalletInfo: () => import("../components/walletInfo"),
    BankInvoice: () => import("../components/bankInvoice"),
    EnterpriseContract: () =>
      import("../components/enterpriseContract/index.vue"),
    EnterpriseTableContract: () =>
      import("../components/enterpriseContract/contractTable.vue"),
  },
  computed: {
    ...mapState({
      dictionary: (state) => state.dictionary,
      customer: (state) => state.customer,
      accountStatus: (state) => state.dictionary.dicsData.accountStatus,
      level: (state) => state.dictionary.dicsData.level,
      clientIdentity: (state) => state.dictionary.dicsData.clientIdentity,
    }),
    dicsListParams() {
      return (basicType, basicTypeVal) => {
        return {
          basicType,
          basicTypeVal,
        };
      };
    },
    dicsList() {
      return (params) => {
        const rowDics = params.basicTypeVal;
        const basicType = this.dictionary.dicsData[params.basicType];
        const hasBasicType = this.dictionary.dicsData && basicType;
        if (!hasBasicType)
          return {
            nameCn: "",
            color: "",
          };
        let arr = [];
        if (rowDics && rowDics.length > 1) arr = rowDics.split(",");
        else arr = [rowDics];
        const nameCnArr = [];
        const colorArr = [];
        const basicTypeObj = {};
        basicType.forEach((item) => {
          basicTypeObj[item.value] = item;
        });
        arr.forEach((_, index) => {
          if (basicTypeObj[arr[index]]) {
            nameCnArr.push(basicTypeObj[arr[index]].nameCn);
            colorArr.push(basicTypeObj[arr[index]].color);
          }
        });
        return {
          nameCn: nameCnArr.toString(),
          color: colorArr.toString(),
        };
      };
    },
    dicsListName() {
      return (params) => {
        return this.dicsList(params).nameCn;
      };
    },
  },
  data() {
    return {
      showSearchForm: true,
      customerLogo,
      fullscreenLoading: new FullscreenLoading(),
      custInfo: {},
      custInfoExtend: {},
      showInfo: {},
      tabs: {
        columns: [
          {
            label: "详 情",
            showStatus: ["2", "3", "0"],
            key: 1,
          },
          {
            label: "钱包信息",
            showStatus: ["2", "3", "0"],
            key: 7,
          },
          {
            label: "银行开票信息",
            showStatus: ["2", "3", "0", "9"],
            key: 2,
          },
          {
            label: "联系人信息",
            showStatus: ["2", "3"],
            key: 3,
          },
          {
            label: "地址信息",
            showStatus: ["2", "3"],
            key: 4,
          },
          {
            label: "合同信息",
            showStatus: ["2", "3"],
            key: 10,
          },
          {
            label: "附件资料",
            showStatus: ["2", "3", "0", "9"],
            key: 5,
          },
          {
            label: "提单联系人",
            showStatus: ["2", "3", "0"],
            key: 6,
          },
        ],
        active: 1,
      },
      detailsType: {
        //2-客户列表 3-服务商列表 0堡森列表 9员工列表
        2: {
          title: "客户详情",
          active: 1,
        },
        3: {
          title: "服务商详情",
          active: 1,
        },
        0: {
          title: "堡森详情",
          active: 1,
        },
        9: {
          title: "员工详情",
          active: 2,
        },
      },
      basicBtn: [
        //右侧的基本操作按钮，只有客户列表用status+userStatus判断，服务商，堡森，员工只用status判断
        //status(客户状态):  0-草稿  1-待审核  2-已驳回  3-正式
        //userStatus(账号状态) 0-已激活   1-未开通   2-禁用
        //2-客户   3-服务商   0-堡森  9-员工
        {
          label: "新增银行开票信息",
          span: 24,
          showLists: {
            2: ["00", "01", "02", "30", "31", "32", "20", "21", "22"], //客户
            3: ["0", "2", "3"], //服务商
            0: ["0", "2", "3"], //堡森
            9: ["0", "2", "3", "4", "5"], //员工
          },
          handleClick: () => {
            this.showConfirmDialog("bankAccount");
          },
        },
        {
          label: "新增提单联系人",
          span: 24,
          showLists: {
            2: ["00", "01", "02", "30", "31", "32", "20", "21", "22"], //客户
            3: ["0", "2", "3"], //服务商
            0: ["0", "2", "3"], //堡森
            9: [], //员工
          },
          handleClick: () => {
            this.showConfirmDialog("mainContacts");
          },
        },
        {
          label: "新增联系人",
          span: 12,
          showLists: {
            2: ["00", "01", "02", "30", "31", "32", "20", "21", "22"],
            3: ["0", "2", "3"],
            0: [],
            9: [],
          },
          handleClick: () => {
            this.showConfirmDialog("contacts");
          },
        },
        {
          label: "新增地址",
          span: 12,
          showLists: {
            2: ["00", "01", "02", "30", "31", "32", "20", "21", "22"],
            3: ["0", "2", "3"],
            0: [],
            9: [],
          },
          handleClick: () => {
            this.showConfirmDialog("contactAddress");
          },
        },
        {
          label: "开通账户",
          span: 24,
          showLists: {
            2: ["31"],
            3: [],
            0: [],
            9: [],
          },
          hasPermission: ["enterprise:customer:openAccount"],
          handleClick: (showInfo, custInfo) => {
            this.showConfirmDialog("openAccount", custInfo);
          },
        },
        {
          label: "禁用账号",
          span: 12,
          showLists: {
            2: ["30"],
            3: [],
            0: [],
            9: [],
          },
          handleClick: (showInfo, custInfo) => {
            // const { userStatus } = showInfo;
            this.changeActStatus(2);
          },
        },
        {
          label: "启用账号",
          span: 12,
          showLists: {
            2: ["32"],
            3: [],
            0: [],
            9: [],
          },
          handleClick: (showInfo, custInfo) => {
            this.changeActStatus(0);
          },
        },
        {
          label: "修改密码",
          span: 12,
          showLists: {
            2: ["30", "32"],
            3: [],
            0: [],
            9: [],
          },
          handleClick: (showInfo, custInfo) => {
            this.showConfirmDialog("resetPW", custInfo);
          },
        },
        {
          label: "更换客户归属",
          span: 24,
          showLists: {
            2: ["00", "01", "02", "30", "31", "32", "20", "21", "22"],
            3: [],
            0: ["0", "2", "3"],
            9: [],
          },
          handleClick: (showInfo, custInfo) => {
            this.showConfirmDialog("changeBelong", custInfo);
          },
        },
        {
          label: "新增合同信息",
          span: 24,
          showLists: {
            2: ["00", "01", "02", "20", "21", "22", "30", "31", "32"],
            3: ["0", "2", "3"],
            0: [],
            9: [],
          },
          handleClick: () => {
            this.$refs.contractRef?.handleCustomDialog(
              {},
              {
                successFn: () => {
                  // 新增后刷新列表
                  this.$refs.contractTabRef?.handleContractRefresh();
                },
              }
            );
          },
        },
        {
          label: "上传附件",
          type: "customUploadFile",
          span: 24,
          showLists: {
            2: ["00", "01", "02", "20", "21", "22", "30", "31", "32"],
            3: ["0", "2", "3"],
            0: ["0", "2", "3"],
            9: ["0", "2", "3", "4", "5"],
          },
        },
      ],
      basicInfoForm: basicInfoConfig(),
      titleInfoForm: titleInfoConfig(),
      // custOrderForm: custOrderConfig,
      // bankInvoiceForm: bankInvoiceConfig,
      // specialForm: specialConfig,
      // bankTable: {
      //   tableHeight: "calc(100vh - 324px)",
      //   columnConfig: bankTableConfig,
      //   httpRequest: getBankInfo,
      //   btnList: [
      //     {
      //       text: "修改",
      //       type: "edit",
      //       handleClick: (rows) => {
      //         this.showConfirmDialog("bankAccount", rows);
      //       },
      //     },
      //     {
      //       text: "删除",
      //       type: "delete",
      //       handleClick: (rows) => {
      //         this.handleDelete("bankAccount", rows.id);
      //       },
      //     },
      //   ],
      // },
      contactsTable: {
        tableHeight: "calc(100vh - 324px)",
        columnConfig: contactsTableConfig,
        httpRequest: getContactsInfo,
        btnList: [
          {
            text: "修改",
            type: "edit",
            handleClick: (rows) => {
              this.showConfirmDialog("contacts", rows);
            },
          },
          {
            text: "删除",
            type: "delete",
            handleClick: (rows) => {
              this.handleDelete("contacts", rows.id);
            },
          },
        ],
      },
      addressTable: {
        tableHeight: "calc(100vh - 324px)",
        columnConfig: addressTableConfig,
        httpRequest: getAddressInfo,
        btnList: [
          {
            text: "修改",
            type: "edit",
            handleClick: (rows) => {
              this.showConfirmDialog("contactAddress", rows);
            },
          },
          {
            text: "删除",
            type: "delete",
            handleClick: (rows) => {
              this.handleDelete("contactAddress", rows.id);
            },
          },
        ],
      },
      basicInfoTable: {
        tableHeight: "calc(100vh - 324px)",
        columnConfig: basicInfoTableConfig,
        httpRequest: POSTCustomerInfoLevelPage,
        getQueryParams: () => {
          return {
            customerId: this.$route.query.id,
          };
        },
      },
      attachTable: {
        tableHeight: "calc(100vh - 100px)",
        columnConfig: attachTableConfig,
        httpRequest: getAttachInfo,
        btnList: [
          {
            text: "删除",
            type: "delete",
            handleClick: (rows) => {
              this.handleDelete("attach", rows.id);
            },
          },
        ],
      },
      contractUploadConfig: {
        ...defaultTextParams,
        url: process.env.VUE_APP_BASE_API + "/crm/attach/fileUpload",
        name: "attachFile",
        showFileList: false,
        fileList: [],
        // accept: ".pdf,.rar,.zip,.jpg,.png",
        uploadData: {
          attentmentType: "",
          customerId: "",
        },
      },
      fileTypeArr: [
        {
          label: "合同资料",
          value: "customerContract",
        },
        {
          label: "营业执照",
          value: "customerBusinessBicense",
        },
        {
          label: "其他资料",
          value: "customerOther",
        },
      ],
      currentIndex: 0,
      activities: [
        {
          title: "装箱",
          updateBy: "TianYU",
          updateTime: "2021/12/30 18:46:08",
          status: "装箱",
          content: "FD-BST-211201-0002",
        },
        {
          title: "拣货",
          updateBy: "管理员",
          updateTime: "2021/12/30 18:46:08",
          status: "拣货",
          content: "FD-BST-211201-0002",
        },
        {
          title: "修改",
          updateBy: "test",
          updateTime: "2021/12/30 18:46:08",
          status: "",
          content: "添加FBA附件存仓换标交接表 BSNL21080046 39箱.xlsx",
        },
      ],
      listType: "",
    };
  },
  created() {},
  mounted() {},
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    mixinInitData() {
      const { id, listType } = this.$route.query;
      this.listType = listType; //用户身份可能因为后期修改而存在多个，从哪个列表进就展示哪个类型的详情
      if (!id) {
        this.reBack();
        return;
      }
      this["dictionary/getDictionary"]("custTypeEn").then(() => {
        this.contractUploadConfig.uploadData.customerId = id;
        this.tabs.active = 1;
        this.getDetails(id);
      });
    },
    handleFile(url) {
      if (
        url &&
        (url.includes(".jpg") || url.includes(".png") || url.includes(".jpeg"))
      ) {
        return url;
      }
      return productDefaultLogo;
    },
    getInfo(id) {
      getShowInfo(id).then((res) => {
        this.showInfo = res.data || {};
      });
    },
    getDetails(id) {
      this.fullscreenLoading.show();
      this.getInfo(id);
      getCustomerDetail(id)
        .then((res) => {
          const { customerInfo, customerInfoExtend } = res.data;
          if (customerInfo.clientIdentity) {
            customerInfo.clientIdentityList =
              customerInfo.clientIdentity.split(",");
          }
          this.custInfo = customerInfo || {};
          this.tabs.active = this.detailsType[this.listType].active;
          this.titleInfoForm = titleInfoConfig({
            type: this.listType,
          });
          this.basicInfoForm = basicInfoConfig({
            type: this.listType,
          });
          this.custInfoExtend = customerInfoExtend || {};
          this.basicInfoForm.formModel = {
            ...customerInfo,
            ...customerInfoExtend,
            remark: customerInfo.remark,
          };
          this.titleInfoForm.formModel = {
            ...customerInfo,
            ...customerInfoExtend,
            remark: customerInfo.remark,
          };
          this.$refs.basicInfoForm.setFormModel(this.basicInfoForm.formModel); //详情页编辑
          this.$refs.titleInfoForm.setFormModel(this.titleInfoForm.formModel); //详情页编辑
          this.showSearchForm = true;
          this.fullscreenLoading.close();
        })
        .catch((err) => {
          this.fullscreenLoading.hide();
        });
    },
    getQueryParams() {
      return {
        id: this.$route.query.id,
      };
    },
    mainContactsGetQueryParams() {
      return {
        customerId: this.$route.query.id,
      };
    },
    changeTabs(key) {
      this.tabs.active = key;
      if (key == 1 || key == 7) return;
      const refreshTable = {
        2: "bankTable",
        3: "contactsTable",
        4: "addressTable",
        5: "attachTable",
      };
      this.$nextTick(() => {
        this.$refs[refreshTable[key]] &&
          this.$refs[refreshTable[key]].refreshTable(true);
      });
    },
    refreshTable(type) {
      const refreshTable = {
        bankAccount: "bankTable",
        contacts: "contactsTable",
        contactAddress: "addressTable",
        attach: "attachTable",
      };
      this.$refs[refreshTable[type]].refreshTable(true);
    },
    billContactsRefreshTable() {
      this.$refs.billLadingContactRef?._mainContactsRefresh();
    },
    showConfirmDialog(type, rows = {}) {
      // console.log('showConfirmDialog=', rows, this.custInfo.nameCn);
      const reqs = {
        bankAccount: addBankInfo,
        contacts: addContacts,
        contactAddress: addAddress,
        mainContacts: addMainContacts,
      };
      const editReqs = {
        bankAccount: editBankInfo,
        contacts: editContacts,
        contactAddress: editAddress,
        resetPW: resetPwd,
        openAccount: openAccount,
        changeBelong: changeBelong,
        mainContacts: updateMainContacts,
      };
      const isEdit = Object.keys(rows).length;
      let formModel = {};
      if (type === "resetPW") {
        formModel = {
          userId: this.custInfo.relationUserId,
          loginName: rows.loginName,
          password: rows.password,
        };
      } else if (type === "openAccount") {
        formModel = {
          id: this.$route.query.id,
          loginName: rows.loginName,
          password: rows.password,
        };
      } else if (type === "changeBelong") {
        formModel = {
          id: this.$route.query.id,
          nameCn: rows.nameCn,
          businessOwnershipOld: rows.businessOwnership,
          nickName: rows.userNickName,
          userNickName: rows.userNickName,
          userId: rows.userId,
          businessOwnership: rows.businessOwnership,
          followUserId: rows.followUserId,
          businessOwnershipName: rows.businessOwnershipName,
        };
      } else {
        formModel = {
          ...rows,
          customerId: this.$route.query.id,
          dataStatus: 1,
          isDefault: !isEdit ? true : rows.isDefault == "1" ? true : false,
          isApplyInvoice: !isEdit
            ? true
            : rows.isApplyInvoice == 1
            ? true
            : false,
        };
      }
      if (type === "contactAddress") {
        // 新增地址公司默认值
        const { addresName } = rows;
        formModel.addresName = addresName ? addresName : this.custInfo.nameCn;
      }
      if (type == "mainContacts") {
        this.$refs.complexDlgRef.show(type, rows);
        return;
      }
      this.$refs.confirmDialog.handleFormDialog(type, {
        httpRequest: (formModel) => {
          let params = { ...formModel };
          params.isDefault = formModel.isDefault ? 1 : 0;
          params.isApplyInvoice = formModel.isApplyInvoice ? 1 : 0;
          if (isEdit) {
            return editReqs[type](params);
          }
          return reqs[type](params);
        },
        successMessage: "提交成功", // 成功提示
        successFunction: () => {
          if (/resetPW|openAccount|changeBelong/.test(type))
            return this.getDetails(this.$route.query.id);
          else {
            setTimeout(() => {
              return this.refreshTable(type);
            }, 500);
          }
        }, // 接口成功回调
        formModel,
      });
    },
    handleDelete(type, id) {
      const delReqs = {
        bankAccount: removeBankInfo,
        contacts: removeContacts,
        contactAddress: removeAddress,
        attach: removeAttach,
      };
      const msg = "删除操作不可逆！";
      const title = "删除提示";
      const className = "el-icon-warning text-warning";
      msgBox(
        this,
        { title, className, msg, showCancelButton: true },
        async () => {
          delReqs[type](id).then(() => {
            this.$message("删除成功");
            this.refreshTable(type);
          });
        }
      );
    },
    // 编辑客户
    handleUpdate(row) {
      const { id } = row;
      this.$refs.editDrawer.show({ id }, this.listType); //得有个TYPE区分企客户，服务商，堡森，员工
    },
    //启用禁用
    changeActStatus(status) {
      if (status == 2) {
        this.$refs.confirmDialog.disable().then(() => {
          changeAccountStatus({
            userId: this.custInfo.relationUserId,
            status,
          }).then(() => {
            this.$message.success(`禁用成功`);
            this.getDetails(this.$route.query.id);
          });
        });
      } else {
        changeAccountStatus({
          userId: this.custInfo.relationUserId,
          status,
        }).then(() => {
          this.$message.success(`启用成功`);
          this.getDetails(this.$route.query.id);
        });
      }
    },
    submitAudit() {
      this.$refs.confirmDialog.audit().then(() => {
        modifyCustStatus({ id: this.$route.query.id, status: 1 }).then(() => {
          this.$message.success("提交成功");
          this.getDetails(this.$route.query.id);
        });
      });
    },
    handleCommand(command) {
      this.contractUploadConfig.uploadData.attentmentType = command;
      this.$refs.dropdownUploadRef[0]?.handleUploadClick();
    },
    goCustomer() {
      hostLoginClient(this.custInfo.relationUserId);
    },
    uploadSuccess() {
      this.changeTabs(5);
    },
    editSuccess() {
      this.getDetails(this.$route.query.id);
    },
    openUrl(rows) {
      if (!rows.filePath) return;
      const isOpen = /.jpg|.jpeg|.png|.pdf/.test(rows.suffix);
      if (isOpen) {
        window.open(rows.filePath);
      } else {
        download(rows.filePath, `${rows.name}${rows.suffix}`);
      }
    },
    handleTopClick({ type, id }) {
      if (type === "pre" || type === "next") {
        this.showSearchForm = false;
        this.changeTabs(this.tabs.active);
        this.getDetails(id);
      }
    },
    getBtnShow(showInfo, custInfo) {
      //status(客户状态):  0-草稿  1-待审核  2-已驳回  3-正式
      //userStatus(账号状态) 0-已激活   1-未开通
      const { status } = custInfo;
      const { userStatus } = showInfo;
      const customerStatus = `${status}${userStatus}`;
      let nBtnArr = [];
      switch (this.listType) {
        //只有客户是通过status+userStatus来判断的，服务商，堡森，员工只通过status来判断
        case "2":
          nBtnArr = this.basicBtn.filter((e) =>
            e.showLists[this.listType].includes(customerStatus)
          );
          break;
        default:
          nBtnArr = this.basicBtn.filter((e) =>
            e.showLists[this.listType].includes(status)
          );
          break;
      }
      return nBtnArr;
    },
    handleView(row = {}, rItem) {
      const { cPageNoKey: path, cOrderIdKey } = rItem;
      const id = row[cOrderIdKey];
      this.$router.push({
        path,
        query: {
          id,
          backPath: this.$route.fullPath,
        },
      });
    },
    fileTypeBtnArr() {
      return this.fileTypeArr.filter((e) => e.value !== "customerContract");
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "~@/assets/styles/variables.scss";

@mixin center {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.cust-details {
  margin: 10px;
  font-size: 14px;
  color: #1f1f1f;
  background-color: #ffffff;
  // .el-card {
  //   height: auto;
  //   box-shadow: 0px 0px 4px 1px rgba(0, 0, 0, 0.1);
  //   border-radius: 2px;
  //   margin: 0 36px 20px;
  //   /deep/.el-card__body {
  //     padding: 20px;
  //   }
  // }
  .content-flex {
    display: flex;
    .order-left {
      min-width: 900px;
      flex: 0 1 100%;
    }
  }
  .el-card {
    height: auto;
    box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    border: 0px solid;
    padding-bottom: 25px;
    margin: 0 36px 1px;
    /deep/.el-card__body {
      padding: 0px;
    }
  }
  .basic-info {
    display: flex;
    justify-content: space-between;
    .pics-box {
      width: 140px;
      height: 140px;
      justify-content: center;
      .el-image {
        width: 140px;
        flex: 0 0 140px;
        height: 140px;
      }
    }
    .info-content {
      width: 100%;
      @include center();
      margin-left: 20px;
      .identify {
        padding: 3px 10px;
        margin-left: 20px;
        border-radius: 2px;
      }
      .identify-green {
        color: #35d06f;
        background: rgba($color: #eafaf0, $alpha: 1);
        border-radius: 12px;
      }
      .identify-blue {
        color: #66a5ff;
        background: rgba($color: #eff6ff, $alpha: 1);
        border-radius: 12px;
      }
      .identify-orange {
        color: #ff813d;
        border: 1px solid #ff813d;
        background: rgba($color: #ff813d, $alpha: 0.04);
      }
      .content-title {
        font-size: 14px;
        font-weight: bold;
        color: #515151;
      }
      .content-label {
        color: #8b8b8b;
        font-size: 13px;
        font-weight: 400;
        margin-top: 15px;
        span {
          color: #515151;
        }
      }
      /deep/ {
        .fix-height-32 {
          margin-bottom: 15px;
        }
      }
    }
    .tabs {
      margin-right: 20px;
    }
    .tags-ui-btn {
      border-bottom: 0px;
    }
    // .operate-content {
    //   width: 120px;
    //   @include center();
    //   align-items: flex-end;
    //   span {
    //     text-align: right;
    //   }
    //   .operate-content-btn {
    //     width: 60px;
    //   }
    // }
    .iconSize {
      font-size: 8px;
    }
  }
  .main {
    display: flex;
    /deep/.el-card__body {
      padding: 0px;
    }
    // .tabs {
    //   border-bottom: 1px solid #e2e2e2;
    //   padding-bottom: 20px;
    // }
    .border-none {
      border-bottom: none;
    }
    // }
    &-left {
      // margin-top: 20px;
      box-shadow: none;
      width: 100%;
      .tabs {
        margin-bottom: 25px;
      }
      .attach-list {
        li {
          height: 112px;
          display: flex;
          justify-content: flex-start;
          padding: 25px 15px;
        }
        .pics-box {
          width: 72px;
          height: 72px;
          margin-right: 20px;
          justify-content: center;
          .el-image {
            width: 72px;
            flex: 0 0 72px;
            height: 72px;
          }
        }
        .attach-content {
          @include center();
          .conts {
            display: inline-block;
            width: 350px;
          }
        }
        .attach-file:hover {
          // color: rgba(0, 173, 178, 0.1);
          color: rgba($color: #606060, $alpha: 0.6);
        }
      }
      /deep/.form-title {
        margin-bottom: 15px;
        border-left: 0px solid;
        font-size: 13px;
        font-weight: bold;
        color: #1f1f1f;
      }
      /deep/.border-bottom-solid {
        &::after {
          padding-top: 20px;
        }
      }
    }
    &-right {
      margin: 0;
      // width: 350px;
      // margin-left: 20px;
      // padding-bottom: 200px;
      // box-shadow: 0px 0px 12px 0px rgba(196, 196, 196, 0.33);
      .btn-list {
        // padding: 45px 15px 25px;
        .login-client {
          background: $text-btn-primary;
          color: #fff;
          .quchaigui {
            font-size: 12px;
          }
        }
        .el-button,
        .stats-disabled,
        .stats-label {
          // color: $text-btn-primary;
          font-size: 14px;
          width: 100%;
          height: 36px;
          display: inline-block;
          text-align: center;
          // border: 1px solid $text-btn-primary;
          border-radius: 4px;
          margin-top: 10px;
        }
        .el-dropdown {
          width: 100%;
        }
        .stats-label {
          background: $text-btn-primary;
          border-radius: 4px 0px 0px 4px;
          color: #fff;
          line-height: 36px;
        }
        .stats-text {
          border-radius: 0px 4px 4px 0px;
          font-size: 14px;
        }
        .stats-disabled {
          border: 1px solid $text-btn-primary;
          color: #525252;
          font-weight: bold;
          line-height: 36px;
        }
        &-operationBtn {
          margin: 25px 0;
          span {
            color: #1f1f1f;
            font-weight: bold;
            font-size: 13px;
          }
        }
      }
      .account-status {
        margin-left: 5px;
      }
      .account-info {
        font-size: 14px;
        margin-top: 20px;
        color: #1f1f1f;
        &:nth-child(1) {
          margin-top: 0px;
        }
        .title {
          display: inline-block;
          width: 98px;
          text-align: right;
          font-weight: 400;
          color: #8b8b8b;
          font-size: 13px;
        }
        .status {
          font-size: 13px;
          font-weight: bold;
          color: #1f1f1f;
        }
        .content {
          font-weight: 400;
          color: #515151;
          font-size: 13px;
        }
        &-status {
          font-size: 12px;
          border-radius: 12px;
          padding: 2px 13px;
        }
      }
      &-account {
        border-top: 1px solid #e2e2e2;
        padding: 25px 0px;
        margin: 0px 25px;
        .remark-tit {
          padding-bottom: 10px;
          font-size: 13px;
          font-weight: bold;
          color: #1f1f1f;
        }
      }
    }
    /deep/.el-form {
      margin-top: 15px;
      .el-form-item--small.el-form-item {
        margin-bottom: 0;
      }
      .el-form-item__label {
        font-size: 13px;
        font-weight: 400;
        color: #8b8b8b;
      }
    }
  }
  .el-divider--horizontal {
    margin: 20px 0;
  }
}
/deep/.text-uploader {
  .el-upload--text .upload-btn {
    color: #000;
    border: none;
    background: transparent;
    font-size: 14px;
  }
  // .el-upload__tip {
  //   display: none;
  // }
}
.disable-change {
  color: #7d7d7d;
}
</style>
