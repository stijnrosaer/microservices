import React, { Component} from 'react';
import axios from "axios";
import StopsList from "./StopsList";

class Stops extends Component {
    constructor(props) {
        super(props);
        this.state = {
            topStops: [],
            minStops: [],
        }
    };

    componentDidMount() {
        this.getStops();
    }

    getStops() {
        axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/scores/stops/avg`)
            .then((res) => {
                this.setState({topStops: res.data.data.topScores});
                this.setState({minStops: res.data.data.minScores});
            })
            .catch((err) => {
                console.log(err);
            });
    };

    render() {
        return (
            <div className="columns">
                <div className="column">

                    <h3 className="title">Top rated stops</h3>
                    <StopsList
                        stops={this.state.topStops}
                    />
                </div>

                <div className="column">

                    <h3 className="title">Worst rated stops</h3>
                    <StopsList
                        stops={this.state.minStops}
                    />
                </div>
            </div>


        )
    };

}

export default Stops