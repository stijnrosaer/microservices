import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import axios from "axios";
import StarRatingComponent from "react-star-rating-component";
import Rate from "./Rate";

class VehicleInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.match.params.id,
            vehicle: '',
            ratings: [],
            rating: 0,
        };
        this.onStarClick = this.onStarClick.bind(this);
        this.remove = this.remove.bind(this);
    };

    componentDidMount() {
        this.getVehicle();
    }

    async onStarClick(nextValue, prevValue, name) {
        await this.setState({rating: nextValue});
        this.rate();
    };

    rate() {
        let url = `${process.env.REACT_APP_USERS_SERVICE_URL}/scores/vehicle`;
        let data = {
            'username': window.localStorage.getItem('username'),
            'score': this.state.rating,
            'vid': this.state.id,
        };
        axios.post(url, data)
            .then((res) => {
                this.getVehicle();
            })
            .catch((err) => {
                console.log(err);

            });
    };

    getVehicle() {
        let url = `${process.env.REACT_APP_USERS_SERVICE_URL}/scores/vehicles/id/${this.state.id}`;
        axios.get(url)
            .then((res) => {
                console.log(res);
                this.setState({vehicle: res.data.data});
                this.setState({ratings: res.data.data.ratings})
            })
            .catch((err) => {
                console.log(err);

            });
    };

    async remove() {
        let url = `${process.env.REACT_APP_USERS_SERVICE_URL}/scores/vehicle/remove`;
        let data = {
            'vid': this.state.id,
        };
        await axios.post(url, data)
            .then((res) => {
                console.log(res);

            })
            .catch((err) => {
                console.log(err);

            });
        return <Redirect to="/"/>

    };

    render() {
        return (
            <div>
                <div className="columns">
                    <div className="column is-11">
                        <h2 className="title is-2">Vehicle info</h2>
                    </div>
                    <div className="column is-1">
                        {window.localStorage.getItem('username') === this.state.vehicle.addUser &&
                        <div>
                            {(this.state.ratings.length === 1 || this.state.ratings.length === 0) &&
                            <button className="button is-danger" onClick={this.remove}>
                                <span>Remove</span>
                            </button>
                            }
                        </div>

                        }

                    </div>
                </div>
                <hr/>
                <br/><br/>

                <h3
                    className="box title is-5"
                >Vehicle id: &emsp;&emsp; {this.state.vehicle.id}
                </h3>
                <h3
                    className="box title is-5"
                >Vehicle type:&emsp; {this.state.vehicle.type}
                </h3>
                <h3
                    className="box title is-5"
                >Added by: &emsp;&emsp; {this.state.vehicle.addUser}
                </h3>
                <br/><br/>

                {window.localStorage.getItem('username') &&
                <Rate
                    onStarClick={this.onStarClick}
                    rating={this.state.rating}
                />
                }

                <h3 className="title is-3">Ratings</h3>
                <hr/>

                <table className="table is-fullwidth">
                    <thead>
                    <tr>
                        <td>Username</td>
                        <td>Score</td>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.ratings.sort((a, b) => a.score < b.score).map((vehicle) => {
                            return (
                                <tr key={vehicle.user}>
                                    <td>{vehicle.user}</td>
                                    <td>
                                        {vehicle.score === -1 && "Not rated"}
                                        {vehicle.score > 0 &&
                                        <StarRatingComponent
                                            editing={false}
                                            starCount={5}
                                            value={vehicle.score}
                                        />
                                        }
                                    </td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </table>
            </div>
        )
    };

}

export default VehicleInfo