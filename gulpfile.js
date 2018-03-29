var gulp = require("gulp");
var ts = require("gulp-typescript");
var clean = require("gulp-clean");
var nodemon = require("gulp-nodemon");
var fs = require("fs");

var tsProject = ts.createProject("tsconfig.json");

gulp.task("default", ["serve dev"]);

gulp.task("clean", () => {
	return gulp
		.src("dist/*", {
			read: false
		})
		.pipe(clean());
});

gulp.task("compile", ["clean"], () => {
	var tsResult = tsProject.src().pipe(tsProject());
	return tsResult.js.pipe(gulp.dest("dist"));
});

gulp.task("watch", ["compile"], () => {
	gulp.watch("src/**/*.ts", ["compile"]);
});

gulp.task("loadenv", () => {
	if(!fs.existsSync(".env")) {
		console.log("Criando .env file");
		fs.createReadStream('.env.sample').pipe(fs.createWriteStream('.env'));
	}
});

gulp.task("serve dev", ["loadenv", "watch"], () => {
	nodemon({
		script: "dist/app.js",
		env: { NODE_ENV: "development" }
	}).on("restart", () => {
		console.log("restarted");
	});
});
