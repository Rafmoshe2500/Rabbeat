type Recommendation = {
    studentId: string;
    text: string;
  };
  
  type teacherProfile = User & {
    image: string;
    aboutMe: string;
    versions: Array<string>;
    sampleIds: Array<string>;
    recommendations: Array<Recommendation>;
  };
  
  type updateProfile = {
    id: string;
    key: keyof teacherProfile;
    value: string | string[] | Recommendation[];
  };
  
  type Sample = {
    id: string
    title: string;
    audio: string;
  };

  type NewSample = {
    audio: string;
    title: string;
    teacherId: string;
  }