from socketio import AsyncNamespace

from .server import sio


class TestNamespace(AsyncNamespace):

    async def on_connect(self, sid, environ, auth):
        pass

    async def on_disconnect(self, sid):
        pass
