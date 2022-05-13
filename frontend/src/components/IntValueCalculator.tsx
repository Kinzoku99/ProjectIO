.strong_ml {
	font-weight:	bold;
	font-size:		1.5rem;
	margin-left:	8px;
}

.bd-placeholder-img {
	font-size: 				1.125rem;
	text-anchor: 			middle;
	-webkit-user-select: 	none;
	-moz-user-select: 		none;
	user-select: 			none;
}

.navbar {
	min-height: 3.5rem;
	z-index: 9999;
}

.calculator-panel {
	background-color: rgba(255,255,255,0.8);
	top: 0;
	z-index: 999;
	position: fixed;
	margin-top: 3.5rem;
	width: 100vw;
	box-shadow: 0 2px 5px #aaaaaa;
    overflow-y: scroll;
    max-height: 100vh;
}

.panel-filler {
	height: 35vh;
}

.main {
	position: relative;
}

#root {
	background-color: white;
	min-height: 100vh;
	position: relative;
}

#exactbtn {
    width: 20%;
}

#exactexpression {
    width: 80%;
}

#formula, #formula2 {
    width: "80%" !important;
}

@media (min-width: 768px) {
	.bd-placeholder-img-lg {
		font-size: 3.5rem;
	}
}

@media (max-width: 600px) {
	p {
		margin-left: 8%;
		font-size: 0.8rem;
	}

	.p11 {
		margin-left: 0;
	}
}

@media (max-width: 484px) {
	p {
		font-size: 0.75rem;
	}

    #formula2 {
        margin-left: 10% !important;
    }

    #subbtn {
       display: none;
    }

    #exactbtn {
        display: none;
    }

    #exactexpression {
        margin-left: 10% !important;
    }
}

@media (max-width: 300px) {
	p {
		font-size: 0.5rem;
	}

    .text-muted {
        display: none;
    }

	.h11 {
		font-size: 0.8rem;
	}

	.p11 {
		display: none;
	}

    .strong_ml {
        display: none;
    }

    .panel-filler {
        height: 25vh;
    }
}

#exactresult .math-multiline {
	overflow-x: auto;
	overflow-y: hidden;
	max-height: 6rem;
	text-overflow: ellipsis;
	overflow-wrap: unset;
	white-space: nowrap;
}

.btn-calc-form {
	background-color: white !important;
}

.btn-calc-form:active, .btn-calc-form:hover {
	background-color: #6c757d !important;
}
