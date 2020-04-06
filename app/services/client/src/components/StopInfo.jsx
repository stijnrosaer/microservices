import React, {Component} from 'react';
import axios from "axios";
import StarRatingComponent from "react-star-rating-component";
import Rate from "./Rate";

class StopInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.match.params.id,
            stop: '',
            ratings: [],
            rating: 0,
        };
        this.onStarClick = this.onStarClick.bind(this);
    };

    componentDidMount() {
        this.getStop();
    }

    getStop() {
        let url = `${process.env.REACT_APP_USERS_SERVICE_URL}/scores/stops/id/${this.state.id}`;
        axios.get(url)
            .then((res) => {
                console.log(res);
                this.setState({stop: res.data.data});
                this.setState({ratings: res.data.data.ratings})
            })
            .catch((err) => {
                console.log(err);

            });
    };

    async onStarClick(nextValue, prevValue, name) {
        await this.setState({rating: nextValue});
        this.rate();
    }

   rate() {
        let url = `${process.env.REACT_APP_USERS_SERVICE_URL}/scores/stop`;
        let data = {
            'username': window.localStorage.getItem('username'),
            'score': this.state.rating,
            'sid': this.state.id,
        };
        console.log(data);
        axios.post(url, data)
            .then((res) => {
                this.getStop();
            })
            .catch((err) => {
                console.log(err);

            });
    }

    render() {
        return (
            <div>
                <h2 className="title is-2">Stop info</h2>
                <hr/>
                <br/><br/>

                <h3
                    className="box title is-5"
                >Stop id: &emsp;&emsp; {this.state.stop.id}
                </h3>
                <h3
                    className="box title is-5"
                >Stop name:&emsp; {this.state.stop.name}
                </h3>
                <h3
                    className="box title is-5"
                >Province: &emsp;&emsp; {this.state.stop.entity}
                </h3>
                <br/><br/>

                {window.localStorage.getItem('username') &&
                <Rate
                    onStarClick={this.onStarClick}
                    rating={this.state.rating}
                />
                }


                <br/><br/>
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
                        this.state.ratings.sort((a, b) => a.score < b.score).map((stop) => {
                            return (
                                <tr>
                                    <td>{stop.user}</td>
                                    <td>
                                        {stop.score === -1 && "Not rated"}
                                        {stop.score > 0 &&
                                        <StarRatingComponent
                                            editing={false}
                                            starCount={5}
                                            value={stop.score}
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

export default StopInfo