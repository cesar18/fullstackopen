import { useState } from 'react'

const Head = ({text}) => <h1>{text}</h1>
const Button = ({text, onClick}) => <button onClick={onClick}>{text}</button>
const StatisticLine = ({text, value}) => <tr><td>{text}</td><td>{value}</td></tr>
const Statistics = ({good, neutral, bad}) => {
  const all = good + neutral + bad
  if(all == 0){
    return (
      <p>
        No feedback given
      </p>
    )
  }
  const average = (good - bad) / all
  const positive = good * 100 / all
  return (
    <table>
      <tbody>
        <StatisticLine text="good" value={good}/>
        <StatisticLine text="neutral" value={neutral}/>
        <StatisticLine text="bad" value={bad}/>
        <StatisticLine text="all" value={all}/>
        <StatisticLine text="average" value={average}/>
        <StatisticLine text="positive" value={positive + " %"}/>
      </tbody>
    </table>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleFeedbackGood = () => {
    setGood(good + 1)
  }

  const handleFeedbackNeutral = () => {
    setNeutral(neutral + 1)
  }

  const handleFeedbackBad = () => {
    setBad(bad + 1)
  }

  return (
    <div>
      <Head text="give feedback" />
      <Button onClick={handleFeedbackGood} text="good"/>
      <Button onClick={handleFeedbackNeutral} text="neutral"/>
      <Button onClick={handleFeedbackBad} text="bad"/>
      <Head text="statistics" />
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App