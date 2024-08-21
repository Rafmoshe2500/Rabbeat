from typing import Union

from fastapi import HTTPException, APIRouter

from database.mongo import mongo_db
from exceptions.exceptions import OperationFailed, NotFound
from models.profile import UpdateProfile, CreateSample, DeleteSample
from models.response import ResponseSamples

router = APIRouter(tags=["Teacher Profile"])


@router.post("/profile/sample", response_model=str, status_code=201)
async def add_new_sample(sample: CreateSample):
    result = mongo_db.add_new_sample(sample)
    profile = mongo_db.get_teacher_profile(sample.teacherId)
    profile['sampleIds'].append(str(result.inserted_id))
    new_updated_profile = UpdateProfile(key='sampleIds', value=profile['sampleIds'])
    mongo_db.update_profile(sample.teacherId, new_updated_profile)
    if result:
        return "Success adding new sample"
    raise HTTPException(status_code=500, detail="Failed to add new sample")


@router.delete("/profile/sample", status_code=200)
async def delete_sample(del_sample: DeleteSample):
    sample_id = del_sample.sampleId
    sample = mongo_db.get_sample_by_id(sample_id)
    profile = mongo_db.get_teacher_profile(sample['teacherId'])
    sample_ids: list = profile['sampleIds']
    sample_ids.remove(sample_id)
    mongo_db.update_profile(sample['teacherId'], UpdateProfile(key='sampleIds', value=sample_ids))
    result = mongo_db.remove_sample(sample_id)
    if result:
        return "Success removing new sample"
    raise OperationFailed(detail="Failed to remove new sample")


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
        raise NotFound(detail="User not found")
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
        raise OperationFailed(detail='Failed to update profile')
    return f'Success update profile {update.key}'
