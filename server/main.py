import socketio

from typing import Type, TypeAlias

from game.namespace import TestNamespace
from game.server import sio

T: TypeAlias = Type[socketio.Server]


def get_application(s: T) -> socketio.ASGIApp:
    application = socketio.ASGIApp(s)
    sio.register_namespace(TestNamespace('/'))
    return application


app = get_application(sio)
