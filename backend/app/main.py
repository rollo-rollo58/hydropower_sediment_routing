"""WSGI application factory and local development entry point."""
from flask import Flask
from flask_cors import CORS
from flask_sock import Sock
import json
import time

from .api import api
from .config import load_settings


def create_app() -> Flask:
    settings = load_settings()
    app = Flask(__name__)
    app.json.sort_keys = False
    CORS(app, origins=[settings.frontend_origin])
    app.register_blueprint(api)
    sock = Sock(app)

    @sock.route("/api/ws")
    def telemetry_socket(connection):
        for index in range(12):
            reading = {
                "sequence": index,
                "level_m": round(470.2 + index * 0.05, 2),
                "inflow_m3s": 780 + index * 7,
            }
            try:
                connection.send(json.dumps(reading))
            except OSError:
                break
            time.sleep(2)

    return app


if __name__ == "__main__":
    settings = load_settings()
    create_app().run(host="0.0.0.0", port=settings.port, debug=False)
