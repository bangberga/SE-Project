"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
    const customError = {
        msg: err.message || "Internal server error",
        statusCode: err.statusCode || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
    };
    res.status(customError.statusCode).json(customError);
};
exports.default = errorHandlerMiddleware;
//# sourceMappingURL=error-handler.js.map