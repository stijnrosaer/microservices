from flask import Blueprint, jsonify, request, render_template
from project.api.models import Stops, StopScores, Vehicles, VehicleScores
from requests import request as outRec
from operator import itemgetter
import json
from project import db
import http.client

from sqlalchemy import and_

scores_blueprint = Blueprint('scores', __name__)


class DeLijn():
    def __init__(self, delijn_key='8cf6f898610949d887d496069fe9efb7'):
        self.delijn_key = delijn_key

        self.headers = {'Ocp-Apim-Subscription-Key': delijn_key}
        self.url = "/DLKernOpenData/api/v1/"
        self.directions = ['HEEN', 'TERUG']

    def request(self, method, url):
        try:
            conn = http.client.HTTPSConnection('api.delijn.be')
            request_url = self.url + url
            conn.request(method, request_url, "{body}", self.headers)

            response = conn.getresponse()
            data = response.read()

            conn.close()
            return data

        except Exception as e:
            print(e)

    def entity(self, province):
        url = '/entiteiten'

        data = self.request("GET", url)
        js = json.loads(data)

        for entity in js['entiteiten']:
            if entity['omschrijving'] == province:
                return entity['entiteitnummer']
        return


def checkStops(filterd, inScores, param=''):
    response_object = {
        'status': 'success',
    }
    scoresList = dict()
    scores = []

    for stop in inScores:
        json = stop.to_json()
        id = json['id']
        score = json['score']

        if id in scoresList:
            scoresList[id].append(score)
        else:
            scoresList[id] = [score]

    for stopData in filterd:
        if param == 'line':
            json = stopData
        else:
            json = stopData.to_json()

        scored = False

        for i in scoresList:
            if i == json['id']:
                scores.append([i, json['name'], round((sum(scoresList[i]) / len(scoresList[i])), 1)])
                scored = True
                break

        if not scored:
            scores.append([json['id'], json['name'], -1])

    sorted(scores, key=itemgetter(2))
    topScores = scores

    response_object = {
        'status': 'success',
        'data': {
            'searchList': [
                {'id': score[0], 'name': score[1], 'score': score[2]} for score in topScores
            ]
        }
    }

    return jsonify(response_object), 200


def checkVehicles(filterd, inVehicles, param=''):
    response_object = {
        'status': 'success',
    }
    scoresList = dict()
    scores = []

    for vehicle in inVehicles:
        json = vehicle.to_json()
        id = json['id']
        score = json['score']

        if id in scoresList:
            scoresList[id].append(score)
        else:
            scoresList[id] = [score]

    for vehicleData in filterd:
        if param == 'line':
            json = vehicleData
        else:
            json = vehicleData.to_json()

        scored = False

        for i in scoresList:
            if i == json['id']:
                scores.append([i, json['type'], round((sum(scoresList[i]) / len(scoresList[i])), 1)])
                scored = True
                break

        if not scored:
            scores.append([json['id'], json['type'], -1])

    sorted(scores, key=itemgetter(2))
    topScores = scores

    response_object = {
        'status': 'success',
        'data': {
            'searchList': [
                {'id': score[0], 'type': score[1], 'score': score[2]} for score in topScores
            ]
        }
    }

    return jsonify(response_object), 200


@scores_blueprint.route('/scores/search/s/id/<id>', methods=['GET'])
def searchStopId(id):
    response_object = {
        'status': 'success',
    }
    items = Stops.query.filter_by(id=id).all()
    itemScores = StopScores.query.all()

    return checkStops(items, itemScores)


@scores_blueprint.route('/scores/search/s/line/<line>/<entity>', methods=['GET'])
def searchStopLine(line, entity):
    response_object = {
        'status': 'success',
    }
    delijn = DeLijn()
    ent = delijn.entity(entity)
    url = '/lijnen/' + ent + '/' + line + '/lijnrichtingen/HEEN/haltes'
    request = delijn.request('GET', url)
    res = json.loads(request)

    itemScores = StopScores.query.all()
    items = []

    for item in res['haltes']:
        if 'entiteitnummer' in item and 'omschrijving' in item and 'omschrijvingGemeente' in item:
            items.append({
                'loaded': True,
                'id': item['haltenummer'],
                'name': item['omschrijving'],
                'entity': entity,
                'city': item['omschrijvingGemeente'],
            })

    return checkStops(items, itemScores, 'line')


