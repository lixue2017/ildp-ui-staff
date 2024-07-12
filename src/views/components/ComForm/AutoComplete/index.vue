<template>
  <div :class="[fieldItem.autoClassName]">
    <el-select
      ref="selectSearch"
      v-if="!fieldItem.noPaging"
      :class="['auto-search', 'el-icon-search', fieldItem.className]"
      v-model="formModel[fieldItem.selectLabelKey || fieldItem.id]"
      :multiple="fieldItem.multiple || false"
      :multiple-limit="fieldItem.multipleNum || 999"
      :disabled="fieldItem.disabled || false"
      :collapse-tags="fieldItem.collapseTags || false"
      filterable
      remote
      :allow-create="fieldItem.allowCreate"
      :clearable="!fieldItem.noClearable"
      reserve-keyword
      :loading="loading"
      :value-key="fieldItem.defaultKey || defaultKey"
      @visible-change="handleVisibleChange"
      @change="selectChange"
      @keyup.enter.native="enterChange"
      v-loadmore="() => querySearchAsync(querySearch, { isLoadMore: true })"
      :filter-method="(queryString) => querySearchAsync(queryString)"
      @focus="
        () => {
          fieldItem.focusLoad && querySearchAsync(querySearch);
        }
      "
      :size="fieldItem.size || 'small'"
      :placeholder="
        overseaLangObj.yu_yan_lang === 'en-us'
          ? 'Select'
          : fieldItem.placeholder
      "
    >
      <!-- <el-option
        v-for="item in searchOptions"
        :key="item[defaultKey]"
        :label="item.label"
        :value="fieldItem.isBackAll ? item : item.value"
        :class="[item.title && 'custom-option']"
        :disabled="item.disabled"
      > -->
      <el-option
        v-for="(item, index) in searchOptions"
        :key="`${index}_${item.value || 'x'}`"
        :label="item.label"
        :value="fieldItem.isBackAll ? item : item.value"
        :class="[
          item.title && 'custom-option',
          fieldItem.selectLabelKey && searchVal === item.value
            ? 'selected'
            : '',
        ]"
        :disabled="
          !!item[fieldItem.disabledKey || 'disabled'] ||
          (fieldItem.disabledArr
            ? fieldItem.disabledArr.includes(item.value)
            : false)
        "
      >
        <template v-if="item.title">
          <!-- v-if="fieldItem.selectTitWidth" -->
          <div class="title">
            <TooltipOver
              :content="item.title"
              :style="{ width: `${fieldItem.selectTitWidth || 370}px` }"
              refName="tooltipOverTit"
            />
          </div>
          <!-- <div class="title" v-else>{{ item.title }}</div> -->

          <div class="subtitle" v-if="item.subtitle">
            <TooltipOver
              :content="item.subtitle"
              :style="{ width: `${fieldItem.selectTxtWidth || 370}px` }"
              refName="tooltipOver"
            />
          </div>
          <template v-if="item.subtitleMultiline">
            <!-- 显示多行信息 -->
            <template v-for="(manyTitle, iMany) in item.subtitleMultiline">
              <div v-if="manyTitle" :key="iMany" class="subtitle">
                <TooltipOver
                  :content="manyTitle"
                  :style="{ width: `${fieldItem.selectTxtWidth || 370}px` }"
                  refName="tooltipOver"
                />
              </div>
            </template>
          </template>
        </template>
      </el-option>
      <el-option v-if="!searchOptions.length" disabled value="" class="no-data">
        <template>
          <div class="table-empty">
            <img :src="noDataImg" alt="" srcset="" width="58px" />
            <div class="text">暂无数据</div>
          </div>
        </template>
      </el-option>
      <div class="create-option" v-if="fieldItem.showCreate">
        <div>
          <el-button
            icon="el-icon-plus"
            size="small"
            type="primary"
            plain
            @click="fieldItem.handleCreate"
            >新增</el-button
          >
        </div>
      </div>
    </el-select>
    <el-select
      v-else
      :multiple="fieldItem.multiple || false"
      v-model="formModel[fieldItem.id]"
      :placeholder="
        overseaLangObj.yu_yan_lang === 'en-us'
          ? 'Select'
          : fieldItem.placeholder
      "
      @change="selectChange"
      :clearable="!fieldItem.noClearable"
      style="width: 100%"
      :size="fieldItem.size || 'small'"
    >
      <el-option
        v-for="item in searchOptions"
        :key="item.value"
        :label="item.label"
        :value="fieldItem.isBackAll ? item : item.value"
        :disabled="item.disabled"
      />
      <el-option v-if="!searchOptions.length" disabled value="" class="no-data">
        <template>
          <div>无数据</div>
        </template>
      </el-option>
      <div class="create-option" v-if="fieldItem.showCreate">
        <div>
          <el-button
            icon="el-icon-plus"
            size="small"
            type="primary"
            plain
            @click="fieldItem.handleCreate"
            >新增</el-button
          >
        </div>
      </div>
    </el-select>
    <template v-if="fieldItem.autoSlotRight">
      <slot :name="fieldItem.id" :formModel="formModel[fieldItem.id]" />
    </template>
  </div>
