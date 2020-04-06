from flask.cli import FlaskGroup
from project import create_app, db
from project.api.models import Stops, StopScores, Vehicles, VehicleScores
import http.client
import json

app = create_app()
cli = FlaskGroup(create_app=create_app)


class DeLijn():
    def __init__(self, delijn_key='8cf6f898610949d887d496069fe9efb7'):
        self.delijn_key = delijn_key

        self.headers = {'Ocp-Apim-Subscription-Key': delijn_key}
        self.url = "/DLKernOpenData/api/v1/"
        self.directions = ['HEEN', 'TERUG']

    def entity(self, province):
        url = '/entiteiten'

        data = self.request("GET", url)
        js = json.loads(data)

        for entity in js['entiteiten']:
            if entity['omschrijving'] == province:
                return entity['entiteitnummer']
        return

    def revEntity(self, number):
        url = '/entiteiten'

        data = self.request("GET", url)
        js = json.loads(data)

        for entity in js['entiteiten']:
            if entity['entiteitnummer'] == number:
                return entity['omschrijving']
        return

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


@cli.command()
def recreate_db():
    db.drop_all()
    db.create_all()
    db.session.commit()


@cli.command()
def load_stops():
    delijn = DeLijn()

    url = '/haltes'
    request = delijn.request('GET', url)
    stops = json.loads(request)

    enti = dict()

    enti['1'] = delijn.revEntity('1')
    enti['2'] = delijn.revEntity('2')
    enti['3'] = delijn.revEntity('3')
    enti['4'] = delijn.revEntity('4')
    enti['5'] = delijn.revEntity('5')

    for stop in stops['haltes']:
        if 'haltenummer' in stop and 'omschrijvingGemeente' in stop:
            id = stop['haltenummer']
            name = stop['omschrijving']
            entity = enti[stop['entiteitnummer']]
            city = stop['omschrijvingGemeente']

            db.session.add(Stops(id, name, entity, city))

    db.session.commit()
    return


@cli.command()
def seed_stops():
    db.session.add(StopScores(101000, 3, 'user1'))
    db.session.add(StopScores(101001, 5, 'user2'))

    db.session.commit()


@cli.command()
def seed_vehicles():
    db.session.add(Vehicles(1, "Bus", 'user1'))
    db.session.add(Vehicles(2, "Bus", 'user1'))
    db.session.add(Vehicles(3, "Bus", 'user2'))
    db.session.add(Vehicles(4, "Bus", 'user1'))
    db.session.add(Vehicles(5, "Bus", 'user2'))
    db.session.add(Vehicles(6, "Bus", 'user2'))
    db.session.add(Vehicles(7, "Bus", 'user1'))
    db.session.add(Vehicles(8, "Bus", 'user1'))

    db.session.add(VehicleScores(1, 2, 'user1'))
    db.session.add(VehicleScores(2, 3, 'user1'))
    db.session.add(VehicleScores(3, 5, 'user1'))
    db.session.add(VehicleScores(4, 4, 'user1'))
    db.session.add(VehicleScores(5, 1, 'user1'))
    db.session.add(VehicleScores(2, 3, 'user2'))
    db.session.add(VehicleScores(4, 2, 'user2'))
    db.session.add(VehicleScores(3, 1, 'user2'))
    db.session.add(VehicleScores(6, 2, 'user1'))

    db.session.commit()


if __name__ == '__main__':
    cli()
