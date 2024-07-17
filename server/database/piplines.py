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
        {"$match": {"userId": {"$in": [student_id, teacher_id]}}},

        # Group by lessonId and collect userIds
        {"$group": {
            "_id": "$lessonId",
            "userIds": {"$addToSet": "$userId"}
        }},

        # Filter for lessons shared by both student and teacher
        {"$match": {
            "userIds": {"$all": [student_id, teacher_id]}
        }},

        # Lookup lesson details
        {"$lookup": {
            "from": "lessons_details",
            "localField": "_id",
            "foreignField": "lessonId",
            "as": "details"
        }},

        # Unwind the details array
        {"$unwind": "$details"},

        # Lookup lesson status for the student
        {"$lookup": {
            "from": "lesson_status",
            "let": {"lessonId": "$_id"},
            "pipeline": [
                {"$match": {
                    "$expr": {
                        "$and": [
                            {"$eq": ["$lessonId", "$$lessonId"]},
                            {"$eq": ["$userId", student_id]}
                        ]
                    }
                }}
            ],
            "as": "status"
        }},

        # Unwind the status array (it will be empty if no status found)
        {"$unwind": {
            "path": "$status",
            "preserveNullAndEmptyArrays": True
        }},

        # Project the final structure
        {"$project": {
            "_id": 0,
            "lessonId": "$details.lessonId",
            "title": "$details.title",
            "startChapter": "$details.startChapter",
            "version": "$details.version",
            "startVerse": "$details.startVerse",
            "endChapter": "$details.endChapter",
            "endVerse": "$details.endVerse",
            "pentateuch": "$details.pentateuch",
            "creationDate": "$details.creationDate",
            "status": {
                "$ifNull": ["$status.status", ""]
            }
        }}
    ]
    return pipeline
