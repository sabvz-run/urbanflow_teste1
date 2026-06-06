# BY ITALO SANTOS

import streamlit as st
import streamlit.components.v1 as components

from db import (
    criar_tabelas,
    inserir_evento,
    listar_eventos,
    salvar_planejamento,
    salvar_avaliacao,
)

st.set_page_config(
    page_title="UrbanFlow",
    page_icon="♥",
    layout="wide",
    initial_sidebar_state="expanded",
)

criar_tabelas()

st.markdown(
    """
<style>
.stApp {
    background:
        linear-gradient(rgba(7,17,31,.95), rgba(7,17,31,.95)),
        repeating-linear-gradient(0deg, transparent, transparent 63px, rgba(44,80,130,.25) 64px),
        repeating-linear-gradient(90deg, transparent, transparent 63px, rgba(44,80,130,.25) 64px);
    color: white;
}

.block-container {
    padding-top: 2rem;
    padding-left: 4rem;
    padding-right: 4rem;
    max-width: 1500px;
}

section[data-testid="stSidebar"] {
    background: #081426;
    border-right: 1px solid #1f3554;
}

section[data-testid="stSidebar"] button {
    height: 54px;
    border-radius: 14px;
    font-size: 15px;
    font-weight: 700;
    text-align: left;
    border: 1px solid #203653;
}

section[data-testid="stSidebar"] button[kind="primary"] {
    background: linear-gradient(90deg, #2078ff, #12d6d0);
    border: 1px solid #18f0e8;
}

.info-card {
    background: linear-gradient(135deg,#07111f,#081a34);
    border: 1px solid #22395a;
    border-radius: 24px;
    padding: 25px;
    min-height: 140px;
}

.info-card h3 {
    color: white;
    font-size: 20px;
    margin-bottom: 12px;
}

.info-card p {
    color: #b7c6d8;
    font-size: 15px;
}

.metric-card {
    background: #0c1a30;
    border: 1px solid #244160;
    border-radius: 18px;
    padding: 22px;
}

h1, h2, h3, p, span, label {
    color: white;
}
</style>
""",
    unsafe_allow_html=True,
)

abas = [
    " Boas-vindas",
    " Selecionar evento",
    " Dashboard",
    " Mapa",
    " Rotas",
    " Recomendações",
    " Alertas",
    " Planejamento",
    " Roteiro final",
    " Avaliar locais",
]

if "aba" not in st.session_state:
    st.session_state.aba = abas[0]

with st.sidebar:
    st.markdown("## UrbanFlow")
    st.caption("Rio de Janeiro - Final Continental 2027")
    st.divider()

    for aba_menu in abas:
        ativo = st.session_state.aba == aba_menu
        if st.button(
            aba_menu.strip(),
            key=f"btn_{aba_menu}",
            use_container_width=True,
            type="primary" if ativo else "secondary",
        ):
            st.session_state.aba = aba_menu
            st.rerun()

aba = st.session_state.aba

