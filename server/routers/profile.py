from typing import Union

from fastapi import HTTPException, APIRouter

from database.mongo import mongo_db
from models.profile import UpdateProfile, CreateSample, DeleteSample
from models.response import ResponseSamples

router = APIRouter(tags=["Teacher Profile"])


@router.post("/profile/sample", response_model=str, status_code=201)
async def add_new_sample(sample: CreateSample):
    result = mongo_db.add_new_sample(sample)
    if result:
        return "Success adding new sample"
    raise HTTPException(status_code=500, detail="Failed to add new sample")


@router.delete("/profile/sample", status_code=200)
async def delete_sample(sample: DeleteSample):
    result = mongo_db.remove_sample(sample.sampleId)
    if result:
        return "Success removing new sample"
    raise HTTPException(status_code=500, detail="Failed to remove new sample")


@router.get("/profile/{teacher_id}/samples", status_code=200, response_model=Union[ResponseSamples | list])
async def get_samples_by_teacher_id(teacher_id):
    result = mongo_db.get_samples(teacher_id)
    for sample in result:
        sample['id'] = str(sample['_id'])
        del sample['_id']
    return result


@router.get('/profile/{user_id}')
async def get_profile(user_id: str):
    user: dict = mongo_db.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    profile: dict = mongo_db.get_teacher_profile(user_id)
    if profile:
        user.update(profile)
    del user['_id']
    return user


@router.post('/profile/{teacher_id}')
async def update_profile(teacher_id: str, update: UpdateProfile):
    if update.key in ['address', 'phoneNumber']:
        result = mongo_db.update_user(teacher_id, update)
    else:
        result = mongo_db.update_profile(teacher_id, update)
    if not result:
        raise HTTPException(status_code=500, detail='Failed to update profile')
    return f'Success update profile {update.key}'
