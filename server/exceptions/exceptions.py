from http import HTTPStatus

from exceptions.base_exception import BackEndExceptions, BackendDBBaseException


class OperationFailed(BackEndExceptions):
    def __init__(self, detail: str):
        self.detail = detail
        self.status_code = 500


class BackendNotFound(BackEndExceptions):
    def __init__(self, detail: str):
        self.detail = detail
        self.status_code = 404


class BackendConnectionError(BackendDBBaseException):
    """Exception raised when there's an issue connecting to MongoDB."""

    def __init__(self, message="Failed to connect to MongoDB"):
        super().__init__(message, HTTPStatus.SERVICE_UNAVAILABLE)


class BackendQueryError(BackendDBBaseException):
    """Exception raised when there's an error executing a MongoDB query."""

    def __init__(self, message="Error executing MongoDB query"):
        super().__init__(message, HTTPStatus.INTERNAL_SERVER_ERROR)


class BackendInsertError(BackendDBBaseException):
    """Exception raised when there's an error inserting data into MongoDB."""

    def __init__(self, message="Error inserting data into MongoDB"):
        super().__init__(message, HTTPStatus.INTERNAL_SERVER_ERROR)


class BackendUpdateError(BackendDBBaseException):
    """Exception raised when there's an error updating data in MongoDB."""

    def __init__(self, message="Error updating data in MongoDB"):
        super().__init__(message, HTTPStatus.INTERNAL_SERVER_ERROR)


class BackendDeleteError(BackendDBBaseException):
    """Exception raised when there's an error deleting data from MongoDB."""

    def __init__(self, message="Error deleting data from MongoDB"):
        super().__init__(message, HTTPStatus.INTERNAL_SERVER_ERROR)


class BackendDocumentNotFoundError(BackendDBBaseException):
    """Exception raised when a document is not found in MongoDB."""

    def __init__(self, message="Document not found in MongoDB"):
        super().__init__(message, HTTPStatus.NOT_FOUND)


class BackendIndexCreationError(BackendDBBaseException):
    """Exception raised when there's an error creating an index in MongoDB."""

    def __init__(self, message="Error creating index in MongoDB"):
        super().__init__(message, HTTPStatus.INTERNAL_SERVER_ERROR)


class BackendInvalidIdError(BackendDBBaseException):
    """Exception raised when an invalid MongoDB ObjectId is used."""

    def __init__(self, message="Invalid MongoDB ObjectId"):
        super().__init__(message, HTTPStatus.BAD_REQUEST)
