-- Tabela com as questões de cada prova do vestibular
CREATE TABLE
  questoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_prova INTEGER NOT NULL,
    numero INTEGER NOT NULL,
    texto TEXT NOT NULL,
    FOREIGN KEY (id_prova) REFERENCES provas(id)
  );