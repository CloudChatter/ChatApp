import React, { Component, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { render } from "react-dom";
import WordCloud from "react-d3-cloud";
import { text } from 'express';

export const WorldCloudContainer = (props) => {
  const messages = useSelector(state => state.messages.messages)
  const [wordCountData, setWordCountData] = useState([])
  const [newWordsAdded, setNewWordsAdded] = useState(false)

  const makeWordCountData = () => {
    const wordCount = {}
    for (let msg of messages) {
      const words = msg.split(" ")
      for (let word of words) {
        if (word.length > 4) {
          wordCount[word] = wordCount[word] ? wordCount[word] + 1 : 1;
        }
      }
    }
    // now we have word Count {"hello": 5, "world": 12}
    const data = []
    for (let [word, count] of Object.entries(wordCount)) {
      data.push({'text': word, 'value': count})
    }
    return data;
  }


  // this useEffect will run every time messages updates.
  // useEffect(() => {
  //   if (!newWordsAdded) return;
  //   setNewWordsAdded(true)
  //   setTimeout(() => {
  //     setNewWordsAdded(false)
  //   }, 5000)
  //   const newWordData = makeWordCountData()
  //   setWordCountData(newWordData)
  // }, [])

  // useEffect(() => {
  //   setNewWordsAdded(true)
  //   setTimeout(() => {
  //     setNewWordsAdded(false)
  //   }, 5000)
  // }. [messages])

  // // this useEffect will run as the component mounts. it will create a listener
  // useEffect(() => {
    
  // }, 5000)

  useEffect(() => {
    setWordCountData(makeWordCountData())
  }, [messages])

  const fontSizeMapper = word => Math.log2(word.value) * 5;
  const rotate = word => word.value % 360;
  const onWordMouseOver = word => alert(word);
  return (
    <WordCloud 
    data={wordCountData}
    fontSizeMapper={fontSizeMapper}
    rotate = {rotate}
    onWordMouseOver={onWordMouseOver}
    />
  )
}

export default WorldCloudContainer;