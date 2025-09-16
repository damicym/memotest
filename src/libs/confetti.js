import confetti from "canvas-confetti";
// note: you CAN only use a path for confetti.shapeFrompath(), but for
// performance reasons it is best to use it once in development and save
// the result to avoid the performance penalty at runtime

function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

var pumpkin = confetti.shapeFromPath({
  path: 'M449.4 142c-5 0-10 .3-15 1a183 183 0 0 0-66.9-19.1V87.5a17.5 17.5 0 1 0-35 0v36.4a183 183 0 0 0-67 19c-4.9-.6-9.9-1-14.8-1C170.3 142 105 219.6 105 315s65.3 173 145.7 173c5 0 10-.3 14.8-1a184.7 184.7 0 0 0 169 0c4.9.7 9.9 1 14.9 1 80.3 0 145.6-77.6 145.6-173s-65.3-173-145.7-173zm-220 138 27.4-40.4a11.6 11.6 0 0 1 16.4-2.7l54.7 40.3a11.3 11.3 0 0 1-7 20.3H239a11.3 11.3 0 0 1-9.6-17.5zM444 383.8l-43.7 17.5a17.7 17.7 0 0 1-13 0l-37.3-15-37.2 15a17.8 17.8 0 0 1-13 0L256 383.8a17.5 17.5 0 0 1 13-32.6l37.3 15 37.2-15c4.2-1.6 8.8-1.6 13 0l37.3 15 37.2-15a17.5 17.5 0 0 1 13 32.6zm17-86.3h-82a11.3 11.3 0 0 1-6.9-20.4l54.7-40.3a11.6 11.6 0 0 1 16.4 2.8l27.4 40.4a11.3 11.3 0 0 1-9.6 17.5z',
  matrix: [0.020491803278688523, 0, 0, 0.020491803278688523, -7.172131147540983, -5.9016393442622945]
})

var valuesTest = {
  angle: randomInRange(0, 180),
  decay: 0.9, // velocidad con la que pierden energia
  ticks: 80,
  scalar: 2, // tamaño
  spread: 180, // angulo con el q se van para los costados
  particleCount: 30,
  origin: { y: 0/* , x: 0 */},
  startVelocity: -35,
  gravity: 0.7, // peso
  drift: randomInRange(-4, 4), // viento
}

export function fireTest(){
  confetti({
    ...valuesTest,
    shapes: [pumpkin],
    colors: ['#ff9a00', '#ff7400', '#ff4d00']
  })
}