# Helper function to convert ObjectId to string
def object_id_str(obj):
    return {**obj, "_id": str(obj["_id"])}