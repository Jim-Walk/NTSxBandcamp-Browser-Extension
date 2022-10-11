firefox:
	cp manifest2.json manifest.json
	zip extension.zip * -r
	rm manifest.json
	

chrome:
	cp manifest3.json manifest.json
	zip extension.zip * -r
	rm manifest.json
