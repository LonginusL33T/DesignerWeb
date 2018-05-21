import * as ActionTypes from '../../../action/ActionTypes'

const initialState = {
  feedbacks:[],
  total:0
};

function DesignersState(state = initialState, action = {type: 'none'}) {
  switch (action.type) {
	case ActionTypes.ACT_FEEDBACK_GET_FEEDBACK_SCHEMA:
	{
	  let data = action.payload;
	  return{
		...state,
		feedbacks: data.feedbacks,
		total:data.total_num
	  };
	}
	default :
	  return state
  }
}
export default DesignersState;