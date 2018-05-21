import * as ActionTypes from '../../../action/ActionTypes'

const initialState = {
  menu:[],
  menuTotal:0,
  data:[],
  datatotal:0,
}

function IntervieweeState(state = initialState, action = {type: 'none'}) {
  switch (action.type) {
	case ActionTypes.ACT_INTERVIEWEE_GET_MENU_SCHEMA:
	{
	  let data = action.payload;
	  return {
		...state,
		menu: data.user,
		menuTotal:data.total_num
	  };
	}
	case ActionTypes.ACT_INTERVIEWEE_GET_TABLE_SCHEMA:
	{
	  let data = action.payload;
	  return {
		...state,
		data: data.applys,
		datatotal:data.total_num
	  };
	}
	default:
	  return state;
  }
}
export default IntervieweeState;