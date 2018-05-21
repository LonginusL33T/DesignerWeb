import * as ActionTypes from '../../action/ActionTypes'
import logger from '../../SmartxLog'
import constants from '../../../framework/config/constants';

const initialState = {
    fetchProgress: false,
    progressCurrent: 0,
    progressLabel: '',
    status: "active"
}

function importDataState(state = initialState, action = { type: 'none' }) {

    switch (action.type) {

        case ActionTypes.ACT_COMMON_IMPORTDATA_INIT:
            return {
                ...state,
                fetchProgress: false,
                progressCurrent: 0,
                progressLabel: '',
                status: "active"
            }

        case ActionTypes.ACT_COMMON_IMPORTDATA_PROGRESS_START:
            return { ...state, fetchProgress: true };

        case ActionTypes.ACT_COMMON_IMPORTDATA_SUCCESS:
            let { error_code, progressCurrent, progressLabel } = action.payload;
            if (error_code === constants.errorcode.SUCCESS) {
                if (progressCurrent === 100) {
                    return { ...state, progressCurrent: progressCurrent, progressLabel: progressLabel, fetchProgress: false, status: "success" };
                } else {
                    return { ...state, progressCurrent: progressCurrent, progressLabel: progressLabel, fetchProgress: true };
                }
            } else {
                return state;
            }

        case ActionTypes.ACT_COMMON_IMPORTDATA_FAIL:
            logger.debug('fetchData error.....', action.data);
            return state;

        default:
            return state;
    }
}
export default importDataState;