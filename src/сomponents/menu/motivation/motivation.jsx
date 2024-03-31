import {Card, Progress, Space, Typography, Carousel, Radio, Row, Col} from 'antd'
import React, {useState} from 'react';
import Divider from "../../divider";

import "./motivation.css"

const {Text, Title} = Typography;

const contentStyle = {
    height: '100px', color: 'black', lineHeight: '100px', textAlign: 'center', background: 'white', width: '300px'
};

const wrapper_style = {
    height: '50px', width: '100%', backgroundColor: 'white', textAlign: 'center',
};

const style = {
    background: '#0092ff',
    padding: '8px 0',
};

class Motivation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }


    componentDidMount() {
        const _plan_completion = 0
        const _leader = ""
        const _place = 0
        const _trend = 0

        this.setState({
            plan_completion: _plan_completion, leader: _leader, place: _place, trend: _trend, dotPosition: 'left'
        })

        window.motivation_SetData = (_plan_completion, _leader, _place, _trend) => {
            this.setState(({
                plan_completion: _plan_completion, leader: _leader, place: _place, trend: _trend
            }));
            return true
        }
    }

    render() {
        return (<div className='customCarousel'>
            <Carousel autoplay autoplaySpeed={10000} dots={false} dotPosition='right'>
                <div className='carousel-slide'>
                    <Space size='middle' direction="horizontal"><Text>Выполнение плана</Text><Progress type="circle"
                                                                                                       percent={this.state.plan_completion}
                                                                                                       width={45}/></Space>
                </div>
                <div className='carousel-slide'>
                    <Space direction="horizontal"><Text>Лидер продаж: <Text
                        type="secondary">{this.state.leader}</Text></Text></Space>
                </div>
                <div className='carousel-slide'>
                    <Space direction="horizontal"><Text>Ваше место: <Text
                        type="secondary">{this.state.place}</Text></Text></Space>
                </div>
                <div className='carousel-slide'>
                    <Space direction="horizontal"><Text>Тенденция: <Text
                        type="secondary">{this.state.trend}</Text></Text></Space>
                </div>
            </Carousel>
        </div>)
    }
}

export default Motivation;