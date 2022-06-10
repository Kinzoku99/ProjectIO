import React from "react";
import {EQ, iEQ} from "../mathOutputFunctions";

const MainPage: React.FC = () => {
    const italics = (text: string) => {
        return (
            <span style={{fontStyle: "italic"}}>{" " + text}</span>
        )
    }

    return (
        <main id="main-page">
            {/* To jest sekcja nagłówka naszej strony czyli o czym to jest */}
            <section className="container text-center py-5">
                <div className="row py-lg-5">
                    <div className="col-lg-6 col-md-8 mx-auto">
                        <h1 className="fw-light">Strona główna</h1>

                        <p className="lead text-muted">
                            Ta strona powstała dla osób zainteresowanych całkowaniem.
                            Można tu znaleźć kalkulatory całek oznaczonych,
                            aproksymacje funkcji pierwotnych, i galerię ciekawych całek.
                            Poniżej znajduje się teoria dotycząca całek.
                        </p>
                    </div>
                </div>
            </section>

            {/* To jest jakieś wprowadzenie do całki Riemanna */}
            <section className="container pb-3">
                <div className="row">
                    <div className="col-lg-8 mx-auto">
                        <h2 className="fw-light">Całka Riemanna</h2>

                        <article>
                            <h3 className="h5 fw-light">Podział odcinka</h3>

                            Podziałem {iEQ("P")} przedziału {iEQ("[a,b]")} nazywa się każdy ściśle
                            rosnący ciąg skończony {iEQ("p_1, \\ldots, p_n")} elementów nazywanych
                            {italics("punktami podziału")} tego przedziału, gdzie
                            {EQ("a = p_0 < p_1 < \\ldots < p_{n-1} < p_n = b")}
                        </article>

                        <article>
                            <h3 className="h5 fw-light">Całka dolna i górna</h3>

                            Niech dana będzie funkcja ograniczona {iEQ("f:[a,b] \\to \\mathbb{R}")}.
                            Niech {iEQ("\\mathcal{P}")} oznacza zbiór podziałów odcinka {iEQ("[a,b]")}. Wówczas
                            całkę dolną i całkę górną Riemanna {iEQ("L_f")} i {iEQ("U_f")} definiują wzory
                            {EQ("L_f = \\sup_{P \\in \\mathcal{P}}\\left\\{\\sum_{i=1}^n \\inf_{x\\in [p_{i-1},p_i]} f(x) \\cdot (p_i-p_{i-1})\\right\\}")}
                            {EQ("U_f = \\inf_{P \\in \\mathcal{P}}\\left\\{\\sum_{i=1}^n \\sup_{x\\in [p_{i-1},p_i]} f(x) \\cdot (p_i-p_{i-1})\\right\\}")}
                        </article>

                        <article>
                            <h3 className="h5 fw-light">Funkcja całkowalna</h3>

                            Funkcja ograniczona {iEQ("f \\colon [a,b] \\to \\mathbb{R}")} jest całkowalna
                            w sensie Riemanna jeśli {iEQ("L_f = U_f")} i wówczas
                            {iEQ("\\int_a^b f(x) dx = L_f = U_f")}. <br/>
                            <small>
                                Powyższa definicja bywa nazywana całką Darboux,
                                istnieje inna definicja całki Riemanna,
                                ale obie definicje są równoważne.
                            </small>
                        </article>
                    </div>
                </div>
            </section>

            {/* To jest jakieś wprowadzenie do całki Lebesgue'a */}
            <section className="container pb-3">
                <div className="row">
                    <div className="col-lg-8 mx-auto">
                        <h2 className="fw-light">Całka Lebesgue'a</h2>

                        <article>
                            <h3 className="h5 fw-light">Funkcja prosta</h3>

                            Niech {iEQ("\\mathcal{F}")} będzie -ciałem podzbiorów
                            pewnego zbioru {iEQ("X")} oraz {iEQ("A \\subseteq X")}. Wówczas jeśli dla
                            {iEQ("f \\colon A \\to [0,\\infty)")} istnieją liczby nieujemne {iEQ("a_1,\\ldots,a_n")}
                            i zbiory {iEQ("A_1,\\ldots,A_n \\subseteq A")}, że
                            {EQ("f = \\sum_{i=1}^n a_i \\chi(A_i)")}
                            to {iEQ("f")} nazywamy funkcją prostą.
                        </article>

                        <article>
                            <h3 className="h5 fw-light">Funkcja mierzalna</h3>

                            W przestrzeni z miarą {iEQ("(X,\\mathcal{F},\\mu)")} elementy
                            {iEQ("\\sigma")}-ciała {iEQ("\\mathcal{F}")} określonego na przestrzeni {iEQ("X")} nazywa się
                            zbiorami {iEQ("\\mu")}-mierzalnymi względem {iEQ("\\mathcal{F}")}.
                            Funkcja {iEQ("f\\colon X \\to \\mathbb{R}")} jest {iEQ("\\mu")}-mierzalna
                            jeśli {iEQ("f^{-1}(U) \\in \\mathcal{F}")} dla dowolnych otwartych {iEQ("U \\subseteq \\mathbb{R}")}.
                        </article>

                        <article>
                            <h3 className="h5 fw-light">Rozbicie zbioru mierzalnego</h3>

                            Przeliczalna suma zbiorów {iEQ("E_1,\\ldots")} jest rozbiciem zbioru mierzalnego {iEQ("E")}
                            wtedy i tylko wtedy gdy {iEQ("E_i")} są mierzalne, parami rozłączne i {iEQ("\\bigcup E_i = E")}.
                        </article>

                        <article>
                            <h3 className="h5 fw-light">Całka z funkcji mierzalnej</h3>

                            Niech {iEQ("\\mathcal{S}")} będzie zbiorem funkcji prostych.
                            Niech {iEQ("f")} będzie funkcją mierzalną. Niech {iEQ("\\mathcal{R}(E)")} będzie
                            rodziną rozbić zbioru {iEQ("E")}. Całkę Lebesgue'a funkcji {iEQ("f")} na {iEQ("E")} definiuje się jako.
                            {EQ("\\int_{E} f d\\mu = \\sup_{(E_1,\\ldots) \\in \\mathcal{R}(E)}\\left(\\sum_{i=1}^{\\infty} \\inf_{x \\in E_i} \\max(f(x),0) \\mu(E_i)\\right)")}
                            {EQ("- \\sup_{(E_1,\\ldots) \\in \\mathcal{R}(E)}\\left(\\sum_{i=1}^{\\infty} \\inf_{x \\in E_i} -\\min(f(x),0) \\mu(E_i)\\right)")}
                        </article>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default MainPage;