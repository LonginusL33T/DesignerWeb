import * as ActionTypes  from '../../../action/ActionTypes'
const initState = {
    roles: [],
    permissions: [],
    checkedKeys: [],
    halfCheckedKeys: [],
    users: {
        loading: true,
        users: []
    },
    userRoles: [],
    userSelected:[],
    result: false
}
const authState = (state = initState, action) => {
    switch (action.type) {
        case ActionTypes.ACT_GET_ROLES_SUCCESS:
            return {...state, roles: action.payload.roles};
        case ActionTypes.ACT_GET_ROLES_FAILED:
            return {...state, roles: []};
        case ActionTypes.ACT_ADD_ROLE_SUCCESS:
            return {...state, result: action.payload};
        case ActionTypes.ACT_ADD_ROLE_FAILED:
            return {...state, result: {error_code: 0x8002}};
        case ActionTypes.ACT_GET_PERMISSIONS_SUCCESS:
        {
            let keys = mapPermissions(action.payload.permissions);
            return {
                ...state,
                permissions: action.payload.permissions,
                checkedKeys: keys.checkedKeys,
                halfCheckedKeys: keys.halfCheckedKeys
            };
        }
        case ActionTypes.ACT_GET_PERMISSIONS_FAILED:
        {
            return {...state, permissions: []}
        }
        case ActionTypes.ACT_MOTIFY_PERMISSIONS:
        {
            return {...state, checkedKeys: action.payload.checkedKeys, halfCheckedKeys: action.payload.halfCheckedKeys}
        }
        case ActionTypes.ACT_GET_USERS_SUCCESS:
        {
            return {
                ...state, users: {
                    users: action.payload.users,
                    total: action.payload.total,
                    loading:false
                }
            }
        }
        case ActionTypes.ACT_GET_USERS_FAILED:
        {
            return {...state, users: {
                users:[],
                loading:false
            }}
        }
        case ActionTypes.ACT_GET_USERS_ROLES_SUCCESS:
        {
            let roles = action.payload.roles;
            let userRoles = action.payload.userRoles;
            let rolesList = roles.map((item)=> {
                return {label: item.name, value: item.roleSid}
            })
            let userRolesList = userRoles.map((item)=> {
                return item.roleSid
            })
            return {...state, userRoles: rolesList, userSelected: userRolesList}
        }
        case ActionTypes.ACT_GET_USERS_ROLES_FAILED:
        {
            return {...state, userRoles: [], userSelected: []}
        }
        case ActionTypes.ACT_MOTIFY_USERS_ROLES:
        {
            return {...state, userSelected: action.payload}
        }
        case ActionTypes.ACT_REQUEST_LOGOUT:
            return initState
        default:
            return state;
    }
}
/*计算预制值*/
function getCheckedOrHalfChecked(checked, halfChecked, permission) {
    if (permission.checked) {
        let allChecked = true;
        for (let i = 0; i < permission.children.length; i++) {
            let item = permission.children[i];
            if (!item.checked && allChecked) {
                allChecked = false;
                halfChecked.push(item.value);
            } else {
                getCheckedOrHalfChecked(checked, halfChecked, item);
            }
        }
        if (permission.children.length == 0 || allChecked) {
            checked.push(permission.value);
        }
    }
}

/*计算已选的key*/
function mapPermissions(permissions) {
    let checked = [];
    let halfChecked = [];
    permissions.map((permission)=> {
        getCheckedOrHalfChecked(checked, halfChecked, permission);
    })
    return {checkedKeys: checked, halfCheckedKeys: halfChecked};
}
export default authState;