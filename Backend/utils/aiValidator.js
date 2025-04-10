// utils/aiValidator.js
const axios = require("axios");

async function validatePRWithFunction(prCode, issueContent) {
  try {
    const response = await axios.post(
      "https://api.function.network/v1/run",
      {
        function: `
You are an AI code reviewer. Given a GitHub Issue and a code snippet from a Pull Request (PR), determine if the PR **fully solves** the issue.

Return a JSON object like this:
{
  "solvesIssue": true,
  "reason": "Reason why it does or doesn't solve the issue"
}

Issue:
${issueContent}

Code:
${prCode}
        `,
        temperature: 0.3,
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.FUNCTION_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data.output;
    return JSON.parse(data); // returns { solvesIssue: true/false, reason: "..."}
  } catch (error) {
    console.error("🔴 Error from Function API:", error.message);
    return { solvesIssue: false, reason: "Function API failed" };
  }
}

module.exports = validatePRWithFunction;
