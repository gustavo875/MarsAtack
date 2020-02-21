var diryJ, dirxJ, jog, velJ, pjx, pjy;
var velT;
var tamTelaW, tamTelaH;
var jogo;
var frames;
var contBombas, painelContBombas, velB, tmpCriaBomba;
var bombasTotal;
var vidaPlaneta, barraPlaneta;
var ie;  //Indice Explosão
var telaMsg;


function teclaDw() {
	var tecla = event.keyCode;
	if (tecla == 38) {//Cima
		diryJ = -1;
	}
	else if (tecla == 40) {//Baixo
		diryJ = 1;
	}
	else if (tecla == 37) {//Esquerda
		dirxJ = -1;
	}
	else if (tecla == 39) {//Direita
		dirxJ = 1;
	}
	else if (tecla == 32) {//Espasso / Tiro
		atira(pjx + 17, pjy);
	}
}

function teclaUp() {
	var tecla = event.keyCode;
	if ((tecla == 38) || (tecla == 40)) {//Cima - Baixo
		diryJ = 0;
	}
	if ((tecla == 37) || (tecla == 39)) {//Esquerda - Direita
		dirxJ = 0;
	}
}

function criaBomba() {
	if (jogo) {
		var y = 0;
		var x = ((Math.random() * 750) + 283);		//Ajustar Posição Bomba
		var bomba = document.createElement("div");
		var att1 = document.createAttribute("class");
		var att2 = document.createAttribute("style");
		var att3 = document.createAttribute("id");
		att1.value = "bomba";
		att2.value = "top:"+y+"px; left:"+x+"px";
		att3.value = "bomba" + contBombas;
		bomba.setAttributeNode(att1);
		bomba.setAttributeNode(att2);
		bomba.setAttributeNode(att3);
		document.body.appendChild(bomba);
		contBombas--;
	}
}

function controlaBomba() {
	if (contBombas <= 100) {
		if (contBombas > 50) {
			velB = 4.5;
		}else {
			velB = 6;
		}
	}
	bombasTotal = document.getElementsByClassName("bomba");
	var tam = bombasTotal.length;
	for (var i = 0; i < tam; i++) {
		if (bombasTotal[i]) {
			var pi = bombasTotal[i].offsetTop;
			pi += velB;
			bombasTotal[i].style.top = pi+"px";
			if (pi > tamTelaH) {
				vidaPlaneta -= 10;
				criaExplosao(2, bombasTotal[i].offsetLeft, null);  //Tipo 2=Terra
				bombasTotal[i].remove();
			}
		}
	}
}

function atira(x, y) {
	x += 283;			//Ajustar tiro com a nave
	y += 25;			//Ajustar tiro com a nave
	var t = document.createElement("div");
	var att1 = document.createAttribute("class");
	var att2 = document.createAttribute("style");
	att1.value = "tiroJog";
	att2.value = "top:"+y+"px; left:"+x+"px";
	t.setAttributeNode(att1);
	t.setAttributeNode(att2);
	document.body.appendChild(t);
}

function controleTiros() {
	var tiros = document.getElementsByClassName("tiroJog");
	var tam = tiros.length;
	for (var i = 0; i < tam; i++) {
		if (tiros[i]) {
			var pt = tiros[i].offsetTop;
			pt -= velT;
			tiros[i].style.top = pt+"px";
			colisaoTiroBomba(tiros[i]);
			if (pt < 0) {
				tiros[i].remove();
			}
		}
	}
}

function colisaoTiroBomba(tiro){
	var tam = bombasTotal.length;
	for (var i = 0; i < tam; i++) {
		if (bombasTotal[i]) {
			if ((
				(tiro.offsetTop <= (bombasTotal[i].offsetTop + 40)) && //Cima Tiro com Baixo Bomba
				((tiro.offsetTop + 6) >= (bombasTotal[i].offsetTop))   //Baixo Tiro com Cima Bomba
				) && (
				(tiro.offsetLeft <= (bombasTotal[i].offsetLeft + 24)) && //Esquera Tiro com Direita Bomba
				((tiro.offsetLeft + 6) >= (bombasTotal[i].offsetLeft))   //Direita Tiro com Esquerda Bomba
				)) {
				criaExplosao(1, bombasTotal[i].offsetLeft -25, bombasTotal[i].offsetTop);	//Tipo 1=Ar
				bombasTotal[i].remove();
				tiro.remove();
			}
		}
	}
}

