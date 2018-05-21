var outsideConfig = window.CONFIG || {}; // 在html文件中配置
var config = {
  apiRoot: outsideConfig.apiRoot || 'http://140.207.233.95/smartx/webapi/service/',
  apiMeshRoot: outsideConfig.apiMeshRoot || 'http://140.207.233.95:8080/api/v1/',
  apiResourceRoot: outsideConfig.apiResourceRoot || 'http://140.207.233.95/smartx/webapi/resource/upload',
  language: outsideConfig.language || 'en'
};
/*var config = {
  apiRoot: outsideConfig.apiRoot || 'http://localhost/smartx/webapi/service/',
  apiMeshRoot: outsideConfig.apiMeshRoot || 'http://localhost:8080/api/v1/',
  apiResourceRoot: outsideConfig.apiResourceRoot || 'http://localhost/smartx/webapi/resource/upload',
  language: outsideConfig.language || 'en'
};*/
config.appCode = 'designer'

config.debug = false
config.api = {
  WebLogin: '/WebLogin/',
  WebFwSendValidateCode: '/WebFwSendValidateCode/',
  WebResetPassword: '/WebResetPassword/',
  WebGetUserInfo: '/WebGetUserInfo/',
  WebVerifyRegistion: '/WebVerifyRegistion/',
  WebVerifyRegistionAccept: '/WebVerifyRegistionAccept/',
  WebVerifyRegistionReject: '/WebVerifyRegistionReject/',
  WebUploadUserInfo: '/WebUploadUserInfo/',
  CellFwSendValidateCode: '/CellFwSendValidateCode/',
  WebGetDesigners: '/WebGetDesigners/',
  WebGetCompanys: '/WebGetCompanys/',
  WebUpdateCompany: '/WebUpdateCompany/',
  WebDeleteCompany: '/WebDeleteCompany/',
  WebDeleteDesigner: '/WebDeleteDesigner/',
  WebGetFeedBacks: '/WebGetFeedBacks/',
  WebGetAdvertisement:'/WebGetAdvertisement/',
  WebCreateAdvertisement:'/WebCreateAdvertisement/',
  WebGetRecruit:'/WebGetRecruit/',
  WebGetApplyByCompany:'/WebGetApplyByCompany/',
  WebVerifyApplyUsers:'/WebVerifyApplyUsers/',
  WebVerifyApply:'/WebVerifyApply/',
  WebVerifyApplyReject:'/WebVerifyApplyReject/',
  WebVerifyApplyAccept:'/WebVerifyApplyAccept/',
  WebStatistics: '/WebStatistics/',
  //=======================
}
config.meshApi = {
  webroot: '/webroot',
  nodes: "/nodes",
  binary: '/binary',
  background: "/background",
  workstationID: '7bdc5bc4549740249c5bc45497a024ac',
  workstation: '/workstation',
  search: '/search',
  imge: '/imge',
  languages: '/languages',
  published: '/published',
  schemas: '/schemas',
  activity: '/activity',
  news: '/news',
  Advert: '/Advert',
  image: '/image'
}
config.keys = {
  token: 'token',
  mesh_token: "mesh.token",
  mesh_user: "mesh.user",
  image_size: 1,
  image_type: ['jpeg', 'png'],
  edit_image_size:0,
}

config.check = {
  accept: {key: "accept", value: '通过'},
  reject: {key: "reject", value: '未通过'},
  verifing: {key: "verifing", value: '待审核'},
  upload: {key: "upload", value: '注册用户'},
  locked: {key: 'locked', value: '锁定'}
}
config.nature = {
  user: {key: "user", value: '个人'},
  company: {key: "company", value: '企业'}
}
config.companySize = ["创业公司", '小微型', "中型", "大型","超大型"];
config.companyNature = ["外资", '合资', '国企', '民企', '政府机关', '事业单位', '上市公司', '创业公司', '非盈利机构'];
config.designerTypes = ['自有品牌设计师', '自由设计师', '应届设计师'];
config.designTypes = ['成衣', '珠宝', '家居', '配饰', '形象', '箱包', '其它'];
config.companyKeys = {
  brands_name: "自有品牌名称",
  company_size: "企业规模",
  brands_number: '自有品牌数量',
  company_nature: '企业性质',
  address: '联系地址',
  phone: "固定电话",
  mobile: '联系人手机',
  E_mail: '电子邮箱',
  license: '营业执照',
  business_card: '联系人名片'
};
config.personKeys = ["出生日期", '上传作品', '出生地', '毕业院校', '国籍', '学院/系', '住址', '专业', '电话', '毕业年份', '邮箱', 'Instagram', '其他教育经历', '其他社交平台', '设计类别', '个人主页', '设计风格']
config.personKeys2 = ['品牌名称', '品牌/公司成立时间', '品牌/公司注册地', '每年产出设计量', '上传简历']
config.person = {
  name: '名字',
  first_name: '姓氏',
  avatar: '头像',
  category: '用户类型',
  country_code: '国籍代码',
  
  birth_time: '出生日期',
  works: '个人作品',
  birth_place: "出生地",
  school: '毕业院校',
  country: '国籍',
  college: '学院/系',
  address: '住址',
  profession: '专业',
  telephone: '联系电话',
  graduate: '毕业年份',
  email: '邮箱',
  experience: '教育经历',
  instagram: 'instagram账号',
  design_type: '设计类型',
  other: '其他社交平台账号',
  tags: '设计风格',
  home_page: '个人主页',
  
  agent: '当前代理人',
  brand_name: '品牌名称',
  regitration_time: '品牌注册时间',
  regitration_place: '品牌注册地',
  production: '每年产品数量',
  resume: '个人简历 ',
}
config.company = {
  name: '企业名称',
  registion_place: '企业注册地址',
  brand_name: '自有品牌名称',
  brand_num: '自有品牌数量',
  address: '企业地址',
  telephone: '固定电话',
  contact_telephone: '联系人电话',
  email: '邮箱地址',
  size: '企业规模',
  enterprise_nature: '企业性质',
  business_licence: '营业执照',
  business_contact_card: '联系人名片',
  avatar: '头像',
  category: '用户类型'
}
config.personInformation = ['出生日期', 'Facebook', '出生地', 'Instagram', '国籍', 'Twitter', '住址', 'Blog', '电话', '其他社交平台', 'E-mail', '官网']

config.recruiters = [''];
module.exports = config;
