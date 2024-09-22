import json
import re

with open('src/json/tools.json', 'r') as fd:
    tools = json.loads(fd.read())
    
    print(f"| Tool | Domain | IP | URL | Hash | Email | CVE | Phone | ASN |");
    print(f"| --- | --- | --- | --- | --- | --- | --- | --- | --- |");
    for tool in tools['tools']:
        name = tool['name']
        url = re.findall('http(?:s?)://[^/]*', list(tool['url'].values())[0])[0]
        is_account_required = tool.get('accountRequired', False)
        is_post = 'submitQuery' in tool.keys()
        is_domain = 'domain' in tool['types']
        is_ip = 'ip' in tool['types']
        is_url = 'url' in tool['types']
        is_hash = 'hash' in tool['types']
        is_email = 'email' in tool['types']
        is_cve = 'cve' in tool['types']
        is_phone = 'phone' in tool['types']
        is_asn = 'asn' in tool['types']
        print(f"|[{name}]({url}) {':information_source:' if is_post else ''} {':warning:' if is_account_required else ''}| {':heavy_check_mark:' if is_domain else '-'} | {':heavy_check_mark:' if is_ip else '-'} | {':heavy_check_mark:' if is_url else '-'} | {':heavy_check_mark:' if is_hash else '-'} | {':heavy_check_mark:' if is_email else '-'} | {':heavy_check_mark:' if is_cve else '-'} | {':heavy_check_mark:' if is_phone else '-'} | {':heavy_check_mark:' if is_asn else '-'} |")