function criaExplosao(tipo, x, y) {   //Tipo 1=Ar, 2=Terra
	var explosao = document.createElement("div");
	var img = document.createElement("img");
	//Atributos para Div
	var att1 = document.createAttribute("class");
	var att2 = document.createAttribute("style");
	var att3 = document.createAttribute("id");
	//Atributos para Imagem
	var att4 = document.createAttribute("src");
	
	att3.value = "explosao" + ie;
	if (tipo==1) {
		att1.value = "explosaoAr";
		att2.value = "top:"+y+"px; left:"+x+"px";
		att4.value = "Imagens/Explosao_Ar.gif?" + new Date();
	}
	else {
		att1.value = "explosaoChao";
		att2.value = "top:"+(tamTelaH - 57)+"px; left:"+(x - 17)+"px";
		att4.value = "Imagens/Explosao_Chao.gif?" + new Date();
	}
	explosao.setAttributeNode(att1);
	explosao.setAttributeNode(att2);
	explosao.setAttributeNode(att3);
	img.setAttributeNode(att4);
	explosao.appendChild(img);
	document.body.appendChild(explosao);
	setTimeout(function() {document.body.appendChild(explosao).remove();}, 1500);	//Remove a Explosão depois de 1,5 segundos

	ie++;
}

function controlaJogador() {
	if (pjx < 0) {
		dirxJ = 1;
	}
	if (pjx > 760) {
		dirxJ = -1;
	}
	if (pjy < 0) {
		diryJ = 1;
	}
	if (pjy > 560) {
		diryJ = -1;
	}

	pjx += dirxJ * velJ;
	pjy += diryJ * velJ;
	jog.style.top = pjy+"px";
	jog.style.left = pjx+"px";
}

function gerenciaGame() {
	barraPlaneta.style.width = vidaPlaneta + "px";
	
	if (contBombas <= 0) {
		jogo = false;
		clearInterval(tmpCriaBomba);
		telaMsg.style.backgroundImage = "url('Imagens/Vitoria.jpg')";
		telaMsg.style.display = "block";
	}
	if (vidaPlaneta <= 0) {
		jogo = false;
		clearInterval(tmpCriaBomba);
		telaMsg.style.backgroundImage = "url('Imagens/Derrota.jpg')";
		telaMsg.style.display = "block";
	}
}

function gameLoop() {
	if (jogo) {
		controlaJogador();
		controleTiros();
		controlaBomba();
	}
	gerenciaGame();
	frames = requestAnimationFrame(gameLoop);
}

function reinicia() {
	for (var i = contBombas; i < contBombas + 5; i++) {
		if (document.getElementById("bomba" + i)) {
			document.getElementById("bomba" + i).remove();
		}
	}
	telaMsg.style.display = "none";
	clearInterval(tmpCriaBomba);
	cancelAnimationFrame(frames);
	vidaPlaneta = 300;
	pjx = tamTelaW / 2;
	pjy = tamTelaH / 2;
	jog.style.top = pjy  + "px";
	jog.style.left = pjy + "px";
	tmpCriaBomba = setInterval(criaBomba, 1500);
	contBombas = 150;
	velB = 3;
	ie = 0;
	jogo = true;

	gameLoop();
}

function inicia() {
	jogo = false;
	//Ini tela
	tamTelaH = 600;//window.innerHeight;
	tamTelaW = 800;//window.innerHeight;

	//Ini Jogador
	dirxJ = diryJ = 0;
	pjx = tamTelaW / 2;
	pjy = tamTelaH / 2;
	velJ = velT = 6;
	jog = document.getElementById("NaveJog");
	jog.style.top = pjy+"px";
	jog.style.left = pjx+"px";

	//Controle Bombas
	contBombas = 150;
	velB = 3;
	ie = 0;

	//Controle Planeta
	vidaPlaneta = 300;
	barraPlaneta = document.getElementById("BarraPlaneta");
	barraPlaneta.style.width = vidaPlaneta + "px";
	
	//Telas
	telaMsg = document.getElementById("TelaMsg");
	telaMsg.style.backgroundImage = "url(Imagens/Intro1.jpg)";  //Removido tela Intro
	telaMsg.style.display = "block";
	document.getElementById("BtnJogar").addEventListener("click", reinicia);
}

window.addEventListener("load", inicia);
document.addEventListener("keydown", teclaDw);
document.addEventListener("keyup", teclaUp);