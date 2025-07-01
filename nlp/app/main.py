from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, constr
import spacy
import re

app = FastAPI()
nlp = spacy.load("pt_core_news_sm")

class TextInput(BaseModel):
    text: constr(min_length=1, max_length=20000)

replacements = {
    "Dr.": "Doutor",
    "Dra.": "Doutora",
    "Sr.": "Senhor",
    "Sra.": "Senhora",
    "Srta.": "Senhorita",
    "Prof.": "Professor",
    "Profa.": "Professora",
    "Ex.": "Exemplo",
    "etc.": "e assim por diante",
    "vs.": "versus",
    "p.ex.": "por exemplo",
    "al.": "alínea",
    "Adm.": "Administração",
    "Dept.": "Departamento",
    "Tel.": "Telefone",
    "Rua": "Rua",
    "Av.": "Avenida",
    "Dr(a).": "Doutor ou Doutora"
}


def prepare_text(text: str):

    for abbr, full in replacements.items():
        text = text.replace(abbr, full)


    text = re.sub(r"[^\w\s.,!?]", "", text)

    doc = nlp(text)
    return [sent.text.strip() for sent in doc.sents]

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/prepare-tts")
async def prepare_tts(input: TextInput):
    try:
        processed = prepare_text(input.text)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    return {"sentences": processed}
