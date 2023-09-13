require("dotenv").config();
const OpenAI = require("openai");
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.use(express.json());
app.use(cors());

app.post("/api/convert", async (req, res) => {
  const { code, targetLanguage } = req.body;

  // Construct the prompt for GPT-3.5
  const prompt = `Please convert the following code from ${code} to ${targetLanguage},
   you response should be a json string which I can parse with JSON.parse having code as key
  `;

  try {
    // Call the GPT-3.5 API to convert code
    const openaiResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      // max_tokens: 50, // Adjust as needed
    });
    res.status(200).send(JSON.parse(openaiResponse.choices[0].message.content));
  } catch (error) {
    res.status(400).send({
      isError: true,
      message: error,
    });
  }
});

app.post("/api/debug", async (req, res) => {
  const sourceCode = req.body.sourceCode;

  // Construct the prompt for GPT-3.5
  const prompt = `Debug the following code: \n${sourceCode} \n explain what wrong and give me a solution to it, 
  your response should be a json string which I can parse with explaination as one key and the code as another key
  `;

  try {
    // Call the GPT-3.5 API to convert code
    const openaiResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      // max_tokens: 50, // Adjust as needed
    });
    res.status(200).send(JSON.parse(openaiResponse.choices[0].message.content));
  } catch (error) {
    res.status(400).send({
      isError: true,
      message: error,
    });
  }
});

app.post("/api/code-quality", async (req, res) => {
  try {
    const sourceCode = req.body.sourceCode;

    const prompt = `Analyze the code quality based on the following parameters:\n
    1. Consistency in Coding Style\n
    2. Comments and Documentation\n
    3. Code Structure and Modularity\n
    4. Error Handling\n
    5. Code Duplications and Code Smells\n
    Code:\n${sourceCode}\n 
    give the response as json object in this format strictly,
    {
        "explaination" : "Consistency in Coding Style\n
        answer\n
        Comments and Documentation\n
        answer\n
        Code Structure and Modularity\n
        answer\n
        Error Handling\n
        answer\n
        Code Duplications and Code Smells\n
        answer\n"
    }

    and replace the answer with explaination for each parameter, don't forget the newline character
    `;

    const openaiResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      // max_tokens: 50, // Adjust as needed
    });
    res.status(200).send(JSON.parse(openaiResponse.choices[0].message.content));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Code quality analysis failed" });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
