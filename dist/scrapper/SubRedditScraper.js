"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var $ = require("cheerio");
var rp = require("request-promise");
var RedditThread_1 = require("../entity/RedditThread");
var SubRedditScraper = /** @class */ (function () {
    function SubRedditScraper() {
        this.protocol = "http://";
        this.baseUrl = "www.reddit.com/r/";
        this.minScore = 5000;
        this.threads = [];
    }
    Object.defineProperty(SubRedditScraper.prototype, "Url", {
        get: function () {
            return this.url;
        },
        set: function (value) {
            this.url = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SubRedditScraper.prototype, "MinScore", {
        get: function () {
            return this.minScore;
        },
        set: function (value) {
            this.minScore = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SubRedditScraper.prototype, "Threads", {
        get: function () {
            return this.threads;
        },
        set: function (value) {
            this.threads = value;
        },
        enumerable: true,
        configurable: true
    });
    SubRedditScraper.prototype.requestThreads = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var options, parsedHTML, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.Threads = [];
                        options = {
                            uri: this.protocol + this.baseUrl + this.Url,
                            transform: function (body) {
                                return $.load(body);
                            }
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, rp(options)];
                    case 2:
                        parsedHTML = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error(error_1);
                        return [3 /*break*/, 4];
                    case 4:
                        parsedHTML(".thing").each(function (i, element) {
                            var elem = $(element);
                            var score = parseInt($(elem).attr("data-score"), 10);
                            if (score < _this.MinScore) {
                                return;
                            }
                            var thread = new RedditThread_1.RedditThread();
                            thread.score = score;
                            thread.selfLink = $(elem).attr("data-url");
                            thread.subReddit = $(elem).attr("data-subreddit");
                            thread.commentsLink =
                                _this.protocol +
                                    _this.baseUrl +
                                    $(elem)
                                        .attr("data-permalink")
                                        .replace(/^\/r\//, "");
                            var elementTitle = $(elem)
                                .find("a.title")
                                .first()
                                .text();
                            thread.title = elementTitle;
                            thread.createdAt = new Date();
                            _this.Threads.push(thread);
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    SubRedditScraper.prototype.threadsToString = function () {
        var text = "";
        if (this.Threads.length === 0) {
            text += "Nenhuma Thread a ser mostrada!\n";
            text += " - Subreddit: " + this.Url + "\n";
            text += " - Score mínimo: " + this.MinScore + "\n";
            text += "----------------------------------------\n";
            return text;
        }
        this.Threads.forEach(function (thread) {
            text += thread.toString();
        });
        return text;
    };
    return SubRedditScraper;
}());
exports.SubRedditScraper = SubRedditScraper;
