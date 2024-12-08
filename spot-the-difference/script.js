let differences = [], score = 0, timer = 0, interval;

async function loadGame() {
  try {
    const response = await fetch('game-config.json');
    const config = await response.json();

    document.getElementById('game-title').textContent = config.gameTitle;
    loadImages(config.images);
    differences = config.differences;
    startTimer();
  } catch (error) {
    console.error('Error loading game configuration:', error);
  }
}

function loadImages(images) {
  const image1 = document.getElementById('image1');
  const image2 = document.getElementById('image2');

  image1.innerHTML = `<img src="${images.image1}" alt="Image 1">`;
  image2.innerHTML = `<img src="${images.image2}" alt="Image 2">`;

  image1.addEventListener('click', (e) => checkDifference(e, image1));
  image2.addEventListener('click', (e) => checkDifference(e, image2));
}

function checkDifference(event, container) {
  const rect = container.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const difference = differences.find(d => 
    x >= d.x && x <= d.x + d.width && y >= d.y && y <= d.y + d.height
  );

  if (difference) {
    markDifference(container, difference);
    differences = differences.filter(d => d !== difference);
    score++;
    updateScore();

    if (differences.length === 0) {
      endGame();
    }
  }
}

function markDifference(container, difference) {
  const marker = document.createElement('div');
  marker.className = 'difference-marker';
  marker.style.position = 'absolute';
  marker.style.left = `${difference.x}px`;
  marker.style.top = `${difference.y}px`;
  marker.style.width = `${difference.width}px`;
  marker.style.height = `${difference.height}px`;
  marker.style.border = '2px solid red';
  marker.style.pointerEvents = 'none';
  container.appendChild(marker);
}

function updateScore() {
  document.getElementById('score').textContent = `Score: ${score}`;
}

function startTimer() {
  interval = setInterval(() => {
    timer++;
    document.getElementById('timer').textContent = `Time: ${timer}s`;
  }, 1000);
}

function endGame() {
  clearInterval(interval);
  alert(`Congratulations! You found all differences in ${timer} seconds.`);
}

window.onload = loadGame;
