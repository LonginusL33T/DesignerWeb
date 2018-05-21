import * as ActionTypes from '../../../action/ActionTypes'

const initialState = {
  data:[],
  total:0
}

function ActivitiesState(state = initialState, action = {type: 'none'}) {
  switch (action.type) {
	case ActionTypes.ACT_ACTIVITY_GET_ACTIVITY_SCHEMA:
	{
	  let data = action.payload;
	  return{
		...state,
		data: data.data,
		total:data._metainfo.totalCount
	  };
	}
	default :
	  return state
  }
}
export default ActivitiesState;