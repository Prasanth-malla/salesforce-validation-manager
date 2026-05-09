import React, { useState } from "react";
import axios from "axios";

function App() {

  const [rules, setRules] = useState([]);

  /*
  ==================================================
  LOGIN WITH SALESFORCE
  ==================================================
  */

  const login = async () => {

    try {

      const response =
        await axios.get(
          "https://salesforce-backend-bsvk.onrender.com"
        );

      window.location.href =
        response.data.url;

    } catch (error) {

      console.log(error);

      alert("Login failed");

    }

  };

  /*
  ==================================================
  FETCH VALIDATION RULES
  ==================================================
  */

  const fetchRules = async () => {

    const accessToken =
      localStorage.getItem("accessToken");

    const instanceUrl =
      localStorage.getItem("instanceUrl");

    try {

      const response =
        await axios.get(
          "https://salesforce-backend-bsvk.onrender.com",
          {
            params: {
              accessToken,
              instanceUrl,
            },
          }
        );

      setRules(response.data);

    } catch (error) {

      console.log(error);

      alert(
        "Failed to fetch validation rules"
      );

    }

  };

  /*
  ==================================================
  TOGGLE VALIDATION RULE
  ==================================================
  */

  const toggleRule = async (rule) => {

    const accessToken =
      localStorage.getItem("accessToken");

    const instanceUrl =
      localStorage.getItem("instanceUrl");

    try {

      await axios.patch(
        "https://salesforce-backend-bsvk.onrender.com",
        {
          accessToken,
          instanceUrl,
          rule,
        }
      );

      // Refresh rules after toggle
      fetchRules();

    } catch (error) {

      console.log(error);

      alert(
        "Failed to update validation rule"
      );

    }

  };

  /*
  ==================================================
  UI
  ==================================================
  */

  return (

    <div
      style={{
        padding: "30px",
        fontFamily: "Arial",
        backgroundColor: "#f4f6f9",
        minHeight: "100vh",
      }}
    >

      {/* Heading */}

      <h1
        style={{
          color: "#0176d3",
          marginBottom: "30px",
        }}
      >
        Salesforce Validation Rule Manager
      </h1>

      {/* Login Button */}

      <button
        onClick={login}
        style={{
          padding: "12px 20px",
          backgroundColor: "#0176d3",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginRight: "10px",
          fontSize: "16px",
        }}
      >
        Login with Salesforce
      </button>

      {/* Fetch Rules Button */}

      <button
        onClick={fetchRules}
        style={{
          padding: "12px 20px",
          backgroundColor: "#2e844a",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Get Validation Rules
      </button>

      {/* Validation Rules */}

      <div style={{ marginTop: "30px" }}>

        {
          rules.length === 0 ? (

            <p>
              No validation rules loaded
            </p>

          ) : (

            rules.map((rule) => (

              <div
                key={rule.Id}
                style={{
                  backgroundColor: "white",
                  padding: "20px",
                  marginBottom: "15px",
                  borderRadius: "8px",
                  boxShadow:
                    "0px 2px 8px rgba(0,0,0,0.1)",
                }}
              >

                {/* Rule Name */}

                <h2
                  style={{
                    marginBottom: "10px",
                  }}
                >
                  {rule.ValidationName}
                </h2>

                {/* Status */}

                <p
                  style={{
                    color:
                      rule.Active
                        ? "green"
                        : "red",
                    fontWeight: "bold",
                    marginBottom: "15px",
                  }}
                >
                  Status:
                  {
                    rule.Active
                      ? " Active"
                      : " Inactive"
                  }
                </p>

                {/* Toggle Button */}

                <button
                  onClick={() => toggleRule(rule)}
                  style={{
                    padding: "10px 18px",
                    backgroundColor:
                      rule.Active
                        ? "#ba0517"
                        : "#2e844a",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "15px",
                  }}
                >
                  {
                    rule.Active
                      ? "Deactivate"
                      : "Activate"
                  }
                </button>

              </div>

            ))

          )
        }

      </div>

    </div>

  );

}

export default App;