if aba == " Boas-vindas":
    components.html(
        """
<!DOCTYPE html>
<html>
<head>
<style>
* {
    box-sizing: border-box;
    font-family: Arial, Helvetica, sans-serif;
}
body {
    margin: 0;
    background: transparent;
    color: white;
}
.hero-card {
    display: grid;
    grid-template-columns: 1.7fr .9fr;
    gap: 70px;
    background: linear-gradient(135deg,#07111f,#081a34);
    border: 1px solid #22395a;
    border-radius: 34px;
    padding: 70px;
    box-shadow: 0 0 50px rgba(0,200,255,.08);
}
.logo-area {
    display: flex;
    align-items: center;
    gap: 26px;
    margin-bottom: 28px;
}
.logo-symbol {
    width: 110px;
    height: 110px;
    border-radius: 28px;
    background: linear-gradient(135deg,#2378ff,#18d7d0);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 900;
    font-size: 36px;
    box-shadow: 0 0 25px rgba(24,215,208,.25);
}
.logo-area h1 {
    color: white;
    font-size: 82px;
    margin: 0;
    line-height: .95;
}
.logo-area h1 span,
.phone-card h3 span {
    color: #18d7d0;
}
.logo-area p {
    margin: 12px 0 0 0;
    color: #93a8c4;
    letter-spacing: 7px;
    font-size: 14px;
}
.badge {
    display: inline-block;
    color: #18f0e8;
    border: 1px solid #18f0e8;
    border-radius: 999px;
    padding: 8px 18px;
    font-size: 13px;
    font-weight: 900;
    margin-bottom: 26px;
}
.hero-left h2 {
    color: white;
    font-size: 68px;
    line-height: 1.07;
    margin: 0 0 24px 0;
    font-weight: 900;
}
.hero-text {
    color: #b7c6d8;
    font-size: 20px;
    line-height: 1.55;
    max-width: 760px;
}
.hero-buttons {
    display: flex;
    gap: 14px;
    margin-top: 34px;
}
.hero-buttons button {
    background: linear-gradient(90deg,#2378ff,#18d7d0);
    color: white;
    border: none;
    border-radius: 12px;
    padding: 16px 24px;
    font-weight: 800;
    font-size: 16px;
}
.hero-buttons .outline {
    background: transparent;
    border: 1px solid #324a6a;
}
.phone-card {
    background: #09182d;
    border: 1px solid #27425f;
    border-radius: 30px;
    padding: 26px;
    margin-top: 64px;
}
.phone-card h3 {
    color: white;
    margin: 0 0 22px 0;
    font-size: 22px;
}
.map-box {
    height: 260px;
    border-radius: 20px;
    background:
        radial-gradient(circle at 70% 45%, rgba(24,215,208,.18), transparent 18%),
        radial-gradient(circle at 25% 65%, rgba(35,120,255,.20), transparent 18%),
        repeating-linear-gradient(45deg, transparent, transparent 22px, rgba(0,180,255,.12) 24px),
        repeating-linear-gradient(-45deg, transparent, transparent 30px, rgba(35,120,255,.12) 32px),
        #07172f;
    border: 1px solid #155f93;
    position: relative;
    overflow: hidden;
}
.area-red {
    position: absolute;
    background: rgba(255,40,80,.30);
    border: 1px dashed #ff4a6f;
    border-radius: 10px;
}
.a1 {
    width: 90px;
    height: 80px;
    left: 120px;
    top: 60px;
}
.a2 {
    width: 80px;
    height: 70px;
    left: 170px;
    top: 140px;
}
.point {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #18d7d0;
    border: 4px solid white;
    position: absolute;
    z-index: 3;
}
.one {
    left: 80px;
    top: 130px;
}
.two {
    right: 80px;
    top: 90px;
}
.map-footer {
    margin-top: 16px;
    border: 1px solid #0fd4cf;
    border-radius: 16px;
    padding: 16px;
    display: flex;
    justify-content: space-between;
    color: white;
    background: rgba(12,72,90,.45);
}
@media (max-width: 1000px) {
    .hero-card {
        grid-template-columns: 1fr;
        padding: 40px;
    }
    .hero-left h2 {
        font-size: 46px;
    }
    .logo-area h1 {
        font-size: 54px;
    }
    .phone-card {
        margin-top: 0;
    }
}
</style>
</head>
<body>
<div class="hero-card">
    <div class="hero-left">
        <div class="logo-area">
            <div class="logo-symbol">UF</div>
            <div>
                <h1>Urban<span>Flow</span></h1>
                <p>mobilidade urbana para eventos</p>
            </div>
        </div>
        <p class="badge">MOBILIDADE URBANA PARA EVENTOS</p>
        <h2>Planeje chegada,<br>rota e roteiro com<br>mais contexto.</h2>
        <p class="hero-text">
            O UrbanFlow organiza evento, cidade-sede, mapa, alertas,
            recomendações e itinerário em uma experiência mobile-first
            para quem está em movimento.
        </p>
        <div class="hero-buttons">
            <button>Iniciar planejamento</button>
            <button class="outline">Ver mapa simulado</button>
        </div>
    </div>
    <div class="hero-right">
        <div class="phone-card">
            <h3>Urban<span>Flow</span></h3>
            <div class="map-box">
                <div class="area-red a1"></div>
                <div class="area-red a2"></div>
                <div class="point one"></div>
                <div class="point two"></div>
            </div>
            <div class="map-footer">
                <span>Fluxo seguro</span>
                <strong>Entrada B</strong>
            </div>
        </div>
    </div>
</div>
</body>
</html>
""",
        height=660,
        scrolling=False,
    )

    c1, c2, c3 = st.columns(3)
    with c1:
        st.markdown(
            '<div class="info-card"><h3>🗺️ Mapa preparado</h3><p>Camadas e POIs simulados para futura API.</p></div>',
            unsafe_allow_html=True,
        )
    with c2:
        st.markdown(
            '<div class="info-card"><h3>🔀 Rotas contextuais</h3><p>Tempo, distância e alternativa visual.</p></div>',
            unsafe_allow_html=True,
        )
    with c3:
        st.markdown(
            '<div class="info-card"><h3>✨ Recomendações</h3><p>Regras simples para clima, horário e fluxo.</p></div>',
            unsafe_allow_html=True,
        )

