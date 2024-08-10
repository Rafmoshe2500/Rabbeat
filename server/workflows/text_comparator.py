from Levenshtein import distance

from tools.consts import GOD
from tools.utils import split_text_maybe_with_numbers_to_words


class HebrewTextComparator:
    def __init__(self, text1, text2):
        self.words1 = text1.split()  # source
        self.words2 = split_text_maybe_with_numbers_to_words(text2)  # stt
        self.len1 = len(self.words1)
        self.len2 = len(self.words2)
        self.result = []
        self.memory = []

    def run(self):
        try:
            i1 = i2 = 0
            while i1 < self.len1 and i2 < self.len2:
                if self.compare_words(self.words1[i1], self.words2[i2]):
                    self.result.append((self.words1[i1], True))
                    self.update_memory(self.words1[i1], self.words2[i2], True)
                    i1, i2 = self.move_forward(i1, i2, 1, 1)
                else:
                    i1, i2 = self.handle_mismatch(i1, i2)
            self.handle_remaining_words(i1, i2)
            return self.result
        except Exception as e:
            print(e)

    def handle_mismatch(self, i1, i2):
        if len(self.words1[i1]) == len(self.words2[i2]):
            self.update_memory(self.words1[i1], self.words2[i2], False)
            self.result.append((self.words1[i1], False))
            return self.move_forward(i1, i2, 1, 1)

        elif self.is_combined_word(i1, i2):
            self.update_memory(self.words1[i1], self.words2[i2], True)
            return self.handle_combined_word(i1, i2)
        else:
            return self.handle_default_mismatch(i1, i2)

    def is_combined_word(self, i1, i2):
        return (len(self.words1[i1]) > len(self.words2[i2]) and i2 < self.len2 - 1 and
                distance(self.words1[i1], self.words2[i2] + self.words2[i2 + 1]) < 3) or \
               (len(self.words1[i1]) < len(self.words2[i2]) and i1 < self.len1 - 1 and
                distance(self.words1[i1] + self.words1[i1 + 1], self.words2[i2]) < 3)

    def handle_combined_word(self, i1, i2):
        if len(self.words1[i1]) > len(self.words2[i2]):
            self.result.append((self.words1[i1], True))
            return self.move_forward(i1, i2, 1, 2)
        else:
            self.result.append((self.words1[i1], True))
            self.result.append((self.words1[i1 + 1], True))
            return self.move_forward(i1, i2, 2, 1)

    def handle_default_mismatch(self, i1, i2):
        back = self.update_memory(self.words1[i1], self.words2[i2], False)
        if back != 0:
            self.result[i1 - back] = (self.words1[i1 - back], True)
        self.result.append((self.words1[i1], False))
        return self.move_forward(i1, i2, 1, 1)

    def handle_remaining_words(self, i1, i2):
        while i1 < self.len1:
            self.result.append((self.words1[i1], False))
            i1 += 1

        while i2 < self.len2:
            back = self.update_memory('', self.words2[i2], False)
            if back != 0:
                self.result[i1 - back] = (self.words1[i1 - 1], True)
            i2 += 1

    def compare_words(self, word1, word2):
        if word1 == word2:
            return True
        elif distance(word1, word2) < 3 and self.check_full_or_miss(word1, word2):
            return True
        elif self.check_God_spell(word1, word2):
            return True
        return False

    @staticmethod
    def check_God_spell(word1, word2):
        return (GOD in word1 and word2 in {'אדוני', 'אדני'}) or (
                word2 in {'אלקים', 'אלוקים'} and word1 in {'אלהים', 'אלוהים'})

    def check_full_or_miss(self, word1, word2):
        full_chars = {'ו', 'י'}
        i1 = i2 = 0

        while i1 < len(word1) and i2 < len(word2):
            if word1[i1] == word2[i2]:
                i1, i2 = self.move_forward(i1, i2, 1, 1)
            elif word1[i1] in full_chars and word2[i2] not in full_chars:
                i1, i2 = self.move_forward(i1, i2, 1, 0)
            elif word1[i1] not in full_chars and word2[i2] in full_chars:
                i1, i2 = self.move_forward(i1, i2, 0, 1)
            elif HebrewTextComparator.check_if_confusion_chars(word1[i1], word2[i2]) and (
                    i1 < len(word1) - 1 and i2 < len(word2) - 1):
                i1, i2 = self.move_forward(i1, i2, 1, 1)
            else:
                return False
        return True

    @staticmethod
    def check_if_confusion_chars(char1, char2):
        confusions = [
            {'ש', 'ס'}, {'ב', 'ו'}, {'כ', 'ח'},
            {'א', 'ה', 'ע'}, {'כ', 'ק'}, {'ט', 'ת'}
        ]
        return any(char1 in confusion and char2 in confusion for confusion in confusions)

    @staticmethod
    def move_forward(i1, i2, moves_i1, moves_i2):
        return i1 + moves_i1, i2 + moves_i2

    def in_memory(self, word):
        return any(self.compare_words(memory_word, word) for memory_word in self.memory)

    def update_memory(self, word1, word2, success):
        result = 0
        if not success and self.in_memory(word2):
            for i in range(len(self.memory)):
                tmp = self.memory.pop(0)
                if self.compare_words(tmp, word2):
                    result = 1 if i <= 1 else i
        if len(self.memory) > 3:
            self.memory.pop(0)
        self.memory.append(word1)
        return result
