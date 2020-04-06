import React, {Component} from 'react'
import {Route, Switch} from 'react-router-dom'
import axios from 'axios'
import NavBar from "./components/NavBar";
import Form from "./components/Form";
import Logout from "./components/Logout";
import Logo from "./delijn.png";
import Stops from "./components/Stops";
import Vehicles from "./components/Vehicles";
import Search from "./components/Search"
import VehicleInfo from "./components/VehicleInfo";
import StopInfo from "./components/StopInfo";
import AddVehicle from "./components/AddVehicle";

class App extends Component {
    constructor() {
        super();
        this.state = {
            users: [],
            username: '',
            email: '',
            title: 'De Lijn rating system',
            logo: Logo,

            formData: {
                username: '',
                email: '',
                password: ''
            },
            isAuthenticated: '',

        };

        if (window.localStorage.getItem('username') === '') {
            this.setState({isAuthenticated: false})
        } else {
            this.setState({isAuthenticated: true})
        }
        this.addUser = this.addUser.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleUserFormSubmit = this.handleUserFormSubmit.bind(this);
        this.handleFormChange = this.handleFormChange.bind(this);
        this.logoutUser = this.logoutUser.bind(this);


    };

    handleChange(event) {
        const obj = {};
        obj[event.target.name] = event.target.value;
        this.setState(obj)
    };

    handleFormChange(event) {
        const obj = this.state.formData;
        obj[event.target.name] = event.target.value;
        this.setState(obj);
    };

    ClearFormState() {
        this.setState({
            formData: {username: '', email: '', password: ''},
            username: '',
            email: ''
        })
    };

    handleUserFormSubmit(event) {
        event.preventDefault();
        const formType = window.location.href.split('/').reverse()[0];
        let data = {
            username: this.state.formData.username,
            password: this.state.formData.password,
        };
        if (formType === 'register') {
            data.email = this.state.formData.email;
        }
        const url = `${process.env.REACT_APP_USERS_SERVICE_URL}/auth/${formType}`;
        axios.post(url, data)
            .then((res) => {
                this.ClearFormState();
                console.log(data);
                window.localStorage.setItem('username', data.username);
                this.setState({isAuthenticated: true,});
                this.getUsers();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    componentDidMount() {
        this.getUsers();
    };

    addUser(event) {
        event.preventDefault();

        const data = {
            username: this.state.username,
            email: this.state.email
        };
        axios.post(`${process.env.REACT_APP_USERS_SERVICE_URL}/users`, data)
            .then((res) => {
                console.log(res);
                this.getUsers();
                this.setState({username: '', email: ''});
            })
            .catch((err) => {
                console.log(err);
            });

    };

    getUsers() {
        axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/users`)
            .then((res) => {
                this.setState({users: res.data.data.users})
            })
            .catch((err) => {
                console.log(err);
            });
    };


    logoutUser() {
        const data = {
            username: window.localStorage.getItem('username')
        };
        console.log(data);
        const url = `${process.env.REACT_APP_USERS_SERVICE_URL}/auth/logout`;
        console.log(url);
        axios.post(url, data)
            .then((res) => {
                this.setState({isAuthenticated: false});
                window.localStorage.clear();
            })
            .catch((err) => {
                console.log(err);
            });

    };

    render() {
        return (
            <div>
                <NavBar title={this.state.title} logo={this.state.logo} isAuthenticated={this.state.isAuthenticated}/>
                <section className="section">
                    <div className="container">
                        <div className="columns">
                            <div className="column">
                                <br/>
                                <Switch>
                                    <Route exact path='/' render={() => (
                                        <div>
                                            <h2 className="title is-2">Home</h2>
                                            <hr/>
                                            <br/>
                                            This website can be used to rate busses and trams as well as stops, provided by De Lijn.
                                        </div>
                                    )}/>
                                    <Route exact path='/register' render={() => (
                                        <Form
                                            formType={'Register'}
                                            formData={this.state.formData}
                                            handleUserFormSubmit={this.handleUserFormSubmit}
                                            handleFormChange={this.handleFormChange}

                                        />
                                    )}/>
                                    <Route exact path='/login' render={() => (
                                        <Form
                                            formType={'Login'}
                                            formData={this.state.formData}
                                            handleUserFormSubmit={this.handleUserFormSubmit}
                                            handleFormChange={this.handleFormChange}
                                            isAuthenticated={this.state.isAuthenticated}
                                        />
                                    )}/>
                                    <Route exact path='/logout' render={() => (
                                        <Logout
                                            logoutUser={this.logoutUser}
                                            isAuthenticated={this.state.isAuthenticated}
                                        />
                                    )}/>
                                    <Route exact path='/stops' render={() => (
                                        <Stops/>
                                    )}/>
                                    <Route exact path='/vehicles' render={() => (
                                        <Vehicles/>
                                    )}/>
                                    <Route exact path='/search/s/id' render={() => (
                                        <Search
                                            title='Search for a stop id'
                                            type='s'
                                            sec='id'
                                        />
                                    )}/>
                                    <Route exact path='/search/s/line' render={() => (
                                        <Search
                                            title='Search for stops on a line'
                                            type='s'
                                            sec='line'
                                        />)}
                                    />
                                    <Route exact path='/search/s/city' render={() => (
                                        <Search
                                            title='Search for stops in a city'
                                            type='s'
                                            sec='city'
                                        />)}
                                    />
                                    <Route exact path='/search/v/id' render={() => (
                                        <Search
                                            title='Search for a vehicle id'
                                            type='v'
                                            sec='id'
                                        />)}
                                    />
                                    <Route exact path='/search/v/type' render={() => (
                                        <Search
                                            title='Search for a vehicle type'
                                            type='v'
                                            sec='type'
                                        />)}
                                    />
                                    <Route exact path='/vehicle/:id' component={VehicleInfo}/>
                                    <Route exact path='/stop/:id' component={StopInfo}/>
                                    <Route exact path='/addvehicle' render={() => (<AddVehicle/>)}/>
                                </Switch>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    };
}

export default App;