$(VERBOSE).SILENT:

.PHONY: all
all:
	@echo "(◕‿◕✿)"

.PHONY: clean
clean:
	if [ -f "src/routes/life.js" ]; then rm src/routes/life.js; fi
	if [ -f "src/routes/life.d.ts" ]; then rm src/routes/life.d.ts; fi
	if [ -f "src/routes/life_bg.wasm" ]; then rm src/routes/life_bg.wasm; fi
	if [ -f "src/routes/life_bg.d.ts" ]; then rm src/routes/life_bg.d.ts; fi
	@echo Done

.PHONY: crate
crate:
	cp crate/pkg/life.js src/routes
	cp crate/pkg/life.d.ts src/routes
	cp crate/pkg/life_bg.wasm src/routes
	cp crate/pkg/life_bg.wasm.d.ts src/routes
	@echo Done

.PHONY: format
format:
	npm run format
	@echo Done

.PHONY: lint
lint:
	npm run lint
	@echo Done

.PHONY: check
check:
	npm run check
	@echo Done
