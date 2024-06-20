import bcrypt


def hash_password(password: str) -> str:
    # Generate a salt
    salt = bcrypt.gensalt()
    # Hash the password
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
    # Return the hashed password as a string
    return hashed_password.decode('utf-8')


# Example usage
plain_password = "my_secure_password"
hashed_password = hash_password(plain_password)
print(f"Hashed password: {hashed_password}")


def check_password(plain_password: str, hashed_password: str) -> bool:
    # Verify the password
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))


is_correct = check_password(plain_password, hashed_password)
print(f"Password is correct: {is_correct}")
