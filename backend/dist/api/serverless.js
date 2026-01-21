"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../src/app.module");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const platform_express_1 = require("@nestjs/platform-express");
const express_1 = require("express");
const server = (0, express_1.default)();
exports.default = async (req, res) => {
    if (!global.__nestApp) {
        const expressApp = (0, express_1.default)();
        const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(expressApp), { logger: ['error', 'warn'] });
        const configService = app.get(config_1.ConfigService);
        app.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }));
        app.enableCors({
            origin: [
                'https://frontend-opal-ten-97.vercel.app',
                'http://localhost:5173',
                'http://localhost:3000',
            ],
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
        });
        app.setGlobalPrefix('api/v1');
        await app.init();
        global.__nestApp = app.getHttpAdapter().getInstance();
    }
    return global.__nestApp(req, res);
};
//# sourceMappingURL=serverless.js.map