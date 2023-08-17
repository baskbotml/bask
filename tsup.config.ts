import { defineConfig } from 'tsup'

export default defineConfig({
	entry: ["./index.ts", "./plugins/**/*", "./commands/**/*", "./events/**/*", "./schemas/**/*"],
	splitting: true,
	sourcemap: false,
	clean: true,
	outDir: './dist',
	format: ['esm'],
	target: 'esnext',
	minify: true
})