</template>

<script>
import { debounce } from "@/utils";
import { querySearchList } from "@/api/common";
import { mapState } from "vuex";
import noDataImg from "@/assets/image/noData.png";
const PAGE_SIZE = 998;
export default {
  props: {
    fieldItem: {
      type: Object,
      default: () => {},
    },
    formModel: {
      type: Object,
      default: () => {},
    },
    defaultKey: {
      type: String,
      default: "value",
    },
    selectValChangeObj: {
      type: Object,
      default: () => ({}),
    },
    additionalParam: {
      // 附加参数
      type: Object,
      default: () => ({}),
    },
    paramConfig: {
      // 返回附加参数
      type: Array,
      default: () => [],
    },
  },
  components: {
    TooltipOver: () => import("_comp/TooltipOver"),
  },
  watch: {
    "fieldItem.refreshRequest": function (val, oldVal) {
      this.querySearchAsync();
    },
    searchVal(nVal) {
      if (
        nVal &&
        this.selectValChangeObj[this.fieldItem.id] &&
        this.optParams !== PAGE_SIZE
      ) {
        // 父组件的ID改变，且不是全部分页时获取接口数据
        this.editSearchId = nVal;
        this.querySearchAsync();
      }
    },
  },
  computed: {
    ...mapState(["dictionary"]),
    searchVal() {
      const { id, isBackAll } = this.fieldItem;
      return isBackAll
        ? this.formModel[id]
          ? this.formModel[id][this.defaultKey]
          : null
        : this.formModel[id];
    },
  },
  data() {
    return {
      searchOptions: [],
      querySearch: "",
      searchPageNum: 1,
      searchTotal: -1,
      optParams: 10,
      loading: false,
      pagingLoading: false,
      noDataImg,
      editSearchId: undefined,
      isMountedRequest: true, // 初始化是否调接口获取数据
      searchOptionsObj: {},
    };
  },
  mounted() {
    // 编辑时定位可优化的点
    const {
      id,
      isBackAll,
      isDefaultSelectVal,
      isAutoInitRequest,
      selectLabelKey,
      multiple,
    } = this.fieldItem;
    if (isDefaultSelectVal && !this.formModel[id]) {
      this.querySearchAsync("", {
        isDefaultSelectVal, // 初始化是否默认选中项
        isCancelOldRequest: true, // 初始化数据不用终止上一个请求
      });
      return;
    }
    if (selectLabelKey) {
      // 无默认显示值时可统一使用 showSelectName_1 2 3 ... 表示
      // 如果回显的值不是ID，则不调接口，表格有fixed时table重复渲染导致多次调用接口。不传ID传名称可防止重复请求
      this.isMountedRequest = false;
      return;
    }
    this.editSearchId = isBackAll
      ? this.formModel[id]
        ? this.formModel[id][this.defaultKey]
        : null
      : this.formModel[id];
    if (typeof this.editSearchId === "string") {
      // 过滤传名称时接口报错 - 兼容之前把名称赋值给ID的显示方式
      this.editSearchId = undefined;
    }
    if (multiple) {
      // 多选默认空数组时初始化不调接口
      if (!this.editSearchId || !this.editSearchId.length) {
        this.editSearchId = undefined;
      }
    }
    if (this.editSearchId || isAutoInitRequest) {
      this.querySearchAsync("", {
        isCancelOldRequest: true, // 初始化数据不用终止上一个请求
      });
    } else {
      this.isMountedRequest = false;
    }
  },
  methods: {
    handleVisibleChange(show) {
      if (show) {
        if (this.editSearchId) {
          // 编辑时使用id搜索时需要重置一次
          this.editSearchId = undefined;
          if (this.fieldItem.searchIdKey) {
            this.isMountedRequest = true; // 防止聚焦时重复调用接口
            this.querySearchAsync();
          }
        } else {
          this.resetSearch();
        }
      } else {
        // this.searchResetEcho(); // 防止搜索后回显下标定位的值
      }
    },
    resetSearch() {
      if (this.querySearch || !this.isMountedRequest) {
        this.querySearch = "";
        this.isMountedRequest = true;
        this.querySearchAsync();
      }
    },
    selectChange(e = "") {
      // 此方法可用于父组件调用重置选中项后的回调
      const {
        id,
        handle,
        isBackAll,
        selectLabelKey,
        multiple,
        currData,
        selectEmitItem,
      } = this.fieldItem;
      if (selectLabelKey) {
        // 显示名称，另外赋值给ID，防止搜索中项后聚焦回显出ID
        if (e) {
          if (isBackAll) {
            this.formModel[selectLabelKey] = e.label;
          } else if (!multiple) {
            const selectObj =
              this.searchOptions.find((ele) => ele[this.defaultKey] === e) ||
              {};
            this.formModel[selectLabelKey] = selectObj.label;
          } else {
            this.formModel[selectLabelKey] = e;
          }
        } else {
          this.formModel[selectLabelKey] = "";
        }
      }
      if (this.paramConfig.length) {
        this.paramConfig.forEach((item) => {
          let key = "",
            formKey = "";
          if (typeof item === "string") {
            key = item;
            formKey = item;
          } else {
            key = item.key;
            formKey = item.formKey;
          }
          if (e) {
            this.formModel[formKey] = this.searchOptionsObj[e][key];
          } else {
            this.formModel[formKey] = "";
          }
        });
      }
      this.formModel[id] = e;
      // 先给ID赋值再执行回调
      if (selectEmitItem && !isBackAll) {
        // 选择ID时返回对象值
        const sObj =
          this.searchOptions.find((ele) => ele[this.defaultKey] === e) || {};
        handle && handle(currData ? this.searchOptionsObj[e] : e, sObj);
        return;
      }
      if(currData&&multiple){
        //既需要多选，又需要返回每一条多选数据的obj
        const sArr=(e||[]).map((ele)=>this.searchOptionsObj[ele])
        handle && handle(sArr);
        return;
      }
      handle && handle(currData ? this.searchOptionsObj[e] : e);
      this.$emit("selectHandleChange", currData ? this.searchOptionsObj[e] : e); // 仅在ComForm调用，其他页面不要调用
    },
    getCustomData(item, type) {
      const { defaultProp, spellType } = this.fieldItem;
      let value = item.id;
      let label =
        item.code || item.twoCode
          ? `${item.code || item.twoCode}/${item.name || item.nameCn}`
          : item.name || item.nameCn;
      if (defaultProp) {
        if (defaultProp.value) {
          let arr = defaultProp.value.split(",");
          if (arr.length === 1) {
            value = item[defaultProp.value];
          } else if (arr.length === 2) {
            value = `${item[arr[0]]}/${item[arr[1]]}`;
          }
        }
        if (defaultProp.label) {
          let arr = defaultProp.label.split(",");
          if (arr.length === 1) {
            label = item[defaultProp.label];
          } else if (arr.length === 2) {
            label =
              spellType == "kuohao"
                ? `${item[arr[0]]}(${item[arr[1]]})`
                : `${item[arr[0]]}/${item[arr[1]]}`;
          }
        }
      }
      let title = "";
      let subtitle = "";
      if (type === "goods") {
        title = `${item.nameCn}/${item.nameEn}`;
        subtitle = `${item.oneName}>${item.twoName}`;
        return {
          label,
          value,
          title,
          subtitle,
        };
      }
      return {
        value,
        label,
      };
    },
    querySearchAsync(queryString = "", paramObj) {
      const {
        isLoadMore,
        isCancelOldRequest,
        addSelectVal,
        isDefaultSelectVal,
      } = paramObj || {};
      const that = this;
      const {
        httpRequest,
        getCustomData,
        category,
        searchParamName = "nameCn",
        searchIdKey,
        autoPageSize = 10,
        searchIdPageSize = 1,
        id: itemId,
        isBackAll,
        basicType,
        basicTypeVal,
        multiple,
        isNoMatchClear,
        selectLabelKey,
      } = this.fieldItem;
      queryString = queryString
        .trim()
        .replace(/%/g, "\\%")
        .replace(/_/g, "\\_");
      this.querySearch = queryString;
      const getRequest = httpRequest || querySearchList;
      if (isLoadMore) {
        if (this.pagingLoading) {
          return;
        }
        if (this.searchTotal <= this.searchOptions.length) return;
        this.searchPageNum++;
        this.pagingLoading = true;
      } else {
        this.loading = true;
        this.searchPageNum = 1;
      }
      debounce(() => {
        let opt = {
          name: queryString,
          [searchParamName]: queryString,
          type: category,
          pageNum: this.searchPageNum,
          pageSize: this.editSearchId ? PAGE_SIZE : autoPageSize,
          webRequestSource: isCancelOldRequest ? undefined : "AutoComplete", // 请求来源
          ...this.additionalParam,
        };
        if (searchIdKey && (this.editSearchId || addSelectVal)) {
          opt[searchIdKey] = this.editSearchId || addSelectVal;
          opt.pageSize = this.fieldItem.multiple
            ? opt[searchIdKey].length
            : searchIdPageSize;
        }
        this.optParams = opt.pageSize;
        if (opt.type === undefined) {
          delete opt.type;
        }
        if (multiple && Array.isArray(opt.id)) {
          opt.ids = opt.id.join(",");
          opt.id = undefined;
        }
        getRequest(opt).then((res = {}) => {
          const nameInfo = res.rows || res.data || [];
          this.searchTotal = res.total || nameInfo.length;
          if (nameInfo.length) {
            nameInfo.forEach((item, index) => {
              const dictObj =
                basicType && basicTypeVal
                  ? this.getDictObj(
                      this.dictionary.dicsData[basicType],
                      item[basicTypeVal],
                      false
                    ) || {}
                  : {};
              nameInfo[index] = {
                ...item,
                ...(getCustomData
                  ? getCustomData(item, this.dictionary, dictObj)
                  : this.getCustomData(item, category, this.dictionary)),
              };
              this.searchOptionsObj[nameInfo[index][this.defaultKey]] =
                nameInfo[index];
            });
          }
          if (isLoadMore) {
            that.searchOptions.push(...nameInfo);
          } else {
            that.searchOptions = nameInfo;
          }
          this.fieldItem.getSearchOptions &&
            this.fieldItem.getSearchOptions(that.searchOptions);
          this.loading = false;
          this.pagingLoading = false;
          if (this.selectValChangeObj[itemId]) {
            this.searchResetEcho();
            this.$emit("loadSearchOptions", itemId);
          }

          if (isDefaultSelectVal) {
            this.selectChange(
              isBackAll ? that.searchOptions[0] : that.searchOptions[0]?.value
            );
            this.$emit("onDefaultSelect", that.searchOptions[0]);
          }
          if (
            isCancelOldRequest &&
            isNoMatchClear &&
            this.editSearchId &&
            !selectLabelKey
          ) {
            let selectArr = "";
            if (multiple) {
              selectArr = this.editSearchId.filter(
                (k) => this.searchOptionsObj[k]
              );
            } else if (this.searchOptionsObj[this.editSearchId]) {
              selectArr = this.searchOptionsObj[this.editSearchId];
            }
            this.$emit("clearNoMatch", selectArr);
          }
          if (addSelectVal) {
            let nSelectVal = "";
            if (isBackAll) {
              const addObj = this.searchOptions.find(
                (ele) => ele[this.defaultKey] === addSelectVal
              );
              if (addObj) {
                nSelectVal = this.fieldItem.multiple
                  ? [...(this.formModel[itemId] || []), addObj]
                  : addObj;
              }
            } else {
              // 下拉新增保存后默认选中新增的数据
              nSelectVal = this.fieldItem.multiple
                ? [...(this.formModel[itemId] || []), ...addSelectVal]
                : addSelectVal;
            }
            this.isMountedRequest = false;
            this.selectChange(nSelectVal);
          }
        });
      })();
    },
    searchResetEcho() {
      const { selectLabelKey, id } = this.fieldItem;
      const echoId = selectLabelKey || id;
      if (!this.formModel[echoId]) {
        return;
      }
      // 重新定位选中项，防止有过滤选择项时选中，再次选择时取消过滤条件获取数据后，直接失焦导致回显内容不一致
      const tempVal = JSON.parse(JSON.stringify(this.formModel[echoId]));
      this.formModel[echoId] = null;
      this.$nextTick(() => {
        this.formModel[echoId] = tempVal;
      });
    },
    changeFocusRequest(obj) {
      const { isDefaultChange } = obj || {};
      // 已调接口，改变接口参数后聚焦时再调接口
      if (this.searchTotal !== -1 || isDefaultChange) {
        this.isMountedRequest = false;
        this.editSearchId = undefined;
        this.selectChange();
      }
    },
    setLabel(row = {}) {
      const { label, placeholder } = row;
      this.$set(this.fieldItem, "label", label);
      this.$set(this.fieldItem, "placeholder", placeholder);
    },
    enterChange() {
      const { isBackAll, disabledArr = [] } = this.fieldItem;
      const oneRow = this.searchOptions[0];
      if (oneRow && !disabledArr.includes(oneRow.value)) {
        if (this.fieldItem.handleSelectEnter) {
          this.fieldItem.handleSelectEnter(oneRow);
        } else {
          const enSelectVal = isBackAll ? oneRow : oneRow?.value;
          this.selectChange(enSelectVal);
        }
        this.$refs.selectSearch?.blur();
      }
    },
  },
};
</script>
<style lang="scss">
.auto-search .el-input__suffix-inner .el-icon-circle-close {
  width: 60px;
}
</style>

