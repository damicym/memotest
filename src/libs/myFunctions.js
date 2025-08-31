export function splitCamelCase(str) {
    return str.replace(/([A-Z])/g, ' $1').trim()
}

export function deleteExtraWords(str, cantWords) {
    const indices = []
    for (let i = 0; i < str.length; i++) {
        if (str[i] === " ") {
            indices.push(i)
        }
    }
    return str.slice(indices[cantWords - 1])
}

export function getReadableRGB() {
    let r, g, b, L
    const min = 50
    const max = 180
    do {
        r = Math.floor(Math.random() * 256)
        g = Math.floor(Math.random() * 256)
        b = Math.floor(Math.random() * 256)
        L = 0.299 * r + 0.587 * g + 0.114 * b
    } while (L < min || L > max)
    return `rgba(${r}, ${g}, ${b}, 1)`
}
function generarError(num, error = 0){
    const errPerc = (Math.random() * 2 * error) - error
    return num + num * errPerc / 100
}
export function getRandomHSL(alpha = 1){
    const hue = Math.floor(Math.random() * 360)
    return `hsla(${hue}, ${generarError(50, 40)}%, ${generarError(40)}%, ${Number(alpha)})`
}
export function shuffle(array) {
    let arr = [...array]
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
            ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
}

export function defineColumns(pares) {
    const totales = pares * 2
    if (Math.sqrt(totales) === Math.ceil(Math.sqrt(totales))) return Math.sqrt(totales)
    else {
        for (let i = 0; i < totales; i++) {
            if (totales % i === 0 && totales / i < i) return i
        }
    }
}

export function isPrime(n) {
    if (n < 2) return false;
    for (let i = 2; i <= Math.sqrt(n); i++) {
        if (n % i === 0) return false;
    }
    return true;
}

export function getClosestNotPrime(n, direction = 'up') {
    do {
        if (direction === 'up') n++;
        else n--;
    } while (isPrime(n));
    return n;
}