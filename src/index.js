import express from "express";
import path from "path"
import router from "./routes/laborCostRoutes.js";

const app = express();
const port = process.env.PORT || 3000;

async function main() {
  app.use(express.json());

  // we can set a prefix for all other pages in router or just leave it as is
  app.use("/", router)

  // just for fun :)
  app.use("/images", express.static(path.join("./", 'images')));
  app.get("/", (req,res)=>{
    res.send(`
      <h1>Welcome to Limble CMMS!</h1>
      <img src="/images/limble.png" alt="Limble Image"></img>`
  )})

  app.listen(port, "0.0.0.0", () => {
    console.info(`App listening on ${port}.`);
  });
}

await main();
