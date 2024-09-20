import { Router } from "express";
import { HfInference } from "@huggingface/inference";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

const router = Router();
router.use(bodyParser.json());

const laguageModelAvaidable = {
  "en-US-es-MX": "Helsinki-NLP/opus-mt-en-es",
  "es-MX-en-US": "Helsinki-NLP/opus-mt-es-en",
  "en-US-fr-FR": "Helsinki-NLP/opus-mt-en-fr",
  "fr-FR-en-US": "Helsinki-NLP/opus-mt-fr-en",
  "en-US-de-DE": "Helsinki-NLP/opus-mt-en-de",
  "de-DE-en-US": "Helsinki-NLP/opus-mt-de-en",
};

async function translateText(text, fromLanguage, toLanguage) {
  try {
    const modelKey = `${fromLanguage}-${toLanguage}`;
    const model = laguageModelAvaidable[modelKey];

    if (!model) {
      throw new Error("Modelo no encontrado");
    } else {
      const hf = new HfInference(process.env.HUGGING_FACE_API_KEY);
      const translate = await hf.translation({ model, inputs: text });
      console.log("Respuesta de la traduccion: " + translate);

      if (translate && translate.translation_text) {
        console.log("Texto traducido:", translate.translation_text);
        return translate.translation_text;
      } else {
        console.error("La respuesta no contiene traducciones válidas.");
        return "Texto no traducido";
      }
    }
  } catch (error) {
    console.error("Error al realizar la traduccion: " + error);
    return "Error al encontrar un modelo adecuado";
  }
}

router.post("/translate/text", async (req, res) => {
  const { text, fromLanguage, toLanguage } = req.body;

  if (!text || !fromLanguage || !toLanguage) {
    return res.status(400).json({
      error: "Los campos 'texto', 'fromLanguage' y 'toLanguage' son requeridos",
    });
  }

  const traduccion = await translateText(text, fromLanguage, toLanguage);

  res.json({ traduccion });
});

export default router;
