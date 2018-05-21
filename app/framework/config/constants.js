var constants = {
  keys: {
	x_token: "x_token",
	timeout: "timeout",
	starttime: "starttime",
	orguniqueid: "orguniqueid"
	
  },
  
  services: {
	WebUserLoginStep1: "WebUserLoginStep1",
	WebUserLoginStep2: "WebUserLoginStep2",
	WebGetOrgs: "WebGetOrgs",
	WebGetMenus: "WebGetMenus",
	WebGetCompanyInfo: "WebGetCompanyInfo",
	WebGetUnActivatedEmployee: "WebGetUnActivatedEmployee",
	WebGetRoles: "WebGetRoles",
	deleteRole: "WebDeleteRole",
	addRole: "WebAddRole",
	getUsers: "WebGetUsers",
	getRoles: "WebGetRoles",
	updateRole: "WebUpdateRole",
	getPermissions: "WebGetPermissions",
	getUserRoles: "WebGetUserRoles",
	updateUserRoles: "WebUpdateUserRoles",
	addUserRoles: "WebAddUserRoles",
	lockOrUnLockUser: "WebLockOrUnLockUser",
	resetPassword: "WebAdminResetPassword"
  },
  templetes: {
	ADD_CLASS_STUDENT_LIST: "addClassStudentList",
	PER_GRADE_IMPORT: "PerGradeImport",
  },
  errorcode: {
	/**
	 * 成功错误码
	 */
	SUCCESS: 0x0000,
	/**
	 * 用户名不存在
	 */
	USER_NOT_EXSIT: 0x8001,
	/**
	 * 密码错误
	 */
	USER_PASSWORD_ERROR: 0x8002,
  },
  schemas: {
	activities: "news",
	Advert: 'Advert'
  }
}
module.exports = constants