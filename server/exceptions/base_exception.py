from abc import abstractmethod, ABC


class BackEndExceptions(Exception, ABC):

    @abstractmethod
    def __init__(self, detail: str, status_code):
        self.detail = detail
        self.status_code = status_code
        super().__init__(detail)
