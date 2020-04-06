import React, {Component} from 'react';
import axios from "axios";
import SearchForm from "./SearchForm";
import StopsList from "./StopsList";
import VehiclesList from "./VehiclesList";

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: props.title,
            sort: props.type,
            sec: props.sec,
            searchFormdata: {
                value: '',
                value2: '',
            },
            filterItems: [],

        };
        this.handleSearchFormChange = this.handleSearchFormChange.bind(this);
        this.handleScoresFormSubmit = this.handleScoresFormSubmit.bind(this);

    };


    componentDidMount() {
        this.ClearSearchFormState();
        console.log(this.state);
    }

    handleSearchFormChange(event) {
        const obj = this.state.searchFormdata;

        if (event.target.name === 'province') {
            obj['value2'] = event.target.value

        } else {

            obj['value'] = event.target.value;
        }

        this.setState({searchFormData: obj});
    };

    ClearSearchFormState() {
        this.setState({
            searchFormdata: {
                value: '',
                value2: '',
            }
        });
    };

    handleScoresFormSubmit(event) {
        event.preventDefault();
        let url = '';
        if (this.state.sec === 'line') {
            url = `${process.env.REACT_APP_USERS_SERVICE_URL}/scores/search/${this.state.sort}/${this.state.sec}/${this.state.searchFormData.value}/${this.state.searchFormData.value2}`;

        } else {
            if (this.state.searchFormData) {
                console.log(this.state);
                url = `${process.env.REACT_APP_USERS_SERVICE_URL}/scores/search/${this.state.sort}/${this.state.sec}/${this.state.searchFormData.value}`;
            } else {
                if (this.state.sort === 'v' && this.state.sec === 'type') {
                    url = `${process.env.REACT_APP_USERS_SERVICE_URL}/scores/search/${this.state.sort}/${this.state.sec}/Bus`;
                }

            }

        }


        axios.get(url)
            .then((res) => {
                this.ClearSearchFormState();
                this.setState({filterItems: res.data.data.searchList})
            })
            .catch((err) => {
                console.log(err);
            });
    }

    render() {
        return (
            <div>
                <h2 className="title is-2">Search</h2>
                <hr/>
                <br/><br/>
                <SearchForm
                    type={this.state.type}
                    sort={this.state.sec}
                    title={this.state.title}
                    formData={this.state.searchFormdata}
                    handleSearchFormChange={this.handleSearchFormChange}
                    handleScoresFormSubmit={this.handleScoresFormSubmit}

                />
                <br/><br/>
                {this.state.sort === 's' &&
                <StopsList
                    stops={this.state.filterItems}
                />
                }
                {this.state.sort === 'v' &&
                <VehiclesList
                    vehicles={this.state.filterItems}
                />
                }


            </div>
        )
    }
    ;

}

export default Search