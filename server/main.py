import socketio

from socketio import AsyncNamespace


class TestNamespace(AsyncNamespace):

    async def on_connect(self, sid, environ, auth):
        pass

    async def on_disconnect(self, sid):
        pass


def get_application():
    sio = socketio.AsyncServer(
        async_mode="asgi",
        cors_allowed_origins='*'
    )
    
    app = socketio.ASGIApp(sio)
    sio.register_namespace(TestNamespace('/'))
    app.sio = sio
    return app


app = get_application()
