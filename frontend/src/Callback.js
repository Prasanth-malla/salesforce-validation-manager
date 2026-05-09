import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Callback() {

  const navigate = useNavigate();

  useEffect(() => {

    const code =
      new URLSearchParams(
        window.location.search
      ).get("code");

    if (code) {

      axios.post(
        "http://localhost:5000/token",
        { code }
      )
      .then((response) => {

        // Store access token
        localStorage.setItem(
          "accessToken",
          response.data.access_token
        );

        // Store instance URL
        localStorage.setItem(
          "instanceUrl",
          response.data.instance_url
        );

        alert(
          "Salesforce Login Successful"
        );

        navigate("/");

      })
      .catch((error) => {

        console.log(error);

        alert("Login Failed");

      });

    }

  }, []);

  return <h2>Loading...</h2>;

}

export default Callback;