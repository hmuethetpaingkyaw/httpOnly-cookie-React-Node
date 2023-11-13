const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");
const { serialize } = require("cookie");
const jwt = require("jsonwebtoken");
const { jwtDecode } = require("jwt-decode");

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello");
});
app.get("/login", (req, res) => {
  jwt.sign(
    {
      name: "hmue",
    },
    "hmue_httpOnly",
    {
      expiresIn: 60 * 60 * 24 * 30,
    },
    (_err, token) => {
      const serialized = serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });
      res.setHeader("Set-Cookie", serialized);
      res.status(200).send({ success: true });
    }
  );
});
app.get("/logout", (req, res) => {
  const { cookies } = req;

  const jwt = cookies.token;

  if (!jwt) {
    return res.status(401).json({
      status: "error",
      error: "Unauthorized",
    });
  }

  res.status(202).clearCookie("token").send("cookies cleared");
});
app.get("/products", (req, res) => {
  const { cookies } = req;

  const jwt = cookies.token;

  if (!jwt) {
    return res.status(401).json({
      status: "error",
      error: "Unauthorized",
    });
  }

  res.status(200).send({
    data: [
      {
        name: "Product 1",
      },
      {
        name: "Product 2",
      },
    ],
  });
});

app.get("/current-user", (req, res) => {
	const { cookies } = req;
  
	const jwt = cookies.token;
  
	if (!jwt) {
	  return res.status(401).json({
		status: "error",
		error: "Unauthorized",
	  });
	}
  
	res.status(202).send(jwtDecode(jwt));
  });

app.listen(4000);
