const canvas = document.querySelector("#game");
const game = canvas.getContext("2d");
const up = document.querySelector("#up")
const down = document.querySelector("#down")
const left = document.querySelector("#left")
const right = document.querySelector("#right")
const lives = document.querySelector("#Lives")
const time = document.querySelector("#Time")
const record = document.querySelector("#Record")
const reset = document.querySelector(".reset")

let showTime = () => {
	segundos++
	time.innerText =""
	tiempoTerminado = segundos
	time.append(segundos)

}
let	tiempoRecord = localStorage.getItem("Records")
let guardarRecords = []
let tiempoTerminado = 0
let segundos = 0
let tiempo = setInterval(showTime, 1000)
let showLives = () => {
	lives.innerText = heart.repeat(vidas)
}
let vidas = 3
let heart = emojis["HEART"]
showLives()
let numberLevel = 0;
let canvasSize;
let elementsSize;
let posX;
let posY;
let nivel;
const giftPosition = {
	x: undefined,
	y: undefined
}
const playerPosition = {
	x:undefined,
	y:undefined
}
let enemiesPosition = []


let terminado;


let movePlayer = () => {
		const giftCollisionX = playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3);
		const giftCollisionY = playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3);
		const giftCollision = giftCollisionY && giftCollisionX;
		console.log({giftCollision, giftCollisionY, giftCollisionX})
		if (giftCollision) {
			numberLevel++
			startGame()
			console.log("Ganaste")
		}
		
		gameLose()


	if (playerPosition.x < elementsSize ) {
		moveRight()
	}else if (playerPosition.y < 10) {
		moveDown()
	}else if (playerPosition.y > 480) {
		moveUp()
	}else if(playerPosition.x > canvasSize){
		moveLeft()
	}
	game.fillText(emojis.PLAYER, playerPosition.x, playerPosition.y)
}
let moveUp = () => {
	if (terminado) {
		return
	}
	playerPosition.y -= elementsSize
	console.log("arriba", playerPosition)
	startGame()
	 }
let moveDown = () => {
	if (terminado) {
		return
	}
playerPosition.y += elementsSize
	console.log("down", playerPosition)
	startGame()

	}
let moveLeft = () => {
	if (terminado) {
		return
	}
playerPosition.x -= elementsSize
	console.log("left", playerPosition)
	startGame()

}
let moveRight = () => {
	if (terminado) {
		return
	}
playerPosition.x += elementsSize
	console.log("left", playerPosition)
	startGame()
}
let moveByKeys = (event) => buttons[event.key]()
let buttons = {
	"ArrowUp" : moveUp,
	"ArrowDown" : moveDown,
	"ArrowLeft" : moveLeft,
	"ArrowRight" : moveRight
}


let setCanvasSize = () => {
	 canvasSize = (window.innerWidth > 600) ? (window.innerWidth / 2) * 0.7 : (window.innerWidth) * 0.8;
	 elementsSize = canvasSize / 10
	console.log(elementsSize)
	canvas.setAttribute("width", canvasSize)
	canvas.setAttribute("height", canvasSize)
	 startGame()
}

let limpiarString = string => newString = string.trim()

let startGame = () => {
  console.log({ canvasSize, elementsSize });

  game.font = elementsSize + 'px Verdana';
  game.textAlign = 'end';
  enemiesPosition = []
  const map = maps[numberLevel];

  if (!map) {
  	gameWinSetRecord()
  	return
  }

  const mapRows = map.trim().split('\n');
  const mapRowCols = mapRows.map(row => row.trim().split(''));
  console.log({map, mapRows, mapRowCols});
  
  game.clearRect(0,0,canvasSize, canvasSize);
  mapRowCols.forEach((row, rowI) => {
    row.forEach((col, colI) => {
      const emoji = emojis[col];
      const posX = elementsSize * (colI + 1) + 6;
      const posY = elementsSize * (rowI + 1) - 6;

      if (col == 'O') {
        if (!playerPosition.x && !playerPosition.y) {
          playerPosition.x = posX;
          playerPosition.y = posY;
          console.log({playerPosition});
        }
      } else if (col == 'I') {
        giftPosition.x = posX;
        giftPosition.y = posY;
         console.log({giftPosition});
      }

      if(col == "X"){
      	enemiesPosition.push({x: posX, y: posY})
		}
      	
      	 
      game.fillText(emoji, posX, posY);
    });
  });
          movePlayer()
}