<style lang="scss" scoped>
.auto-search {
  &.el-icon-search:before {
    position: absolute;
    z-index: 1;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #999;
  }
  &.auto-dis-no-icon {
    &:before {
      opacity: 0;
    }
  }
  &.auto-dis-search {
    /deep/ .is-disabled.el-input--suffix {
      .el-input__inner {
        cursor: not-allowed;
        background-color: #f9f9f9;
        border: 1px solid #bcbcbc;
        padding-right: 30px;
        padding-left: 15px;
        border-radius: 4px;
      }
    }
  }
}
.custom-option {
  &.selected {
    .subtitle {
      color: #5094ff;
      font-weight: 400;
    }
  }
  .all-tit-txt {
    max-width: 660px;
    word-break: break-all;
    white-space: normal;
  }
  .subtitle {
    font-size: 12px;
    opacity: 0.8;
  }
}
.el-select-dropdown__wrap {
  position: relative;
  .el-select-dropdown__list {
    padding-bottom: 50px;
  }
  .last-option {
    margin-bottom: 50px;
  }
  .no-data {
    text-align: center;
    height: auto;
  }
  .create-option {
    height: 50px;

    & > div {
      position: absolute;
      bottom: 0;
      z-index: 1000;
      width: 100%;
      height: 50px;
      background: #fff;
      padding: 0 15px;
    }

    button {
      width: 100%;
      margin: 10px 0;
    }
  }
  .el-select-dropdown__item {
    height: auto;
    line-height: 22px;
    padding: 5px 20px;
    max-width: 660px;
    /deep/ {
      & > span {
        // max-width: calc(100% - 30px);
        display: inline-block;
        word-break: break-all;
        white-space: normal;
      }
    }
  }
  .no-data.el-select-dropdown__item.hover,
  .no-data.el-select-dropdown__item:hover {
    background: #fff;
  }
  .table-empty {
    line-height: 20px;
    img {
      padding: 20px 0 5px;
    }
    .text {
      font-size: 12px;
      color: #dadada;
      padding-bottom: 15px;
    }
  }
}
.is-multiple {
  .el-select-dropdown__item {
    /deep/ {
      & > span {
        max-width: calc(100% - 30px);
      }
    }
  }
}
/deep/ {
  .el-select__tags {
    .el-tag.el-tag--info {
      height: auto;
      white-space: normal;
    }
  }
}
</style>