elif aba == " Selecionar evento":

    st.markdown("""
    <style>
    .event-hero {
        background: linear-gradient(135deg, rgba(10,25,48,.96), rgba(11,27,55,.90));
        border: 1px solid #263b5a;
        border-radius: 28px;
        padding: 32px;
        margin-bottom: 22px;
    }

    .event-hero .tag {
        display: inline-block;
        color: #18f0e8;
        border: 1px solid #18f0e8;
        border-radius: 999px;
        padding: 6px 14px;
        font-size: 13px;
        font-weight: 800;
        margin-bottom: 12px;
    }

    .event-hero h1 {
        color: white;
        font-size: 44px;
        margin: 0;
        font-weight: 900;
    }

    .event-hero p {
        color: #b8c7dd;
        font-size: 16px;
        margin-top: 10px;
    }

    .event-card {
        background: linear-gradient(135deg, #0b1528, #0f1b33);
        border: 1px solid #263b5a;
        border-radius: 24px;
        padding: 26px;
        min-height: 280px;
    }

    .event-selected {
        background: linear-gradient(135deg, #0b1528, #0f1b33);
        border: 1px solid #263b5a;
        border-radius: 24px;
        padding: 26px;
        min-height: 280px;
    }

    .pill {
        display: inline-block;
        background: #07394c;
        color: #18f0e8;
        border: 1px solid #18f0e8;
        border-radius: 999px;
        padding: 5px 12px;
        font-size: 12px;
        font-weight: 800;
    }

    .stat-box {
        background: #10223a;
        border: 1px solid #294462;
        border-radius: 16px;
        padding: 14px;
        margin-top: 10px;
    }

    .stat-number {
        color: white;
        font-size: 22px;
        font-weight: 900;
    }

    .stat-label {
        color: #9fb0c9;
        font-size: 13px;
    }

    .event-list-card {
        background: linear-gradient(135deg, #0d2244, #0a172d);
        border: 2px solid #18a8ff;
        border-left: 6px solid #18d7d0;
        border-radius: 22px;
        padding: 22px;
        margin-top: 12px;
    }

    .muted {
        color: #a8b7ce;
    }
    </style>
    """, unsafe_allow_html=True)

    st.markdown("""
    <div class="event-hero">
        <span class="tag">● Seleção de evento</span>
        <h1>Encontre seu evento</h1>
        <p>Filtre por país e cidade, confira o resumo e siga para o painel do evento.</p>
    </div>
    """, unsafe_allow_html=True)

    eventos = listar_eventos()

    col1, col2 = st.columns([1.6, 1])

    with col1:
        st.markdown('<div class="event-card">', unsafe_allow_html=True)

        busca = st.text_input("Evento ou local", placeholder="Ex.: Rio de Janeiro, Fan Zone, Toronto")

        c1, c2 = st.columns(2)

        with c1:
            pais = st.selectbox("País", ["Brasil", "Canadá", "Estados Unidos", "México"])

        with c2:
            cidade = st.selectbox("Cidade-sede", ["Rio de Janeiro", "São Paulo", "Belo Horizonte", "Curitiba"])

        s1, s2 = st.columns(2)

        with s1:
            st.markdown("""
            <div class="stat-box">
                <div class="stat-number">1</div>
                <div class="stat-label">eventos</div>
            </div>
            """, unsafe_allow_html=True)

        with s2:
            st.markdown("""
            <div class="stat-box">
                <div class="stat-number">1</div>
                <div class="stat-label">cidades</div>
            </div>
            """, unsafe_allow_html=True)

        st.markdown("""
        <div class="stat-box" style="width:48%;">
            <div class="stat-number">1</div>
            <div class="stat-label">países</div>
        </div>
        """, unsafe_allow_html=True)

        st.markdown('</div>', unsafe_allow_html=True)

    with col2:
        st.markdown("""
        <div class="event-selected">
            <span class="pill">Selecionado</span>
            <h3 style="color:white;margin-top:12px;">Final Continental 2027</h3>
            <p class="muted">
                Operação urbana para chegada ao estádio, Fan Zone e retornos por transporte oficial.
            </p>
            <p class="muted">Tipo: Esportivo</p>
            <p class="muted">Cidade-sede: Rio de Janeiro</p>
            <p class="muted">Clima: Chuva leve</p>
        </div>
        """, unsafe_allow_html=True)

        if st.button("Abrir dashboard", type="primary"):
            st.session_state.aba = " Dashboard"
            st.rerun()

    st.write("")

    col_titulo, col_resultado = st.columns([2, 1])
    with col_titulo:
        st.subheader("Eventos disponíveis")
    with col_resultado:
        st.markdown("<p style='text-align:right;color:white;'>1 resultado(s)</p>", unsafe_allow_html=True)

    st.markdown("""
    <div class="event-list-card">
        <span class="pill">Brasil</span>
        <span style="float:right;color:#a8b7ce;font-weight:700;">Alta procura</span>
        <h4 style="color:white;margin-top:18px;">Final Continental 2027</h4>
        <p class="muted">
            Operação urbana para chegada ao estádio, Fan Zone e retornos por transporte oficial.
        </p>
        <p class="muted">Rio de Janeiro - Estádio Maracanã</p>
        <p class="muted">12 de jul. de 2027 até 12 de jul. de 2027</p>
        <p class="muted">72.000 pessoas previstas</p>
    </div>
    """, unsafe_allow_html=True)

    if st.button("Selecionar evento", type="primary", use_container_width=True):
        st.success("Evento selecionado: Final Continental 2027")

