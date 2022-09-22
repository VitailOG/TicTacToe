import json
import uuid

from socketio import AsyncNamespace

from .exceptions import GameNotFound
from .game import GameManager
from .server import sio
from .types import Game, Player, DataRequestType


class TestNamespace(AsyncNamespace):
    room_prefix = 'game_'
    game_manager = GameManager()

    async def on_connect(self, sid, environ, auth):
        async with sio.session(sid) as s:
            if auth is not None:
                s['username'] = auth['username']

    async def on_disconnect(self, sid):
        pass

    async def on_new_game(self, sid, figure):
        _id = str(uuid.uuid4())
        async with sio.session(sid) as s:
            new_game = Game(id=_id)
            player = Player(
                name=s['username'], user_id=sid, figure=figure
            )

            new_game.players.append(player)
            self.game_manager.create_game(new_game)

            await sio.emit(
                event='ng', data=self.game_manager.present_to_dict(self.game_manager.games)
            )

            sio.enter_room(sid, f'{self.room_prefix}{_id}')

            return _id

    async def on_games(self, sid):
        return json.dumps(self.game_manager.games)

    async def on_detail_game(self, sid, _id):
        try:
            return self.game_manager.present_to_dict(
                self.game_manager.get_game_by_id(_id)
            )
        except GameNotFound:
            pass

    async def on_join_to_game(self, sid, data):
        d = DataRequestType(**data)
        game, creator, opponent = self.game_manager.join_to_game(sid, d)
        await sio.emit('start_or_finish_game', room=f'{self.room_prefix}{game.id}', data=True)

        await sio.emit('set_user_data', data=self.game_manager.present_to_dict(creator), to=creator.user_id)
        await sio.emit('set_user_data', data=self.game_manager.present_to_dict(opponent), to=sid)

        return self.game_manager.present_to_dict(game)

    async def on_step(self, sid, data):
        game_id = data.pop('game_id')
        game = self.game_manager.get_game_by_id(game_id)
        curr_user = next(filter(lambda x: x.user_id == sid, game.players))
        curr_user.cells.append(int(data['cell']))

        player1, player2 = sorted(game.players, key=lambda x: x.user_id == sid, reverse=True)
        for i in self.game_manager.WINNING_COMBINATIONS:
            c_u = set(player1.cells)
            opp = set(player2.cells)

            if (steps := c_u & i) and len(steps) == 3:
                await sio.emit('win', to=player1.get('user_id'))
                await sio.emit('loss', to=player2.get('user_id'))
                await sio.emit('start_or_finish_game', room=f'{self.room_prefix}{game_id}', data=False)
                return

            elif len(c_u.union(opp)) == 9:
                await sio.emit('start_or_finish_game', room=f'{self.room_prefix}{game_id}', data=False)
                await sio.emit('draw', room=f'{self.room_prefix}{game_id}', data=False)

            else:
                await sio.emit('allow_step', to=player2.user_id, data=self.game_manager.present_to_dict(player2))

        await sio.emit('set_figure', room=f'{self.room_prefix}{game_id}', data=data)
        await sio.emit('block_step', to=sid, data=self.game_manager.present_to_dict(player1))
