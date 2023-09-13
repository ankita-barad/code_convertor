require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.use(express.json());
app.use(cors());

app.post("/convert", async (req, res) => {
  const { sourceCode, targetLanguage } = req.body;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/engines/text-davinci-002/completions",
      {
        prompt: `Translate the following code from ${targetLanguage} to ${targetLanguage}:\n${sourceCode}`,
        max_tokens: 150,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    const translatedCode = response.data.choices[0].text;
    res.status(200).json({ translatedCode });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Conversion failed" });
  }
});
app.post("/api/debug", async (req, res) => {
  try {
    const sourceCode = req.body.sourceCode;

    // Send the source code to the OpenAI API for code generation and explanation
    const response = await axios.post(
      "https://api.openai.com/v1/engines/text-davinci-002/completions",
      {
        prompt: `Debug the following code:\n${sourceCode} return updated source code and explaination to fix the issue in code`,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    // Extract the explanation and corrected code from the OpenAI response
    const correctedCodeWithExplanation = response.data.choices[0].text;

    // Respond with the explanation and the corrected code
    res.status(200).json({ correctedCodeWithExplanation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Debugging and explanation failed" });
  }
});

app.post("/api/code-quality", async (req, res) => {
  try {
    const sourceCode = req.body.sourceCode;

    // Send the source code to the OpenAI API for code quality analysis
    const response = await axios.post(
      "https://api.openai.com/v1/engines/text-davinci-002/completions",
      {
        prompt: `Analyze the code quality based on the following parameters:\n
          1. Consistency in Coding Style\n
          2. Comments and Documentation\n
          3. Code Structure and Modularity\n
          4. Error Handling\n
          5. Code Duplications and Code Smells\n
          Code:\n${sourceCode}`,
        max_tokens: 150,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    // Extract the code quality analysis from the OpenAI response
    const codeQualityAnalysis = response.data.choices[0].text;

    // Respond with the code quality analysis
    res.status(200).json({ codeQualityAnalysis });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Code quality analysis failed" });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
