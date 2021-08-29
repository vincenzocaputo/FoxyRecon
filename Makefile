.PHONY: pack move

all: pack move

version = 0.3.4

pack:
	cd addon/ && zip -r FoxyRecon_v$(version).zip *

move:
	mv addon/FoxyRecon_v$(version).zip .
