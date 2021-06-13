.PHONY: zip
zip:
	@zip -r redirect-me.zip \
		manifest.json \
		popup.html \
		popup.css \
		popup.js \
		background.js \
		assets
