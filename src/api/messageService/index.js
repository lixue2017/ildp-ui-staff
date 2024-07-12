import request from '@/utils/request'
// 消息记录查看列表
export function getMsgRecordList(data) {
  return request({
    url: '/msg/info/list',
    method: 'post',
    data
  })
}

// 获取消息配置列表
export function getConfigList() {
  return request({
    url: '/msg/config/get/configList',
    method: 'get'
  })
}

// 获取消息配置参数
export function getMsgModuleParamEnum(params) {
  return request({
    url: '/msg/param/get/MsgModuleParamEnum',
    method: 'get',
    params
  })
}

// 修改消息配置
export function updateConfig(data) {
  return request({
    url: '/msg/config/update',
    method: 'post',
    data
  })
}

// 消息类型列表
export function getTypeList(data) {
  return request({
    url: '/msg/type/list',
    method: 'post',
    data
  })
}

// 基础消息查看列表
export function getBaseMsgList(data = {}) {
  return request({
    url: '/msg/config/list',
    method: 'post',
    data
  })
}

// 消息设置已读
export function updateMsgInfo(data = {}) {
  return request({
    url: '/msg/info/update',
    method: 'post',
    data
  })
}

// 配置参数
export function getParamList(data = {}) {
  return request({
    url: '/msg/param/list',
    method: 'post',
    data
  })
}

// 邮件模板查看列表
export function getTemplateList(data) {
  return request({
		// url: '/msg/template/list',
		url: '/msgTemplate/page',
    method: 'post',
    data
  })
}

// 获取邮件模板参数
export function getMailTemplateEnum(params) {
  return request({
    url: '/msg/param/get/MailTemplateEnum',
    method: 'get',
    params
  })
}

// 获取邮件模板详情
export function getMailTemplateInfo(id) {
  return request({
    // url: '/msg/template/get/info',
		url: `/msgTemplate/info/${id}`,
    method: 'get',
  })
}

// 新增邮件模板
export function addMailTemplate(data) {
  return request({
    url: '/msg/template/add',
    method: 'post',
    data
  })
}

// 新增编辑消息邮件可选参数
export function getMsgParamEntity(data) {
  return request({
    url: '/msgParamEntity/page',
    method: 'post',
    data
  })
}

// 消息模板预览
export function previewMsgTemplate(data) {
  return request({
    url: '/msgTemplate/preview',
    method: 'post',
    data
  })
}


// 新增编辑消息邮件模板
export function postMsgTemplate(data) {
  return request({
    url: '/msgTemplate/sou',
    method: 'post',
    data
  })
}

// 修改邮件模板
export function updateMailTemplate(id) {
  return request({
    // url: '/msg/template/update',
		url: `/msgTemplate/enableDisable/${id}`,
    method: 'put',
    data: {}
  })
}

// 删除邮件模板
export function deleteMailTemplate(id) {
  return request({
    url: `/msg/template/${id}`,
    method: 'delete',
  })
}

// 获取邮件记录列表
export function getRecordList(data) {
  return request({
    // url: '/msg/record/list',
		url: '/msgEmailSendLog/page',
    method: 'post',
    data
  })
}

// 获取邮件记录详情
export function getRecordInfo(id) {
  return request({
		// url: '/msg/record/get/info',
		url: `/msgEmailSendLog/info/${id}`,
    method: 'get',
  })
}

// 发送邮件
export function sendMail(data) {
  return request({
    url: '/msg/mail/sendMail',
    method: 'post',
    data
  })
}

// 获取消息信息
export function getMailMsg(data) {
  return request({
		url: '/msgInfo/info',
		method: 'post',
		data
  })
}

// 发送邮件
export function postSendMail(data) {
  return request({
    url: '/emailSend/send',
    method: 'post',
    data
  })
}

// 获取消息未读个数
export function getUnreadCount() {
  return request({
    url: '/msg/info/getReadCount',
    method: 'get',
  })
}

// 获取配置模块参数
export function getMsgConfigModuleEnum() {
  return request({
    url: '/msg/param/get/MsgConfigModuleEnum',
    method: 'get',
  })
}
