from socketio import AsyncNamespace

from .index import app


class TestNamespace(AsyncNamespace):

    async def connect(self, sid, environ, auth):
        async with app.sio.session(sid) as session:
            session['name'] = auth.get('username')

    @app.sio.on('disconnect')
    async def disconnect(self, sid):
        pass
