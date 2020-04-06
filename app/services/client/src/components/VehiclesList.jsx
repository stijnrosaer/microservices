import React from 'react';
import StarRatingComponent from "react-star-rating-component";
import {Link} from 'react-router-dom';


const VehiclesList = (props) => {
    return (
        <div>
            <table className="table is-fullwidth">
                <thead>
                <tr>
                    <td>ID</td>
                    <td>Type</td>
                    <td>Score</td>
                    <td>Info</td>
                </tr>
                </thead>
                <tbody>
                {
                    props.vehicles.sort((a, b) => a.score < b.score).map((vehicle) => {
                        return (
                            <tr>
                                <td>{vehicle.id}</td>
                                <td>{vehicle.type}</td>
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
                                <td>
                                    <Link to={"/vehicle/" + vehicle.id}>
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

export default VehiclesList