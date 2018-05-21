import * as ActionTypes from '../../action/ActionTypes'
import logger from '../../SmartxLog'

const initialState = {
    projects:[],
    version:{
        databaseVendor: "",
        databaseVersion: "",
        meshNodeId: "",
        meshVersion: "",
        searchVendor: "",
        searchVersion: "",
        vertxVersion: ""
    }
}

function homeState(state = initialState, action = {type: 'none'}) {
    switch (action.type) {
        case ActionTypes.ACT_HOME_GET_PROJECTS_SUCCESS:
        {
            let data = action.payload;
            return {
                ...state,
                projects: data.data
            };
        }
        case ActionTypes.ACT_HOME_GET_VERSION_SUCCESS:
            let data = action.payload;
            return {...state, version: data};
        default:
            return state;
    }
}
export default homeState;
