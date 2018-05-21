import * as ActionTypes from '../../../../action/ActionTypes'
const initialState = {
	data:{}
}

function UpdateNodeState(state = initialState, action = {type: 'none'}) {
  switch (action.type) {
	case ActionTypes.ACT_ACTIVITY_GET_NODE_SCHEMAS:
	{
	  let data = action.payload;
	  return {
		...state,
		data:data
	  };
	}
	case ActionTypes.ACT_ACTIVITY_CHANGE_NODE_SCHEMAS:
	{
	  let data = state.data;
	  data.fields.content = action.payload;
	  return {
		...state,
		data:data
	  };
	}
	case ActionTypes.ACT_ACTIVITY_GET_VERSION_SCHEMAS:
	{
	  let data = state.data;
	  data.version = action.payload;
	  return {
		...state,
		data:data
	  };
	}
	default:
	  return state;
  }
}
export default UpdateNodeState;
