install:
	@npm --registry=http://r.tools.elenet.me install
	@if [ ! -f "$$(which webpack)" ]; then sudo npm --registry=http://r.tools.elenet.me install webpack -g; fi

dev: install
	@npm run dev


