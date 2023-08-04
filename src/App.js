import React from 'react'
import { render } from 'react-dom'
import Card from 'react-credit-cards'
import './index.css'

import {
  formatCreditCardNumber,
  formatCVC,
  formatExpirationDate
} from './utils'

import 'react-credit-cards/es/styles-compiled.css'
import axios from 'axios'

export default class App extends React.Component {
  state = {
    number: '',
    name: '',
    expiry: '',
    cvc: '',
    issuer: '',
    focused: '',
    formData: null,
    discount: 0,
    coupon:''

  }

  handleCallback = ({ issuer }, isValid) => {
    if (isValid) {
      this.setState({ issuer })
    }
  }

  handleInputFocus = ({ target }) => {
    this.setState({
      focused: target.name
    })
  }

  handleCoupon = async() =>{
     const res = await axios.post('http://localhost:4000/coupon/getByName', {name:this.state.coupon})

    console.log(res?.data)


    if(res?.data){
      this.setState({discount: res?.data?.price})
      console.log(res?.data?.price)
    }

  }


  handleInputChange = ({ target }) => {
    if (target.name === 'number') {
      target.value = formatCreditCardNumber(target.value)
    } else if (target.name === 'expiry') {
      target.value = formatExpirationDate(target.value)
    } else if (target.name === 'cvc') {
      target.value = formatCVC(target.value)
    } 

    this.setState({ [target.name]: target.value })
  }

  handleSubmit = e => {
    e.preventDefault()
  }

  render () {
    const { name, number, expiry, cvc, focused, issuer } = this.state


    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const paramPrice = urlParams.get('price');
    const paramId = urlParams.get('id');

    return (
      <div key='Payment'>
        <div className='App-payment'>
          <h1>Enter your payment details</h1>
          <h4>Total Price is {paramPrice - this.state.discount} LKR</h4>
          <Card
            number={number}
            name={name}
            expiry={expiry}
            cvc={cvc}
            focused={focused}
            callback={this.handleCallback}
          />
          <form ref={c => (this.form = c)} onSubmit={this.handleSubmit} noValidate>
            <div className='form-group'>
              <small style={{width:'50px'}}>Name on card:</small>
              <input
                type='text'
                name='name'
                style={{width:'200px'}}
                className='form-control'
                placeholder='Name'
                pattern='[a-z A-Z-]+'
                required
                onChange={this.handleInputChange}
                onFocus={this.handleInputFocus}
              />
            </div>
            <div className='form-group'>
              <small style={{width:'50px'}}>Card Number:</small>

              <input
                type='tel'
                name='number'
                style={{width:'200px'}}
                className='form-control'
                placeholder='Card Number'
                pattern='[\d| ]{16,22}'
                maxLength='19'
                required
                onChange={this.handleInputChange}
                onFocus={this.handleInputFocus}
              />
            </div>

            <div className='form-group'>
              <small style={{width:'50px'}}>Expiration Date:</small>

              <input
                type='tel'
                name='expiry'
                style={{width:'200px', marginRight:'0.7%'}}
                className='form-control'
                placeholder='Valid Thru'
                pattern='\d\d/\d\d'
                required
                onChange={this.handleInputChange}
                onFocus={this.handleInputFocus}
              />
            </div>
            <div className='form-group'>
              <small style={{width:'50px'}}>CVC:</small>

              <input
                type='tel'
                name='cvc'
                style={{width:'200px', marginLeft:'6%'}}
                className='form-control'
                placeholder='CVC'
                pattern='\d{3}'
                required
                onChange={this.handleInputChange}
                onFocus={this.handleInputFocus}
              />
            </div>
            <div className='form-group' style={{marginTop:'10px'}}>
              <small style={{width:'50px'}}>Coupon Code</small>

              <input
                type='tel'
                name='coupon_code'
                style={{width:'200px', marginLeft:'2%'}}
                className='form-control'
                placeholder='Coupon Code'
                pattern='\d{3}'
                required
                onChange={(e)=>  this.setState({coupon:e.target.value})}
                onFocus={this.handleInputFocus}
              />
              <button style={{borderRadius:'5px', margin:'5px'}} onClick={()=> this.handleCoupon()}>Apply</button>
            </div>
            <input type='hidden' name='issuer' value={issuer} />
            <div className='form-actions'>
              <button onClick={async()=>{
                await axios.put(`http://localhost:4000/bookings/${paramId}`, {status:'paid'})
              }}>Submit</button>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

render(<App />, document.getElementById('root'))