from Levenshtein import distance

from tools.consts import GOD


def check_God_spell(word1, word2):
    return (GOD in word1 and word2 in {'אדוני', 'אדני'}) or (
            word2 in {'אלקים', 'אלוקים'} and word1 in {'אלהים', 'אלוהים'})


def check_full_or_miss(word1, word2):
    full_chars = {'ו', 'י'}
    i1 = i2 = 0

    while i1 < len(word1) and i2 < len(word2):
        if word1[i1] == word2[i2]:
            i1 += 1
            i2 += 1
        elif word1[i1] in full_chars and word2[i2] not in full_chars:
            i1 += 1
        elif word1[i1] not in full_chars and word2[i2] in full_chars:
            i2 += 1
        elif check_if_confusion_chars(word1[i1], word2[i2]) and (i1 < len(word1) - 1 and i2 < len(word2) - 1):
            i1 += 1
            i2 += 1
        else:
            return False
    return True


def check_if_confusion_chars(char1, char2):
    confusions = [
        {'ש', 'ס'}, {'ב', 'ו'}, {'כ', 'ח'},
        {'א', 'ה', 'ע'}, {'כ', 'ק'}, {'ט', 'ת'}
    ]
    return any(char1 in confusion and char2 in confusion for confusion in confusions)


def move_forward(i1, i2, moves_i1, moves_i2):
    i1 += moves_i1
    i2 += moves_i2
    return i1, i2


def compare_words(word1, word2):
    words_distance = distance(word1, word2)
    if word1 == word2:
        return True

    elif words_distance < 3 and check_full_or_miss(word1, word2):
        return True

    elif check_God_spell(word1, word2):
        return True

    return False


def compare_texts(text1, text2):
    result = []
    words1, words2 = text1.split(), text2.split()
    len1, len2 = len(words1), len(words2)
    i1 = i2 = 0
    memory = []
    while i1 < len1 and i2 < len2:
        if compare_words(words1[i1], words2[i2]):
            result.append((words1[i1], True))
            i1, i2 = move_forward(i1, i2, 1, 1)
        else:
            if len(words1[i1]) == len(words2[i2]):
                back = update_memory(memory, words1[i1], words2[i2])
                if back != 0:
                    result[i1 - back] = (words1[i1], True)
                result.append((words1[i1], False))
                i1, i2 = move_forward(i1, i2, 1, 1)

            elif len(words1[i1]) > len(words2[i2]) and i2 < len2 - 1 and distance(words1[i1],
                                                                                  words2[i2] + words2[i2 + 1]) < 3:
                result.append((words1[i1], True))
                i1, i2 = move_forward(i1, i2, 1, 2)
            elif len(words1[i1]) < len(words2[i2]) and i1 < len1 - 1 and distance(words1[i1] + words1[i1 + 1],
                                                                                  words2[i2]) < 3:
                result.append((words1[i1], True))
                result.append((words1[i1 + 1], True))
                i1, i2 = move_forward(i1, i2, 2, 1)

            else:
                back = update_memory(memory, words1[i1], words2[i2])
                if back != 0:
                    result[i1 - back] = (words1[i1 - back], True)
                result.append((words1[i1], False))
                i1, i2 = move_forward(i1, i2, 1, 1)

    while i1 < len1:
        result.append((words1[i1], False))
        i1 += 1

    while i2 < len2:
        back = update_memory(memory, '', words2[i2])
        if back != 0:
            result[i1 - back] = (words1[i1 - 1], True)
        i2 += 1

    return result


def in_memory(memory, word):
    for memory_word in memory:
        if compare_words(memory_word, word):
            return True
    return False


def update_memory(memory: list, word1, word2) -> int:
    if in_memory(memory, word2):
        for i in range(len(memory)):
            tmp = memory.pop(0)
            if compare_words(tmp, word2):
                memory.append(word1)
                if i - 1 == 0 or i == 0:
                    return 1
                return i
    elif len(memory) > 3:
        memory.pop(0)
    memory.append(word1)
    return 0


# Test the function
t1 = 'והנה אנכי נותן לך את הברכה ואת הקללה היום כי בא השמש מראשותיו'
t2 = 'והינה אנוכי נתן לכה את הברכה ואת הקללה היום כיבה השמש מרעש אותיו'

print(f'source: {t1}\nstt: {t2}')
for word in HebrewTextComparator(t1, t2).run():
    print(word)

t1 = 'והנה אנכי נותן לך את הברכה ואת הקללה היום כי בא השמש מראשותיו'
t2 = 'והינה אנוכי נתן לכה את הברכה ואת הקללה היום כיבה השמש מרעש אותותיו'

print(f'source: {t1}\nstt: {t2}')
for word in HebrewTextComparator(t1, t2).run():
    print(word)

t1 = 'והנה והנה בא השמש בא השמש ויאמר ויאמר ויאמר והארץ איתו'
t2 = 'והינה אנוכי נתן לכה את הברכה ואת הקללה היום כיבה השמש מרעש אותיו'
print(f'source: {t1}\nstt: {t2}')

for word in HebrewTextComparator(t1, t2).run():
    print(word)

t1 = 'ויקרא אל משה וידבר יהוה אליו מאוהל מועד לאמור'
t2 = 'ויקרע אל משה וידבר שמואל אדוני אליו מאוהל מועד לאמור'
print(f'source: {t1}\nstt: {t2}')

for word in HebrewTextComparator(t1, t2).run():
    print(word)