@scores_blueprint.route('/scores/search/s/city/<city>', methods=['GET'])
def searchStopCity(city):
    response_object = {
        'status': 'success',
    }
    items = Stops.query.filter_by(city=city).all()
    itemScores = StopScores.query.all()

    return checkStops(items, itemScores)


@scores_blueprint.route('/scores/search/v/id/<id>', methods=['GET'])
def searchVehicleId(id):
    response_object = {
        'status': 'success',
    }
    items = Vehicles.query.filter_by(id=id).all()
    itemScores = VehicleScores.query.all()

    return checkVehicles(items, itemScores)


@scores_blueprint.route('/scores/search/v/type/<type>', methods=['GET'])
def searchVehicleType(type):
    response_object = {
        'status': 'success',
    }
    items = Vehicles.query.filter_by(type=type).all()
    itemScores = VehicleScores.query.all()

    return checkVehicles(items, itemScores)


@scores_blueprint.route('/scores/vehicle/remove', methods=['POST'])
def removeVehicle():
    data = request.get_json()
    vehicle_id = data.get('vid')

    vehicle = Vehicles.query.filter_by(id=vehicle_id).first()

    if vehicle:
        scores = VehicleScores.query.filter_by(id=vehicle_id).first()

        VehicleScores.query.filter_by(id=vehicle_id).delete()
        Vehicles.query.filter_by(id=vehicle_id).delete()

        db.session.commit()
        response_object = {
            'status': 'success',
            'id': vehicle_id,
        }
        return jsonify(response_object), 201

    else:
        response_object = {
            'status': 'failure',
            'reason': 'vehicle does not exist',
        }

    return jsonify(response_object), 201


@scores_blueprint.route('/scores/vehicle', methods=['POST'])
def set_vehicle_score():
    data = request.get_json()
    vehicle_id = data.get('vid')
    score = data.get('score')
    username = data.get('username')

    myVehicle = VehicleScores.query.filter_by(id=vehicle_id, username=username).first()
    if myVehicle:
        myVehicle.score = score
        db.session.commit()

        response_object = {
            'status': 'success',
            'id': vehicle_id,
            'score': score,
        }

    else:
        db.session.add(VehicleScores(vehicle_id, score, username))
        db.session.commit()

        response_object = {
            'status': 'success',
            'id': vehicle_id,
            'score': score,
        }

    return jsonify(response_object), 201


@scores_blueprint.route('/scores/stop', methods=['POST'])
def set_stop_score():
    data = request.get_json()
    stop_id = data.get('sid')
    score = data.get('score')
    username = data.get('username')

    myStop = StopScores.query.filter_by(id=stop_id, username=username).first()
    if myStop:
        myStop.score = score
        db.session.commit()

        response_object = {
            'status': 'success',
            'id': stop_id,
            'score': score,
        }

    else:
        db.session.add(StopScores(id=stop_id, score=score, username=username))
        db.session.commit()

        response_object = {
            'status': 'success',
            'id': stop_id,
            'score': score,
        }

    return jsonify(response_object), 201


@scores_blueprint.route('/scores/stops/avg', methods=['GET'])
def get_avg_stop_scores():
    response_object = {
        'status': 'success',
    }
    scoresList = dict()
    scores = []

    for stop in StopScores.query.all():
        json = stop.to_json()
        id = json['id']
        score = json['score']

        if id in scoresList:
            scoresList[id].append(score)
        else:
            scoresList[id] = [score]

    for stopData in Stops.query.all():
        json = stopData.to_json()

        scored = False

        for i in scoresList:
            if i == json['id']:
                scores.append([i, json['name'], round((sum(scoresList[i]) / len(scoresList[i])), 1)])
                scored = True
                break

        if not scored:
            scores.append([json['id'], json['name'], -1])

    crop = min(50, round(len(scores) / 2))
    if crop < 50:
        crop2 = crop
    else:
        crop2 = len(scores) - crop

    scores = sorted(scores, key=itemgetter(2))
    scores.reverse()
    topScores = scores[:crop]
    minScores = scores[crop2:]

    response_object = {
        'status': 'success',
        'data': {
            'topScores': [
                {'id': score[0], 'name': score[1], 'score': score[2]} for score in topScores
            ],
            'minScores': [
                {'id': score[0], 'name': score[1], 'score': score[2]} for score in minScores
            ]
        }
    }

    return jsonify(response_object), 200


