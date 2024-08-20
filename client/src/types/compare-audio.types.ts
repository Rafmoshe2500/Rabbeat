type CompareAudio = {
    sourceText: string;
    sttText: string;
    testAudio: string;
    lessonId: string;
}

type CompareAudioResponse = {
    score: number;
    feedback: [string, string];
};