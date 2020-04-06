import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from "axios";
import VehiclesList from "./VehiclesList"

class Vehicles extends Component {
    constructor(props) {
        super(props);
        this.state = {
            topVehicles: [],
            minVehicles: [],
        }
    };

    componentDidMount() {
        this.setState({topVehicles: []});
        this.setState({minVehicles: []});

        this.getVehicles();
    }

    getVehicles() {
        axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/scores/vehicles/avg`)
            .then((res) => {
                console.log(res);
                this.setState({topVehicles: res.data.data.topScores});
                this.setState({minVehicles: res.data.data.minScores});
            })
            .catch((err) => {
                console.log(err);
            });
    };

    render() {
        return (
            <div>
                {window.localStorage.getItem('username') &&
                <div>
                    <Link to={"/addvehicle"}>
                        <button className="button is-primary is-fullwidth">
                            <span>Add vehicle</span>
                        </button>
                    </Link>
                </div>
                }
                <br/><br/>
                <div className="columns">
                    <div className="column">

                        <h3 className="title">Top rated vehicles</h3>
                        <VehiclesList
                            vehicles={this.state.topVehicles}
                        />
                    </div>

                    <div className="column">

                        <h3 className="title">Worst rated vehicles</h3>
                        <VehiclesList
                            vehicles={this.state.minVehicles}
                        />
                    </div>
                </div>
            </div>


        )
    };

}

export default Vehicles