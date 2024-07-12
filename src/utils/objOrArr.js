// 设置每个节点的全部子节点统计字段
export const toTreeNodeCount = (data = [], obj) => {
  const { childKey = "children", countField = "child_count" } = obj || {};
  return data.reduce((total, cur) => {
    return (
      total +
      (cur[countField] = toTreeNodeCount(cur[childKey] || [], countField))
    );
  }, data.length);
};

// 树状结构铺平
export const openFlatTree = (treeArr, obj) => {
  const { childKey = "children" } = obj || {};
  let arr = [];
  const expanded = (list, pid = 0) => {
    if (list && list.length > 0) {
      list.forEach((eItem, idx) => {
        const self_id = `${idx}_${pid}`;
        const which_layer = self_id.split("_").length - 1;
        arr.push({
          ...eItem,
          self_id,
          parent_id: pid,
          which_layer, // 表格层级
        });
        if (eItem[childKey]) {
          expanded(eItem[childKey], self_id);
        }
      });
    }
  };
  expanded(treeArr);
  let first_col_num = 0;
  // if (true) {
  //   arr.filter((f) => !e[childKey].length);
  // }
  return arr.map((e) => {
    delete e[childKey];
    if (e.which_layer === 1) {
      first_col_num += 1;
      e.first_col_num = first_col_num; // 第一列序号
    }
    return e;
  });
};

/**
 * 树状结构铺平后合并行
 * spanMethod({ row, column, rowIndex, columnIndex }) {
		if (columnIndex === 1) {
			if (row.which_layer === 1) {
				return {
					rowspan: row.child_count + 1,
					colspan: 1,
				};
			} else {
				return {
					rowspan: 0,
					colspan: 0,
				};
			}
		}
	},
 */

// 把扁平数组封装成树型结构
export const arrayToTree = (arr, obj) => {
  const {
    childKey = "children",
    self_id = "self_id",
    parent_id = "parent_id",
  } = obj || {};
  const rootItems = [];
  const lookup = {};

  for (const item of arr) {
    const itemId = item[self_id];
    const pId = item[parent_id];

    if (!lookup[itemId]) lookup[itemId] = { [childKey]: [] };
    lookup[itemId] = { ...item, [childKey]: lookup[itemId][childKey] };

    const parent = pId ? lookup[pId] : null;
    if (parent) {
      // 如果父项不存在，则添加到根项集合中
      if (!parent[childKey]) parent[childKey] = [];
      parent[childKey].push(lookup[itemId]);
    } else {
      rootItems.push(lookup[itemId]);
    }
  }
  return rootItems;
};

// 树形数组必填校验
export const validateTreeList = (treeArr, obj) => {
  const { childKey = "children", ruleMsg = {} } = obj || {};
  let checkObj = {};
  let oneIndex = 0;
  const expandedFn = (list, pid = 0) => {
    if (list && list.length > 0) {
      list.forEach((eItem, idx) => {
        const self_id = `${idx}_${pid}`;
        const which_layer = self_id.split("_").length - 1; // 树形数组层级
        if (which_layer === 1) {
          oneIndex = idx; // 最外层的下标
          if (!checkObj[oneIndex]) {
            checkObj[oneIndex] = [];
          }
        }
        const rLayerMsg = ruleMsg[which_layer];
        if (rLayerMsg) {
          for (let key in rLayerMsg) {
            if (!checkObj[oneIndex].includes(rLayerMsg[key])) {
              if (!eItem[key]) {
                checkObj[oneIndex].push(rLayerMsg[key]);
              }
            }
          }
        }

        if (eItem[childKey]) {
          expandedFn(eItem[childKey], self_id);
        }
      });
    }
  };
  expandedFn(treeArr);
  return checkObj;
};
