import React, { Component } from 'react';
import {Input} from '../Input/Input';
import 'antd/dist/antd.css';
import { Button } from 'antd';
import  axios from '../../axios/axios';

export default class Login extends Component {

    state={
      "email":'',
      "password":'',
      "loading" :false,
      'emailError':false,
       'passError':false,
       'disable':false
    }

    inputChangeHandler=async (e)=>{
        let re=/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; 
          if(e.target.name==='email'){

             this.setState({
               ...this.state,
               [e.target.name]: e.target.value,
               emailError: !re.test(e.target.value),
               disable: !re.test(e.target.value)
             });
             
          }
          else if (e.target.name === "password") {
                 this.setState({
                   ...this.state,
                   [e.target.name]: e.target.value,
                   passError: !e.target.value.length > 0,
                   disable: !e.target.value.length > 0
                 });
               }

             
        

    }

    submitHandler= async (e)=>{
       e.preventDefault();
       


       this.setState({
           ...this.state,
        loading:true
       })

         const { emailError, passError } = this.state;
         console.log("state", this.state);
         const data = {
           email: this.state.email,
           password: this.state.password
         };

         if(!emailError && !passError){
           const result = await axios.post(
             "signin",
             data
           );
           console.log(result);
          }

    }
    render() {
        return (
          <div className="container">
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header">Login Page</div>
                  <div className="card-body">
                    <form>
                      <label htmlFor="email">Email:</label>
                      <Input
                        key="1"
                        type="email"
                        name="email"
                        changeHandler={e => this.inputChangeHandler(e)}
                        value={this.state.email}
                        emailError={this.state.emailError}
                      />
                      {this.state.emailError ? (
                        <div>
                          <small className="text-danger">
                            Enter vailid Email
                          </small>
                        </div>
                      ) : null}

                      <label htmlFor="pass" className="mt-2">
                        Password:
                      </label>
                      <Input
                        key="2"
                        type="password"
                        name="password"
                        changeHandler={e => this.inputChangeHandler(e)}
                        value={this.state.password}
                        passError={this.state.passError}
                      />
                      {this.state.passError ? (
                        <small className="text-danger">
                          Enter vailid password
                        </small>
                      ) : null}

                      <Button
                        type="primary"
                        className="btn-block mt-2"
                        size="large"
                        onClick={this.submitHandler}
                        loading={this.state.loading}
                        disabled={this.state.disable}
                      >
                        Login
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
          </div>
        );
    }
}
