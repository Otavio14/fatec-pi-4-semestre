-- Tabela com as provas do vestibular
CREATE TABLE
  provas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url_arquivo TEXT NOT NULL,
    nome TEXT NOT NULL UNIQUE,
    id_vestibular INTEGER NOT NULL,
    instrucoes TEXT NOT NULL,
    FOREIGN KEY (id_vestibular) REFERENCES vestibulares (id)
  );