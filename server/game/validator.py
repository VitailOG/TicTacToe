class Validator:
    """ Validator for dataclass
    """

    def __post_init__(self):
        for name, field in self.__dataclass_fields__.items():
            if method := getattr(self, f"validate_{name}", False):
                method()
