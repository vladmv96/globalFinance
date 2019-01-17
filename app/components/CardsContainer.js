import React, { Component } from 'react'
import './CardsContainer.css'
import Card from './Card'
import axios from 'axios'

class CardsContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
        }
    }

    componentDidMount = () => {
        this.getData()
    }

    getData = () => {
        axios
            .get('http://68.183.217.11/api/ideas')
            .then(res => {
                this.setState({ data: res.data }, () => {
                    this.sortData('1')
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

    sortData = value => {
        const data = [...this.state.data]
        data.sort((a, b) => {
            let incomeA = +(
                ((a.price - a.buyPrice) * 100) /
                a.buyPrice
            ).toFixed(2)
            let incomeB = +(
                ((b.price - b.buyPrice) * 100) /
                b.buyPrice
            ).toFixed(2)
            switch (value) {
                case '1':
                    return a.ideaDate < b.ideaDate ? 1 : -1
                case '2':
                    return incomeA < incomeB ? 1 : -1
                case '3':
                    return a.price < b.price ? 1 : -1
                default:
                    return
            }
        })
        this.setState({ data })
    }

    renderData = item => {
        return (
            <Card
                key={item._id}
                ideaDate={item.ideaDate}
                logoSrc={item.logoSrc}
                name={item.name}
                period={item.period}
                buyPrice={item.buyPrice}
                price={item.price}
                sellPrice={item.sellPrice}
                status={item.status}
            />
        )
    }

    render() {
        return (
            <div>
                <div className="filters-container">
                    <div className="container">
                        <h2>Показывать</h2>
                        <select
                            className="filters-list"
                            onChange={e => this.sortData(e.target.value)}
                        >
                            <option value="1">Новые</option>
                            <option value="2">По доходу</option>
                            <option value="3">По цене</option>
                        </select>
                    </div>
                </div>
                <div className="cards-container container">
                    {this.state.data.map(this.renderData)}
                </div>
            </div>
        )
    }
}

export default CardsContainer
