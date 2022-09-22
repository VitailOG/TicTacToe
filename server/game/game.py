import uuid
from dataclasses import asdict, is_dataclass
from typing import Final

from game.exceptions import GameNotFound
from game.types import Game, DataRequestType, Player, Figure, ItemType


class GameManager:
    GAMES: list[Game] = []
    WINNING_COMBINATIONS: Final[list[set]] = [{1, 2, 3}]

    @property
    def games(self):
        return self.GAMES

    def get_game_by_id(self, id: uuid):
        try:
            return next(filter(lambda x: x.id == id, self.games))
        except StopIteration:
            raise GameNotFound

    def create_game(self, new_game: Game):
        self.games.append(new_game)

    def join_to_game(self, sid: str, data: DataRequestType) -> tuple[Game, Player, Player]:
        game = self.get_game_by_id(data.game_id)
        creator = game.players[0]
        creator.allow_move = True
        opponent = Player(user_id=sid, name=data.username, figure=self._gen_figure(creator.figure))
        game.start = True
        if opponent not in game.players and len(game.players) < 3:
            game.players.append(opponent)

        return game, creator, opponent

    @staticmethod
    def _gen_figure(figure: Figure):
        return Figure.X.value if figure == Figure.O.value else Figure.O.value

    def add_player_to_game(self):
        pass

    @staticmethod
    def present_to_dict(item: list[ItemType] | ItemType):
        if is_dataclass(item):
            return asdict(item)
        return [asdict(_) for _ in item]
