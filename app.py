import textwrap
import streamlit as st
import streamlit.components.v1 as components
from db import criar_tabelas

from services import (
    criar_evento,
    buscar_eventos,
    criar_planejamento,
    criar_avaliacao,
)

st.set_page_config(
    page_title="UrbanFlow",
    page_icon="♥",
    layout="wide",
    initial_sidebar_state="expanded",
)

criar_tabelas()


def md(html: str):
    st.markdown(textwrap.dedent(html), unsafe_allow_html=True)


def abrir_aba(nome_aba: str):
    st.session_state.aba = nome_aba
    st.rerun()


md("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');

:root {
    --bg: #07111f;
    --panel: #0b1528;
    --panel2: #0f1b33;
    --border: #263b5a;
    --cyan: #18f0e8;
    --blue: #2378ff;
    --muted: #a8b7ce;
    --white: #ffffff;
}

* {
    font-family: 'Inter', Arial, Helvetica, sans-serif;
}

.stApp {
    background:
        linear-gradient(rgba(7,17,31,.96), rgba(7,17,31,.96)),
        repeating-linear-gradient(0deg, transparent, transparent 63px, rgba(44,80,130,.25) 64px),
        repeating-linear-gradient(90deg, transparent, transparent 63px, rgba(44,80,130,.25) 64px);
    color: white;
}

.block-container {
    padding-top: 2.2rem;
    padding-left: 4rem;
    padding-right: 4rem;
    max-width: 1480px;
}

section[data-testid="stSidebar"] {
    background: #081426;
    border-right: 1px solid #1f3554;
}

section[data-testid="stSidebar"] button {
    height: 46px;
    border-radius: 11px;
    font-size: 14px;
    font-weight: 800;
    text-align: left;
    border: 1px solid #203653;
}

section[data-testid="stSidebar"] button[kind="primary"] {
    background: linear-gradient(90deg, #123f7a, #0d5969);
    border: 1px solid #18f0e8;
    box-shadow: inset 3px 0 0 #18f0e8;
}

h1, h2, h3, h4, h5, h6, p, span, label, div {
    color: white;
}

div[data-testid="stTextInput"] input,
div[data-testid="stSelectbox"] div,
textarea {
    background-color: #07111f !important;
    color: white !important;
    border-color: #263b5a !important;
}

.stButton > button {
    border-radius: 12px !important;
    font-weight: 900 !important;
    border: 1px solid #294462 !important;
}

.stButton > button[kind="primary"] {
    background: linear-gradient(90deg, #2378ff, #13d6d0) !important;
    border: 1px solid #18f0e8 !important;
}

.page-wrap {
    max-width: 1050px;
    margin: 0 auto;
}

.page-wide {
    max-width: 1180px;
    margin: 0 auto;
}

.hero-strip, .panel, .soft-panel, .mini-card, .event-card, .event-selected, .dash-card, .dash-panel {
    background: linear-gradient(135deg, rgba(11,21,40,.98), rgba(15,27,51,.94));
    border: 1px solid var(--border);
    border-radius: 20px;
}

.hero-strip {
    padding: 28px 30px;
    margin-bottom: 18px;
}

.hero-strip h1 {
    font-size: 44px;
    line-height: 1.05;
    margin: 8px 0 0 0;
    font-weight: 950;
}

.hero-strip p {
    color: var(--muted);
    margin: 10px 0 0 0;
    font-size: 16px;
}

.tag, .pill {
    display: inline-block;
    background: #07394c;
    color: var(--cyan);
    border: 1px solid var(--cyan);
    border-radius: 999px;
    padding: 5px 12px;
    font-size: 12px;
    font-weight: 900;
}

.panel, .soft-panel {
    padding: 22px;
}

.muted {
    color: var(--muted);
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

.stat-box, .metric-box {
    background: #10223a;
    border: 1px solid #294462;
    border-radius: 16px;
    padding: 14px;
    min-height: 78px;
}

.stat-number, .metric-box strong {
    color: white;
    font-size: 20px;
    font-weight: 900;
    display: block;
}

.stat-label, .metric-box span {
    color: #9fb0c9;
    font-size: 12px;
}

.event-list-card {
    background: linear-gradient(135deg, #0d2244, #0a172d);
    border: 2px solid #18a8ff;
    border-left: 6px solid #18d7d0;
    border-radius: 22px;
    padding: 22px;
    margin-top: 12px;
}

.place-box, .alert-box, .route-step, .item-row, .timeline-item, .recommend-card {
    background: #0c1a30;
    border: 1px solid #294462;
    border-radius: 14px;
    padding: 14px;
    margin-bottom: 12px;
}

.place-box h4, .alert-box h4, .item-row h4, .timeline-item h4, .recommend-card h4 {
    margin: 6px 0;
    font-size: 14px;
    color: white;
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

.map-layout {
    display: grid;
    grid-template-columns: 190px 1fr 220px;
    gap: 14px;
}

.layer-list {
    padding: 12px;
}

.layer-row {
    border: 1px solid #0ebed2;
    background: rgba(7,57,76,.55);
    border-radius: 14px;
    padding: 10px;
    margin: 8px 0;
    color: white;
    font-size: 13px;
    display: flex;
    justify-content: space-between;
}

.toggle-dot {
    width: 12px;
    height: 12px;
    background: var(--cyan);
    border-radius: 50%;
    display: inline-block;
    box-shadow: 0 0 10px rgba(24,240,232,.8);
}

.map-art {
    height: 520px;
    border-radius: 22px;
    border: 1px solid #155f93;
    position: relative;
    overflow: hidden;
    background:
        radial-gradient(circle at 65% 35%, rgba(24,240,232,.16), transparent 12%),
        radial-gradient(circle at 30% 60%, rgba(35,120,255,.22), transparent 14%),
        repeating-linear-gradient(45deg, transparent, transparent 28px, rgba(0,180,255,.13) 30px),
        repeating-linear-gradient(-45deg, transparent, transparent 34px, rgba(35,120,255,.13) 36px),
        #07172f;
}

.map-route {
    position: absolute;
    left: 12%;
    top: 44%;
    width: 76%;
    height: 7px;
    background: linear-gradient(90deg,#2378ff,#18f0e8,#2378ff);
    border-radius: 99px;
    transform: rotate(-12deg);
    box-shadow: 0 0 18px rgba(24,240,232,.6);
}

.map-route2 {
    position: absolute;
    left: 36%;
    top: 20%;
    width: 7px;
    height: 68%;
    background: linear-gradient(#2378ff,#18f0e8,#2378ff);
    border-radius: 99px;
    transform: rotate(18deg);
    box-shadow: 0 0 18px rgba(24,240,232,.6);
}

.map-hot {
    position: absolute;
    background: rgba(255,40,80,.30);
    border: 1px dashed #ff4a6f;
    border-radius: 18px;
}

.hot1 { width: 140px; height: 90px; left: 15%; top: 35%; transform: rotate(-8deg); }
.hot2 { width: 130px; height: 120px; left: 21%; top: 62%; transform: rotate(8deg); }

.map-pin {
    position: absolute;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #0caab1;
    border: 3px solid rgba(255,255,255,.9);
    display:flex;
    align-items:center;
    justify-content:center;
    font-size: 13px;
    font-weight: 900;
}

.pin1 { left: 18%; top: 36%; }
.pin2 { left: 45%; top: 28%; background:#b83d51; }
.pin3 { left: 62%; top: 46%; }
.pin4 { left: 77%; top: 34%; }
.pin5 { left: 36%; top: 61%; background:#b83d51; }
.pin6 { left: 58%; top: 72%; background:#b83d51; }

.recommend-grid {
    display:grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
}

.recommend-card {
    min-height: 165px;
    display:flex;
    flex-direction:column;
    justify-content:space-between;
}

.timeline-time {
    color: var(--cyan);
    background: rgba(7,57,76,.7);
    border: 1px solid var(--cyan);
    border-radius: 999px;
    padding: 6px 10px;
    font-weight: 900;
    display: inline-block;
    margin-right: 10px;
}

.rating-star {
    display:inline-flex;
    width:34px;
    height:34px;
    border-radius:50%;
    align-items:center;
    justify-content:center;
    background:#0d3a83;
    color:white;
    margin-right:8px;
    font-weight:900;
}

.rating-star.active {
    background:#e8eef6;
    color:#10223a;
}

@media (max-width: 1000px) {
    .block-container { padding-left: 1.2rem; padding-right: 1.2rem; }
    .map-layout { grid-template-columns: 1fr; }
    .recommend-grid { grid-template-columns: 1fr; }
    .external-grid { grid-template-columns: 1fr 1fr; }
}
</style>
""")


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
* { box-sizing: border-box; font-family: Inter, Arial, Helvetica, sans-serif; }
body { margin: 0; background: transparent; color: white; }
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
.logo-area { display: flex; align-items: center; gap: 26px; margin-bottom: 28px; }
.logo-symbol {
    width: 110px; height: 110px; border-radius: 28px;
    background: linear-gradient(135deg,#2378ff,#18d7d0);
    display: flex; align-items: center; justify-content: center;
    color: white; font-weight: 900; font-size: 36px;
    box-shadow: 0 0 25px rgba(24,215,208,.25);
}
.logo-area h1 { color: white; font-size: 82px; margin: 0; line-height: .95; }
.logo-area h1 span, .phone-card h3 span { color: #18d7d0; }
.logo-area p { margin: 12px 0 0 0; color: #93a8c4; letter-spacing: 7px; font-size: 14px; }
.badge {
    display: inline-block; color: #18f0e8; border: 1px solid #18f0e8;
    border-radius: 999px; padding: 8px 18px; font-size: 13px;
    font-weight: 900; margin-bottom: 26px;
}
.hero-left h2 { color: white; font-size: 68px; line-height: 1.07; margin: 0 0 24px 0; font-weight: 900; }
.hero-text { color: #b7c6d8; font-size: 20px; line-height: 1.55; max-width: 760px; }
.hero-buttons { display: flex; gap: 14px; margin-top: 34px; }
.hero-buttons button {
    background: linear-gradient(90deg,#2378ff,#18d7d0); color: white;
    border: none; border-radius: 12px; padding: 16px 24px; font-weight: 800; font-size: 16px;
}
.hero-buttons .outline { background: transparent; border: 1px solid #324a6a; }
.phone-card {
    background: #09182d; border: 1px solid #27425f; border-radius: 30px;
    padding: 26px; margin-top: 64px;
}
.phone-card h3 { color: white; margin: 0 0 22px 0; font-size: 22px; }
.map-box {
    height: 260px; border-radius: 20px;
    background:
        radial-gradient(circle at 70% 45%, rgba(24,215,208,.18), transparent 18%),
        radial-gradient(circle at 25% 65%, rgba(35,120,255,.20), transparent 18%),
        repeating-linear-gradient(45deg, transparent, transparent 22px, rgba(0,180,255,.12) 24px),
        repeating-linear-gradient(-45deg, transparent, transparent 30px, rgba(35,120,255,.12) 32px),
        #07172f;
    border: 1px solid #155f93; position: relative; overflow: hidden;
}
.area-red { position: absolute; background: rgba(255,40,80,.30); border: 1px dashed #ff4a6f; border-radius: 10px; }
.a1 { width: 90px; height: 80px; left: 120px; top: 60px; }
.a2 { width: 80px; height: 70px; left: 170px; top: 140px; }
.point {
    width: 20px; height: 20px; border-radius: 50%; background: #18d7d0;
    border: 4px solid white; position: absolute; z-index: 3;
}
.one { left: 80px; top: 130px; }
.two { right: 80px; top: 90px; }
.map-footer {
    margin-top: 16px; border: 1px solid #0fd4cf; border-radius: 16px;
    padding: 16px; display: flex; justify-content: space-between;
    color: white; background: rgba(12,72,90,.45);
}
@media (max-width: 1000px) {
    .hero-card { grid-template-columns: 1fr; padding: 40px; }
    .hero-left h2 { font-size: 46px; }
    .logo-area h1 { font-size: 54px; }
    .phone-card { margin-top: 0; }
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
        md('<div class="info-card"><h3>🗺️ Mapa preparado</h3><p>Camadas e POIs simulados para futura API.</p></div>')
    with c2:
        md('<div class="info-card"><h3>🔀 Rotas contextuais</h3><p>Tempo, distância e alternativa visual.</p></div>')
    with c3:
        md('<div class="info-card"><h3>✨ Recomendações</h3><p>Regras simples para clima, horário e fluxo.</p></div>')


elif aba == " Selecionar evento":
    md("""
    <div class="page-wide">
        <div class="hero-strip">
            <span class="tag">● Seleção de evento</span>
            <h1>Encontre seu evento</h1>
            <p>Filtre por país e cidade, confira o resumo e siga para o painel do evento.</p>
        </div>
    </div>
    """)

    eventos = buscar_eventos()

    col1, col2 = st.columns([1.6, 1])

    with col1:
        with st.container(border=True):
            st.text_input("Evento ou local", placeholder="Ex.: Rio de Janeiro, Fan Zone, Toronto")
            c1, c2 = st.columns(2)
            with c1:
                st.selectbox("País", ["Brasil", "Canadá", "Estados Unidos", "México"])
            with c2:
                st.selectbox("Cidade-sede", ["Rio de Janeiro", "São Paulo", "Belo Horizonte", "Curitiba"])

            s1, s2 = st.columns(2)
            with s1:
                md(f'<div class="stat-box"><div class="stat-number">{max(len(eventos), 1)}</div><div class="stat-label">eventos</div></div>')
            with s2:
                md('<div class="stat-box"><div class="stat-number">1</div><div class="stat-label">cidades</div></div>')
            md('<div class="stat-box" style="width:48%;"><div class="stat-number">1</div><div class="stat-label">países</div></div>')

        with st.expander("Cadastrar novo evento"):
            with st.form("novo_evento"):
                nome = st.text_input("Nome do evento")
                cidade = st.text_input("Cidade")
                data = st.date_input("Data")
                local = st.text_input("Local")
                enviar = st.form_submit_button("Salvar Evento")
                if enviar:
                    criar_evento(nome, cidade, data, local)
                    st.success("Evento salvo!")
                    st.rerun()

    with col2:
        md("""
        <div class="event-selected" style="padding:24px;min-height:280px;">
            <span class="pill">Selecionado</span>
            <h3 style="margin-top:12px;">Final Continental 2027</h3>
            <p class="muted">Operação urbana para chegada ao estádio, Fan Zone e retornos por transporte oficial.</p>
            <p class="muted">Tipo: Esportivo</p>
            <p class="muted">Cidade-sede: Rio de Janeiro</p>
            <p class="muted">Clima: Chuva leve</p>
        </div>
        """)
        if st.button("Abrir dashboard", type="primary"):
            abrir_aba(" Dashboard")

    st.write("")
    col_titulo, col_resultado = st.columns([2, 1])
    with col_titulo:
        st.subheader("Eventos disponíveis")
    with col_resultado:
        st.markdown(f"<p style='text-align:right;color:white;'>{max(len(eventos), 1)} resultado(s)</p>", unsafe_allow_html=True)

    if eventos:
        for evento in eventos:
            md(f"""
            <div class="event-list-card">
                <span class="pill">{evento.get('cidade', 'Brasil')}</span>
                <span style="float:right;color:#a8b7ce;font-weight:700;">Alta procura</span>
                <h4 style="margin-top:18px;">{evento.get('nome', 'Evento')}</h4>
                <p class="muted">Operação urbana para chegada ao estádio, Fan Zone e retornos por transporte oficial.</p>
                <p class="muted">{evento.get('cidade', '')} - {evento.get('local', '')}</p>
                <p class="muted">{evento.get('data', '')}</p>
            </div>
            """)
    else:
        md("""
        <div class="event-list-card">
            <span class="pill">Brasil</span>
            <span style="float:right;color:#a8b7ce;font-weight:700;">Alta procura</span>
            <h4 style="margin-top:18px;">Final Continental 2027</h4>
            <p class="muted">Operação urbana para chegada ao estádio, Fan Zone e retornos por transporte oficial.</p>
            <p class="muted">Rio de Janeiro - Estádio Maracanã</p>
            <p class="muted">12 de jul. de 2027 até 12 de jul. de 2027</p>
            <p class="muted">72.000 pessoas previstas</p>
        </div>
        """)

    if st.button("Selecionar evento", type="primary", use_container_width=True):
        st.success("Evento selecionado: Final Continental 2027")


elif aba == " Dashboard":
    md("""
    <div class="page-wrap">
        <div class="hero-strip">
            <span class="tag">● Visão geral</span>
            <h1>Final Continental 2027</h1>
        </div>
    </div>
    """)

    col_main, col_alertas = st.columns([1.75, 1])

    with col_main:
        md("""
        <div class="dash-card" style="padding:20px;">
            <span class="tag">Esportivo</span>
            <h4 style="margin-top:18px;">Rio de Janeiro - Estádio Maracanã</h4>
            <p class="muted">Operação urbana para chegada ao estádio, Fan Zone e retornos por transporte oficial.</p>
        </div>
        """)
        c1, c2, c3, c4 = st.columns(4)
        with c1:
            md('<div class="metric-box"><strong>Chuva leve</strong><span>Clima</span></div>')
        with c2:
            md('<div class="metric-box"><strong>alta</strong><span>Fluxo estimado</span></div>')
        with c3:
            md('<div class="metric-box"><strong>4,8 km</strong><span>Distância até destino</span></div>')
        with c4:
            md('<div class="metric-box"><strong>72.000</strong><span>Público previsto</span></div>')

        b1, b2, b3, b4 = st.columns(4)
        with b1:
            if st.button("Abrir mapa", type="primary", use_container_width=True):
                abrir_aba(" Mapa")
        with b2:
            if st.button("Planejar itinerário", use_container_width=True):
                abrir_aba(" Planejamento")
        with b3:
            if st.button("Ver recomendações", use_container_width=True):
                abrir_aba(" Recomendações")
        with b4:
            if st.button("Ver alertas", use_container_width=True):
                abrir_aba(" Alertas")

        st.write("")
        md("""
        <div class="dash-panel" style="padding:18px;">
            <h4>Principais locais</h4>
            <div class="place-box"><span class="tag">stadium</span><h4>Estádio Maracanã</h4><p class="muted">Portão principal - Maracanã</p></div>
            <div class="place-box"><span class="tag">hospital</span><h4>Hospital de Apoio</h4><p class="muted">Avenida do Serviço 120 - Tijuca</p></div>
            <div class="place-box"><span class="tag">transport</span><h4>Transporte Oficial A</h4><p class="muted">Terminal integrado - Maracanã</p></div>
            <div class="place-box"><span class="tag">transport</span><h4>Embarque Expresso B</h4><p class="muted">Corredor exclusivo - Tijuca</p></div>
        </div>
        """)

    with col_alertas:
        md("""
        <div class="dash-panel" style="padding:18px;">
            <h4>Alertas principais</h4>
            <div class="alert-box"><span class="tag">Médio</span><h4>Chuva leve prevista</h4><p class="muted">Rotas cobertas e pontos internos foram priorizados.</p></div>
            <div class="alert-box"><span class="tag">Alto</span><h4>Alta densidade no setor norte</h4><p class="muted">Entrada B tem fluxo mais estável neste momento.</p></div>
            <div class="alert-box"><span class="tag">Médio</span><h4>Rota noturna segura</h4><p class="muted">Rotas por vias iluminadas e transporte oficial foram priorizados.</p></div>
        </div>
        """)

    st.write("")
    md("""
    <div class="dash-panel" style="padding:18px;">
        <h4>Handoff externo</h4>
        <div class="external-grid">
            <div class="external-btn">Reservar hotel</div>
            <div class="external-btn">Comprar ingresso</div>
            <div class="external-btn">Reservar restaurante</div>
            <div class="external-btn">Abrir transporte</div>
        </div>
        <br>
        <div class="external-grid"><div class="external-btn">Site oficial</div></div>
    </div>
    """)


elif aba == " Mapa":
    md("""
    <div class="page-wide">
        <div class="hero-strip">
            <span class="tag">● Mapa interativo</span>
            <h1>Camadas e pontos de interesse</h1>
        </div>
        <div class="map-layout">
            <div class="panel layer-list">
                <h4>Camadas</h4>
                <div class="layer-row">Estádios <span class="toggle-dot"></span></div>
                <div class="layer-row">Hospitais <span class="toggle-dot"></span></div>
                <div class="layer-row">Hotéis <span class="toggle-dot"></span></div>
                <div class="layer-row">Restaurantes <span class="toggle-dot"></span></div>
                <div class="layer-row">Farmácias <span class="toggle-dot"></span></div>
                <div class="layer-row">Bares <span class="toggle-dot"></span></div>
                <div class="layer-row">Transporte <span class="toggle-dot"></span></div>
                <div class="layer-row">Entradas <span class="toggle-dot"></span></div>
                <div class="layer-row">Áreas de risco <span class="toggle-dot"></span></div>
                <div class="layer-row">Rotas alter. <span class="toggle-dot"></span></div>
            </div>
            <div>
                <div style="display:flex;justify-content:space-between;margin-bottom:12px;">
                    <strong>Final Continental 2027 - Rio de Janeiro</strong>
                    <span class="external-btn" style="padding:10px 18px;">Planejar rota</span>
                </div>
                <div class="map-art">
                    <div class="map-route"></div>
                    <div class="map-route2"></div>
                    <div class="map-hot hot1"></div>
                    <div class="map-hot hot2"></div>
                    <div class="map-pin pin1">H</div>
                    <div class="map-pin pin2">!</div>
                    <div class="map-pin pin3">P</div>
                    <div class="map-pin pin4">E</div>
                    <div class="map-pin pin5">B</div>
                    <div class="map-pin pin6">T</div>
                </div>
            </div>
            <div class="panel">
                <span class="tag">Estádios</span>
                <h4>Estádio Maracanã</h4>
                <p class="muted">Portão principal - Maracanã</p>
                <p class="muted">Nota: 4.8</p>
                <p class="muted">Área aberta</p>
                <p class="muted">Fila: 18 min</p>
                <div class="alert-box">
                    <strong>Alta densidade detectada.</strong>
                    <p class="muted">Entrada alternativa recomendada.</p>
                </div>
            </div>
        </div>
    </div>
    """)
    b1, b2, b3 = st.columns([1, 1, 1])
    with b1:
        st.button("Rota até aqui", type="primary", use_container_width=True)
    with b2:
        st.button("Avaliar local", use_container_width=True)
    with b3:
        st.button("Abrir endereço", use_container_width=True)


elif aba == " Rotas":
    md("""
    <div class="page-wrap">
        <div class="hero-strip">
            <span class="tag">● Roteirização</span>
            <h1>Rotas e navegação</h1>
        </div>
    </div>
    """)

    col_form, col_route = st.columns([1.5, 1])
    with col_form:
        with st.container(border=True):
            origem = st.text_input("Origem", "Minha localização")
            destino = st.selectbox("Destino", ["Estádio Maracanã", "Entrada B", "Transporte Oficial A", "Hotel Central Maracanã"])
            meio = st.selectbox("Deslocamento", ["A pé", "Metrô", "Ônibus", "Carro"])
            if st.button("Gerar rota", type="primary"):
                st.success(f"Rota segura sugerida de {origem} até {destino} usando {meio}.")

    with col_route:
        md("""
        <div class="panel">
            <div style="display:flex;gap:16px;align-items:center;">
                <div class="tag" style="width:54px;height:54px;display:flex;align-items:center;justify-content:center;">A pé</div>
                <div><h4>Estádio Maracanã</h4><p class="muted">Origem: Minha localização</p></div>
            </div>
            <br>
            <div class="external-grid">
                <div class="metric-box"><strong>4.8 km</strong><span>Distância</span></div>
                <div class="metric-box"><strong>76 min</strong><span>Tempo</span></div>
                <div class="metric-box"><strong>alto</strong><span>Tráfego</span></div>
                <div class="metric-box"><strong>vias iluminadas</strong><span>Segurança</span></div>
            </div>
            <hr style="border-color:#263b5a;">
            <h4>Detalhes da rota</h4>
            <p>1. Sair pelo eixo seguro mais próximo<br>2. Priorizar trecho coberto<br>3. Usar desvio por fluxo moderado<br>4. Chegar em Estádio Maracanã</p>
            <div class="route-step"><span class="tag">Alternativa</span><h4>Rota perimetral</h4><p class="muted">5.4 km - 83 min - evita área de alta densidade</p></div>
        </div>
        """)


elif aba == " Recomendações":
    md("""
    <div class="page-wrap">
        <div class="hero-strip">
            <span class="tag">● Sugestões contextuais</span>
            <h1>Recomendações próximas</h1>
        </div>
        <p>
            <span class="tag">Clima: Chuva leve</span>
            <span class="tag">Horário: 22:30</span>
            <span class="tag">Distância: 4.8 km</span>
            <span class="tag">Fluxo: alta</span>
        </p>
        <div class="recommend-grid">
            <div class="recommend-card"><div><span class="tag">Chuva</span><h4>Hotel Central Maracanã</h4><p class="muted">Local coberto recomendado para reduzir exposição à chuva.</p></div><div class="external-btn">Ver no mapa</div></div>
            <div class="recommend-card"><div><span class="tag">Chuva</span><h4>Mercado Gastronômico</h4><p class="muted">Local coberto recomendado para reduzir exposição à chuva.</p></div><div class="external-btn">Ver no mapa</div></div>
            <div class="recommend-card"><div><span class="tag">Chuva</span><h4>Farmácia 24h</h4><p class="muted">Local coberto recomendado para reduzir exposição à chuva.</p></div><div class="external-btn">Ver no mapa</div></div>
            <div class="recommend-card"><div><span class="tag">Conforto</span><h4>Rota com menor exposição</h4><p class="muted">A rota alternativa prioriza passagens cobertas e pontos de abrigo.</p></div><div class="external-btn">Abrir rotas</div></div>
            <div class="recommend-card"><div><span class="tag">22h+</span><h4>Transporte Oficial A</h4><p class="muted">Ponto oficial sugerido para deslocamento noturno por vias iluminadas.</p></div><div class="external-btn">Abrir rota</div></div>
            <div class="recommend-card"><div><span class="tag">22h+</span><h4>Embarque Expresso B</h4><p class="muted">Ponto oficial sugerido para deslocamento noturno por vias iluminadas.</p></div><div class="external-btn">Abrir rota</div></div>
            <div class="recommend-card"><div><span class="tag">Fluxo</span><h4>Entrada B</h4><p class="muted">Entrada alternativa com fila menor e melhor distribuição de pessoas.</p></div><div class="external-btn">Ver entrada</div></div>
            <div class="recommend-card"><div><span class="tag">Superlotação</span><h4>Buffer no cronograma</h4><p class="muted">Locais cheios recebem tempo extra no itinerário para evitar atrasos.</p></div><div class="external-btn">Editar roteiro</div></div>
            <div class="recommend-card"><div><span class="tag">Distância</span><h4>Melhor horário de saída</h4><p class="muted">Saia cerca de 38 min antes do horário alvo.</p></div><div class="external-btn">Ver roteiro</div></div>
        </div>
    </div>
    """)


elif aba == " Alertas":
    md("""
    <div class="page-wrap">
        <div class="hero-strip">
            <span class="tag">● Tempo real</span>
            <h1>Alertas e notificações</h1>
        </div>
        <div class="alert-box"><span class="tag">Médio</span><h4>Chuva leve prevista</h4><p>Rotas cobertas e pontos internos foram priorizados.</p></div>
        <div class="alert-box"><span class="tag">Alto</span><h4>Alta densidade no setor norte</h4><p>Entrada B tem fluxo mais estável neste momento.</p></div>
        <div class="alert-box"><span class="tag">Médio</span><h4>Rota noturna segura</h4><p>Rotas por vias iluminadas e transporte oficial foram priorizados.</p></div>
        <div class="alert-box"><span class="tag">Alto</span><h4>Densidade elevada</h4><p>Considere Entrada B ou caminho perimetral para reduzir espera.</p></div>
    </div>
    """)


elif aba == " Planejamento":
    md("""
    <div class="page-wrap">
        <div class="hero-strip">
            <span class="tag">● Pré-evento</span>
            <h1>Planejamento de itinerário</h1>
        </div>
    </div>
    """)

    eventos = buscar_eventos()
    col_agenda, col_roteiro = st.columns([1.1, 1])

    with col_agenda:
        with st.container(border=True):
            st.markdown("#### Agenda e locais")
            locais = [
                ("Estádio Maracanã", "Portão principal - Maracanã"),
                ("Hotel Central Maracanã", "Rua das Delegações 88 - Quinta"),
                ("Mercado Gastronômico", "Boulevard do Evento 45 - Maracanã"),
                ("Farmácia 24h", "Rua Norte 310 - Tijuca"),
                ("Bar do Entorno", "Travessa Leste 17 - Quinta"),
                ("Transporte Oficial A", "Terminal integrado - Maracanã"),
                ("Embarque Expresso B", "Corredor exclusivo - Tijuca"),
                ("Entrada A", "Acesso norte - Quinta"),
                ("Entrada B", "Acesso leste - Maracanã"),
            ]
            for nome_local, desc in locais:
                c1, c2 = st.columns([3, 1])
                with c1:
                    md(f'<div class="item-row"><h4>{nome_local}</h4><p class="muted">{desc}</p></div>')
                with c2:
                    st.button("Adicionar", key=f"add_{nome_local}", use_container_width=True)

    with col_roteiro:
        with st.container(border=True):
            c1, c2 = st.columns([1, 1])
            with c1:
                st.markdown("#### Meu roteiro")
            with c2:
                st.button("Salvar preferências", use_container_width=True)

            md("""
            <div class="external-grid" style="grid-template-columns:repeat(2, 1fr);">
                <div class="metric-box"><strong>R$ 103</strong><span>Custo estimado</span></div>
                <div class="metric-box"><strong>4</strong><span>Paradas</span></div>
            </div>
            <br>
            <div class="timeline-item"><span class="timeline-time">18:35</span><strong>Entrada B</strong><p class="muted">Permanência: 25 min<br>Saída prevista: 19:00</p></div>
            <div class="timeline-item"><span class="timeline-time">19:12</span><strong>Estádio Maracanã</strong><p class="muted">Permanência: 120 min + 18 min de segurança<br>Saída prevista: 21:30</p></div>
            <div class="timeline-item"><span class="timeline-time">21:48</span><strong>Mercado Gastronômico</strong><p class="muted">Permanência: 75 min + 20 min de segurança<br>Saída prevista: 23:23</p></div>
            <div class="timeline-item"><span class="timeline-time">23:41</span><strong>Transporte Oficial A</strong><p class="muted">Permanência: 25 min<br>Saída prevista: 00:06</p></div>
            """)

    st.write("")
    with st.expander("Salvar planejamento no banco"):
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
                criar_planejamento(nome, opcoes[evento_escolhido], origem, destino, meio, horario, anotacoes)
                st.success("Planejamento salvo!")


elif aba == " Roteiro final":
    md("""
    <div class="page-wrap">
        <div class="hero-strip">
            <span class="tag">● Resumo final</span>
            <h1>Cronograma completo</h1>
        </div>
        <div class="panel">
            <span class="tag">Saída: 18:00</span>
            <h4>Final Continental 2027</h4>
            <div class="timeline-item"><span class="timeline-time">18:35</span><strong>Entrada B</strong><span class="muted"> Permanência 25 min - saída 19:00</span></div>
            <div class="timeline-item"><span class="timeline-time">19:12</span><strong>Estádio Maracanã</strong><span class="muted"> Permanência 120 min - saída 21:30</span></div>
            <div class="timeline-item"><span class="timeline-time">21:48</span><strong>Mercado Gastronômico</strong><span class="muted"> Permanência 75 min - saída 23:23</span></div>
            <div class="timeline-item"><span class="timeline-time">23:41</span><strong>Transporte Oficial A</strong><span class="muted"> Permanência 25 min - saída 00:06</span></div>
        </div>
    </div>
    """)

    roteiro = """Roteiro UrbanFlow

Evento: Rio de Janeiro - Final Continental 2027
Saída recomendada: 18:00
Entrada recomendada: Entrada B
Rota: Fluxo seguro
Tempo estimado: 24 minutos
Recomendação: evitar Entrada A entre 18h e 19h

Cronograma:
18:35 - Entrada B
19:12 - Estádio Maracanã
21:48 - Mercado Gastronômico
23:41 - Transporte Oficial A
"""
    st.download_button("Exportar PDF", roteiro, file_name="roteiro_urbanflow.txt", type="primary", use_container_width=True)
    st.button("Salvar no calendário", use_container_width=True)
    st.button("Abrir rota", use_container_width=True)
    st.button("Compartilhar roteiro", use_container_width=True)
    if st.button("Voltar para edição", use_container_width=True):
        abrir_aba(" Planejamento")


elif aba == " Avaliar locais":
    md("""
    <div class="page-wrap">
        <div class="hero-strip">
            <span class="tag">● Feedback</span>
            <h1>Avaliação de locais</h1>
        </div>
    </div>
    """)

    col_form, col_lista = st.columns([1.4, .9])
    with col_form:
        with st.container(border=True):
            local = st.selectbox("Local", ["Estádio Maracanã", "Entrada A", "Entrada B", "Praça de alimentação", "Estação de metrô"])
            nota = st.slider("Nota do local", 1, 5, 4)
            estrelas = "".join([f'<span class="rating-star {"active" if i == nota else ""}">★</span>' for i in range(1, 6)])
            md(f"<div>{estrelas}</div>")
            comentario = st.text_area("Comentário", placeholder="Conte como foi a experiência")
            if st.button("Enviar avaliação", type="primary"):
                criar_avaliacao(local, nota, comentario)
                st.success(f"Avaliação enviada para {local}: {nota} estrelas.")

    with col_lista:
        md("""
        <div class="panel" style="min-height:260px;">
            <h4>Avaliações registradas</h4>
            <div style="border:1px dashed #355474;border-radius:16px;padding:28px;text-align:center;color:#a8b7ce;">
                Nenhuma avaliação enviada ainda.
            </div>
        </div>
        """)
