# services/users/project/api/auth.py


from flask import Blueprint, jsonify, request
from sqlalchemy import exc, or_, and_

from project.api.models import User
from project import db, bcrypt

auth_blueprint = Blueprint('auth', __name__)


@auth_blueprint.route('/auth/register', methods=['POST'])
def register_user():
    # get post data
    post_data = request.get_json()
    response_object = {
        'status': 'fail',
        'message': 'Invalid payload.'
    }
    if not post_data:
        return jsonify(response_object), 400
    username = post_data.get('username')
    email = post_data.get('email')
    password = post_data.get('password')
    try:
        # check for existing user
        user = User.query.filter(
            or_(User.username == username, User.email == email)).first()

        if not user:

            # add new user to db
            new_user = User(
                username=username,
                email=email,
                password=password
            )
            new_user.logedin = True
            db.session.add(new_user)
            db.session.commit()

            response_object['status'] = 'success'
            response_object['message'] = 'Successfully registered.'

            return jsonify(response_object), 201
        else:
            response_object['message'] = 'Sorry. That user already exists.'
            return jsonify(response_object), 400
    # handler errors
    except (exc.IntegrityError, ValueError) as e:
        db.session.rollback()
        return jsonify(response_object), 400


@auth_blueprint.route('/auth/login', methods=['POST'])
def login_user():
    # get post data
    post_data = request.get_json()
    response_object = {
        'status': 'fail',
        'message': 'Invalid payload.'
    }
    if not post_data:
        return jsonify(response_object), 400
    username = post_data.get('username')
    password = post_data.get('password')
    try:
        # fetch the user data
        user = User.query.filter_by(username=username).first()
        if user and bcrypt.check_password_hash(user.password, password):
            response_object['status'] = 'success'
            response_object['message'] = 'Successfully logged in.'
            user.logedin = True
            db.session.commit()
            return jsonify(response_object), 200
        else:
            response_object['message'] = 'User does not exist.'
            return jsonify(response_object), 404
    except Exception as e:
        response_object['message'] = 'Try again.'
        return jsonify(response_object), 500


@auth_blueprint.route('/auth/logout', methods=['POST'])
def logout_user():
    post_data = request.get_json()
    response_object = {
        'status': 'fail',
        'message': 'Invalid payload.'
    }
    if not post_data:
        return jsonify(response_object), 400

    username = post_data.get('username')
    user = User.query.filter_by(username=username).first()
    user.logedin = False
    db.session.commit()

    response_object = {
        'status': 'success',
        'message': 'Successfully logged out.'
    }
    return jsonify(response_object), 200
