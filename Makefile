install:
	@npm install
	@if [ ! -f "$$(which webpack)" ]; then sudo npm install webpack -g; fi

dev: install
	@npm run dev


