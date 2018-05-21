import * as ActionTypes from '../../../../action/ActionTypes'
const initialState = {
  user:{}
}
function CheckCompanyState(state = initialState, action = {type: 'none'}) {
  switch (action.type) {
	case ActionTypes.ACT_REGISTERS_GET_COMPANY_SCHEMA:
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
export default CheckCompanyState;