import streamlit as st
import psycopg2
from psycopg2.extras import RealDictCursor


def conectar():
    return psycopg2.connect(
        host=st.secrets["postgres"]["host"],
        port=st.secrets["postgres"]["port"],
        database=st.secrets["postgres"]["database"],
        user=st.secrets["postgres"]["user"],
        password=st.secrets["postgres"]["password"],
        cursor_factory=RealDictCursor
    )


def criar_tabelas():
    conn = conectar()
    cur = conn.cursor()

    cur.execute("""
    CREATE TABLE IF NOT EXISTS eventos (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(150) NOT NULL,
        cidade VARCHAR(100) NOT NULL,
        data DATE,
        local VARCHAR(150)
    );
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS planejamentos (
        id SERIAL PRIMARY KEY,
        nome_participante VARCHAR(150),
        evento_id INTEGER REFERENCES eventos(id),
        origem VARCHAR(150),
        destino VARCHAR(150),
        meio_transporte VARCHAR(50),
        horario_chegada TIME,
        anotacoes TEXT,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS avaliacoes (
        id SERIAL PRIMARY KEY,
        local VARCHAR(150) NOT NULL,
        nota INTEGER NOT NULL CHECK (nota BETWEEN 1 AND 5),
        comentario TEXT,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    conn.commit()
    cur.close()
    conn.close()


def inserir_evento(nome, cidade, data, local):
    conn = conectar()
    cur = conn.cursor()

    cur.execute("""
    INSERT INTO eventos (nome, cidade, data, local)
    VALUES (%s, %s, %s, %s);
    """, (nome, cidade, data, local))

    conn.commit()
    cur.close()
    conn.close()


def listar_eventos():
    conn = conectar()
    cur = conn.cursor()

    cur.execute("""
    SELECT id, nome, cidade, data, local
    FROM eventos
    ORDER BY data;
    """)

    eventos = cur.fetchall()

    cur.close()
    conn.close()
    return eventos


def salvar_planejamento(nome, evento_id, origem, destino, meio, horario, anotacoes):
    conn = conectar()
    cur = conn.cursor()

    cur.execute("""
    INSERT INTO planejamentos (
        nome_participante, evento_id, origem, destino,
        meio_transporte, horario_chegada, anotacoes
    )
    VALUES (%s, %s, %s, %s, %s, %s, %s);
    """, (nome, evento_id, origem, destino, meio, horario, anotacoes))

    conn.commit()
    cur.close()
    conn.close()


def salvar_avaliacao(local, nota, comentario):
    conn = conectar()
    cur = conn.cursor()

    cur.execute("""
    INSERT INTO avaliacoes (local, nota, comentario)
    VALUES (%s, %s, %s);
    """, (local, nota, comentario))

    conn.commit()
    cur.close()
    conn.close()