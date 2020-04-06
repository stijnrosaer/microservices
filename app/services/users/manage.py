from flask.cli import FlaskGroup
from project import create_app, db
from project.api.models import User

app = create_app()
cli = FlaskGroup(create_app=create_app)

@cli.command()
def recreate_db():
    db.drop_all()
    db.create_all()
    db.session.commit()

@cli.command()
def seed_db():
    db.session.add(User(username='user1', email='user1@mail.com', password='1111'))
    db.session.add(User(username='user2', email='user2@mail.com', password='2222'))
    db.session.commit()


if __name__ == '__main__':
    cli()