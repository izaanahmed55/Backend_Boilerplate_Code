import authRouter from "../modules/Auth/auth.route.js";

const ConfigureRoutes = (app) => {
    app.use("/api/auth/", authRouter);
};

export default ConfigureRoutes;
