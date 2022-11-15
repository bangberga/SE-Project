"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const notFoundMiddleware = (req, res) => {
    const customError = {
        msg: "Route does not exist",
        statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
    };
    return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json(customError);
};
exports.default = notFoundMiddleware;
//# sourceMappingURL=not-found.js.map