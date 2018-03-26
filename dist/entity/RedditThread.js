"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RedditThread = /** @class */ (function () {
    function RedditThread() {
    }
    Object.defineProperty(RedditThread.prototype, "subReddit", {
        get: function () {
            return this._subReddit;
        },
        set: function (value) {
            this._subReddit = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RedditThread.prototype, "title", {
        get: function () {
            return this._title;
        },
        set: function (value) {
            this._title = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RedditThread.prototype, "score", {
        get: function () {
            return this._score;
        },
        set: function (value) {
            this._score = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RedditThread.prototype, "selfLink", {
        get: function () {
            return this._selfLink;
        },
        set: function (value) {
            this._selfLink = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RedditThread.prototype, "commentsLink", {
        get: function () {
            return this._commentsLink;
        },
        set: function (value) {
            this._commentsLink = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RedditThread.prototype, "createdAt", {
        get: function () {
            return this._createdAt;
        },
        set: function (value) {
            this._createdAt = value;
        },
        enumerable: true,
        configurable: true
    });
    RedditThread.prototype.toJSON = function () {
        return {
            subReddit: this.subReddit,
            title: this.title,
            score: this.score,
            selfLink: this.selfLink,
            commentsLink: this.commentsLink,
            createdAt: this.createdAt
        };
    };
    RedditThread.prototype.toString = function () {
        var ret = "";
        ret += "Título: " + this.title + "\n";
        ret += " - SubReddit: " + this.subReddit + "\n";
        ret += " - Link: " + this.selfLink + "\n";
        ret += " - Score: " + this.score + "\n";
        ret += " - Link para os comentários: " + this.commentsLink + "\n";
        ret += "----------------------------------------\n";
        return ret;
    };
    return RedditThread;
}());
exports.RedditThread = RedditThread;
