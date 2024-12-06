import "dotenv/config";
import express from "express";
import routes from "./routes/index.js";

const app = express();
const PORT = process.env.SERVER_PORT || process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

// Error 404
app.use((_, res) => {
  res.status(404).json({
    status: {
      success: false,
      message: "La ruta solicitada no existe.",
    },
    data: null,
  });
});

app.listen(PORT, () => {
  console.log("Server is running in localhost:" + PORT);
});
