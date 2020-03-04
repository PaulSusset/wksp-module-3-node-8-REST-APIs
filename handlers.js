const { words } = require("./data/words");

const wordHandler = (req, res) => {
    let random = Math.floor(Math.random() * words.length);
    let word = words[random];
    let letterCount = word["word"].length;
    res.status(200).send({ status: 200, word: word.id, letterCount });
};

const guessHandler = (req, res) => {
    const letter = req.query.letter;
    const wordId = req.params.wordId;
    let word = words.filter(word => {
        return word.id.toString() === wordId;
    });
    if (letter) {
        word = word[0]["word"];
        // const letterCount = word.length;
        word = word.split("");
        // if (query is a letter)
        let answer = word.map(ltr => {
            if (ltr === letter) {
                return true;
            } else {
                return false;
            }
        });
        // console.log({ status: 200, answer })
        res.status(200).send({ status: 200, answer });
    } else {
        res.status(200).send({ status: 200, word });
    }
};

module.exports = { wordHandler, guessHandler };
