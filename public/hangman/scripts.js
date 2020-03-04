let word = undefined
let wordLength = undefined
let guesses = 6
let pGuesses = []
const keyDownHandler = (event) => {
    const key = event.key;
    const keyCode = event.which;
    console.log('key', key)
    const validate = (keyCode) =>{
        // const letters = /^[A-Za-z]+$/;
        // if (key === 'shift' || 'tab' || 'enter' || 'ctrl') {return false}
        if(keyCode<=90 && keyCode>=65){
            return true
        } else { return false }
    }
    if (!validate(keyCode)){
        return
    }
    
    fetch(`/hangman/guess/${word}?letter=${key}`, {
        method: "POST",
        headers: {
            "Accept": "application/JSON",
            "Content-Type": "application/JSON"
        }
    })
        .then(data => {
            return data.text();
        })
        .then(data => {
            let guessValid = false
            let answer = JSON.parse(data);
            for (i = 0; i < answer['answer'].length; i++) {
                if (
                    document.getElementById(`${i}`).innerText === "_" &&
                    answer['answer'][i]
                ) {
                    document.getElementById(`${i}`).innerText = key.toUpperCase();
                    guessValid = true;
                }
            }
            if (!guessValid){
                guesses -= 1;
                document.getElementById('guesses').innerText = guesses;
                pGuesses.push(key);
                document.getElementById('pGuesses').innerText = pGuesses.toString()
            }
            if (guesses <1){
                document.removeEventListener("keydown", keyDownHandler);
                document.getElementById('content').innerText = 'You lose.'
                document.getElementById('reset').classList.remove('none')
            }
            let winArr = []
            for (i=0;i < wordLength; i++){
                if (document.getElementById(`${i}`).innerText !== "_"){
                    winArr.push(true)
                } else {winArr.push(false)}
            }
            if (winArr.every(check => check === true)){
                document.removeEventListener("keydown", keyDownHandler);
                document.getElementById('content').innerText = 'You win!!!'
                document.getElementById('reset').classList.toggle('none')
            }
    })
}

fetch("/hangman/words", {
    method: "GET",
    headers: {
        Accept: "application/JSON",
        "Content-Type": "application/json"
    }
})
    .then(res => {
        return res.text();
    })
    .then(data => {
        let wordInfo = JSON.parse(data);
        word = wordInfo.word
        wordLength = wordInfo.letterCount
        for (i = 0; i < wordInfo.letterCount; i++) {
            const letterSpot = document.createElement("div");
            letterSpot.innerText = "_";
            letterSpot.id = i;
            letterSpot.classList.add("letterSpot");
            document.getElementById("wordSpot").appendChild(letterSpot);
        }
        document.addEventListener("keydown", keyDownHandler);
    });
