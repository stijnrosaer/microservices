import React from 'react';
import {Redirect} from 'react-router-dom';
import StarRatingComponent from "react-star-rating-component";


const Rate = (props) => {
    if (!window.localStorage.getItem('username')) {
        return <Redirect to='/'/>;
    }
    return (
        <div>
            <h3 className="title is-3">Enter a rating</h3>
            <hr/>
            <StarRatingComponent
                editing={true}
                starCount={5}
                value={props.rating}
                onStarClick={props.onStarClick}
            />
            <br/>
            <br/>

        </div>
    )
};

export default Rate;