elif aba == " Dashboard":

    st.markdown("""
    <style>
    .dash-hero, .dash-card, .dash-panel {
        background: linear-gradient(135deg, #0b1528, #0f1b33);
        border: 1px solid #263b5a;
        border-radius: 20px;
        padding: 22px;
    }

    .dash-tag {
        display: inline-block;
        color: #18f0e8;
        border: 1px solid #18f0e8;
        background: #07394c;
        border-radius: 999px;
        padding: 5px 12px;
        font-size: 12px;
        font-weight: 800;
    }

    .dash-title {
        color: white;
        font-size: 42px;
        font-weight: 900;
        margin: 10px 0 0 0;
    }

    .dash-muted {
        color: #a8b7ce;
        font-size: 14px;
    }

    .dash-info {
        background: #10223a;
        border: 1px solid #294462;
        border-radius: 14px;
        padding: 14px;
        min-height: 78px;
    }

    .dash-info strong {
        color: white;
        display: block;
        font-size: 16px;
    }

    .dash-info span {
        color: #a8b7ce;
        font-size: 12px;
    }

    .dash-btn {
        background: linear-gradient(90deg, #2378ff, #13d6d0);
        border-radius: 12px;
        padding: 18px;
        text-align: center;
        color: white;
        font-weight: 900;
        border: 1px solid #18f0e8;
    }

    .dash-btn-dark {
        background: transparent;
        border: 1px solid #294462;
        border-radius: 12px;
        padding: 18px;
        text-align: center;
        color: white;
        font-weight: 900;
    }

    .alert-box, .place-box {
        background: #0c1a30;
        border: 1px solid #294462;
        border-radius: 14px;
        padding: 14px;
        margin-bottom: 12px;
    }

    .alert-box h4, .place-box h4 {
        color: white;
        margin: 6px 0;
        font-size: 14px;
    }

    .external-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 12px;
    }

    .external-btn {
        border: 1px solid #294462;
        border-radius: 12px;
        padding: 14px;
        text-align: center;
        color: white;
        font-weight: 800;
    }
    </style>
    """, unsafe_allow_html=True)

    st.markdown("""
    <div class="dash-hero">
        <span class="dash-tag">● Visão geral</span>
        <h1 class="dash-title">Final Continental 2027</h1>
    </div>
    """, unsafe_allow_html=True)

    col_main, col_alertas = st.columns([1.75, 1])

    with col_main:
        st.markdown("""
        <div class="dash-card">
            <span class="dash-tag">Esportivo</span>
            <h4 style="color:white;margin-top:18px;">Rio de Janeiro - Estádio Maracanã</h4>
            <p class="dash-muted">
                Operação urbana para chegada ao estádio, Fan Zone e retornos por transporte oficial.
            </p>
        </div>
        """, unsafe_allow_html=True)

        c1, c2, c3, c4 = st.columns(4)
        with c1:
            st.markdown('<div class="dash-info"><strong>Chuva leve</strong><span>Clima</span></div>', unsafe_allow_html=True)
        with c2:
            st.markdown('<div class="dash-info"><strong>alta</strong><span>Fluxo estimado</span></div>', unsafe_allow_html=True)
        with c3:
            st.markdown('<div class="dash-info"><strong>4,8 km</strong><span>Distância até destino</span></div>', unsafe_allow_html=True)
        with c4:
            st.markdown('<div class="dash-info"><strong>72.000</strong><span>Público previsto</span></div>', unsafe_allow_html=True)

        b1, b2, b3, b4 = st.columns(4)
        with b1:
            if st.button("Abrir mapa", type="primary", use_container_width=True):
                st.session_state.aba = " Mapa"
                st.rerun()
        with b2:
            if st.button("Planejar itinerário", use_container_width=True):
                st.session_state.aba = " Planejamento"
                st.rerun()
        with b3:
            if st.button("Ver recomendações", use_container_width=True):
                st.session_state.aba = " Recomendações"
                st.rerun()
        with b4:
            if st.button("Ver alertas", use_container_width=True):
                st.session_state.aba = " Alertas"
                st.rerun()

        st.write("")

        st.markdown("""
        <div class="dash-panel">
            <h4 style="color:white;">Principais locais</h4>

            <div class="place-box">
                <span class="dash-tag">stadium</span>
                <h4>Estádio Maracanã</h4>
                <p class="dash-muted">Portão principal - Maracanã</p>
            </div>

            <div class="place-box">
                <span class="dash-tag">hospital</span>
                <h4>Hospital de Apoio</h4>
                <p class="dash-muted">Avenida do Serviço 120 - Tijuca</p>
            </div>

            <div class="place-box">
                <span class="dash-tag">transport</span>
                <h4>Transporte Oficial A</h4>
                <p class="dash-muted">Terminal integrado - Maracanã</p>
            </div>

            <div class="place-box">
                <span class="dash-tag">transport</span>
                <h4>Embarque Expresso B</h4>
                <p class="dash-muted">Corredor exclusivo - Tijuca</p>
            </div>
        </div>
        """, unsafe_allow_html=True)

    with col_alertas:
        st.markdown("""
        <div class="dash-panel">
            <h4 style="color:white;">Alertas principais</h4>

            <div class="alert-box">
                <span class="dash-tag">Médio</span>
                <h4>Chuva leve prevista</h4>
                <p class="dash-muted">Rotas cobertas e pontos internos foram priorizados.</p>
            </div>

            <div class="alert-box">
                <span class="dash-tag">Alto</span>
                <h4>Alta densidade no setor norte</h4>
                <p class="dash-muted">Entrada B tem fluxo mais estável neste momento.</p>
            </div>

            <div class="alert-box">
                <span class="dash-tag">Médio</span>
                <h4>Rota noturna segura</h4>
                <p class="dash-muted">Rotas por vias iluminadas e transporte oficial foram priorizados.</p>
            </div>
        </div>
        """, unsafe_allow_html=True)

    st.write("")

    st.markdown("""
    <div class="dash-panel">
        <h4 style="color:white;">Handoff externo</h4>
        <div class="external-grid">
            <div class="external-btn">Reservar hotel</div>
            <div class="external-btn">Comprar ingresso</div>
            <div class="external-btn">Reservar restaurante</div>
            <div class="external-btn">Abrir transporte</div>
        </div>
        <br>
        <div class="external-grid" style="grid-template-columns: repeat(4, 1fr);">
            <div class="external-btn">Site oficial</div>
        </div>
    </div>
    """, unsafe_allow_html=True)

