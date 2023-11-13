import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
axios.defaults.withCredentials = true;
function App() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  const [user, setCurrentUser] = useState(null);

  useEffect(() => {
    getCurrentUser();
  }, []);

  const getCurrentUser = () => {
    axios
      .get("http://localhost:4000/current-user", { withCredentials: true })
      .then((res) => {
        setCurrentUser(res.data);
      })
      .catch((error) => {
        // setError(error?.reponse?.data?.error);

        console.log(error);
      });
  };

  const login = async () => {
    await axios
      .get("http://localhost:4000/login", { withCredentials: true })
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        // setError(error?.reponse?.data?.error);

        console.log(error);
      });
  };
  const getProducts = () => {
    if (!localStorage.getItem("httpOnly")) {
      return;
    }
    axios
      .get("http://localhost:4000/products", { withCredentials: true })
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        // setError(error?.reponse?.data?.error);

        if (error?.response?.data?.status === 401) {
          localStorage.removeItem("httpOnly");
        }
      });
  };

  const logout = () => {
    axios
      .get("http://localhost:4000/logout", { withCredentials: true })
      .then((res) => {
        console.log(res.data);
        localStorage.removeItem("httpOnly");
      })
      .catch((error) => {
        //setError(error?.response?.data?.error);
      });
  };

  return (
    <div className="App">
      <h1>{user?.name}</h1>
      <div
        style={{
          background: "white",
        }}
      >
        <span
          style={{
            color: "red",
          }}
        >
          {error}
        </span>
      </div>
      <div className="box">
        {user ? (
          <>
            <button className="button yellow" onClick={getProducts}>
              Get Items
            </button>
            <button className="button red" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <button className="button green" onClick={login}>
            Login
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
