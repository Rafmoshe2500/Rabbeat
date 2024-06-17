import time

from selenium import webdriver
from selenium.webdriver.common.by import By

# Set up Chrome options (optional)
chrome_options = webdriver.ChromeOptions()
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-dev-shm-usage")
chrome_options.add_argument("--headless")  # Uncomment if you want to run headless

# Initialize the Chrome driver using ChromeDriverManager
driver = webdriver.Chrome(options=chrome_options)


def get_full_text_return_verse_with_nikud(string):
    try:
        driver.get("https://nakdan.dicta.org.il/")

        element = driver.find_element(By.ID, "text-wrap")
        element.clear()  # Clear the element before sending keys
        element.send_keys(string)
        button = driver.find_element(By.CLASS_NAME, "btn-primary")
        button.click()

        # Optionally wait for some time to let the new content load
        time.sleep(2)  # Adjust the sleep time as needed

        # Find the element with class 'space' and get its text
        space_element = driver.find_element(By.CLASS_NAME, "space")
        space_text = space_element.text

        return space_text
    finally:
        driver.quit()
