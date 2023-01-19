import socketio

from typing import Type

from game.namespace import TestNamespace
from game.server import sio


def get_application(s: Type[socketio.Server]) -> socketio.ASGIApp:
    application = socketio.ASGIApp(s)
    sio.register_namespace(TestNamespace('/'))
    return application


app = get_application(sio)
