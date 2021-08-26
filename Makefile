.PHONY: pack move

all: clean pack move

version=0.3.3

clean: addon/*.zip
	rm addon/*.zip

pack:
	cd addon/ && zip -r FoxyRecon_v${version}.zip *

move:
	mv addon/FoxyRecon_v${version}.zip .
