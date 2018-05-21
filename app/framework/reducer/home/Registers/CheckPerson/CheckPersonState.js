import * as ActionTypes from '../../../../action/ActionTypes'
const initialState = {
 user:{
 	works:[]
 }
}

function CheckPersonState(state = initialState, action = {type: 'none'}) {
  switch (action.type) {
	case ActionTypes.ACT_REGISTERS_GET_PERSON_SCHEMA:
	{
	  let data = action.payload;
	  return{
		...state,
		user: data.user,
	  };
	}
	default :
	  return state
  }
}
export default CheckPersonState;