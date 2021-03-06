import * as ActionTypes from '../../../../action/ActionTypes'

const initialState = {
    Designers:{},
  total:0
}

function DesignersDetailState(state = initialState, action = {type: 'none'}) {
  switch (action.type) {
	case ActionTypes.ACT_DESIGNER_GET_DETAIL_SCHEMAS:
	{
	  let data = action.payload;
	  return{
		...state,
          Designers: data.user,
		total:data.total_num
	  };
	}
	default :
		return state
  }
}
export default DesignersDetailState;