elif aba == " Mapa":
    st.title("Mapa")
    st.info("Aqui você pode integrar futuramente Folium, Mapbox ou dados de API.")

    st.markdown(
        '<div style="height:420px;border-radius:24px;background:radial-gradient(circle at center,#103766,#061020);border:1px solid #1d6fa3;display:flex;align-items:center;justify-content:center;"><h2>Mapa interativo simulado</h2></div>',
        unsafe_allow_html=True,
    )

elif aba == " Rotas":
    st.title("Rotas")

    origem = st.text_input("Origem", "Copacabana")
    destino = st.text_input("Destino", "Estádio - Entrada B")
    meio = st.radio("Meio de transporte", ["A pé", "Metrô", "Ônibus", "Carro"])

    if st.button("Calcular rota", type="primary"):
        st.success(f"Rota segura sugerida de {origem} até {destino} usando {meio}.")
        st.write("Tempo estimado: **24 minutos**")
        st.write("Distância: **2,8 km**")

elif aba == " Recomendações":
    st.title("Recomendações")
    st.success("Use a Entrada B para menor tempo de espera.")
    st.warning("Evite a Entrada A entre 18h e 19h.")
    st.info("Leve capa de chuva se houver previsão instável.")

elif aba == " Alertas":
    st.title("Alertas")
    st.warning("Possível congestionamento próximo ao estádio.")
    st.error("Área com alto fluxo detectada na zona norte do evento.")
    st.success("Rota alternativa disponível pela Avenida Principal.")

