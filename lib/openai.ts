import OpenAIApi from "openai";

const openai = new OpenAIApi({
  apiKey: process.env.OPENAI_API_KEY,
});

export default openai;
