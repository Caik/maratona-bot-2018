"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var mongoose_1 = require("mongoose");
exports.default = mongoose.model("SubRedditVisit", new mongoose_1.Schema({
    subReddit: String,
    createdAt: Date
}));