elif aba == " Planejamento":
    st.title("Planejamento")

    eventos = listar_eventos()

    if not eventos:
        st.warning("Cadastre um evento antes de criar um planejamento.")
    else:
        opcoes = {f"{e['nome']} - {e['cidade']}": e["id"] for e in eventos}

        evento_escolhido = st.selectbox("Evento", list(opcoes.keys()))
        nome = st.text_input("Nome")
        origem = st.text_input("Origem")
        destino = st.text_input("Destino")
        meio = st.selectbox("Transporte", ["A pé", "Metrô", "Ônibus", "Carro"])
        horario = st.time_input("Horário")
        anotacoes = st.text_area("Observações")

        if st.button("Salvar Planejamento"):
            evento_id = opcoes[evento_escolhido]
            salvar_planejamento(nome, evento_id, origem, destino, meio, horario, anotacoes)
            st.success("Planejamento salvo!")

elif aba == " Roteiro final":
    st.title("Roteiro final")

    roteiro = """
Roteiro UrbanFlow

Evento: Rio de Janeiro - Final Continental 2027
Entrada recomendada: Entrada B
Rota: Fluxo seguro
Tempo estimado: 24 minutos
Recomendação: evitar Entrada A entre 18h e 19h
"""

    st.code(roteiro)
    st.download_button("Baixar roteiro", roteiro, file_name="roteiro_urbanflow.txt")

elif aba == " Avaliar locais":
    st.title("Avaliar locais")

    local = st.selectbox(
        "Local",
        ["Entrada A", "Entrada B", "Praça de alimentação", "Estação de metrô"],
    )
    nota = st.slider("Nota do local", 1, 5, 4)
    comentario = st.text_area("Comentário")

    if st.button("Enviar avaliação", type="primary"):
        salvar_avaliacao(local, nota, comentario)
        st.success(f"Avaliação enviada para {local}: {nota} estrelas.")
