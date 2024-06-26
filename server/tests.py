import requests

def search_verse(hebrew_text):
    search_url = f"https://www.sefaria.org/api/v2/search-wrapper?q={hebrew_text}"
    response = requests.get(search_url)
    if response.status_code == 200:
        results = response.json()
        if results['total'] > 0:
            for result in results['hits']['hits']:
                text = result['_source']['exact']
                ref = result['_source']['ref']
                print(f"Text: {text}\nReference: {ref}")
        else:
            print("No results found.")
    else:
        print("Error with the request.")

# Example Hebrew text search
hebrew_text = "ויהי כי החל האדם לרב על פני האדמה ובנות ילדו להם"
search_verse(hebrew_text)