@scores_blueprint.route('/scores/vehicles/avg', methods=['GET'])
def get_avg_vehicle_scores():
    response_object = {
        'status': 'success',
    }
    scoresList = dict()
    scores = []

    for vehicle in VehicleScores.query.all():
        json = vehicle.to_json()
        id = json['id']
        score = json['score']

        if id in scoresList:
            scoresList[id].append(score)
        else:
            scoresList[id] = [score]

    for vehicleData in Vehicles.query.all():
        vdjson = vehicleData.to_json()

        scored = False

        for i in scoresList:
            if i == vdjson['id']:
                scores.append([i, vdjson["type"], round((sum(scoresList[i]) / len(scoresList[i])), 1)])

                scored = True
                break

        if not scored:
            scores.append([vdjson['id'], vdjson["type"], -1])

    crop = min(50, round(len(scores) / 2))

    if crop < 50:
        crop2 = crop
    else:
        crop2 = len(scores) - crop

    scores = sorted(scores, key=itemgetter(2))
    scores.reverse()
    topScores = scores[:crop]
    minScores = scores[crop2:]

    response_object = {
        'status': 'success',
        'data': {
            'topScores': [
                {'id': score[0], 'type': score[1], 'score': score[2]} for score in topScores
            ],
            'minScores': [
                {'id': score[0], 'type': score[1], 'score': score[2]} for score in minScores
            ]
        }
    }

    return jsonify(response_object), 200


@scores_blueprint.route('/scores/vehicles/id/<id>', methods=['GET'])
def get_vehicle(id):
    vehicle = Vehicles.query.filter_by(id=id).first()
    vehicleRatings = VehicleScores.query.filter_by(id=id).all()

    json = vehicle.to_json()
    id = json['id']
    type = json['type']
    addUser = json['username']

    outScores = []
    for v in vehicleRatings:
        data = v.to_json()

        outScores.append([
            data['score'],
            data['username'],
        ])

    response_object = {
        'status': 'success',
        'data': {
            'id': id,
            'type': type,
            'addUser': addUser,
            'ratings': [
                {'user': it[1], 'score': it[0]} for it in outScores
            ]
        }
    }
    return jsonify(response_object), 200


@scores_blueprint.route('/scores/stops/id/<id>', methods=['GET'])
def get_stop(id):
    stop = Stops.query.filter_by(id=id).first()
    stopRatings = StopScores.query.filter_by(id=id).all()

    json = stop.to_json()
    id = json['id']
    name = json['name']
    entity = json['entity']

    outScores = []
    for v in stopRatings:
        data = v.to_json()

        outScores.append([
            data['score'],
            data['username'],
        ])

    response_object = {
        'status': 'success',
        'data': {
            'id': id,
            'name': name,
            'entity': entity,
            'ratings': [
                {'user': it[1], 'score': it[0]} for it in outScores
            ]
        }
    }
    return jsonify(response_object), 200


@scores_blueprint.route('/scores/addvehicle', methods=['POST'])
def addVehicle():
    data = request.get_json()
    vehicle_id = data.get('id')
    v_type = data.get('type')
    username = data.get('username')

    response_object = {
        'status': 'success',
        'id': vehicle_id,
    }

    v = Vehicles.query.filter_by(id=vehicle_id).first()
    if v:
        response_object = {
            'status': 'already added',
            'id': vehicle_id,
        }
        return jsonify(response_object), 201

    db.session.add(Vehicles(vehicle_id, v_type, username))
    db.session.commit()

    return jsonify(response_object), 201
