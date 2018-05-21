import * as ActionTypes from '../../../../action/ActionTypes'
const initialState = {
  user:{name:'',
	user_introduction:'',
	brand_introduction:''
  },
  version:0.1
}
function CheckDesignerState(state = initialState, action = {type: 'none'}) {
  switch (action.type) {
	case ActionTypes.ACT_DESIGNER_GET_DETAIL_SCHEMA:
	{
	  let data = action.payload;
	  return{
		...state,
		 user:data.fields,
		version:data.version
	  };
	}
	case ActionTypes.ACT_DESIGNER_CHANGE_USER_SCHEMA:
	{
	  let data =  state.user
	  data.user_introduction = action.payload;
	  return{
		...state,
		user:data,
	  };
	}
	case ActionTypes.ACT_DESIGNER_CHANGE_BRAND_SCHEMA:
	{
	  let data = state.user
	  data.brand_introduction = action.payload;
	  return{
		...state,
		user:data,
	  };
	}
	case ActionTypes.ACT_DESIGNER_CHANGE_BACKGROUD_SCHEMA:
	{
	  let data = state.user
	  data.user_background = action.payload;
	  return{
		...state,
		user:data,
	  };
	}
	default :
	  return state
  }
}
export default CheckDesignerState;