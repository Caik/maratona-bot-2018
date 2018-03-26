"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SubRedditVisit = /** @class */ (function () {
    function SubRedditVisit() {
    }
    Object.defineProperty(SubRedditVisit.prototype, "subReddit", {
        get: function () {
            return this._subReddit;
        },
        set: function (value) {
            this._subReddit = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SubRedditVisit.prototype, "createdAt", {
        get: function () {
            return this._createdAt;
        },
        set: function (value) {
            this._createdAt = value;
        },
        enumerable: true,
        configurable: true
    });
    SubRedditVisit.prototype.toJSON = function () {
        return {
            subReddit: this.subReddit,
            createdAt: this.createdAt
        };
    };
    return SubRedditVisit;
}());
exports.SubRedditVisit = SubRedditVisit;
