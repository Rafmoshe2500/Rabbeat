from abc import abstractmethod, ABC
from http import HTTPStatus


class BackEndExceptions(Exception, ABC):

    @abstractmethod
    def __init__(self, detail: str, status_code):
        self.detail = detail
        self.status_code = status_code
        super().__init__(detail)


class BackendDBBaseException(Exception):
    """Base exception for MongoDB operations."""

    def __init__(self, message="An error occurred with MongoDB operation",
                 status_code=HTTPStatus.INTERNAL_SERVER_ERROR):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)
