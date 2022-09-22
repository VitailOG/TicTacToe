from dataclasses import dataclass, field
from typing import NamedTuple
from uuid import UUID

from pydantic.dataclasses import dataclass as _dataclass
from pydantic import ValidationError
from enum import Enum

from .validator import Validator


class Figure(Enum):
    X = "X"
    O = "O"


class PlayersListField(list):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v) -> list:
        match v:
            case [_, _]: return v  # if length equal 2
            case [_]: return v  # if length equal 1
            case [_, _, *_]: raise ValidationError('Many players, max - 2')  # if length more than equal 2
            case _: return v  # if length equal 0


@dataclass
class Player(Validator):
    name: str
    user_id: str
    figure: Figure
    cells: list[int] = field(default_factory=list)
    allow_move: bool = False

    def validate_name(self):
        if not self.name[0].isalpha():
            raise ValidationError('Name must be start only letter')
        return self.name


@_dataclass
class Game:
    id: str
    start: bool = False
    winning: bool = False
    players: PlayersListField[Player] = field(default_factory=lambda: [])


class DataRequestType(NamedTuple):
    username: str
    game_id: UUID


ItemType = Game | Player
