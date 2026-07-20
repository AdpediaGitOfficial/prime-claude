import swaggerJsdoc from "swagger-jsdoc";
import { env } from "./env";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Prime Promenade API",
      version: "1.0.0",
      description:
        "Backend & admin API for the Prime Promenade website. Public endpoints mirror the existing frontend contract; admin endpoints are JWT-protected.",
    },
    servers: [{ url: env.publicBaseUrl, description: env.nodeEnv }],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
    },
    tags: [
      { name: "Public - OTP" },
      { name: "Public - Bookings" },
      { name: "Public - Forms" },
      { name: "Public - Listings" },
      { name: "Admin - Auth" },
      { name: "Admin - Dashboard" },
      { name: "Admin - Bookings" },
      { name: "Admin - Content" },
      { name: "Admin - Listings" },
      { name: "Admin - Uploads" },
      { name: "Admin - Users" },
    ],
  },
  // Scan route files for @openapi JSDoc blocks.
  apis: ["src/modules/**/*.routes.ts", "dist/modules/**/*.routes.js"],
};

export const swaggerSpec = swaggerJsdoc(options);
