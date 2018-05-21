/**
 * reducer to combine the page model of smartx client based on server response json
 */
"use strict";

import {combineReducers} from 'redux'
import appstate from './appstate'
import importDataState from './common/importDataState'
import loginState from './login/loginState'
import homeState from './home/homeState'
import projectState from './home/projects/projectState'
import RegistersState from './home/Registers/RegistersState'
import UpdateNodeState from './home/Activities/UpdateNode/UpdateNodeState'
import CheckPersonState from './home/Registers/CheckPerson/CheckPersonState'
import CheckDesignerState from './home/Registers/CheckDesigner/CheckDesignerState'
import ActivitiesState from './home/Activities/ActivitiesState'
import DesignersDetailState from './home/Designers/Detail/DesignersDetailState'
import CheckCompanyState from './home/Registers/CheckCompany/CheckCompanyState'
import WorkstationState from './home/Workstation/WorkstationState'
import authState from './home/Admin/authState'
import FeedbackState from './home/Feedback/FeedbackState'
import DesignersState from './home/Designers/DesignersState'
import CompaniesState from './home/Companies/CompaniesState'
import CompaniesDetailState from './home/Companies/Detail/CompaniesDetailState'
import IntervieweeState from './home/Interviewee/IntervieweeState'
import StatisticsState from './home/Statistics/StatisticsState'


const pageReducer = combineReducers({
  //common
  appstate,
  importDataState,
  loginState,
  homeState,
  projectState,
  UpdateNodeState,
  RegistersState,
  CheckPersonState,
  CheckCompanyState,
  DesignersState,
  WorkstationState,
  CompaniesState,
  CompaniesDetailState,
  CheckDesignerState,
  ActivitiesState,
  DesignersDetailState,
  authState,
  FeedbackState,
  IntervieweeState,
  StatisticsState,
});
export default pageReducer;
