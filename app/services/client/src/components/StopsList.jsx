import React from 'react';
import StarRatingComponent from "react-star-rating-component";
import {Link} from 'react-router-dom';


const StopsList = (props) => {
    return (
        <div>
            <table className="table is-fullwidth">
                <thead>
                <tr>
                    <td>ID</td>
                    <td>Name</td>
                    <td>Score</td>
                    <td>Info</td>
                </tr>
                </thead>
                <tbody>
                {
                    props.stops.sort((a, b) => a.score < b.score).map((stop) => {
                        return (
                            <tr>
                                <td>{stop.id}</td>
                                <td>{stop.name}</td>
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
                                <td>
                                    <Link to={"/stop/" + stop.id}>
                                        <button className="button is-primary">
                                            <span>Info</span>
                                        </button>
                                    </Link>
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

export default StopsList