let gameLose = () => {

		const enemyCollision = enemiesPosition.find(enemy => {
			const enemyCollisionX = enemy.x.toFixed(3) == playerPosition.x.toFixed(3)
			const enemyCollisionY = enemy.y.toFixed(3) == playerPosition.y.toFixed(3)
			return enemyCollisionY && enemyCollisionX
		})



		if (enemyCollision) {

		if (numberLevel >= 0) {
			// numberLevel--
			vidas--
			lives.innerText = ""
			showLives()
			

			console.log(vidas)
			if (vidas == 0) {
				/*numberLevel = 0
				vidas = 3
*/
				showLives()
				segundos = 0
		game.clearRect(0,0,canvasSize, canvasSize)
		game.font = "25px Verdana";
		game.textAlign = "end"
		game.fillText(`!Haz perdido, que desgracia! ${emojis["PLAYER"]}`, canvasSize - 50, canvasSize/2)
		clearInterval(tiempo)
		reset.classList.remove("none")
		reset.addEventListener("click", () => window.location.reload())
		numberLevel = Math.max(numberLevel, 0)
			playerPosition.x = undefined
			playerPosition.y = undefined
			terminado = true
				return

				}
			numberLevel = Math.max(numberLevel, 0)
			playerPosition.x = undefined
			playerPosition.y = undefined
			startGame()
		}	
			console.log("Perdiste")}
}
let gameWinSetRecord = () =>{
	numberLevel = 0
	vidas = 3
	showLives()
	clearInterval(tiempo)
	guardarRecords.push(tiempoTerminado)
	record.innerText = ""
	
	if(segundos < localStorage.getItem("Records")){
		localStorage.setItem("Records", tiempoTerminado)
		tiempoRecord = localStorage.getItem("Records")
		paintRecord()
		resultado = `!Haz superado tu record, felicitaciones! ${emojis["WIN"]}`
	}
	else{
		resultado = `!No superaste tu record, que desgracia! ${emojis["PLAYER"]}`	

	}
	paintRecord()	
	time.innerText = 0
	startGame()
	game.clearRect(0,0,canvasSize, canvasSize)
	playerPosition.x = undefined
	playerPosition.y = undefined
	game.font = "20px Verdana";
	game.textAlign = "end"
	game.fillText(`!Haz ganado, felicitaciones! ${emojis["WIN"]}`, canvasSize - 50, canvasSize/2)
	game.fillText(resultado, canvasSize - 20, (canvasSize/2) -50)
	reset.classList.remove("none")
	reset.addEventListener("click", () => window.location.reload())
	terminado = true
}
let paintRecord = () =>{
		record.innerText = ""
	record.append(tiempoRecord)
	}
paintRecord()


window.addEventListener("keydown", moveByKeys)
up.addEventListener("click",moveUp)
down.addEventListener("click",moveDown) 
left.addEventListener("click",moveLeft)
right.addEventListener("click", moveRight)
window.addEventListener("load", setCanvasSize);
window.onresize = () => setCanvasSize() ;

//El metodo split se usa para dividir un string en un array de subcadenas basado en un separador especificado
	//Osea divide la cadena principal cuando detecta un caracter en especifico

	//Y la funcion para string .trim elimina los espacios en blanco al principio y al final de una cadena de texto
	//Osea devuelve una cadena de texto identica a la original pero sin los espacios en blanco al principio y final
	
	//fillRect te crea un rectangulo en tu canvas dependiendo de las posiciones en donde lo quieras poner
	// los dos primeros 0 son los valores de donde empezara el rectangulo en el eje X e Y y los otros valores 
	// seran el tamaño del rectangulo, el tercer valor es el ancho y el cuarto es el alto
	// game.fillRect(0,0,100,100)

	//Con clearRect creas un rectangulo utilizando la misma sintaxis que el anterior pero borrando en esa area
	//de X e Y que le indiquemos
	// game.clearRect(0,0,100,50)

	//Con fillText podemos añadir texto a nuestra canvas, pasandole como parametros el texto y la posicion en X e Y
	//En la que queremos que este, tambien con .font podemos asignarle tamaño de fuente y fuente (si pones el tamaño pero no la fuente no funciona,
	// y con fillStyle Le damos color, con textAlign podemos decirle en donde debe ir el texto, 
	//por ejemplo si ponemos textAlign = start lo que hara es poner el texto desde el punto de x e y que le asignamos
	// hacia la derecha, y si ponemos textAlign= end
	// lo que hara es poner el texto desde el punto de x e y asignado hacia la izquierda
	// game.font = "25px Verdana";
	// game.fillStyle = "Red";
	// game.textAlign = "start";
	// game.fillText("Me pican lo coooco", 50, 50)