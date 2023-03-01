"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMessage = void 0;
const errorMessage = (message, res) => {
    console.log(message.text);
    return res.json({ success: false, error: message.text }).status(message.status);
};
exports.errorMessage = errorMessage;
//# sourceMappingURL=error.js.map