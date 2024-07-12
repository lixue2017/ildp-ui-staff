export function handleDetailData(data) {
  const {
    deliveryClearanceOrderDeatail,
    directClearanceOrderDetail,
    warehouseOrderDetailVo,
  } = data;
  const { agentType, transportMode, pdo, pod } =
    directClearanceOrderDetail || {};
  if (agentType || agentType === 0)
    data.directClearanceOrderDetail.agentType = `${agentType}`;
  if (transportMode || transportMode === 0)
    data.directClearanceOrderDetail.transportMode = `${transportMode}`;
  if (pdo || pdo === 0)
    data.directClearanceOrderDetail.pdo = `${pdo}`;
  if (pod || pod === 0)
    data.directClearanceOrderDetail.pod = `${pod}`;

  const { delivertAgentType, isInsure } =
    deliveryClearanceOrderDeatail || {};
  if (delivertAgentType || delivertAgentType === 0)
    data.deliveryClearanceOrderDeatail.delivertAgentType = `${delivertAgentType}`;
  if (isInsure || isInsure === 0)
    data.deliveryClearanceOrderDeatail.isInsure = !!isInsure;
  const { packingMethod, warehouseSource } = warehouseOrderDetailVo || {};
  if (packingMethod || packingMethod === 0)
    data.warehouseOrderDetailVo.packingMethod = `${packingMethod}`;
  if (warehouseSource)
    data.warehouseOrderDetailVo.warehousingSource = warehouseSource.split(",");
  return data
}