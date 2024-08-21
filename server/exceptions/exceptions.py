from base_exception import BackEndExceptions


class OperationFailed(BackEndExceptions):
    def __init__(self, detail: str):
        self.detail = detail
        self.status_code = 500


class NotFound(BackEndExceptions):
    def __init__(self, detail: str):
        self.detail = detail
        self.status_code = 404
