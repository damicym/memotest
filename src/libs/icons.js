import * as fa6Icons from "react-icons/fa6"
import * as ciIcons from "react-icons/ci"
import * as giIcons from "react-icons/gi"
import { splitCamelCase, deleteExtraWords, shuffle } from "./myFunctions"

const arrFa6Icons = Object.entries(fa6Icons).map(([name, Icon]) => ({ name: enhanceName(name), Icon }))
const arrCiIcons = Object.entries(ciIcons).map(([name, Icon]) => ({ name: enhanceName(name), Icon }))
const arrGiIcons = Object.entries(giIcons).map(([name, Icon]) => ({ name: enhanceName(name), Icon }))
const allIconsWNames = [...arrFa6Icons, ...arrCiIcons, ...arrGiIcons]

export function enhanceName(name) {
    let enhanced = name
    enhanced = splitCamelCase(enhanced)
    if (enhanced.startsWith("Fa ") || enhanced.startsWith("Ci ") || enhanced.startsWith("Gi ")) enhanced = enhanced.slice(3)
    if (enhanced.startsWith("Reg ")) enhanced = enhanced.slice(4)
    else if (enhanced.startsWith("Solid ")) enhanced = enhanced.slice(6)
    else if (enhanced.startsWith("Light ")) enhanced = enhanced.slice(6)
    enhanced = deleteExtraWords(enhanced, 2)
    return enhanced
}

export function getRandomIcon() {
    const randomIndex = Math.floor(Math.random() * allIconsWNames.length)
    return allIconsWNames[randomIndex]
}

export function inicializarFichas(cantParesAJugar) {
    let auxFichas = []
    let keyCounter = 0
    const colorOffset = Math.random() * 360 / cantParesAJugar
    for (let index = 0; index < cantParesAJugar; index++) {
        const { Icon, name } = getRandomIcon()

        const colorSection = 360 / cantParesAJugar * index
        const colorErrorPerc = 360 / cantParesAJugar * index * 5 / 100
        const colorError = (Math.random() * 2 * colorErrorPerc) - colorErrorPerc
        const colorHue = colorSection + colorError + colorOffset
        const colorFinal = `hsla(${colorHue}, 40%, 40%, 1)`

        auxFichas.push({ myKey: keyCounter++, pairId: index, name, Icon, color: colorFinal, status: 0 })
        auxFichas.push({ myKey: keyCounter++, pairId: index, name, Icon, color: colorFinal, status: 0 })
    }
    return shuffle(auxFichas)
}