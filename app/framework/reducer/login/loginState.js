import * as ActionTypes from '../../action/ActionTypes'
import logger from '../../SmartxLog'

const initialState = {
    schoolList: [],
    fetching: false
}

function loginState(state = initialState, action = { type: 'none' }) {
    switch (action.type) {
        case ActionTypes.ACT_LOGIN_REQUEST_START:
            return {...state, fetching: true};

        case ActionTypes.ACT_LOGIN_SCHOOL_LIST:
            return {...state, schoolList: action.payload.schoolList, fetching: false};
        
        case ActionTypes.ACT_LOGIN_FAILD:
            logger.debug('fetchData error.....', action.data);
            return state;

        default:
            return state;
    }
}
export default loginState;
