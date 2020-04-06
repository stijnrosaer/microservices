import React from 'react';

const SearchForm = (props) => {
    return (
        <div>
            <h3 className="title is-3">{props.title}</h3>

            <form onSubmit={(event) => props.handleScoresFormSubmit(event)}>
                {props.sort === 'id' &&
                <input
                    className="input"
                    type="text"
                    name="id"
                    placeholder="Choose a ID"
                    value={props.formData.value}
                    required
                    onChange={props.handleSearchFormChange}
                />
                }
                {props.sort === 'city' &&
                <input
                    className="input"
                    type="text"
                    name="city"
                    placeholder="Choose a city"
                    value={props.formData.value}
                    required
                    onChange={props.handleSearchFormChange}

                />
                }
                {props.sort === 'line' &&
                <input
                    className="input"
                    type="text"
                    name="line"
                    placeholder="Choose a line"
                    value={props.formData.value}
                    required
                    onChange={props.handleSearchFormChange}

                />
                }
                {props.sort === 'line' &&
                <div>
                    <br/>
                </div>
                }
                {props.sort === 'line' &&
                <input
                    className="input"
                    type="text"
                    name="province"
                    placeholder="Choose a province"
                    value={props.formData.value2}
                    required
                    onChange={props.handleSearchFormChange}

                />
                }
                {props.sort === 'type' &&
                <div className="select is-fullwidth">
                    <select
                        name="type"
                        value={props.formData.value}
                        required
                        onChange={props.handleSearchFormChange}

                    >
                        <option>Bus</option>
                        <option>Tram</option>
                    </select>
                </div>
                }

                <div>
                    <br/>
                </div>


                <input
                    type="submit"
                    className="button is-primary is-medium is-fullwidth"
                    value="Submit"
                />
            </form>

        </div>
    )
};

export default SearchForm;