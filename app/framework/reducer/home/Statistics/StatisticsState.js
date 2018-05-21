import * as ActionTypes from '../../../action/ActionTypes'

const initialState = {
    /* 对返回数据重新封装 */
    designer: {
        loc: {
            asia: {
                cn: 0,
                jp: 0,
                kr: 0,
                sg: 0,
                etc: 0,
                sum: 0,
            },
            euro: {
                it: 0,
                de: 0,
                fr: 0,
                uk: 0,
                etc: 0,
                sum: 0,
            },
            america: {
                ar: 0,
                us: 0,
                etc: 0,
                sum: 0,
            },
            ocean: {
                au: 0,
                nz: 0,
                etc: 0,
                sum: 0,
            },
            other: 0,
        }, // 设计师地域
        cate: {
            accessory: 0,
            furniture: 0,
            ready_to_wear: 0,
            luggage: 0,
            jewelry: 0,
            appearance: 0,
            other: 0,
        }, // 设计类别
        type: {
            graduate: 0,
            free: 0,
            private_brand: 0,
        }, // 设计师类型
        age: {
            lt20: 0,
            gt20lt30: 0,
            gt30lt40: 0,
            gt40lt50: 0,
            gt50: 0,
        }
    },
    company: {
        type: {
            state_owned: 0,
            foreign_capital: 0,
            joint_capital: 0,
            private: 0,
            government_agency: 0,
            state_institution: 0,
            non_profit: 0,
            listed: 0,
            startup: 0,
        },
        loc: {
            asia: {
                cn: 0,
                jp: 0,
                kr: 0,
                sg: 0,
                etc: 0,
                sum: 0,
            },
            euro: {
                it: 0,
                de: 0,
                fr: 0,
                uk: 0,
                etc: 0,
                sum: 0,
            },
            america: {
                ar: 0,
                us: 0,
                etc: 0,
                sum: 0,
            },
            ocean: {
                au: 0,
                nz: 0,
                etc: 0,
                sum: 0,
            },
            other: 0,
        },
    },
};

function traversal(obj)  {
    let values = 0;
    let keys=[];
    for (let key in obj) {
        if (obj.hasOwnProperty(key) === true) {
            keys.push(key);
            values += obj[key];
        }
    }
    return values;
}

function StatisticsState(state = initialState, action = {type: 'none'}) {

    switch (action.type) {
        case ActionTypes.ACT_STATISTICS_GET_DATA_SCHEMAS:
            let data = action.payload;
            let statData = data.statistics;
            return {
                ...state,
                designer: {
                    loc: {
                        asia: {
                            cn: statData.designer.area.asia.china,
                            jp: statData.designer.area.asia.japan,
                            kr: statData.designer.area.asia.korea,
                            sg: statData.designer.area.asia.singapore,
                            sum: traversal(statData.designer.area.asia),
                        },
                        euro: {
                            it: statData.designer.area.europe.italy,
                            de: statData.designer.area.europe.germany,
                            fr: statData.designer.area.europe.franch,  //Response Typo: => french
                            uk: statData.designer.area.europe.english, //Response Typo: => england
                            sum: traversal(statData.designer.area.europe),
                        },
                        america: {
                            ar: statData.designer.area.america.argentina,
                            us: statData.designer.area.america.america,
                            sum: traversal(statData.designer.area.america),
                        },
                        ocean: {
                            au: statData.designer.area.oceania.australia,
                            nz: statData.designer.area.oceania.newZealand,
                            sum: traversal(statData.designer.area.oceania),
                        },
                        other: statData.designer.area.other,
                    }, // 设计师地域
                    cate: {
                        accessory: statData.designer.design_type.peishi,
                        furniture: statData.designer.design_type.jiaju,
                        ready_to_wear: statData.designer.design_type.chengyi,
                        luggage: statData.designer.design_type.xiangbao,
                        jewelry: statData.designer.design_type.zhubao,
                        appearance: statData.designer.design_type.xingxiang,
                        other: statData.designer.design_type.other,
                    }, // 设计类别
                    type: {
                        graduate: statData.designer.categroy.graduate,
                        free: statData.designer.categroy.free,
                        private_brand: statData.designer.categroy.production,
                    }, // 设计师类型
                    age: {
                        lt20: statData.designer.age.less20,
                        gt20lt30: statData.designer.age.more20less30,
                        gt30lt40: statData.designer.age.more30less40,
                        gt40lt50: statData.designer.age.more40less50,
                        gt50: statData.designer.age.more50,
                    }
                },
                company: {
                    type: {
                        state_owned: statData.company.natures.guoqi,
                        foreign_capital: statData.company.natures.waizi,
                        joint_capital: statData.company.natures.hezi,
                        private: statData.company.natures.mingqi,
                        government_agency: statData.company.natures.zhengfujigou,
                        state_institution: statData.company.natures.shiyedanwei,
                        non_profit: statData.company.natures.feiyinglijigou,
                        listed: statData.company.natures.shangshigongsi,
                        startup: statData.company.natures.chuangyegongsi,
                    },
                    loc:{
                        asia: {
                            cn: statData.company.area.asia.china,
                            jp: statData.company.area.asia.japan,
                            kr: statData.company.area.asia.korea,
                            sg: statData.company.area.asia.singapore,
                            sum: traversal(statData.company.area.asia),
                        },
                        euro: {
                            it: statData.company.area.europe.italy,
                            de: statData.company.area.europe.germany,
                            fr: statData.company.area.europe.franch,  //Response Typo: => french
                            uk: statData.company.area.europe.english, //Response Typo: => england
                            sum: traversal(statData.company.area.europe),
                        },
                        america: {
                            ar: statData.company.area.america.argentina,
                            us: statData.company.area.america.america,
                            sum: traversal(statData.company.area.america),
                        },
                        ocean: {
                            au: statData.company.area.oceania.australia,
                            nz: statData.company.area.oceania.newZealand,
                            sum: traversal(statData.company.area.oceania),
                        },
                        other: statData.company.area.other,
                    },
                },
            };

        default :
            return state;
    }
}

export default StatisticsState;