import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

db = SQLAlchemy()


def create_app(script_info=None):
    app = Flask(__name__)

    CORS(app)

    app_settings = os.getenv('SCORES_APP_SETTINGS')
    app.config.from_object(app_settings)

    db.init_app(app)

    from project.api.scores import scores_blueprint
    app.register_blueprint(scores_blueprint)

    @app.shell_context_processor
    def ctx():
        return {'app': app, 'db': db}

    return app
