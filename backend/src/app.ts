import path from "node:path";
import express, { type Application, type Request, type Response } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import hpp from "hpp";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env";
import { swaggerSpec } from "./config/swagger";
import { globalLimiter } from "./middleware/rateLimit";
import { errorHandler, notFound } from "./middleware/errorHandler";
import routes from "./routes";

export function createApp(): Application {
  const app = express();

  app.set("trust proxy", 1);

  // Security & parsing
  app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
  app.use(
    cors({
      origin: (origin, cb) => {
        // Allow non-browser tools (no origin) and any configured origin.
        if (!origin || env.corsOrigins.includes(origin)) return cb(null, true);
        return cb(new Error(`Origin not allowed by CORS: ${origin}`));
      },
      credentials: true,
    })
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(hpp());
  app.use(compression());
  app.use(morgan(env.isProd ? "combined" : "dev"));
  app.use(globalLimiter);

  // Static file storage (uploaded assets)
  app.use(`/${env.uploadDir}`, express.static(path.resolve(process.cwd(), env.uploadDir)));

  // Health check
  app.get("/health", (_req: Request, res: Response) =>
    res.json({ success: true, status: "ok", uptime: process.uptime() })
  );

  // API docs
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { customSiteTitle: "Prime Promenade API" }));
  app.get("/api/docs.json", (_req: Request, res: Response) => res.json(swaggerSpec));

  // All application routes
  app.use("/", routes);

  // 404 + error handling (last)
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
