# def merge(numbers, words):
#     new_words, new_numbers = [], []
#     all_direction = []
#     if len(numbers) < len(words):
#         difference = len(words) - len(numbers)
#         for i, number in enumerate(numbers, 1):
#             if i == len(numbers):
#                 break
#             all_direction.append((numbers[i] - number, (i - 1, i)))
#
#         all_direction.sort()
#         start_merged_indexes = [index[1][0] for index in all_direction[:difference]]
#         start_merged_indexes.sort()
#         for i in range(len(numbers)):
#             if start_merged_indexes and i == start_merged_indexes[0]:
#                 new_words.append(f'{words[i]} {words[i + 1]}')
#                 start_merged_indexes.pop(0)
#                 words.pop(i + 1)
#             else:
#                 new_words.append(words[i])
#     return new_words
# #
# #
# # numbers = [1.5, 1.7, 3.2, 4.1, 4.2]
# # words = ["apple", "banana", "cherry", "date", "elderberry", "fig", "grape"]
# #
# # merge(numbers, words)
#
#
# # def merge(numbers, words):
# #     if len(numbers) < len(words):
# #
# #
# numbers = [1.5, 1.7, 3.2, 4.1, 4.2]
# words = ["apple", "banana", "cherry", "date", "elderberry", "fig", "grape", "SSS"]
#
# print(merge(numbers, words))
