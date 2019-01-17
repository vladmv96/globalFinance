import React, { Component } from 'react';
import "./Card.css";
import axios from 'axios';

class Card extends Component {

    constructor(props) {
        super(props);
        this.state = {
            phone: "",
            openForm: false,
            doneSending: false,
            sendStatus: 0,
            invalidForm: false,
        }
    }

    componentDidUpdate = () => {
        console.log('upd');
    }
    
    formatDate = (date) => {
        let dd = date.getDate();
        let mm = date.getMonth() + 1;
        let yy = date.getFullYear() % 100;
        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;
        if (yy < 10) yy = '0' + yy;

        return dd + '.' + mm + '.' + yy;
    }

    openForm = () => {
        this.setState({ openForm: true });
    }

    inputPhoneChange = e => {
        const value = e.target.value;
        if (isNaN(value[value.length - 1])) return;
        if (value.length > 16) return;
        if (value.length < this.state.phone.length && value.length > 3) {
            this.setState({ phone: value });
            return;
        }
        if (value[0] !== "+" || value[1] !== "7" || value[2] !== " ") {
            this.setState({ phone: `+7 ` });
            return;
        }

        if (
            value.length === 2 ||
            value.length === 6 ||
            value.length === 10 ||
            value.length === 13
        ) {
            let newVal = e.target.value + " ";
            this.setState({ phone: newVal });
            return;
        }
        this.setState({ phone: value });
    };

    sendData = () => {
        if (this.state.phone.length < 16) {
            this.setState({invalidForm: true});
            return;
        };

        this.setState({invalidForm: false});

        axios.post('http://68.183.217.11/phone', {
            phone: this.state.phone
        }).then(
            (res) => {
                this.setState({doneSending: true, sendStatus: res.status})
            }
        ).catch(
            (err) => {
                console.log(err);
            }
        )
    }

    closeModal = () => {
        this.setState({doneSending: false})
    }

    render() {

        const { ideaDate, logoSrc, name, period, buyPrice, sellPrice, price, status, key } = this.props;
        const { phone, openForm, doneSending, sendStatus, invalidForm } = this.state;
        const forecast = (((sellPrice - buyPrice) * 100) / buyPrice).toFixed(2);
        let income = (((price - buyPrice) * 100) / buyPrice).toFixed(2);
        if (income > 0) income = "+" + income;
        const realizationPercent = (((((price - buyPrice) * 100) / buyPrice) * 100) / (((sellPrice - buyPrice) * 100) / buyPrice)).toFixed(2);
        console.log(name, openForm);

        return (
            <div className="card-box" key={key}>
                <div className="idea-date">{this.formatDate(new Date(ideaDate))}</div>
                <div>
                    <img className="logo inline-block" src={"http://68.183.217.11/" + logoSrc} alt="logo" />
                    <div className="inline-block idea-name">{name}</div>
                </div>
                <div className="forecast inline-block">Прогнозируемый доход: <span className="forecast-percent">{forecast}%</span> <span className="forecast-date"> за {period}</span></div>
                <div>
                    <div className="buy-price inline-block"><h3 className="price">${buyPrice}</h3><p>цена покупки</p></div>
                    <div className="sell-price inline-block"><h3 className="price">${sellPrice}</h3><p>цена продажи</p></div>
                    <div className="price inline-block"><h3 className="price">${price}</h3><p>текущая цена</p></div>
                    <div className="income inline-block"><h3 className="income" style={{ color: `${income < 0 ? 'red' : 'green'}` }}>{income}%</h3><p>текущий доход</p></div>
                </div>
                <div className="realization"><p>Идея реализована на <span> {realizationPercent}%</span></p></div>
                <div className="progress-container">
                    <p className="inline-block">0%</p>
                    <div className="progress-bar-container inline-block">
                        <div className="progress-bar" style={{ width: `${realizationPercent < 100 && realizationPercent > 0 ? realizationPercent*3 : realizationPercent >= 100 ? 300 : 0}px` }}></div>
                    </div>
                    <p className="inline-block">100%</p>
                </div>
                {!openForm && <div className="invest-button-container">
                    <button className="invest-button" disabled={status} onClick={this.openForm}>Инвестировать</button>
                </div>}
                {openForm && <div className="form-button-container">
                    <input
                        placeholder="+7XXXXXXXXXX" 
                        name="tel"
                        onChange={this.inputPhoneChange}
                        value={phone}
                        style={{borderColor: `${invalidForm ? 'red' : '#fdba14'}`}}
                        autoComplete="off"/>
                    <button onClick={this.sendData}>Оставить заявку</button>
                </div>}

        {doneSending && 
               <div className="modal">
                    <div className="closeModal" onClick={this.closeModal}>X</div>
                    {sendStatus == 200 && "Заявка отправлена!" }
                    {sendStatus != 200 && "Заявка отклонена" }
                </div> 
            }
            </div>
        );
    }
}

export default Card;