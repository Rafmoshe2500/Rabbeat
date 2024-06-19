from hebrew import Hebrew

a = 'א'
b = 'יא'

after = str(Hebrew(a).gematria())
after2 = str(Hebrew(b).gematria())
print(after2, after)