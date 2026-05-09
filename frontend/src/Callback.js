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
        "https://salesforce-backend-bsvk.onrender.com/token",
        { code }
      )
      .then((response) => {

        localStorage.setItem(
          "accessToken",
          response.data.access_token
        );

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

  }, [navigate]);

  return <h2>Loading...</h2>;

}

export default Callback;