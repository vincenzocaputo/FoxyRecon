import requests
import re

res = requests.get("https://data.iana.org/TLD/tlds-alpha-by-domain.txt")

with open('../src/txt/tld.txt', 'w') as fd:
    tlds = res.text.lower()

    fd.write(re.sub("#.*\n", "", tlds))



