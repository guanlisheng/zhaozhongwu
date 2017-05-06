(function (D) {
    function A(L, J, K) {
        var E = this,
        I = L.add(this),
        G = L.find(K.tabs),
        H = J.jquery ? J : L.children(J),
        F;
        G.length || (G = L.children());
        H.length || (H = L.parent().find(J));
        H.length || (H = D(J));
        D.extend(this, {
            click: function (P, M) {
                var N = G.eq(P);
                if (typeof P == "string" && P.replace("#", "")) {
                    N = G.filter("[href*=" + P.replace("#", "") + "]");
                    P = Math.max(G.index(N), 0)
                }
                if (K.rotate) {
                    var O = G.length - 1;
                    if (P < 0) {
                        return E.click(O, M)
                    }
                    if (P > O) {
                        return E.click(0, M)
                    }
                }
                if (!N.length) {
                    if (F >= 0) {
                        return E
                    }
                    P = K.initialIndex;
                    N = G.eq(P)
                }
                if (P === F) {
                    return E
                }
                M = M || D.Event();
                M.type = "onBeforeClick";
                I.trigger(M, [P]);
                if (!M.isDefaultPrevented()) {
                    B[K.effect].call(E, P,
                    function () {
                        M.type = "onClick";
                        I.trigger(M, [P])
                    });
                    F = P;
                    G.removeClass(K.current);
                    N.addClass(K.current);
                    return E
                }
            },
            getConf: function () {
                return K
            },
            getTabs: function () {
                return G
            },
            getPanes: function () {
                return H
            },
            getCurrentPane: function () {
                return H.eq(F)
            },
            getCurrentTab: function () {
                return G.eq(F)
            },
            getIndex: function () {
                return F
            },
            next: function () {
                return E.click(F + 1)
            },
            prev: function () {
                return E.click(F - 1)
            },
            destroy: function () {
                G.unbind(K.event).removeClass(K.current);
                H.find("a[href^=#]").unbind("click.T");
                return E
            }
        });
        D.each("onBeforeClick,onClick".split(","),
        function (N, M) {
            D.isFunction(K[M]) && D(E).bind(M, K[M]);
            E[M] = function (O) {
                O && D(E).bind(M, O);
                return E
            }
        });
        if (K.history && D.fn.history) {
            D.tools.history.init(G);
            K.event = "history"
        }
        G.each(function (M) {
            D(this).bind(K.event,
            function (N) {
                E.click(M, N);
                return N.preventDefault()
            })
        });
        H.find("a[href^=#]").bind("click.T",
        function (M) {
            E.click(D(this).attr("href"), M)
        });
        if (location.hash && K.tabs == "a" && L.find("[href=" + location.hash + "]").length) {
            E.click(location.hash)
        } else {
            if (K.initialIndex === 0 || K.initialIndex > 0) {
                E.click(K.initialIndex)
            }
        }
    }
    D.tools = D.tools || {
        version: "1.2.5"
    };
    D.tools.tabs = {
        conf: {
            tabs: "a",
            current: "current",
            onBeforeClick: null,
            onClick: null,
            effect: "default",
            initialIndex: 0,
            event: "click",
            rotate: false,
            history: false
        },
        addEffect: function (E, F) {
            B[E] = F
        }
    };
    var B = {
        "default": function (E, F) {
            this.getPanes().hide().eq(E).show();
            F.call()
        },
        fade: function (E, H) {
            var I = this.getConf(),
            F = I.fadeOutSpeed,
            G = this.getPanes();
            F ? G.fadeOut(F) : G.hide();
            G.eq(E).fadeIn(I.fadeInSpeed, H)
        },
        slide: function (E, F) {
            this.getPanes().slideUp(200);
            this.getPanes().eq(E).slideDown(400, F)
        },
        ajax: function (E, F) {
            this.getPanes().eq(0).load(this.getTabs().eq(E).attr("href"), F)
        }
    },
    C;
    D.tools.tabs.addEffect("horizontal",
    function (E, F) {
        C || (C = this.getPanes().eq(0).width());
        this.getCurrentPane().animate({
            width: 0
        },
        function () {
            D(this).hide()
        });
        this.getPanes().eq(E).animate({
            width: C
        },
        function () {
            D(this).show();
            F.call()
        })
    });
    D.fn.tabs = function (E, F) {
        var G = this.data("tabs");
        if (G) {
            G.destroy();
            this.removeData("tabs")
        }
        if (D.isFunction(F)) {
            F = {
                onBeforeClick: F
            }
        }
        F = D.extend({},
        D.tools.tabs.conf, F);
        this.each(function () {
            G = new A(D(this), E, F);
            D(this).data("tabs", G)
        });
        return F.api ? G : this
    }
})(jQuery); (function (D) {
    function A(J, H, I) {
        var E = I.relative ? J.position().top : J.offset().top,
        F = I.relative ? J.position().left : J.offset().left,
        G = I.position[0];
        E -= H.outerHeight() - I.offset[0];
        F += J.outerWidth() + I.offset[1];
        if (/iPad/i.test(navigator.userAgent)) {
            E -= D(window).scrollTop()
        }
        var K = H.outerHeight() + J.outerHeight();
        if (G == "center") {
            E += K / 2
        }
        if (G == "bottom") {
            E += K
        }
        G = I.position[1];
        J = H.outerWidth() + J.outerWidth();
        if (G == "center") {
            F -= J / 2
        }
        if (G == "left") {
            F -= J
        }
        return {
            top: E,
            left: F
        }
    }
    function C(R, P) {
        var Q = this,
        L = R.add(Q),
        S,
        M = 0,
        J = 0,
        O = GetTooltipDescription(R.attr("title")),
        G = R.attr("data-tooltip"),
        E = B[P.effect],
        N,
        F = R.is(":input"),
        H = F && R.is(":checkbox, :radio, select, :button, :submit"),
        I = R.attr("type"),
        K = P.events[I] || P.events[F ? H ? "widget" : "input" : "def"];
        if (!E) {
            throw 'Nonexistent effect "' + P.effect + '"'
        }
        K = K.split(/,\s*/);
        if (K.length != 2) {
            throw "Tooltip: bad events configuration for " + I
        }
        R.bind(K[0],
        function (T) {
            clearTimeout(M);
            if (P.predelay) {
                J = setTimeout(function () {
                    Q.show(T)
                },
                P.predelay)
            } else {
                Q.show(T)
            }
        }).bind(K[1],
        function (T) {
            clearTimeout(J);
            if (P.delay) {
                M = setTimeout(function () {
                    Q.hide(T)
                },
                P.delay)
            } else {
                Q.hide(T)
            }
        });
        if (O && P.cancelDefault) {
            R.removeAttr("title");
            R.data("title", O)
        }
        D.extend(Q, {
            show: function (U) {
                if (!S) {
                    if (G) {
                        S = D(G)
                    } else {
                        if (P.tip) {
                            S = D(P.tip).eq(0)
                        } else {
                            if (O) {
                                S = D(P.layout).addClass(P.tipClass).appendTo(document.body).hide().append(O)
                            } else {
                                S = R.next();
                                S.length || (S = R.parent().next())
                            }
                        }
                    }
                    if (!S.length) {
                        throw "Cannot find tooltip for " + R
                    }
                }
                if (Q.isShown()) {
                    return Q
                }
                S.stop(true, true);
                var T = A(R, S, P);
                P.tip && S.html(R.data("title"));
                U = U || D.Event();
                U.type = "onBeforeShow";
                L.trigger(U, [T]);
                if (U.isDefaultPrevented()) {
                    return Q
                }
                T = A(R, S, P);
                S.css({
                    position: "absolute",
                    top: T.top,
                    left: T.left,
                    "z-index": 99999
                });
                N = true;
                E[0].call(Q,
                function () {
                    U.type = "onShow";
                    N = "full";
                    L.trigger(U)
                });
                T = P.events.tooltip.split(/,\s*/);
                if (!S.data("__set")) {
                    S.bind(T[0],
                    function () {
                        clearTimeout(M);
                        clearTimeout(J)
                    });
                    T[1] && !R.is("input:not(:checkbox, :radio), textarea") && S.bind(T[1],
                    function (V) {
                        V.relatedTarget != R[0] && R.trigger(K[1].split(" ")[0])
                    });
                    S.data("__set", true)
                }
                return Q
            },
            hide: function (T) {
                if (!S || !Q.isShown()) {
                    return Q
                }
                T = T || D.Event();
                T.type = "onBeforeHide";
                L.trigger(T);
                if (!T.isDefaultPrevented()) {
                    N = false;
                    B[P.effect][1].call(Q,
                    function () {
                        T.type = "onHide";
                        L.trigger(T)
                    });
                    return Q
                }
            },
            isShown: function (T) {
                return T ? N == "full" : N
            },
            getConf: function () {
                return P
            },
            getTip: function () {
                return S
            },
            getTrigger: function () {
                return R
            }
        });
        D.each("onHide,onBeforeShow,onShow,onBeforeHide".split(","),
        function (U, T) {
            D.isFunction(P[T]) && D(Q).bind(T, P[T]);
            Q[T] = function (V) {
                V && D(Q).bind(T, V);
                return Q
            }
        })
    }
    D.tools = D.tools || {
        version: "1.2.5"
    };
    D.tools.tooltip = {
        conf: {
            effect: "toggle",
            fadeOutSpeed: "fast",
            predelay: 0,
            delay: 30,
            opacity: 1,
            tip: 0,
            position: ["top", "center"],
            offset: [0, 0],
            relative: false,
            cancelDefault: true,
            events: {
                def: "mouseenter,mouseleave",
                input: "focus,blur",
                widget: "focus mouseenter,blur mouseleave",
                tooltip: "mouseenter,mouseleave"
            },
            layout: "<div/>",
            tipClass: "tooltip"
        },
        addEffect: function (G, E, F) {
            B[G] = [E, F]
        }
    };
    var B = {
        toggle: [function (G) {
            var E = this.getConf(),
            F = this.getTip();
            E = E.opacity;
            E < 1 && F.css({
                opacity: E
            });
            F.show();
            G.call()
        },
        function (E) {
            this.getTip().hide();
            E.call()
        }],
        fade: [function (F) {
            var E = this.getConf();
            this.getTip().fadeTo(E.fadeInSpeed, E.opacity, F)
        },
        function (E) {
            this.getTip().fadeOut(this.getConf().fadeOutSpeed, E)
        }]
    };
    D.fn.tooltip = function (F) {
        var E = this.data("tooltip");
        if (E) {
            return E
        }
        F = D.extend(true, {},
        D.tools.tooltip.conf, F);
        if (typeof F.position == "string") {
            F.position = F.position.split(/,?\s/)
        }
        this.each(function () {
            E = new C(D(this), F);
            D(this).data("tooltip", E)
        });
        return F.api ? E : this
    }
})(jQuery); (function (A) {
    function B(G, F) {
        var E = A(F);
        return E.length < 2 ? E : G.parent().find(F)
    }
    function C(O, N) {
        var M = this,
        I = O.add(M),
        P = O.children(),
        K = 0,
        H = N.vertical;
        D || (D = M);
        if (P.length > 1) {
            P = A(N.items, O)
        }
        A.extend(M, {
            getConf: function () {
                return N
            },
            getIndex: function () {
                return K
            },
            getSize: function () {
                return M.getItems().size()
            },
            getNaviButtons: function () {
                return J.add(F)
            },
            getRoot: function () {
                return O
            },
            getItemWrap: function () {
                return P
            },
            getItems: function () {
                return P.children(N.item).not("." + N.clonedClass)
            },
            move: function (R, Q) {
                return M.seekTo(K + R, Q)
            },
            next: function (Q) {
                return M.move(1, Q)
            },
            prev: function (Q) {
                return M.move(-1, Q)
            },
            begin: function (Q) {
                return M.seekTo(0, Q)
            },
            end: function (Q) {
                return M.seekTo(M.getSize() - 1, Q)
            },
            focus: function () {
                return D = M
            },
            addItem: function (Q) {
                Q = A(Q);
                if (N.circular) {
                    P.children("." + N.clonedClass + ":last").before(Q);
                    P.children("." + N.clonedClass + ":first").replaceWith(Q.clone().addClass(N.clonedClass))
                } else {
                    P.append(Q)
                }
                I.trigger("onAddItem", [Q]);
                return M
            },
            seekTo: function (U, R, Q) {
                U.jquery || (U *= 1);
                if (N.circular && U === 0 && K == -1 && R !== 0) {
                    return M
                }
                if (!N.circular && U < 0 || U > M.getSize() || U < -1) {
                    return M
                }
                var S = U;
                if (U.jquery) {
                    U = M.getItems().index(U)
                } else {
                    S = M.getItems().eq(U)
                }
                var T = A.Event("onBeforeSeek");
                if (!Q) {
                    I.trigger(T, [U, R]);
                    if (T.isDefaultPrevented() || !S.length) {
                        return M
                    }
                }
                S = H ? {
                    top: -S.position().top
                } : {
                    left: -S.position().left
                };
                K = U;
                D = M;
                if (R === undefined) {
                    R = N.speed
                }
                P.animate(S, R, N.easing, Q ||
                function () {
                    I.trigger("onSeek", [U])
                });
                return M
            }
        });
        A.each(["onBeforeSeek", "onSeek", "onAddItem"],
        function (R, Q) {
            A.isFunction(N[Q]) && A(M).bind(Q, N[Q]);
            M[Q] = function (S) {
                S && A(M).bind(Q, S);
                return M
            }
        });
        if (N.circular) {
            var E = M.getItems().slice(-1).clone().prependTo(P),
            G = M.getItems().eq(1).clone().appendTo(P);
            E.add(G).addClass(N.clonedClass);
            M.onBeforeSeek(function (S, R, Q) {
                if (!S.isDefaultPrevented()) {
                    if (R == -1) {
                        M.seekTo(E, Q,
                        function () {
                            M.end(0)
                        });
                        return S.preventDefault()
                    } else {
                        R == M.getSize() && M.seekTo(G, Q,
                        function () {
                            M.begin(0)
                        })
                    }
                }
            });
            M.seekTo(0, 0,
            function () { })
        }
        var J = B(O, N.prev).click(function () {
            M.prev()
        }),
        F = B(O, N.next).click(function () {
            M.next()
        });
        if (!N.circular && M.getSize() > 1) {
            M.onBeforeSeek(function (R, Q) {
                setTimeout(function () {
                    if (!R.isDefaultPrevented()) {
                        J.toggleClass(N.disabledClass, Q <= 0);
                        F.toggleClass(N.disabledClass, Q >= M.getSize() - 1)
                    }
                },
                1)
            });
            N.initialIndex || J.addClass(N.disabledClass)
        }
        N.mousewheel && A.fn.mousewheel && O.mousewheel(function (R, Q) {
            if (N.mousewheel) {
                M.move(Q < 0 ? 1 : -1, N.wheelSpeed || 50);
                return false
            }
        });
        if (N.touch) {
            var L = {};
            P[0].ontouchstart = function (Q) {
                Q = Q.touches[0];
                L.x = Q.clientX;
                L.y = Q.clientY
            };
            P[0].ontouchmove = function (S) {
                if (S.touches.length == 1 && !P.is(":animated")) {
                    var R = S.touches[0],
                    Q = L.x - R.clientX;
                    R = L.y - R.clientY;
                    M[H && R > 0 || !H && Q > 0 ? "next" : "prev"]();
                    S.preventDefault()
                }
            }
        }
        N.keyboard && A(document).bind("keydown.scrollable",
        function (R) {
            if (!(!N.keyboard || R.altKey || R.ctrlKey || A(R.target).is(":input"))) {
                if (!(N.keyboard != "static" && D != M)) {
                    var Q = R.keyCode;
                    if (H && (Q == 38 || Q == 40)) {
                        M.move(Q == 38 ? -1 : 1);
                        return R.preventDefault()
                    }
                    if (!H && (Q == 37 || Q == 39)) {
                        M.move(Q == 37 ? -1 : 1);
                        return R.preventDefault()
                    }
                }
            }
        });
        N.initialIndex && M.seekTo(N.initialIndex, 0,
        function () { })
    }
    A.tools = A.tools || {
        version: "1.2.5"
    };
    A.tools.scrollable = {
        conf: {
            activeClass: "active",
            circular: false,
            clonedClass: "cloned",
            disabledClass: "disabled",
            easing: "swing",
            initialIndex: 0,
            item: null,
            items: ".items",
            keyboard: true,
            mousewheel: false,
            next: ".next",
            prev: ".prev",
            speed: 400,
            vertical: false,
            touch: true,
            wheelSpeed: 0
        }
    };
    var D;
    A.fn.scrollable = function (F) {
        var E = this.data("scrollable");
        if (E) {
            return E
        }
        F = A.extend({},
        A.tools.scrollable.conf, F);
        this.each(function () {
            E = new C(A(this), F);
            A(this).data("scrollable", E)
        });
        return F.api ? E : this
    }
})(jQuery); (function (D) {
    function C(O, K) {
        var L = this,
        F = O.add(L),
        I = D(window),
        G,
        M,
        J,
        N = D.tools.expose && (K.mask || K.expose),
        H = Math.random().toString().slice(10);
        if (N) {
            if (typeof N == "string") {
                N = {
                    color: N
                }
            }
            N.closeOnClick = N.closeOnEsc = false
        }
        var E = K.target || O.attr("rel");
        M = E ? D(E) : O;
        if (!M.length) {
            throw "Could not find Overlay: " + E
        }
        O && O.index(M) == -1 && O.click(function (P) {
            L.load(P);
            return P.preventDefault()
        });
        D.extend(L, {
            load: function (R) {
                if (L.isOpened()) {
                    return L
                }
                var P = B[K.effect];
                if (!P) {
                    throw 'Overlay: cannot find effect : "' + K.effect + '"'
                }
                K.oneInstance && D.each(A,
                function () {
                    this.close(R)
                });
                R = R || D.Event();
                R.type = "onBeforeLoad";
                F.trigger(R);
                if (R.isDefaultPrevented()) {
                    return L
                }
                J = true;
                N && D(M).expose(N);
                var Q = K.top,
                S = K.left,
                U = M.outerWidth({
                    margin: true
                }),
                T = M.outerHeight({
                    margin: true
                });
                if (typeof Q == "string") {
                    Q = Q == "center" ? Math.max((I.height() - T) / 2, 0) : parseInt(Q, 10) / 100 * I.height()
                }
                if (S == "center") {
                    S = Math.max((I.width() - U) / 2, 0)
                }
                P[0].call(L, {
                    top: Q,
                    left: S
                },
                function () {
                    if (J) {
                        R.type = "onLoad";
                        F.trigger(R)
                    }
                });
                N && K.closeOnClick && D.mask.getMask().one("click", L.close);
                K.closeOnClick && D(document).bind("click." + H,
                function (V) {
                    D(V.target).parents(M).length || L.close(V)
                });
                K.closeOnEsc && D(document).bind("keydown." + H,
                function (V) {
                    V.keyCode == 27 && L.close(V)
                });
                return L
            },
            close: function (P) {
                if (!L.isOpened()) {
                    return L
                }
                P = P || D.Event();
                P.type = "onBeforeClose";
                F.trigger(P);
                if (!P.isDefaultPrevented()) {
                    J = false;
                    B[K.effect][1].call(L,
                    function () {
                        P.type = "onClose";
                        F.trigger(P)
                    });
                    D(document).unbind("click." + H).unbind("keydown." + H);
                    N && D.mask.close();
                    return L
                }
            },
            getOverlay: function () {
                return M
            },
            getTrigger: function () {
                return O
            },
            getClosers: function () {
                return G
            },
            isOpened: function () {
                return J
            },
            getConf: function () {
                return K
            }
        });
        D.each("onBeforeLoad,onStart,onLoad,onBeforeClose,onClose".split(","),
        function (Q, P) {
            D.isFunction(K[P]) && D(L).bind(P, K[P]);
            L[P] = function (R) {
                R && D(L).bind(P, R);
                return L
            }
        });
        G = M.find(K.close || ".close");
        if (!G.length && !K.close) {
            G = D('<a class="close"></a>');
            M.prepend(G)
        }
        G.click(function (P) {
            L.close(P)
        });
        K.load && L.load()
    }
    D.tools = D.tools || {
        version: "1.2.5"
    };
    D.tools.overlay = {
        addEffect: function (E, F, G) {
            B[E] = [F, G]
        },
        conf: {
            close: null,
            closeOnClick: true,
            closeOnEsc: true,
            closeSpeed: "fast",
            effect: "default",
            fixed: 1,
            left: "center",
            load: false,
            mask: null,
            oneInstance: true,
            speed: "normal",
            target: null,
            top: "10%"
        }
    };
    var A = [],
    B = {};
    D.tools.overlay.addEffect("default",
    function (E, F) {
        var G = this.getConf(),
        H = D(window);
        if (!G.fixed) {
            E.top += H.scrollTop();
            E.left += H.scrollLeft()
        }
        E.position = G.fixed ? "fixed" : "absolute";
        this.getOverlay().css(E).fadeIn(G.speed, F)
    },
    function (E) {
        this.getOverlay().fadeOut(this.getConf().closeSpeed, E)
    });
    D.fn.overlay = function (E) {
        var F = this.data("overlay");
        if (F) {
            return F
        }
        if (D.isFunction(E)) {
            E = {
                onBeforeLoad: E
            }
        }
        E = D.extend(true, {},
        D.tools.overlay.conf, E);
        this.each(function () {
            F = new C(D(this), E);
            A.push(F);
            D(this).data("overlay", F)
        });
        return E.api ? F : this
    }
})(jQuery); (function (P) {
    function I(C, B) {
        return 32 - (new Date(C, B, 32)).getDate()
    }
    function J(C, B) {
        C = "" + C;
        for (B = B || 2; C.length < B;) {
            C = "0" + C
        }
        return C
    }
    function N(T, S, U) {
        var R = T.getDate(),
        B = T.getDay(),
        C = T.getMonth();
        T = T.getFullYear();
        var Q = {
            d: R,
            dd: J(R),
            ddd: E[U].shortDays[B],
            dddd: E[U].days[B],
            m: C + 1,
            mm: J(C + 1),
            mmm: E[U].shortMonths[C],
            mmmm: E[U].months[C],
            yy: String(T).slice(2),
            yyyy: T
        };
        S = S.replace(H,
        function (V) {
            return V in Q ? Q[V] : V.slice(1, V.length - 1)
        });
        return G.html(S).html()
    }
    function A(B) {
        return parseInt(B, 10)
    }
    function O(C, B) {
        return C.getFullYear() === B.getFullYear() && C.getMonth() == B.getMonth() && C.getDate() == B.getDate()
    }
    function F(C) {
        if (C) {
            if (C.constructor == Date) {
                return C
            }
            if (typeof C == "string") {
                var B = C.split("-");
                if (B.length == 3) {
                    return new Date(A(B[0]), A(B[1]) - 1, A(B[2]))
                }
                if (!/^-?\d+$/.test(C)) {
                    return
                }
                C = A(C)
            }
            B = new Date;
            B.setDate(B.getDate() + C);
            return B
        }
    }
    function D(Z, Y) {
        function T(f, c, a) {
            W = f;
            Aa = f.getFullYear();
            Ab = f.getMonth();
            y = f.getDate();
            a = a || P.Event("api");
            a.type = "change";
            g.trigger(a, [f]);
            if (!a.isDefaultPrevented()) {
                Z.val(N(f, c.format, c.lang));
                Z.data("date", f);
                V.hide(a)
            }
        }
        function R(a) {
            a.type = "onShow";
            g.trigger(a);
            P(document).bind("keydown.d",
            function (h) {
                if (h.ctrlKey) {
                    return true
                }
                var c = h.keyCode;
                if (c == 27) {
                    return V.hide(h)
                }
                if (P(L).index(c) >= 0) {
                    if (!S) {
                        V.show(h);
                        return h.preventDefault()
                    }
                    var f = P("#" + b.weeks + " a"),
                    k = P("." + b.focus),
                    j = f.index(k);
                    k.removeClass(b.focus);
                    if (c == 74 || c == 40) {
                        j += 7
                    } else {
                        if (c == 75 || c == 38) {
                            j -= 7
                        } else {
                            if (c == 76 || c == 39) {
                                j += 1
                            } else {
                                if (c == 72 || c == 37) {
                                    j -= 1
                                }
                            }
                        }
                    }
                    if (j > 41) {
                        V.addMonth();
                        k = P("#" + b.weeks + " a:eq(" + (j - 42) + ")")
                    } else {
                        if (j < 0) {
                            V.addMonth(-1);
                            k = P("#" + b.weeks + " a:eq(" + (j + 42) + ")")
                        } else {
                            k = f.eq(j)
                        }
                    }
                    k.addClass(b.focus);
                    return h.preventDefault()
                }
                if (c == 34) {
                    return V.addMonth()
                }
                if (c == 33) {
                    return V.addMonth(-1)
                }
                if (c == 36) {
                    return V.today()
                }
                if (c == 13) {
                    P(h.target).is("select") || P("." + b.focus).click()
                }
                return true;
                return P([16, 17, 18, 9]).index(c) >= 0
            });
            P(document).bind("click.d",
            function (f) {
                var c = f.target;
                if (!P(c).parents("#" + b.root).length && c != Z[0] && (!t || c != t[0])) {
                    V.hide(f)
                }
            })
        }
        var V = this,
        B = new Date,
        b = Y.css,
        C = E[Y.lang],
        U = P("#" + b.root),
        u = U.find("#" + b.title),
        t,
        i,
        d,
        Aa,
        Ab,
        y,
        W = Z.attr("data-value") || Y.value || Z.val(),
        X = Z.attr("min") || Y.min,
        Q = Z.attr("max") || Y.max,
        S;
        if (X === 0) {
            X = "0"
        }
        W = F(W) || B;
        X = F(X || Y.yearRange[0] * 365);
        Q = F(Q || Y.yearRange[1] * 365);
        if (!C) {
            throw "Dateinput: invalid language: " + Y.lang
        }
        if (Z.attr("type") == "date") {
            var l = P("<input/>");
            P.each("class,disabled,id,maxlength,name,readonly,required,size,style,tabindex,title,value".split(","),
            function (c, a) {
                l.attr(a, Z.attr(a))
            });
            Z.replaceWith(l);
            Z = l
        }
        Z.addClass(b.input);
        var g = Z.add(V);
        if (!U.length) {
            U = P("<div><div><a/><div/><a/></div><div><div/><div/></div></div>").hide().css({
                position: "absolute"
            }).attr("id", b.root);
            U.children().eq(0).attr("id", b.head).end().eq(1).attr("id", b.body).children().eq(0).attr("id", b.days).end().eq(1).attr("id", b.weeks).end().end().end().find("a").eq(0).attr("id", b.prev).end().eq(1).attr("id", b.next);
            u = U.find("#" + b.head).find("div").attr("id", b.title);
            if (Y.selectors) {
                var Ac = P("<select/>").attr("id", b.month),
                x = P("<select/>").attr("id", b.year);
                u.html(x.add(Ac))
            }
            for (var e = U.find("#" + b.days), o = 0; o < 7; o++) {
                e.append(P("<span/>").text(C.shortDays[(o + Y.firstDay) % 7]))
            }
            P("body").append(U)
        }
        if (Y.trigger) {
            t = P("<a/>").attr("href", "#").addClass(b.trigger).click(function (a) {
                V.isOpen() ? V.hide() : V.show();
                return a.preventDefault()
            }).insertAfter(Z)
        }
        var v = U.find("#" + b.weeks);
        x = U.find("#" + b.year);
        Ac = U.find("#" + b.month);
        P.extend(V, {
            show: function (c) {
                if (!(Z.attr("readonly") || Z.attr("disabled") || S)) {
                    c = c || P.Event();
                    c.type = "onBeforeShow";
                    g.trigger(c);
                    if (!c.isDefaultPrevented()) {
                        P.each(M,
                        function () {
                            this.hide()
                        });
                        S = true;
                        Ac.unbind("change").change(function () {
                            V.setValue(x.val(), P(this).val())
                        });
                        x.unbind("change").change(function () {
                            V.setValue(P(this).val(), Ac.val())
                        });
                        i = U.find("#" + b.prev).unbind("click").click(function () {
                            i.hasClass(b.disabled) || V.addMonth(-1);
                            return false
                        });
                        d = U.find("#" + b.next).unbind("click").click(function () {
                            d.hasClass(b.disabled) || V.addMonth();
                            return false
                        });
                        V.setValue(W);
                        var a = Z.offset();
                        if (/iPad/i.test(navigator.userAgent)) {
                            a.top -= P(window).scrollTop()
                        }
                        U.css({
                            top: a.top + Z.outerHeight() + Y.offset[0],
                            left: a.left + Y.offset[1]
                        });
                        if (Y.speed) {
                            U.show(Y.speed,
                            function () {
                                R(c)
                            })
                        } else {
                            U.show();
                            R(c)
                        }
                        return V
                    }
                }
            },
            setValue: function (n, a, q) {
                var j = A(a) >= -1 ? new Date(A(n), A(a), A(q || 1)) : n || W;
                if (j < X) {
                    j = X
                } else {
                    if (j > Q) {
                        j = Q
                    }
                }
                n = j.getFullYear();
                a = j.getMonth();
                q = j.getDate();
                if (a == -1) {
                    a = 11;
                    n--
                } else {
                    if (a == 12) {
                        a = 0;
                        n++
                    }
                }
                if (!S) {
                    T(j, Y);
                    return V
                }
                Ab = a;
                Aa = n;
                q = new Date(n, a, 1 - Y.firstDay);
                q = q.getDay();
                var f = I(n, a),
                k = I(n, a - 1),
                p;
                if (Y.selectors) {
                    Ac.empty();
                    P.each(C.months,
                    function (s, r) {
                        X < new Date(n, s + 1, -1) && Q > new Date(n, s, 0) && Ac.append(P("<option/>").html(r).attr("value", s))
                    });
                    x.empty();
                    j = B.getFullYear();
                    for (var m = j + Y.yearRange[0]; m < j + Y.yearRange[1]; m++) {
                        X <= new Date(m + 1, -1, 1) && Q > new Date(m, 0, 0) && x.append(P("<option/>").text(m))
                    }
                    Ac.val(a);
                    x.val(n)
                } else {
                    u.html(C.months[a] + " " + n)
                }
                v.empty();
                i.add(d).removeClass(b.disabled);
                m = !q ? -7 : 0;
                for (var h, c; m < (!q ? 35 : 42) ; m++) {
                    h = P("<a/>");
                    if (m % 7 === 0) {
                        p = P("<div/>").addClass(b.week);
                        v.append(p)
                    }
                    if (m < q) {
                        h.addClass(b.off);
                        c = k - q + m + 1;
                        j = new Date(n, a - 1, c)
                    } else {
                        if (m >= q + f) {
                            h.addClass(b.off);
                            c = m - f - q + 1;
                            j = new Date(n, a + 1, c)
                        } else {
                            c = m - q + 1;
                            j = new Date(n, a, c);
                            if (O(W, j)) {
                                h.attr("id", b.current).addClass(b.focus)
                            } else {
                                O(B, j) && h.attr("id", b.today)
                            }
                        }
                    }
                    X && j < X && h.add(i).addClass(b.disabled);
                    Q && j > Q && h.add(d).addClass(b.disabled);
                    h.attr("href", "#" + c).text(c).data("date", j);
                    p.append(h)
                }
                v.find("a").click(function (s) {
                    var r = P(this);
                    if (!r.hasClass(b.disabled)) {
                        P("#" + b.current).removeAttr("id");
                        r.attr("id", b.current);
                        T(r.data("date"), Y, s)
                    }
                    return false
                });
                b.sunday && v.find(b.week).each(function () {
                    var r = Y.firstDay ? 7 - Y.firstDay : 0;
                    P(this).children().slice(r, r + 1).addClass(b.sunday)
                });
                return V
            },
            setMin: function (c, a) {
                X = F(c);
                a && W < X && V.setValue(X);
                return V
            },
            setMax: function (c, a) {
                Q = F(c);
                a && W > Q && V.setValue(Q);
                return V
            },
            today: function () {
                return V.setValue(B)
            },
            addDay: function (a) {
                return this.setValue(Aa, Ab, y + (a || 1))
            },
            addMonth: function (a) {
                return this.setValue(Aa, Ab + (a || 1), y)
            },
            addYear: function (a) {
                return this.setValue(Aa + (a || 1), Ab, y)
            },
            hide: function (a) {
                if (S) {
                    a = P.Event();
                    a.type = "onHide";
                    g.trigger(a);
                    P(document).unbind("click.d").unbind("keydown.d");
                    if (a.isDefaultPrevented()) {
                        return
                    }
                    U.hide();
                    S = false
                }
                return V
            },
            getConf: function () {
                return Y
            },
            getInput: function () {
                return Z
            },
            getCalendar: function () {
                return U
            },
            getValue: function (a) {
                return a ? N(W, a, Y.lang) : W
            },
            isOpen: function () {
                return S
            }
        });
        P.each(["onBeforeShow", "onShow", "change", "onHide"],
        function (c, a) {
            P.isFunction(Y[a]) && P(V).bind(a, Y[a]);
            V[a] = function (f) {
                f && P(V).bind(a, f);
                return V
            }
        });
        Z.bind("focus click", V.show).keydown(function (c) {
            return true;
            var a = c.keyCode;
            if (!S && P(L).index(a) >= 0) {
                V.show(c);
                return c.preventDefault()
            }
            return c.shiftKey || c.ctrlKey || c.altKey || a == 9 ? true : c.preventDefault()
        });
        F(Z.val()) && T(W, Y)
    }
    P.tools = P.tools || {
        version: "1.2.5"
    };
    var M = [],
    K,
    L = [75, 76, 38, 39, 74, 72, 40, 37],
    E = {};
    K = P.tools.dateinput = {
        conf: {
            format: "mm/dd/yy",
            selectors: false,
            yearRange: [-60, 5],
            lang: "en",
            offset: [0, 0],
            speed: 0,
            firstDay: 0,
            min: undefined,
            max: undefined,
            trigger: false,
            css: {
                prefix: "cal",
                input: "date",
                root: 0,
                head: 0,
                title: 0,
                prev: 0,
                next: 0,
                month: 0,
                year: 0,
                days: 0,
                body: 0,
                weeks: 0,
                today: 0,
                current: 0,
                week: 0,
                off: 0,
                sunday: 0,
                focus: 0,
                disabled: 0,
                trigger: 0
            }
        },
        localize: function (C, B) {
            P.each(B,
            function (R, Q) {
                B[R] = Q.split(",")
            });
            E[C] = B
        }
    };
    K.localize("en", {
        months: "January,February,March,April,May,June,July,August,September,October,November,December",
        shortMonths: "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec",
        days: "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday",
        shortDays: "Sun,Mon,Tue,Wed,Thu,Fri,Sat"
    });
    var H = /d{1,4}|m{1,4}|yy(?:yy)?|"[^"]*"|'[^']*'/g,
    G = P("<a/>");
    P.expr[":"].date = function (C) {
        var B = C.getAttribute("type");
        return B && B == "date" || !!P(C).data("dateinput")
    };
    P.fn.dateinput = function (C) {
        if (this.data("dateinput")) {
            return this
        }
        C = P.extend(true, {},
        K.conf, C);
        P.each(C.css,
        function (R, Q) {
            if (!Q && R != "prefix") {
                C.css[R] = (C.css.prefix || "") + (Q || R)
            }
        });
        var B;
        this.each(function () {
            var Q = new D(P(this), C);
            M.push(Q);
            Q = Q.getInput().data("dateinput", Q);
            B = B ? B.add(Q) : Q
        });
        return B ? B : this
    }
})(jQuery);
function GetTooltipDescription(A) {
    if (/\.(jpg|jpeg|gif|png)$/i.test(A)) {
        if (A.indexOf("style") > 0) {
            return "<img src='" + A + "' style='max-width:200px;' />"
        } else {
            return "<img src='" + A + "' width='200' />"
        }
    } else {
        if (/\.swf$/i.test(A)) {
            return "<embed src='" + A + "' style='width:200px;' />"
        }
    }
    switch (A) {
        case "OrdinalAscing":
            return "显示顺序，按从小到大顺序排列。";
        case "OrdinalDescing":
            return "显示顺序，按从大到小顺序排列。";
        case "IsReaded":
            return "是否已经查看此信息。";
        case "IsDisplay":
            return "网站前台是否显示此信息。";
        case "ContactDept.Email":
            return "用户给部门留言时，会自动发送一封邮件到指定的邮箱。";
        case "ContactDept.IsFormDisplay":
            return "用户查看部门信息时，是否显示留言表单。";
        case "Job.Email":
            return "用户应聘岗位时，会自动发送一封邮件到指定的邮箱。";
        case "Job.IsFormDisplay":
            return "用户查看职位信息时，是否显示应聘表单。";
        case "User.IsApproved":
            return "用户是否已经审核，未通过审核的用户不能登录。";
        case "Role.IsAutoAssignment":
            return "增加用户时，是否自动分配角色。";
        case "Role.Assignment":
            return "给角色分配管理权限。";
        case "Adver.Type":
            return "广告显示方式：弹出广告、门帘广告、漂浮广告等。";
        case "Adver.Size":
            return "广告的宽度和高度设置。";
        case "Adver.IsDisplay":
            return "广告是否在网站前台显示。";
        case "Adver.IsAutoClose":
            return "广告点击后，是否自动关闭。";
        case "Adver.IsOnlyFirstPage":
            return "广告是否仅在网站首页显示。";
        case "Adver.IsOnlyOnce":
            return "广告被关闭后，再次刷新页面是否重新显示。";
        case "Adver.CloseButtonType":
            return "广告关闭按钮的设置。";
        case "Adver.Location":
            return "广告出现在网站的位置，距离顶部以及两边的间距。";
        case "Adver.ImageUrl":
            return "广告上传文件，支持图片和动画。";
        case "Research.VoteTimes":
            return "访问者参与调查的次数。";
        case "Research.IsMultiSelect":
            return "调查是单项选择还是多项选择。";
        case "WebLog.Url":
            return "浏览者访问的第一个页面。";
        case "WebLog.Referer":
            return "浏览者从何处链接到本网站，来源为空是指直接输入网址访问的。";
        case "Content.Hits":
            return "信息被查看的次数。";
        case "Content.ImageUrl":
            return "信息的缩略图，此图片不在正文中显示。";
        case "Content.AttachmentUrl":
            return "信息相关的附件，可供下载使用。";
        case "IsApproved":
            return "信息是否审核，未通过审核的不能显示。";
        case "IsTop":
            return "信息是否置顶，置顶的信息显示在其它信息之前。";
        case "IsRecommended":
            return "是否推荐信息。";
        case "IsHot":
            return "是否热点信息。";
        case "Content.Url":
            return "信息链接地址，如填写链接，则直接转向此链接地址，不再显示信息正文。";
        case "PageTitle":
            return "显示在浏览器顶部，设置合适的标题可提高搜索引擎收录效果。";
        case "Keywords":
            return "使用英文逗号分隔的多个关键词，用于搜索引擎优化。建议：设置不超过 10 个的重要关键词，关键词不要重复。";
        case "Description":
            return "简短的描述，用于搜索引擎优化。建议：应使用完整的一段话描述，以引起访问者兴趣。";
        case "pImage":
            return "用于手机首页导航图片。";
        case "ParentCategory":
            return "当前分类所属的上一级分类。";
        case "DisplayMode":
            return "内容的展现形式，包括图文模式、新闻列表、图片列表等。";
        case "Language":
            return "语言设置，对应不同语言版本的网站前台。";
        case "Site.FooterJavascript":
            return "添加如站长统计、在线客服等第三方代码。请确保代码的安全性，恶意代码可能造成网站瘫痪、数据丢失等问题。";
        case "Site.HeaderJavascript":
            return "添加在网页头部的 Js 代码，会影响网站打开速度。除非有特殊要求，请将代码添加在底部代码文本框中添加。";
        case "Site.WaterMarkFontSize":
            return "文字大小示例：<font style='font-size:12px'>12</font>，<font style='font-size:16px'>16</font>，<font style='font-size:20px'>20</font>。";
        case "Site.WaterMarkImage":
            return "用于添加水印的图片文件，在图片水印模式下有效。";
        default:
            return A
    }
}
$.tools.dateinput.localize("cn", {
    months: "1,2,3,4,5,6,7,8,9,10,11,12",
    shortMonths: "1月,2月,3月,4月,5月,6月,7月,8月,9月,10月,11月,12月",
    days: "星期日,星期一,星期二,星期三,星期四,星期五,星期六",
    shortDays: "周日,周一,周二,周三,周四,周五,周六"
});