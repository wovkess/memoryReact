import { useEffect, useState } from 'react';
import './App.css';

const App = () => {
  const [score, setScore] = useState(0)
  const [flips, setFlips] = useState(0)
  const [timer, setTimer] = useState(60)
  const [isGameActive, setIsGameActive] = useState(false)
  const [flippedCards, setFlippedCards] = useState([])
  const [gameWon, setGameWon] = useState(false)
  
  const icons = ['airplane.svg', 'bath.svg', 'cocktail.svg', 'hotel.svg', 'surf.svg']
  const doubleIcons = [...icons, ...icons]
  
  const shuffleArray = (array) => array.sort(() => Math.random() - 0.5)
  
  const [cards, setCards] = useState(
    shuffleArray(doubleIcons.map((icon, index) => ({
      id: index, 
      icon,
      isFlipped: false, 
      isMatched: false
    })))
  )

  useEffect(() => {
    if(cards.every((card) => card.isMatched)){
      setGameWon(true)
      setIsGameActive(false)
    }
  }, [cards])

  // таймер
  useEffect(() => {
    let interval
    if(isGameActive && !gameWon){
      interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
    
    
  }, [isGameActive, gameWon])



  



  const handleCardClick = (index) => {
    if (!isGameActive) setIsGameActive(true)
    const clickedCard = cards[index] // записываем ту карточку, на которую нажали
    if (clickedCard.isFlipped || clickedCard.isMatched || flippedCards.length === 2){
      return // проверка на то, что нельзя кликать на перевернутую карту, на совпавшую и если уже есть две карты уже открыты
    }

    // переворот карты
    const updatedCards = [...cards]
    updatedCards[index].isFlipped = true
    setCards(updatedCards)
    setFlippedCards([...flippedCards, index])
    setFlips(flips + 1)

    // Проверка на совпадение, если открыты 2 карточки
    if (flippedCards.length === 1){
      const firstCard = cards[flippedCards[0]]
      const secondCard = clickedCard

      if(firstCard.icon === secondCard.icon){ // картинки двух открытых карточек совпали 
        setScore(score + 10)
        setCards((prevCards) => 
          prevCards.map((card) => 
            card.icon === firstCard.icon ? { ...card, isMatched: true } : card 
          )
        )
        setFlippedCards([])
      }else{  // картинки двух открытых карточек не совпали 
        setTimeout(() => {
          setCards((prevCards) => 
            prevCards.map((card) => 
              card.id === firstCard.id || card.id === secondCard.id ? { ...card, isFlipped: false } : card 
            )
          )
          setFlippedCards([])
          setScore((prev) => prev-5)
        }, 600)
      }
    }
  }

  const resetGame = () => {
    setCards(
      shuffleArray(doubleIcons.map((icon, index) => ({
        id: index, 
        icon,
        isFlipped: false, 
        isMatched: false
      })))
    )
    setFlippedCards([])
    setScore(0)
    setFlips(0)
    setTimer(60)
    setIsGameActive(false)
    setGameWon(false)
  }


  return (
    <>
    <div id='app'>
      <h1>Memory React</h1>
      <header>
        <div className='header-item'>
          <div className='item-icon'>
            <img src="/medal.svg" alt="medal" />
          </div>
          <div className='item-info'>
            Score: {score}
          </div>
        </div>
        <div className='header-item'>
          <div className='item-icon'>
            <img src="/flips.svg" alt="flips" />
          </div>
          <div className='item-info'>
            Flips: {flips}
          </div>
        </div>
        <div className='header-item'>
          <div className='item-icon'>
            <img src="/timer.svg" alt="timer" />
          </div>
          <div className='item-info'>
            Timer: {timer}
          </div>
        </div>
      </header>
      <main>
        {cards.map((card, index) => (
          <div 
            key={index} 
            className={`card ${card.isFlipped || card.isMatched ? 'flipped' : ''}`}
            onClick={() => handleCardClick(index)}
          >
            <div className='card-front'>
              <img src="/cardImg/card-front.svg" alt="" />
            </div>
            <div className='card-back'>
              <img src={`/cardImg/${card.icon}`} alt="" />
            </div>
          </div>
        ))}
      </main>
    </div>
    <div 
      className={`victory-container show`}
      style={{
        visibility: `${gameWon ? 'visible' : 'hidden'}`
      }}
    >
      <div className='victory-include'>
        <h3>Congratulations!</h3>
        <div className='victory-info'>
          <div><p>Score: {score}</p></div>
          <div><p>Flips: {flips}</p></div>
          <div><p>Timer: {timer}</p></div>
        </div>
        <button onClick={() => resetGame()}>Restart</button>
      </div>
    </div>
    </>
  );
};

export default App;




