import json
import argparse

with open('src/json/tools.json') as fd:
    tools = json.load(fd)

tags = { tag for t in tools['tools'] for tag in t.get('tags', []) }
types = { ty for t in tools['tools'] for ty in t.get('types', []) }

parser = argparse.ArgumentParser(description="An utility to add new resource to tools.json")
parser.add_argument('-n', '--name', description="The name of the web resource", dest="tool_name")
parser.add_argument('-d', '--description', description="A short description", dest="tool_descr")
parser.add_argument('-c', '--color', description="The color for the tool button (HEX)", dest="tool_color")
parser.add_argument('-t', '--types', description="Accepted types", type=list dest="tool_types", choices=types)
parser.add_argument('-T', '--tags', description="Tags", type=list dest="tool_tags", choices=tags)
parser.add_argument('-T', '--tags', description="Tags", type=list dest="tool_tags", choices=tags)
print(types)
