

export const getWrongWords = (text: string, targetText: string) => {
    const splittedText = text.split(' ');
    const splittedTargetText = targetText.split(' ');
    let results: Array<Word> = [];

    const length = splittedTargetText.length > splittedText.length ? splittedText.length : splittedTargetText.length;

    for (let i = 0; i < length; i++) {
        results.push({ text: splittedTargetText[i], isCorrect: splittedText[i] === splittedTargetText[i] })
    }

    return results;
}