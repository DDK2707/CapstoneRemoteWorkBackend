require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoute = require("./routes/userRoute");
const postRoute = require ("./routes/postRoute");

//set up MongoDB connection
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true
});
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Connected to database"));


//configure Express app
const app = express();
app.set("port", process.env.PORT || 7500);
app.use(express.json());
app.use(cors());

app.use("/api/users", userRoute)
app.use("/api/posts", postRoute)
// app.use("/api/comment", commentRoute)

app.get("/", (
req, res, next) => {
  res.send({
    message: "Welcome to the TUNEz Backend",
    user_routes: {
      user_register: {
        method: "POST",
        route: "/api/users",
        request_body: {
          username: "String",
          email: "String",
          password: "String"
        },
        result: {
          jwt: "String token",
        },
      },
      user_login: {
        method: "PATCH",
        route: "/api/users",
        request_body: {
          email: "String",
          password: "String",
        },
        result: {
          jwt: "String token",
        },
      },
      all_users: {
        method: "GET",
        route: "/api/users",
        result: {
          users: "Array",
        },
      },
      single_user: {
        method: "GET",
        route: "/api/users/:user_id",
        result: {
          user: "Object",
        },
      },
      update_user: {
        method: "PUT",
        request_body: {
          username: "String",
          email: "String",
          password: "String",
          join_date: "String",
        },
        route: "/api/users/:user_id",
        result: {
          user: "Object",
        },
      },
      delete_user: {
        method: "DELETE",
        route: "/api/users/:id",
        result: {
          message: "Object",
        },
      },
      post_routes: {
        timeline: {
          method: "GET",
          request_body: {
            title: "String",
            category: "String",
            description: "String",
            img: "String",
            price: "Number",
            created_by: "Number",
            quantity: "Number"
          },
          route: "/api/posts",
          headers: {
            authorization: "Bearer (JWT token)",
          },
          result: {
            posts: "Array",
          },
        },
        single_post: {
          method: "GET",
          request_body: {
            userId: "String",
            description: "String",
            img: "String",
            likes: "Array"
          },
          route: "/products/:product_id",
          headers: {
            authorization: "Bearer (JWT token)",
          },
          result: {
            posts: "Object",
          },
        },
        create_post: {
          method: "POST",
          route: "/api/posts",
          headers: {
            authorization: "Bearer (JWT token)",
          },
          request_body: {
            userId: "String",
            description: "String",
            img: "String",
            likes: "Array",
          },
          result: {
            post: "Object",
          },
        },
        update_post: {
          method: "PUT",
          request_body: {
            userId: "String",
            description: "String",
            img: "String",
            likes: "Array"
          },
          route: "/api/posts/:post_id",
          headers: {
            authorization: "Bearer (JWT token)",
          },
          result: {
            post: "Object",
          },
        },
        delete_post: {
          method: "DELETE",
          route: "/api/posts/:post_id",
          result: {
            message: "Object",
          },
        },
      },
    }
  });
});

app.listen(app.get("port"), (server) => {
    console.info(`Server is listening on port ${app.get("port")}`);
    console.info("Press CTRL + C to close the server")
})