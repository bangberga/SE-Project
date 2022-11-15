"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomResponseError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.err = true;
    }
}
exports.default = CustomResponseError;
//# sourceMappingURL=CustomResponseError.js.map