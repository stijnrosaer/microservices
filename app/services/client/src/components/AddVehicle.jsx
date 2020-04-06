import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import axios from "axios";

class AddVehicle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            type: 'Bus',
        };

        this.handleAddFormChange = this.handleAddFormChange.bind(this);
        this.handleAddFormSubmit = this.handleAddFormSubmit.bind(this);
    };

    componentDidMount() {
    }

    handleAddFormChange(event) {
        const obj = this.state;
        obj[event.target.name] = event.target.value;

        this.setState(obj);
    };

    ClearAddFormState() {
        this.setState(({
            id: '',
            type: 'Bus',
        }))
    };

    async handleAddFormSubmit(event) {
        event.preventDefault();

        let data = {
            id: this.state.id,
            type: this.state.type,
            username: window.localStorage.getItem('username'),
        };

        let url = `${process.env.REACT_APP_USERS_SERVICE_URL}/scores/addvehicle`;

        await axios.post(url, data)
            .then((res) => {
                this.ClearAddFormState();
                return <Redirect to='/vehicles' />
            })
            .catch((err) => {
                console.log(err);
            });
    }


    render() {
        return (
            <div>
                <form onSubmit={(event) => this.handleAddFormSubmit(event)}>
                    <div className="field">
                        <input
                            name="id"
                            className="input is-medium"
                            type="text"
                            placeholder="Enter the vehicle id"
                            required
                            value={this.state.id}
                            onChange={this.handleAddFormChange}
                        />
                    </div>

                    <div className="select is-fullwidth">
                        <select
                            name="type"
                            value={this.state.type}
                            required
                            onChange={this.handleAddFormChange}

                        >
                            <option>Bus</option>
                            <option>Tram</option>
                        </select>
                    </div>
                    <br/><br/>
                    <input
                        type="submit"
                        className="button is-primary is-medium is-fullwidth"
                        value="Submit"
                    />
                </form>
            </div>


        )
    };

}

export default AddVehicle