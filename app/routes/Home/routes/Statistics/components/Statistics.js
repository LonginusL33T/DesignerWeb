import React, {Component} from 'react'
import {Row, message, Spin} from 'antd'
import config from "../../../../../framework/config/config"
import style from '../resource/Statistics.css'
import * as ActionTypes from '../../../../../framework/action/ActionTypes'
import services from '../../../../../framework/utils/MeshService';
import {connect} from 'react-redux'
import {createAction} from 'redux-actions'

class Statistics extends Component {
    state = {
        isLoading: true,
    };

    constructor(props) {
        super(props);
    }

    _fetchStatData() {
        this.setState({
            isLoading: true,
        });
        let {dispatch} = this.props;
        services.createServiceRequest.Service(config.api.WebStatistics, {}, (success) => {

            dispatch(createAction(ActionTypes.ACT_STATISTICS_GET_DATA_SCHEMAS, (model) => model)(success));
            this.setState({
                isLoading: false,
            })
        }, (failed) => {
            message.error(failed)
        })
    }

    componentDidMount() {
        this._fetchStatData();
    }

    render() {
        let {StatisticsState} = this.props;
        console.log(this.state.isLoading);
        const dData = StatisticsState.designer;
        const cData = StatisticsState.company;
        return (
            <Spin spinning={this.state.isLoading}>
                <div>
                    <Row>
                        <div className={style.designers_head_container}>
                            <span className={style.designers_head_text}>【设计师所在地区】</span>
                        </div>
                    </Row>
                    <Row>
                        <table className={style.designers_location_tables_container}>
                            <tr>
                                <td>
                                    <table className={style.designers_location_euro}>
                                        <tr>
                                            <td className={style.tg_title} rowSpan={2}>欧洲</td>
                                            <td className={style.tg_colTitle}>法国</td>
                                            <td className={style.tg_colTitle}>意大利</td>
                                            <td className={style.tg_colTitle}>德国</td>
                                            <td className={style.tg_colTitle}>英国</td>
                                            <td className={style.tg_endRow1}>总计</td>
                                        </tr>
                                        <tr>
                                            <td className={style.tg_colValue}>{dData.loc.euro.fr}</td>
                                            <td className={style.tg_colValue}>{dData.loc.euro.it}</td>
                                            <td className={style.tg_colValue}>{dData.loc.euro.de}</td>
                                            <td className={style.tg_colValue}>{dData.loc.euro.uk}</td>
                                            <td className={style.tg_endRow2}>{dData.loc.euro.sum}</td>
                                        </tr>
                                    </table>
                                </td>
                                <td>
                                    <table className={style.designers_location_asia}>
                                        <tr>
                                            <td className={style.tg_title} rowSpan={2}>亚洲</td>
                                            <td className={style.tg_colTitle}>中国</td>
                                            <td className={style.tg_colTitle}>韩国</td>
                                            <td className={style.tg_colTitle}>日本</td>
                                            <td className={style.tg_colTitle}>新加坡</td>
                                            <td className={style.tg_endRow1}>总计</td>
                                        </tr>
                                        <tr>
                                            <td className={style.tg_colValue}>{dData.loc.asia.cn}</td>
                                            <td className={style.tg_colValue}>{dData.loc.asia.kr}</td>
                                            <td className={style.tg_colValue}>{dData.loc.asia.jp}</td>
                                            <td className={style.tg_colValue}>{dData.loc.asia.sg}</td>
                                            <td className={style.tg_endRow2}>{dData.loc.asia.sum}</td>
                                        </tr>
                                    </table>
                                </td>
                                <td rowSpan={2}>
                                    <table className={style.designers_location_table_others}>
                                        <tr>
                                            <td className={style.tg_colTitle}>其他</td>
                                        </tr>
                                        <tr>
                                            <td className={style.tg_colValue}>{dData.loc.other}</td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <table className={style.designers_location_america}>
                                        <tr>
                                            <td className={style.tg_title} rowSpan={2}>美洲</td>
                                            <td className={style.tg_colTitle}>美国</td>
                                            <td className={style.tg_colTitle}>阿根廷</td>
                                            <td className={style.tg_endBigRow1}>总计</td>
                                        </tr>
                                        <tr>
                                            <td className={style.tg_colValue}>{dData.loc.america.us}</td>
                                            <td className={style.tg_colValue}>{dData.loc.america.ar}</td>
                                            <td className={style.tg_endRow2}>{dData.loc.america.sum}</td>
                                        </tr>
                                    </table>
                                </td>

                                <td>
                                    <table className={style.designers_location_oceania}>
                                        <tr>
                                            <td className={style.tg_title} rowSpan={2}>大洋洲</td>
                                            <td className={style.tg_colTitle}>澳大利亚</td>
                                            <td className={style.tg_colTitle}>新西兰</td>
                                            <td className={style.tg_endBigRow1}>总计</td>
                                        </tr>
                                        <tr>
                                            <td className={style.tg_colValue}>{dData.loc.ocean.au}</td>
                                            <td className={style.tg_colValue}>{dData.loc.ocean.nz}</td>
                                            <td className={style.tg_endRow2}>{dData.loc.ocean.sum}</td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </Row>
                    <Row>
                        <div className={style.designers_head_container}>
                            <span className={style.designers_head_text}>【设计师年龄】</span>
                        </div>
                    </Row>
                    <Row>
                        <div>
                            <table className={style.designers_normal_template}>
                                <tbody>
                                <tr>
                                    <td className={style.tg_colTitle}>20岁以下</td>
                                    <td className={style.tg_colTitle}>20-30岁</td>
                                    <td className={style.tg_colTitle}>30-40岁</td>
                                    <td className={style.tg_colTitle}>40-50岁</td>
                                    <td className={style.tg_colTitle}>50岁以上</td>
                                </tr>
                                <tr>
                                    <td className={style.tg_colValue}>{dData.age.lt20}</td>
                                    <td className={style.tg_colValue}>{dData.age.gt20lt30}</td>
                                    <td className={style.tg_colValue}>{dData.age.gt30lt40}</td>
                                    <td className={style.tg_colValue}>{dData.age.gt40lt50}</td>
                                    <td className={style.tg_colValue}>{dData.age.gt50}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </Row>

                    {/*设计类别文字*/}

                    <Row>
                        <div className={style.designers_head_container}>
                            <span className={style.designers_head_text}>【设计类别】</span>
                        </div>
                    </Row>

                    {/*设计类别*/}

                    <Row>
                        <div>
                            <table className={style.designers_normal_template}>
                                <tbody>
                                <tr>
                                    <td className={style.tg_colTitle}>成衣</td>
                                    <td className={style.tg_colTitle}>配饰</td>
                                    <td className={style.tg_colTitle}>珠宝</td>
                                    <td className={style.tg_colTitle}>家具</td>
                                    <td className={style.tg_colTitle}>箱包</td>
                                    <td className={style.tg_colTitle}>形象</td>
                                    <td className={style.tg_colTitle}>其他</td>
                                </tr>
                                <tr>
                                    <td className={style.tg_colValue}>{dData.cate.ready_to_wear}</td>
                                    <td className={style.tg_colValue}>{dData.cate.accessory}</td>
                                    <td className={style.tg_colValue}>{dData.cate.jewelry}</td>
                                    <td className={style.tg_colValue}>{dData.cate.furniture}</td>
                                    <td className={style.tg_colValue}>{dData.cate.luggage}</td>
                                    <td className={style.tg_colValue}>{dData.cate.appearance}</td>
                                    <td className={style.tg_colValue}>{dData.cate.other}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </Row>

                    {/*设计师类别文字*/}

                    <Row>
                        <div className={style.designers_head_container}>
                            <span className={style.designers_head_text}>【设计师类别】</span>
                        </div>
                    </Row>

                    {/*设计师类别*/}

                    <Row>
                        <div>
                            <table className={style.designers_category}>
                                <tbody>
                                <tr>
                                    <td className={style.tg_colTitle}>自有品牌设计师</td>
                                    <td className={style.tg_colTitle}>自由设计师</td>
                                    <td className={style.tg_colTitle}>应届设计师</td>
                                </tr>
                                <tr>
                                    <td className={style.tg_colValue}>{dData.type.private_brand}</td>
                                    <td className={style.tg_colValue}>{dData.type.free}</td>
                                    <td className={style.tg_colValue}>{dData.type.graduate}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </Row>

                    {/*企业所在地区文字*/}

                    <Row>
                        <div className={style.designers_head_container}>
                            <span className={style.designers_head_text}>【企业所在地区】</span>
                        </div>
                    </Row>

                    {/*企业所在地区*/}

                    <Row>
                        <table className={style.designers_location_tables_container}>
                            <tr>
                                <td>
                                    <table className={style.designers_location_euro}>
                                        <tr>
                                            <td className={style.tg_title} rowSpan={2}>欧洲</td>
                                            <td className={style.tg_colTitle}>法国</td>
                                            <td className={style.tg_colTitle}>意大利</td>
                                            <td className={style.tg_colTitle}>德国</td>
                                            <td className={style.tg_colTitle}>英国</td>
                                            <td className={style.tg_endRow1}>总计</td>
                                        </tr>
                                        <tr>
                                            <td className={style.tg_colValue}>{cData.loc.euro.fr}</td>
                                            <td className={style.tg_colValue}>{cData.loc.euro.it}</td>
                                            <td className={style.tg_colValue}>{cData.loc.euro.de}</td>
                                            <td className={style.tg_colValue}>{cData.loc.euro.uk}</td>
                                            <td className={style.tg_endRow2}>{cData.loc.euro.sum}</td>
                                        </tr>
                                    </table>
                                </td>
                                <td>
                                    <table className={style.designers_location_asia}>
                                        <tr>
                                            <td className={style.tg_title} rowSpan={2}>亚洲</td>
                                            <td className={style.tg_colTitle}>中国</td>
                                            <td className={style.tg_colTitle}>韩国</td>
                                            <td className={style.tg_colTitle}>日本</td>
                                            <td className={style.tg_colTitle}>新加坡</td>
                                            <td className={style.tg_endRow1}>总计</td>
                                        </tr>
                                        <tr>
                                            <td className={style.tg_colValue}>{cData.loc.asia.cn}</td>
                                            <td className={style.tg_colValue}>{cData.loc.asia.kr}</td>
                                            <td className={style.tg_colValue}>{cData.loc.asia.jp}</td>
                                            <td className={style.tg_colValue}>{cData.loc.asia.sg}</td>
                                            <td className={style.tg_endRow2}>{cData.loc.asia.sum}</td>
                                        </tr>
                                    </table>
                                </td>
                                <td rowSpan={2}>
                                    <table className={style.designers_location_table_others}>
                                        <tr>
                                            <td className={style.tg_colTitle}>其他</td>
                                        </tr>
                                        <tr>
                                            <td className={style.tg_colValue}>{cData.loc.other}</td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <table className={style.designers_location_america}>
                                        <tr>
                                            <td className={style.tg_title} rowSpan={2}>美洲</td>
                                            <td className={style.tg_colTitle}>美国</td>
                                            <td className={style.tg_colTitle}>阿根廷</td>
                                            <td className={style.tg_endBigRow1}>总计</td>
                                        </tr>
                                        <tr>
                                            <td className={style.tg_colValue}>{cData.loc.america.us}</td>
                                            <td className={style.tg_colValue}>{cData.loc.america.ar}</td>
                                            <td className={style.tg_endRow2}>{cData.loc.america.sum}</td>
                                        </tr>
                                    </table>
                                </td>

                                <td>
                                    <table className={style.designers_location_oceania}>
                                        <tr>
                                            <td className={style.tg_title} rowSpan={2}>大洋洲</td>
                                            <td className={style.tg_colTitle}>澳大利亚</td>
                                            <td className={style.tg_colTitle}>新西兰</td>
                                            <td className={style.tg_endBigRow1}>总计</td>
                                        </tr>
                                        <tr>
                                            <td className={style.tg_colValue}>{cData.loc.ocean.au}</td>
                                            <td className={style.tg_colValue}>{cData.loc.ocean.nz}</td>
                                            <td className={style.tg_endRow2}>{cData.loc.ocean.sum}</td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>


                    </Row>

                    {/*企业性质文字*/}

                    <Row>
                        <div className={style.designers_head_container}>
                            <span className={style.designers_head_text}>【企业性质】</span>
                        </div>
                    </Row>

                    {/*企业性质年龄*/}

                    <Row>
                        <div>
                            <table className={style.designers_company_template}>
                                <tbody>
                                <tr>
                                    <td className={style.ct_colTitle}>国有企业</td>
                                    <td className={style.ct_colTitle}>外资企业</td>
                                    <td className={style.ct_colTitle}>合资企业</td>
                                    <td className={style.ct_colTitle}>民营企业</td>
                                    <td className={style.ct_colTitle}>上市公司</td>
                                    <td className={style.ct_colTitle}>非营利组织</td>
                                    <td className={style.ct_colTitle}>创业公司</td>
                                    <td className={style.ct_colTitle}>政府部门</td>
                                    <td className={style.ct_colTitle}>事业单位</td>
                                </tr>
                                <tr>
                                    <td className={style.ct_colValue}>{cData.type.state_owned}</td>
                                    <td className={style.ct_colValue}>{cData.type.foreign_capital}</td>
                                    <td className={style.ct_colValue}>{cData.type.joint_capital}</td>
                                    <td className={style.ct_colValue}>{cData.type.private}</td>
                                    <td className={style.ct_colValue}>{cData.type.listed}</td>
                                    <td className={style.ct_colValue}>{cData.type.non_profit}</td>
                                    <td className={style.ct_colValue}>{cData.type.startup}</td>
                                    <td className={style.ct_colValue}>{cData.type.government_agency}</td>
                                    <td className={style.ct_colValue}>{cData.type.state_institution}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </Row>

                </div>
            </Spin>
        )
    }
}

function mapStateToProps(state) {
    return {
        StatisticsState: state.StatisticsState,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: dispatch
    }
}

module.exports = connect(
    mapStateToProps,
    mapDispatchToProps
)(Statistics);