import * as ActionTypes from '../../../action/ActionTypes'

const initialState = {
    projects:[],
    schemas:[],
    schemasSelected:[]
}

function projectState(state = initialState, action = {type: 'none'}) {
    switch (action.type) {
        case ActionTypes.ACT_PROJECTS_GET_PROJECTS_SUCCESS:
        {
            let data = action.payload;
            return {
                ...state,
                projects: data.data
            };
        }
        case ActionTypes.ACT_PROJECTS_GET_PROJECTS_SCHEMAS:{
            let data = action.payload;
            return {
                ...state,
                schemas:data.schemas,
                schemasSelected:data.schemasSelected
            }
        }
        case ActionTypes.ACT_PROJECTS_SELECT_PROJECTS_SCHEMAS:{
            let data = action.payload;
            return {
                ...state,
                schemasSelected:data.schemasSelected
            }
        }
        default:
            return state;
    }
}
export default projectState;
