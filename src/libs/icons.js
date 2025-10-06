import * as fa6Icons from "react-icons/fa6"
// import * as ciIcons from "react-icons/ci"
import * as giIcons from "react-icons/gi"
import { splitCamelCase, deleteExtraWords, separarNumerosYPalabras } from "./myFunctions"
import React from "react"
import ReactDOMServer from "react-dom/server"

const arrFa6Icons = Object.entries(fa6Icons).map(([name, Icon]) => ({ name: enhanceName(name), Icon }))
// const arrCiIcons = Object.entries(ciIcons).map(([name, Icon]) => ({ name: enhanceName(name), Icon }))
const arrGiIcons = Object.entries(giIcons).map(([name, Icon]) => ({ name: enhanceName(name), Icon }))
const allIconsWNames = [...arrFa6Icons, /* ...arrCiIcons, */ ...arrGiIcons]

export function enhanceName(name) {
  const maxNameWords = 2
  const maxCharsPerWord = 10
  let enhanced = name
  enhanced = splitCamelCase(enhanced)

  if (enhanced.startsWith("Fa ") || enhanced.startsWith("Ci ") || enhanced.startsWith("Gi ")) enhanced = enhanced.slice(3)
  if (enhanced.startsWith("Reg ")) enhanced = enhanced.slice(4)
  else if (enhanced.startsWith("Solid ")) enhanced = enhanced.slice(6)
  else if (enhanced.startsWith("Light ")) enhanced = enhanced.slice(6)

  enhanced = deleteExtraWords(enhanced, maxNameWords, maxCharsPerWord)
  enhanced = separarNumerosYPalabras(enhanced)
  return enhanced
}

export function getRandomIcon() {
  const randomIndex = Math.floor(Math.random() * allIconsWNames.length)
  return allIconsWNames[randomIndex]
}

export function getPathFromIcon(IconComponent) {
  const element = React.createElement(IconComponent)
  const svgString = ReactDOMServer.renderToStaticMarkup(element)
  const match = svgString.match(/path d="([^"]+)"/)
  if(match[1]?.length < 40){
    console.log("Revisar path")
  }
  return match ? match[1] : null
}
