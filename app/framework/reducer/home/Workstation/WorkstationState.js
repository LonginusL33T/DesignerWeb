import * as ActionTypes from '../../../action/ActionTypes'
const initialState = {
  detail:{},
  version:0.1, 
	uuid:""
}

function WorkstationState(state = initialState, action = {type: 'none'}) {
  switch (action.type) {
	case ActionTypes.ACT_STATION_GET_DETAIL_SCHEMA:
	{
	  let data = action.payload;
	  return{
		...state,
		detail: data.fields,
		version:data.version,
		  uuid:data.uuid
	  };
	}
	case ActionTypes.ACT_STATION_CHANGE_DETAIL_SCHEMA:
	{
	  let data = action.payload;
	  return{
		...state,
		detail: data,
	  };
	}
	case ActionTypes.ACT_STATION_CHANGE_VERSION_SCHEMA:
	{
	  let data = action.payload;
	  return{
		...state,
		version:data.version
	  };
	}
	default :
	  return state
  }
}
export default WorkstationState;