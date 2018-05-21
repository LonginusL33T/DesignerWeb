import * as ActionTypes from '../../../action/ActionTypes'

const initialState = {
  Registers:[],
  total:0
}

//用于登录的逻辑
function RegistersState(state = initialState, action = {type: 'none'}) {
  switch (action.type) {
	case ActionTypes.ACT_REGISTERS_GET_REGISTERS_SCHEMAS:
	{
	  let data = action.payload;
	  return{
		...state,
		Registers: data.user,
		total:data.total_num
	  };
	}
	default :
		return state
  }
}
export default RegistersState;