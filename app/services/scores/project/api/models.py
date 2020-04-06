from sqlalchemy.sql import func
from project import db


class Stops(db.Model):
    __tablename__ = 'stops'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    entity = db.Column(db.String(128), primary_key=True, nullable=False)
    city = db.Column(db.String(225), nullable=False)

    def __init__(self, id, name, entity, city):
        self.id = id
        self.name = name
        self.entity = entity
        self.city = city

    def to_json(self):
        return {
            'id': self.id,
            'name': self.name,
            'entity': self.entity,
            'city': self.city,
        }


class StopScores(db.Model):
    __tablename__ = 'stopscores'
    id = db.Column(db.Integer, primary_key=True)
    score = db.Column(db.Integer, nullable=True)
    username = db.Column(db.String(128), primary_key=True, nullable=False)

    def __init__(self, id, score, username):
        self.id = id
        self.score = score
        self.username = username

    def to_json(self):
        return {
            'id': self.id,
            'score': self.score,
            'username': self.username,

        }


class Vehicles(db.Model):
    __tablename__ = 'vehicles'
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(128), nullable=False)
    username = db.Column(db.String(128), nullable=False)

    def __init__(self, id, type, username):
        self.id = id
        self.type = type
        self.username = username

    def to_json(self):
        return {
            'id': self.id,
            'type': self.type,
            'username': self.username
        }


class VehicleScores(db.Model):
    __tablename__ = 'vehiclescores'
    id = db.Column(db.Integer, primary_key=True)
    score = db.Column(db.Integer,  nullable=True)
    username = db.Column(db.String(128), primary_key=True, nullable=False)

    def __init__(self, id, score, username):
        self.id = id
        self.score = score
        self.username = username

    def to_json(self):
        return {
            'id': self.id,
            'score': self.score,
            'username': self.username
        }
