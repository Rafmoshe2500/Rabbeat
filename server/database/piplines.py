PIPELINE_ALL_TEACHERS_WITH_PROFILE = [
    {
        '$match': {
            'type': 'teacher'
        }
    },
    {
        '$lookup': {
            'from': 'teacher_profile',
            'localField': 'id',
            'foreignField': 'id',
            'as': 'profile'
        }
    },
    {
        '$unwind': {
            'path': '$profile',
            'preserveNullAndEmptyArrays': False
        }
    },
    {
        '$project': {
            'id': 1,
            'firstName': 1,
            'lastName': 1,
            'email': 1,
            'phoneNumber': 1,
            'address': 1,
            'birthDay': 1,
            'type': 1,
            'image': '$profile.image',
            'aboutMe': '$profile.aboutMe',
            'recommendations': '$profile.recommendations',
            'sampleIds': '$profile.sampleIds',
            'versions': '$profile.versions'
        }
    }
]


def get_shared_lessons_pipeline(student_id, teacher_id):
    pipeline = [
        # Match documents for both student and teacher
        {
            "$match": {
                "userId": {"$in": [student_id, teacher_id]}
            }
        },
        # Group by lessonId and collect userIds
        {
            "$group": {
                "_id": "$lessonId",
                "userIds": {"$addToSet": "$userId"}
            }
        },
        # Filter for lessons shared by both student and teacher
        {
            "$match": {
                "userIds": {"$all": [student_id, teacher_id]}
            }
        },
        # Convert string lessonId to ObjectId
        {
            "$addFields": {
                "lessonObjectId": {"$toObjectId": "$_id"}
            }
        },
        # Lookup lesson details using the ObjectId
        {
            "$lookup": {
                "from": "lessons_details",
                "localField": "lessonObjectId",
                "foreignField": "_id",
                "as": "details"
            }
        },
        # Unwind the details array
        {
            "$unwind": "$details"
        },
        # Lookup study zone details for the student
        {
            "$lookup": {
                "from": "study_zone",
                "let": {"lessonId": "$_id"},
                "pipeline": [
                    {
                        "$match": {
                            "$expr": {
                                "$and": [
                                    {"$eq": ["$lessonId", "$$lessonId"]},
                                    {"$eq": ["$userId", student_id]}
                                ]
                            }
                        }
                    }
                ],
                "as": "studyZoneDetails"
            }
        },
        # Unwind the studyZoneDetails array (it will be empty if no details found)
        {
            "$unwind": {
                "path": "$studyZoneDetails",
                "preserveNullAndEmptyArrays": True
            }
        },
        # Project the final structure
        {
            "$project": {
                "_id": 0,
                "lessonId": "$_id",
                "userId": student_id,
                "details": {
                    "title": "$details.title",
                    "startChapter": "$details.startChapter",
                    "version": "$details.version",
                    "startVerse": "$details.startVerse",
                    "endChapter": "$details.endChapter",
                    "endVerse": "$details.endVerse",
                    "pentateuch": "$details.pentateuch",
                    "creationDate": "$details.creationDate"
                },
                "studyZoneDetails": {
                    "$cond": {
                        "if": {"$ifNull": ["$studyZoneDetails", False]},
                        "then": {
                            "chatId": "$studyZoneDetails.chatId",
                            "testAudioId": "$studyZoneDetails.testAudioId",
                            "status": "$studyZoneDetails.status"
                        },
                        "else": None
                    }
                }
            }
        }
    ]
    return pipeline


def get_students_by_teacher_ids_pipeline(teacher_id):
    pipeline = [
        {
            "$match": {
                "teacherId": teacher_id
            }
        },
        {
            "$lookup": {
                "from": "users",
                "localField": "studentId",
                "foreignField": "id",
                "as": "student_info"
            }
        },
        {
            "$unwind": "$student_info"
        },
        {
            "$lookup": {
                "from": "study_zone",
                "let": {
                    "student_id": "$student_info.id",
                    "teacher_id": "$teacherId"
                },
                "pipeline": [
                    {
                        "$match": {
                            "$expr": {
                                "$and": [
                                    {"$eq": ["$userId", "$$student_id"]},
                                    {"$eq": ["$teacherId", "$$teacher_id"]},
                                ]
                            }
                        }
                    },
                    {
                        "$sort": {"updated": -1}
                    },
                    {
                        "$limit": 1
                    },
                    {
                        "$project": {
                            "_id": 0,
                            "updated": 1
                        }
                    }
                ],
                "as": "study_zone"
            }
        },
        {
            "$unwind": {
                "path": "$study_zone",
                "preserveNullAndEmptyArrays": True
            }
        },
        {
            "$project": {
                "_id": 0,
                "id": "$student_info.id",
                "firstName": "$student_info.firstName",
                "lastName": "$student_info.lastName",
                "phoneNumber": "$student_info.phoneNumber",
                "expired_date": 1,
                "updated": "$study_zone.updated"
            }
        },
        {"$sort": {"expired_date": -1}}
    ]
    return pipeline
