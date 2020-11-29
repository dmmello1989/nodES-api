const customExpress = require("./config/customExpress");
const connection = require("./infra/connection");
const Tabelas = require("./infra/tabelas");

connection.connect((err) => {
  if(err) {
    console.log("ERROR:", err)
  } else {
    console.log("Connection succesful")

    Tabelas.init(connection);
    const app = customExpress();
    app.listen(3000, console.log("Server start on port 3000"));
  }
});


