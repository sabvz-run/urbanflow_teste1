from db import (
    inserir_evento,
    listar_eventos,
    salvar_planejamento,
    salvar_avaliacao,
)


def criar_evento(nome, cidade, data, local):
    if not nome or not cidade:
        raise ValueError("Nome do evento e cidade são obrigatórios.")

    inserir_evento(nome, cidade, data, local)


def buscar_eventos():
    return listar_eventos()


def criar_planejamento(nome, evento_id, origem, destino, meio, horario, anotacoes):
    if not nome:
        raise ValueError("Informe o nome do participante.")

    if not evento_id:
        raise ValueError("Selecione um evento.")

    salvar_planejamento(
        nome,
        evento_id,
        origem,
        destino,
        meio,
        horario,
        anotacoes,
    )


def criar_avaliacao(local, nota, comentario):
    if not local:
        raise ValueError("Selecione um local.")

    if nota < 1 or nota > 5:
        raise ValueError("A nota deve estar entre 1 e 5.")

    salvar_avaliacao(local, nota, comentario)