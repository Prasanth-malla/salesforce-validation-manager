const express = require("express");
const axios = require("axios");
const cors = require("cors");
const crypto = require("crypto");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;

/*
==================================================
SALESFORCE LOGIN URL WITH PKCE
==================================================
*/

app.get("/auth-url", (req, res) => {

  // Generate Code Verifier
  const codeVerifier =
    crypto.randomBytes(32).toString("hex");

  // Generate Code Challenge
  const codeChallenge =
    crypto
      .createHash("sha256")
      .update(codeVerifier)
      .digest("base64url");

  // Store verifier globally
  global.codeVerifier = codeVerifier;

  // OAuth URL
  const url =
    `https://login.salesforce.com/services/oauth2/authorize` +
    `?response_type=code` +
    `&client_id=${process.env.CLIENT_ID}` +
    `&redirect_uri=${process.env.REDIRECT_URI}` +
    `&code_challenge=${codeChallenge}` +
    `&code_challenge_method=S256`;

  res.json({ url });

});

/*
==================================================
GET ACCESS TOKEN
==================================================
*/

app.post("/token", async (req, res) => {

  const { code } = req.body;

  try {

    const response = await axios.post(
      "https://login.salesforce.com/services/oauth2/token",
      null,
      {
        params: {
          grant_type: "authorization_code",
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          redirect_uri: process.env.REDIRECT_URI,
          code,
          code_verifier: global.codeVerifier,
        },
      }
    );

    res.json(response.data);

  } catch (error) {

    console.log(
      error.response?.data || error.message
    );

    res.status(500).json(
      error.response?.data || {
        error: "Failed to generate token",
      }
    );

  }

});

/*
==================================================
GET VALIDATION RULES
==================================================
*/

app.get("/validation-rules", async (req, res) => {

  const {
    accessToken,
    instanceUrl,
  } = req.query;

  // Correct Tooling API Query
  const query = `
    SELECT Id,
           ValidationName,
           Active
    FROM ValidationRule
    WHERE EntityDefinition.QualifiedApiName='Account'
  `;

  try {

    const response = await axios.get(
      `${instanceUrl}/services/data/v59.0/tooling/query`,
      {
        headers: {
          Authorization:
            `Bearer ${accessToken}`,
        },
        params: {
          q: query,
        },
      }
    );

    res.json(response.data.records);

  } catch (error) {

    console.log(
      error.response?.data || error.message
    );

    res.status(500).json(
      error.response?.data || {
        error:
          "Failed to fetch validation rules",
      }
    );

  }

});

/*
==================================================
TOGGLE VALIDATION RULE
==================================================
*/

app.patch("/toggle-rule", async (req, res) => {

  const {
    accessToken,
    instanceUrl,
    rule,
  } = req.body;

  try {

    /*
    ==============================================
    FETCH FULL VALIDATION RULE
    ==============================================
    */

    const fullRule =
      await axios.get(
        `${instanceUrl}/services/data/v59.0/tooling/sobjects/ValidationRule/${rule.Id}`,
        {
          headers: {
            Authorization:
              `Bearer ${accessToken}`,
          },
        }
      );

    /*
    ==============================================
    GET FULL METADATA
    ==============================================
    */

    const metadata =
      fullRule.data.Metadata;

    /*
    ==============================================
    TOGGLE ACTIVE STATUS
    ==============================================
    */

    metadata.active = !rule.Active;

    /*
    ==============================================
    UPDATE VALIDATION RULE
    ==============================================
    */

    await axios.patch(
      `${instanceUrl}/services/data/v59.0/tooling/sobjects/ValidationRule/${rule.Id}`,
      {
        Metadata: metadata,
      },
      {
        headers: {
          Authorization:
            `Bearer ${accessToken}`,
          "Content-Type":
            "application/json",
        },
      }
    );

    res.json({
      message:
        "Validation Rule Updated Successfully",
    });

  } catch (error) {

    console.log(
      error.response?.data || error.message
    );

    res.status(500).json(
      error.response?.data || {
        error:
          "Failed to update validation rule",
      }
    );

  }

});

/*
==================================================
START SERVER
==================================================
*/

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});