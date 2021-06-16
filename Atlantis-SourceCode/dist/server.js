"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//the extra variables available from express define express types
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
//if curious see package.json, had to install types for some of these dependencies to work with TS
dotenv_1.default.config();
//notice no require in ts, there is just an import ___ from _____
const PORT = 3000;
//const PORT: number = parseInt(process.env.PORT as string, 3000);
//const PORT = process.env.PORT || 3000;
// const REDIS_PORT: number = parseInt(process.env.REDIS_PORT as string, 6379);
//console.log(REDIS_PORT)
// const client = redis.createClient(REDIS_PORT)
const app = express_1.default();
app.use(express_1.default.json());
// app.use(express.static(path.join(__dirname, '../client')));
app.get('/', (req, res) => {
    return res.status(200).sendFile(path_1.default.join(__dirname, './views/index.html'));
});
app.listen(PORT, () => {
    console.log(`server started at http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map