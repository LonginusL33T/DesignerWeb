import * as ActionTypes from '../../../action/ActionTypes'

const initialState = {
  Companies:[],
  total:0
}

function CompaniesState(state = initialState, action = {type: 'none'}) {
  switch (action.type) {
	case ActionTypes.ACT_COMPANIES_GET_COMPANIES_SCHEMAS:
	{
	  let data = action.payload;
	  return{
		...state,
        Companies: data.company,
		total:data.total_num
	  };
	}
	default :
		return state
  }
}
export default CompaniesState;