import * as ActionTypes from '../../../../action/ActionTypes'

const initialState = {
  Companies:{},
  total:0,
  recruit:[],
  recruitTotal:0,
  apply:[],
  applyTotal:0
}

function CompaniesDetailState(state = initialState, action = {type: 'none'}) {
  switch (action.type) {
	case ActionTypes.ACT_COMPANIES_GET_DETAIL_SCHEMAS:
	{
	  let data = action.payload;
	  return{
		...state,
        Companies: data.user,
		total:data.total_num
	  };
	}
	case ActionTypes.ACT_COMPANIES_GET_RECRUIT_SCHEMAS:
	{
	  let data = action.payload;
	  return{
		...state,
		recruit: data.recruits,
		recruitTotal:data.total_num
	  };
	}
	case ActionTypes.ACT_COMPANIES_GET_APPLY_SCHEMAS:
	{
	  let data = action.payload;
	  return{
		...state,
		apply: data.apply,
		applyTotal:data.total_num
	  };
	}
	default :
		return state
  }
}
export default CompaniesDetailState;