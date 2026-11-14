const form = document.querySelector("#password-form");
const passwordInput = document.querySelector("#password");
const feedback = document.querySelector("#feedback");
const togglePassword = document.querySelector("#toggle-password");
const digitSlots = [...document.querySelectorAll(".digit-slot")];
const digitEntry = document.querySelector("#digit-entry");
const entryScreen = document.querySelector("#entry-screen");
const quizScreen = document.querySelector("#quiz-screen");
const scene = document.querySelector(".scene");
const bookCover = document.querySelector("#book-cover");
const openBook = document.querySelector("#open-book");
const bookParticles = document.querySelector("#book-particles");
const sparkles = document.querySelector("#sparkles");
const fireflies = document.querySelector("#fireflies");

const questionCount = document.querySelector("#question-count");
const progressFill = document.querySelector("#progress-fill");
const progressDots = document.querySelector("#progress-dots");
const questionIcon = document.querySelector("#question-icon");
const questionText = document.querySelector("#question-text");
const answersBox = document.querySelector("#answers");
const answerFeedback = document.querySelector("#answer-feedback");
const nextButton = document.querySelector("#next-question");
const questionArea = document.querySelector("#question-area");
const quizFinish = document.querySelector("#quiz-finish");
const pageNumber = document.querySelector("#page-number");
const scoreLine = document.querySelector("#score-line");
const restartQuiz = document.querySelector("#restart-quiz");

const questions = [
  {
    icon: "🌿",
    text: "Qual anime virou um dos nossos momentinhos favoritos?",
    answers: ["Jujutsu Kaisen", "Frieren", "Hunter x Hunter"],
    correct: 1,
    right: "Acertou! Frieren já tem um lugar especial na nossa história. ✨",
    wrong: "Quase, cavaleiro! É Frieren — nosso momentinho de anime favorito. 💙"
  },
  {
    icon: "🧇",
    text: "Qual sobremesa está quase virando tradição nos nossos encontros?",
    answers: ["Waffles com sorvete", "Petit gâteau com churrasco", "Sorvete com macarrão"],
    correct: 0,
    right: "Isso! E o próximo encontro vai ser a terceira vez… já virou tradição! 🤭",
    wrong: "Nããão, essa foi uma tentativa culinária perigosa! A resposta é waffles com sorvete. 🧇"
  },
  {
    icon: "🎬",
    text: "Qual tipo de saga você fez questão de compartilhar comigo?",
    answers: ["Documentários sobre parafusos", "Uma saga de super-heróis", "Competições de pesca profissional"],
    correct: 1,
    right: "Acertou! Você me apresentou ao seu universo de heróis — e eu fui junto nessa aventura. 🦸",
    wrong: "Essa resposta foi de outro multiverso! Era a saga de super-heróis que você queria ver comigo. 🦸"
  },
  {
    icon: "💪",
    text: "Qual é uma das nossas missões da vida real que fazemos juntinhos?",
    answers: ["Treinar na academia", "Caçar dinossauros no quintal", "Derrotar monstros antes do café"],
    correct: 0,
    right: "Perfeito! Parceiros de treino e de vida. 💪💗",
    wrong: "Boa tentativa, aventureiro! Ainda não temos dinossauros no quintal… é a academia! 😂"
  },
  {
    icon: "🗻",
    text: "Qual viagem é um dos grandes sonhos da princesa — e você quer viver com ela?",
    answers: ["Uma expedição para Marte", "Uma volta ao mundo de bicicleta amanhã", "Conhecer o Japão juntos"],
    correct: 2,
    right: "Isso! Um dia vamos conhecer o Japão e criar memórias por lá. 🇯🇵",
    wrong: "Quase! O sonho é conhecer o Japão, e fica ainda mais especial com você ao meu lado. 💗"
  },
  {
    icon: "☕",
    text: "Qual passeio você adora fazer comigo para descobrirmos lugares novos?",
    answers: ["Conhecer cafés diferentes", "Avaliar todas as lojas de ferramentas do planeta", "Dormir em uma fila de supermercado"],
    correct: 0,
    right: "Acertou! Um café novo, uma caminhada e você comigo: encontro perfeito. ☕",
    wrong: "Essa ideia merece uma side quest… mas a resposta é descobrir cafés novos comigo! ☕"
  },
  {
    icon: "💖",
    text: "O que a princesa mais ama no seu cavaleiro?",
    answers: ["Quando ele finge que não é lindo", "O jeito carinhoso, brincalhão e cuidadoso dele", "Quando ele deixa a princesa ganhar em tudo"],
    correct: 1,
    right: "Acertou o maior tesouro! Eu amo seu carinho, seu humor e o jeito que você cuida de mim. 🥹💗",
    wrong: "Você é lindo tentando adivinhar, mas a resposta é seu jeito carinhoso, brincalhão e cuidadoso. 💗"
  }
];

let currentQuestion = 0;
let correctAnswers = 0;
let answered = false;

function createAtmosphere() {
  const sparkleSymbols = ["✦", "✧", "·", "✦", "⋆"];
  for (let i = 0; i < 34; i++) {
    const sparkle = document.createElement("span");
    sparkle.className = "sparkle";
    sparkle.textContent = sparkleSymbols[Math.floor(Math.random() * sparkleSymbols.length)];
    sparkle.style.left = `${Math.random() * 100}%`;
    sparkle.style.top = `${Math.random() * 100}%`;
    sparkle.style.fontSize = `${8 + Math.random() * 14}px`;
    sparkle.style.setProperty("--duration", `${3 + Math.random() * 5}s`);
    sparkle.style.animationDelay = `${Math.random() * 6}s`;
    sparkles.appendChild(sparkle);
  }
  for (let i = 19; i > 0; i--) {
    const light = document.createElement("span");
    light.className = "firefly";
    light.style.left = `${Math.random() * 100}%`;
    light.style.top = `${Math.random() * 100}%`;
    light.style.setProperty("--duration", `${4 + Math.random() * 7}s`);
    light.style.animationDelay = `${Math.random() * 5}s`;
    fireflies.appendChild(light);
  }
}

function renderDots() {
  progressDots.innerHTML = "";
  questions.forEach((_, index) => {
    const dot = document.createElement("span");
    dot.className = "progress-dot";
    if (index === currentQuestion) dot.classList.add("current");
    if (index < currentQuestion) dot.classList.add("done");
    progressDots.appendChild(dot);
  });
}

function renderQuestion() {
  answered = false;
  const q = questions[currentQuestion];
  questionCount.textContent = `PERGUNTA ${currentQuestion + 1} DE ${questions.length}`;
  progressFill.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
  questionIcon.textContent = q.icon;
  questionText.textContent = q.text;
  pageNumber.textContent = String(currentQuestion + 1);
  answerFeedback.textContent = "";
  answerFeedback.className = "answer-feedback";
  nextButton.disabled = true;
  nextButton.innerHTML = currentQuestion === questions.length - 1
    ? 'Concluir o teste <span>♡</span>'
    : 'Próxima página <span>❧</span>';
  answersBox.innerHTML = "";
  renderDots();
  // Virada de página 3D a cada pergunta.
  questionArea.classList.remove("page-turn");
  void questionArea.offsetWidth;
  questionArea.classList.add("page-turn");
  window.Fx?.pageTurn();

  q.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-option";
    button.innerHTML = `<span class="answer-letter">${String.fromCharCode(65 + index)}</span><span></span>`;
    button.querySelector("span:last-child").textContent = answer;
    button.addEventListener("click", () => chooseAnswer(index, button));
    answersBox.appendChild(button);
  });
}

function chooseAnswer(selectedIndex, selectedButton) {
  if (answered) return;
  answered = true;
  const q = questions[currentQuestion];
  const buttons = [...answersBox.querySelectorAll(".answer-option")];
  buttons.forEach((button, index) => {
    button.disabled = true;
    if (index === q.correct) button.classList.add("correct");
  });

  if (selectedIndex === q.correct) {
    correctAnswers++;
    answerFeedback.textContent = q.right;
    window.Fx?.good();
  } else {
    selectedButton.classList.add("incorrect");
    answerFeedback.textContent = q.wrong;
    window.Fx?.bad();
  }
  nextButton.disabled = false;
}

function finishQuiz() {
  questionArea.hidden = true;
  quizFinish.hidden = false;
  pageNumber.textContent = "♡";
  scoreLine.textContent = `${correctAnswers} de ${questions.length} respostas certas`;
  const message = correctAnswers === questions.length
    ? "Gabaritou! O cavaleiro conhece muito bem a princesa — e merece uma medalha de amor. 🏆"
    : correctAnswers >= 4
      ? "Muito bem, cavaleiro! O mais importante é que vocês continuam escrevendo essa história juntos. 💙"
      : "Ainda tem muito para descobrir sobre a princesa… que sorte a sua poder continuar essa aventura com ela! 💗";
  document.querySelector("#final-message").textContent = message;
  progressFill.style.width = "100%";
  renderDots();
}

function updateDigitSlots() {
  const digits = passwordInput.value.replace(/\D/g, "").slice(0, 4);
  if (passwordInput.value !== digits) passwordInput.value = digits;
  digitSlots.forEach((slot, index) => {
    const sparkle = slot.querySelector("i");
    slot.textContent = digits[index] ? (passwordInput.type === "password" ? "•" : digits[index]) : "";
    if (sparkle) slot.appendChild(sparkle);
    slot.classList.toggle("filled", Boolean(digits[index]));
    slot.classList.toggle("active", index === digits.length && digits.length < 4);
  });
  digitEntry.classList.toggle("has-value", digits.length > 0);
}
passwordInput.addEventListener("input", updateDigitSlots);
digitEntry.addEventListener("click", () => passwordInput.focus());

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const enteredPassword = passwordInput.value.trim();
  if (enteredPassword === "1211") {
    feedback.textContent = "A chave reconheceu você… 💗";
    feedback.className = "feedback success";
    entryScreen.classList.add("portal-unlocked");
    digitEntry.classList.add("unlocked");
    const button = form.querySelector(".key-button");
    button.classList.add("unlocking");
    button.disabled = true;

    // A senha recebe um último brilho breve; depois, o coração some e deixa sua luz nascer do alto.
    digitEntry.classList.add("password-final-glow");
    window.setTimeout(() => {
      digitEntry.classList.remove("password-final-glow");
      const heart = entryScreen.querySelector(".portal-heart");
      const heartRect = heart.getBoundingClientRect();
      const originX = heartRect.left + heartRect.width / 2;
      const originY = heartRect.top + heartRect.height / 2;
      heart.classList.add("heart-source-hidden");
      scene.classList.add("heart-darkening");

      // A luz nasce no ponto do coração, na parte superior, e toma a tela em 5 segundos.
      window.setTimeout(() => {
        const light = document.createElement("div");
        light.className = "heart-light-burst";
        light.style.setProperty("--light-origin-x", `${originX}px`);
        light.style.setProperty("--light-origin-y", `${originY}px`);
        document.body.appendChild(light);
        requestAnimationFrame(() => light.classList.add("burst-full"));

        window.setTimeout(() => {
          // A partir do branco, a cachoeira reaparece suavemente; sem corte para preto.
          entryScreen.hidden = true;
          quizScreen.hidden = false;
          scene.classList.remove("heart-darkening");
          heart.remove();
          quizScreen.classList.add("landscape-reveal");
          bookCover.classList.add("cover-arrive");
          light.classList.add("burst-fade");
          window.setTimeout(() => light.remove(), 1600);
          window.setTimeout(() => quizScreen.classList.remove("landscape-reveal"), 1800);
        }, 5000);
      }, 250);
    }, 650);
  } else {
    feedback.textContent = enteredPassword.length < 4
      ? "Faltam alguns números para abrir o portal, meu príncipe…"
      : "Hmm… essa chave não parece ser a certa, meu príncipe! 💗";
    feedback.className = "feedback error";
    digitEntry.classList.remove("shake");
    void digitEntry.offsetWidth;
    digitEntry.classList.add("shake");
    passwordInput.value = "";
    updateDigitSlots();
    passwordInput.focus();
  }
});

// O coração da senha tem um brilho branco suave e pode espalhar partículas ao clique.
const portalHeart = document.querySelector("#portal-heart");
portalHeart.addEventListener("pointerenter", () => portalHeart.classList.add("heart-hover-light"));
portalHeart.addEventListener("pointerleave", () => portalHeart.classList.remove("heart-hover-light"));
portalHeart.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  if (scene.classList.contains("heart-darkening") || portalHeart.disabled) return;

  const rect = portalHeart.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;
  const heartSymbols = ["♥", "♡", "❤"];
  const heartColors = ["#ffd6e5", "#fff0f6", "#f5bfd4", "#ffffff"];

  for (let i = 0; i < 18; i++) {
    const particle = document.createElement("span");
    particle.className = "portal-heart-particle";
    particle.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
    const angle = (Math.PI * 2 * i) / 18 + (Math.random() - .5) * .32;
    const distance = 55 + Math.random() * 95;
    particle.style.left = `${originX}px`;
    particle.style.top = `${originY}px`;
    particle.style.setProperty("--heart-dx", `${Math.cos(angle) * distance}px`);
    particle.style.setProperty("--heart-dy", `${Math.sin(angle) * distance}px`);
    particle.style.setProperty("--heart-spin", `${Math.random() * 100 - 50}deg`);
    particle.style.setProperty("--heart-size", `${12 + Math.random() * 13}px`);
    particle.style.setProperty("--heart-color", heartColors[Math.floor(Math.random() * heartColors.length)]);
    document.body.appendChild(particle);
    particle.addEventListener("animationend", () => particle.remove(), { once: true });
  }
  portalHeart.classList.remove("heart-clicked");
  void portalHeart.offsetWidth;
  portalHeart.classList.add("heart-clicked");
  window.setTimeout(() => portalHeart.classList.remove("heart-clicked"), 420);
});

togglePassword.addEventListener("click", () => {
  const showing = passwordInput.type === "text";
  passwordInput.type = showing ? "password" : "text";
  updateDigitSlots();
  togglePassword.textContent = showing ? "◉" : "◉̸";
  togglePassword.setAttribute("aria-label", showing ? "Mostrar senha" : "Ocultar senha");
  togglePassword.title = showing ? "Mostrar senha" : "Ocultar senha";
  passwordInput.focus();
});


bookCover.addEventListener("click", () => {
  if (bookCover.dataset.opening === "true") return;
  bookCover.dataset.opening = "true";
  bookCover.classList.add("cover-leaving");

  // A paisagem fica visível primeiro; o livro começa a surgir depois, dentro dos 5s.
  window.setTimeout(() => {
    bookCover.hidden = true;
    openBook.hidden = false;
    renderQuestion();
    openBook.classList.add("book-opening");
  }, 1800);
});

// A luz dourada acompanha suavemente a posição do mouse perto do livro.
quizScreen.addEventListener("pointermove", (event) => {
  const rect = quizScreen.getBoundingClientRect();
  quizScreen.style.setProperty("--pointer-x", `${event.clientX - rect.left}px`);
  quizScreen.style.setProperty("--pointer-y", `${event.clientY - rect.top}px`);
});

nextButton.addEventListener("click", () => {
  if (!answered) return;
  if (currentQuestion === questions.length - 1) {
    finishQuiz();
    return;
  }
  currentQuestion++;
  renderQuestion();
});

restartQuiz.addEventListener("click", () => {
  currentQuestion = 0;
  correctAnswers = 0;
  quizFinish.hidden = true;
  questionArea.hidden = false;
  renderQuestion();
});

createAtmosphere();


// Navegação para a Tela 3 e lógica da máquina de recompensas.
const machineScreen = document.querySelector("#machine-screen");
const goToMachine = document.querySelector("#go-to-machine");
const claw = document.querySelector("#claw");
const moveLeft = document.querySelector("#move-left");
const moveRight = document.querySelector("#move-right");
const grabPrize = document.querySelector("#grab-prize");
const machineHint = document.querySelector("#machine-hint");
const collectionCount = document.querySelector("#collection-count");
const collectionProgressFill = document.querySelector("#collection-progress-fill");
const collectionList = document.querySelector("#collection-list");
const collectionEmpty = document.querySelector("#collection-empty");
const prizePop = document.querySelector("#prize-pop");
const cornerNote = document.querySelector("#corner-note");

const prizeDetails = [
  { emoji: "💗", name: "Vale-beijo", description: "Um beijinho especial, quando os dois quiserem." },
  { emoji: "🧸", name: "Vale-massagem", description: "Uma sessão de carinho e massagem feita pela princesa." },
  { emoji: "🍿", name: "Escolher o filme", description: "Você escolhe o próximo filme ou aventura para assistirem juntinhos." },
  { emoji: "📸", name: "Foto especial", description: "Uma foto nossa com uma dedicatória feita especialmente para você.", gallery: true },
  { emoji: "🎀", name: "Vale-dia de mimo", description: "Um dia para receber carinho, atenção e mimos da princesa." },
  { emoji: "🧇", name: "Vale waffles com sorvete", description: "Nosso próximo encontro doce: waffles com sorvete! 🥹" },
  { emoji: "🎁", name: "Item lendário encontrado!", description: "Seu conteúdo será revelado em uma ocasião especial." }
];
prizeDetails.forEach((prize, i) => { prize.medal = `assets/anime/medalha-${i + 1}.jpg`; });
let clawPosition = 50;
let collectedPrizes = new Set();
let grabInProgress = false;

function updateClaw() {
  claw.style.left = `${clawPosition}%`;
  moveLeft.disabled = clawPosition <= 7;
  moveRight.disabled = clawPosition >= 93;
}

function moveClaw(direction) {
  if (grabInProgress || !machineScreen || machineScreen.hidden) return;
  clawPosition = Math.max(7, Math.min(93, clawPosition + direction * 8));
  updateClaw();
}

moveLeft.addEventListener("click", () => moveClaw(-1));
moveRight.addEventListener("click", () => moveClaw(1));

document.addEventListener("keydown", (event) => {
  if (machineScreen.hidden || prizePop.hidden === false) return;
  if (event.key === "ArrowLeft") { event.preventDefault(); moveClaw(-1); }
  if (event.key === "ArrowRight") { event.preventDefault(); moveClaw(1); }
  if (event.key === "Enter" && document.activeElement !== passwordInput && !grabInProgress) {
    event.preventDefault();
    grabPrize.click();
  }
});

// Medalha: recorte circular da arte anime com o emoji do prêmio como selo.
function medalMarkup(prize) {
  return `<span class="medal"><img src="${prize.medal}" alt="" draggable="false"><b>${prize.emoji}</b></span>`;
}

// Carrossel de imagens estilo anime (popup do prêmio "Foto especial").
const animePhotos = [1, 2, 3, 4, 5].map(n => `assets/anime/foto-${n}.jpg`);
let photoIndex = 0;
let photoTimer = null;

function galleryMarkup() {
  return `
    <div class="photo-carousel" id="photo-carousel" aria-label="Fotos em estilo anime">
      <button class="photo-arrow photo-prev" id="photo-prev" type="button" aria-label="Foto anterior">‹</button>
      <div class="photo-frame">
        ${animePhotos.map((src, i) => `<img class="photo-slide${i === 0 ? " active" : ""}" src="${src}" alt="Ilustração em estilo anime ${i + 1} de ${animePhotos.length}" draggable="false">`).join("")}
      </div>
      <button class="photo-arrow photo-next" id="photo-next" type="button" aria-label="Próxima foto">›</button>
      <div class="photo-dots" id="photo-dots">${animePhotos.map((_, i) => `<span class="photo-dot${i === 0 ? " active" : ""}"></span>`).join("")}</div>
    </div>`;
}

function stopPhotoCarousel() {
  if (photoTimer) window.clearInterval(photoTimer);
  photoTimer = null;
}

function startPhotoCarousel() {
  stopPhotoCarousel();
  photoTimer = window.setInterval(() => showPhoto(photoIndex + 1), 3500);
}

function showPhoto(index) {
  const slides = prizePop.querySelectorAll(".photo-slide");
  const dots = prizePop.querySelectorAll(".photo-dot");
  if (!slides.length) return;
  photoIndex = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => slide.classList.toggle("active", i === photoIndex));
  dots.forEach((dot, i) => dot.classList.toggle("active", i === photoIndex));
}

function initPhotoCarousel() {
  photoIndex = 0;
  const go = delta => { showPhoto(photoIndex + delta); startPhotoCarousel(); };
  document.querySelector("#photo-prev").addEventListener("click", () => go(-1));
  document.querySelector("#photo-next").addEventListener("click", () => go(1));
  startPhotoCarousel();
}

function showPrizePopup(prize, allDone) {
  const showGallery = Boolean(prize.gallery) && !allDone;
  const sparkleMarkup = Array.from({ length: 22 }, (_, index) => {
    const angle = (Math.PI * 2 * index) / 22;
    const distance = 155 + (index % 3) * 24;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance * .82;
    return `<span class="pop-sparkle" style="--i:${index};--dx:${dx.toFixed(1)}px;--dy:${dy.toFixed(1)}px">✦</span>`;
  }).join("");
  prizePop.innerHTML = `
    <div class="pop-sparkles" aria-hidden="true">${sparkleMarkup}</div>
    ${showGallery ? galleryMarkup() : `<div class="pop-emoji pop-medal">${medalMarkup(prize)}</div>`}
    <h3>${allDone ? "Coleção completa!" : prize.name}</h3>
    <p>${allDone
      ? "Você conquistou os sete prêmios! Uma última surpresa espera por você no fim desta aventura. 💗"
      : prize.description}</p>
    <button type="button" id="close-prize-pop">${allDone ? "Ver meus presentes ✨" : "Guardar na coleção 💝"}</button>`;
  prizePop.hidden = false;
  if (showGallery) initPhotoCarousel();
  document.querySelector("#close-prize-pop").addEventListener("click", () => {
    stopPhotoCarousel();
    prizePop.hidden = true;
    if (allDone) {
      machineHint.textContent = "Todos os 7 prêmios conquistados! Sua surpresa final está desbloqueada. 💗";
      const collectionFooter = document.querySelector(".collection-footer");
      if (collectionFooter) collectionFooter.textContent = "Todos os prêmios foram conquistados. Veja tudo o que você ganhou! ✨";
      window.setTimeout(startGiftRecap, 350);
    } else {
      machineHint.textContent = "Prêmio guardado! Escolha outro e continue tentando. ✨";
    }
  });
}

const giftRecapOverlay = document.querySelector("#gift-recap-overlay");
const giftSlideEmoji = document.querySelector("#gift-slide-emoji");
const giftSlideCount = document.querySelector("#gift-slide-count");
const giftSlideName = document.querySelector("#gift-slide-name");
const giftSlideDescription = document.querySelector("#gift-slide-description");
const physicalGiftNote = document.querySelector("#physical-gift-note");
const claimLastGift = document.querySelector("#claim-last-gift");
let giftSlideIndex = 0;
let giftCarouselTimer = null;

function renderGiftSlide() {
  const gift = prizeDetails[giftSlideIndex];
  giftSlideEmoji.innerHTML = medalMarkup(gift);
  giftSlideCount.textContent = `${giftSlideIndex + 1} de ${prizeDetails.length}`;
  giftSlideName.textContent = gift.name;
  giftSlideDescription.textContent = gift.description;
  const isLast = giftSlideIndex === prizeDetails.length - 1;
  physicalGiftNote.hidden = !isLast;
  claimLastGift.hidden = !isLast;
}

function showGiftSlide(index) {
  giftSlideIndex = Math.max(0, Math.min(prizeDetails.length - 1, index));
  renderGiftSlide();
}

function startGiftRecap() {
  giftSlideIndex = 0;
  renderGiftSlide();
  giftRecapOverlay.hidden = false;
  if (giftCarouselTimer) window.clearInterval(giftCarouselTimer);
  giftCarouselTimer = window.setInterval(() => {
    if (giftSlideIndex < prizeDetails.length - 1) {
      showGiftSlide(giftSlideIndex + 1);
    } else {
      window.clearInterval(giftCarouselTimer);
      giftCarouselTimer = null;
    }
  }, 3000);
}

document.querySelector("#gift-prev").addEventListener("click", () => {
  if (giftCarouselTimer) { window.clearInterval(giftCarouselTimer); giftCarouselTimer = null; }
  showGiftSlide(giftSlideIndex - 1);
});
document.querySelector("#gift-next").addEventListener("click", () => {
  if (giftCarouselTimer) { window.clearInterval(giftCarouselTimer); giftCarouselTimer = null; }
  showGiftSlide(giftSlideIndex + 1);
});
claimLastGift.addEventListener("click", () => {
  if (giftSlideIndex !== prizeDetails.length - 1) return;
  if (giftCarouselTimer) window.clearInterval(giftCarouselTimer);
  giftCarouselTimer = null;
  giftRecapOverlay.classList.add("is-transitioning");
  window.setTimeout(() => {
    giftRecapOverlay.hidden = true;
    giftRecapOverlay.classList.remove("is-transitioning");
    machineScreen.hidden = true;
    treasureScreen.hidden = false;
    treasureScreen.classList.add("treasure-arrive");
  }, 550);
});

function renderCollection() {
  collectionCount.textContent = `${collectedPrizes.size} de 7 prêmios`;
  collectionProgressFill.style.width = `${(collectedPrizes.size / prizeDetails.length) * 100}%`;
  collectionEmpty.hidden = collectedPrizes.size > 0;
  collectionList.querySelectorAll(".collection-item").forEach(item => item.remove());

  collectedPrizes.forEach(index => {
    const prize = prizeDetails[index];
    const item = document.createElement("div");
    item.className = "collection-item";
    item.innerHTML = `<span class="collection-emoji">${medalMarkup(prize)}</span><span><strong></strong><small></small></span>`;
    item.querySelector("strong").textContent = prize.name;
    item.querySelector("small").textContent = prize.description;
    collectionList.appendChild(item);
  });
}

function collectPrize(index, heartElement) {
  const prize = prizeDetails[index];
  collectedPrizes.add(index);
  if (heartElement) heartElement.classList.add("collected");
  renderCollection();
  const allDone = collectedPrizes.size === prizeDetails.length;
  machineHint.textContent = allDone
    ? "Você encontrou todos os corações! ✨"
    : "O coração chegou! Vamos descobrir o que veio dentro? 💗";
  showPrizePopup(prize, allDone);
}

grabPrize.addEventListener("click", () => {
  if (grabInProgress || prizePop.hidden === false || collectedPrizes.size === prizeDetails.length) return;

  // O anzol sempre desce até o fundo. Só fisga um coração quando há um bem próximo da posição escolhida.
  const available = [...document.querySelectorAll(".heart-prize:not(.collected)")];
  let targetHeart = null;
  let closestDistance = Infinity;
  available.forEach(element => {
    const heartX = parseFloat(element.style.getPropertyValue("--x"));
    const distance = Math.abs(heartX - clawPosition);
    if (distance < closestDistance) {
      closestDistance = distance;
      targetHeart = element;
    }
  });

  const caughtHeart = targetHeart && closestDistance <= 10 ? targetHeart : null;
  grabInProgress = true;
  grabPrize.disabled = true;
  moveLeft.disabled = true;
  moveRight.disabled = true;
  claw.classList.remove("carrying", "dropping", "grabbing");
  void claw.offsetWidth;
  claw.classList.add("dropping");
  machineHint.textContent = caughtHeart
    ? "O anzol está descendo para fisgar um coração… 💗"
    : "O anzol está descendo até o fundo… será que vai encontrar algo? ✨";

  // No fundo, a ponta prende o coração na curva interna do anzol, sem saltos artificiais.
  window.setTimeout(() => {
    if (caughtHeart) {
      caughtHeart.classList.add("collected");
      claw.classList.add("carrying");
      machineHint.textContent = "Fisgou! O coração está preso no anzol… trazendo sua surpresa! 💗";
    } else {
      machineHint.textContent = "O anzol voltou vazio desta vez! Tente outra posição. 💛";
    }
  }, 900);

  window.setTimeout(() => {
    claw.classList.remove("dropping", "carrying", "grabbing");
    grabInProgress = false;
    grabPrize.disabled = false;
    updateClaw();
    if (caughtHeart) {
      // Ordem fixa e secreta: a captura seguinte sempre revela o próximo prêmio.
      const nextPrizeIndex = collectedPrizes.size;
      collectPrize(nextPrizeIndex, caughtHeart);
    } else {
      machineHint.textContent = "Nenhum coração foi fisgado. Mova o anzol e tente novamente! 💗";
    }
  }, 1680);
});

goToMachine.addEventListener("click", () => {
  quizScreen.hidden = true;
  machineScreen.hidden = false;
  if (cornerNote) cornerNote.hidden = true;
  updateClaw();
  machineHint.textContent = "Mova o anzol até a posição desejada e aperte PEGAR!";
});


// Primeira abertura: clique no coração, explosão de partículas e transição preta até a senha.
const heartIntro = document.querySelector("#heart-intro");
const giantHeartButton = document.querySelector("#giant-heart-button");
const introContent = document.querySelector("#intro-content");
const heartBurst = document.querySelector("#heart-burst");
let introStarted = false;

function burstHeart() {
  if (introStarted) return;
  introStarted = true;
  giantHeartButton.disabled = true;

  const symbols = ["♥", "♡", "✦", "✧", "❤", "⋆", "·"];
  const colors = ["#ff6f9e", "#ffd0df", "#fff0c2", "#f7a6c4", "#ffffff", "#f5d38a"];

  for (let i = 0; i < 58; i++) {
    const particle = document.createElement("span");
    particle.className = "burst-particle";
    particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    const angle = (Math.PI * 2 * i) / 58 + (Math.random() - .5) * .35;
    const distance = 110 + Math.random() * Math.min(window.innerWidth, window.innerHeight) * .48;
    particle.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
    particle.style.setProperty("--dy", `${Math.sin(angle) * distance}px`);
    particle.style.setProperty("--spin", `${Math.random() * 900 - 450}deg`);
    particle.style.setProperty("--particle-size", `${12 + Math.random() * 25}px`);
    particle.style.setProperty("--particle-duration", `${650 + Math.random() * 650}ms`);
    particle.style.setProperty("--particle-color", colors[Math.floor(Math.random() * colors.length)]);
    heartBurst.appendChild(particle);
  }

  giantHeartButton.animate(
    [
      { transform: "scale(1)", filter: "brightness(1)" },
      { transform: "scale(1.22)", filter: "brightness(1.8)" },
      { transform: "scale(.05)", filter: "brightness(2.5)" }
    ],
    { duration: 520, easing: "cubic-bezier(.2,.8,.2,1)", fill: "forwards" }
  );

  heartIntro.classList.add("is-bursting");
  window.setTimeout(() => heartIntro.classList.add("is-black"), 260);

  // A passagem até a senha dura cerca de 6 segundos e revela o painel em camadas.
  window.setTimeout(() => {
    entryScreen.hidden = false;
    entryScreen.style.opacity = "0";
    entryScreen.style.transform = "translateY(34px) scale(.91)";
    heartIntro.classList.add("is-fading");
    window.setTimeout(() => {
      heartIntro.hidden = true;
      entryScreen.animate(
        [
          { opacity: 0, transform: "translateY(34px) scale(.91)" , filter: "blur(12px) brightness(1.8)"},
          { opacity: .35, transform: "translateY(18px) scale(.96)", filter: "blur(6px) brightness(1.5)", offset: .35 },
          { opacity: 1, transform: "translateY(0) scale(1)", filter: "blur(0) brightness(1)" }
        ],
        { duration: 4050, easing: "cubic-bezier(.16,1,.3,1)", fill: "forwards" }
      );
      window.setTimeout(() => passwordInput.focus({ preventScroll: true }), 2500);
    }, 700);
  }, 1250);
}

giantHeartButton.addEventListener("click", burstHeart);



// TELA 4 — baú 3D articulado, recompensa e carta final.
const goToTreasure = document.querySelector("#go-to-treasure");
const treasureScreen = document.querySelector("#treasure-screen");
const chestButton = document.querySelector("#open-chest");
const treasureStars = document.querySelector("#treasure-stars");
const treasureReward = document.querySelector("#treasure-reward");
const showEnvelopeButton = document.querySelector("#show-envelope");
const letterScreen = document.querySelector("#letter-screen");
const envelopeScene = document.querySelector("#envelope-scene");
const openEnvelopeButton = document.querySelector("#open-envelope");
const envelopeHint = document.querySelector("#envelope-hint");
const royalLetter = document.querySelector("#royal-letter");
let chestHasOpened = false;
let envelopeHasOpened = false;

goToTreasure?.addEventListener("click", () => {
  if (collectedPrizes.size !== prizeDetails.length) return;
  machineScreen.hidden = true;
  treasureScreen.hidden = false;
  treasureScreen.classList.add("treasure-arrive");
  if (cornerNote) cornerNote.hidden = true;
});

function releaseTreasureStars() {
  const symbols = ["✦", "✧", "⋆", "✶", "✴"];
  for (let i = 0; i < 54; i++) {
    const star = document.createElement("span");
    star.className = "treasure-particle";
    star.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    const angle = (Math.PI * 2 * i) / 54 + (Math.random() - .5) * .3;
    const distance = 90 + Math.random() * Math.min(innerWidth, innerHeight) * .48;
    star.style.setProperty("--tx", `${Math.cos(angle) * distance}px`);
    star.style.setProperty("--ty", `${Math.sin(angle) * distance - 35}px`);
    star.style.setProperty("--spin", `${Math.random() * 520 - 260}deg`);
    star.style.setProperty("--star-delay", `${Math.random() * 420}ms`);
    star.style.setProperty("--star-size", `${10 + Math.random() * 19}px`);
    treasureStars.appendChild(star);
    window.setTimeout(() => star.remove(), 2100);
  }
}

chestButton?.addEventListener("click", () => {
  if (chestHasOpened) return;
  chestHasOpened = true;
  chestButton.disabled = true;
  document.querySelector("#chest-click-hint").textContent = "✦ UM TESOURO MUITO ESPECIAL... ✦";
  // Escurece rapidamente a cena; quando a luz retorna, o baú aberto já está no lugar.
  treasureScreen.classList.add("chest-transition");
  window.setTimeout(() => {
    const openChestImage = chestButton.querySelector(".chest-open-image");
    if (openChestImage) openChestImage.hidden = false;
    chestButton.classList.add("chest-opened");
    treasureScreen.classList.remove("chest-transition");
    treasureScreen.classList.add("chest-revealed");
    releaseTreasureStars();
  }, 360);
  window.setTimeout(() => {
    treasureReward.hidden = false;
    treasureReward.classList.add("reward-reveal");
  }, 720);
});

showEnvelopeButton?.addEventListener("click", () => {
  treasureScreen.hidden = true;
  letterScreen.hidden = false;
  envelopeScene.classList.add("envelope-arrive");
});

openEnvelopeButton?.addEventListener("click", () => {
  if (envelopeHasOpened) return;
  envelopeHasOpened = true;
  openEnvelopeButton.classList.add("envelope-opening");
  envelopeHint.textContent = "O SELO SE ROMPEU...";
  window.setTimeout(() => {
    envelopeScene.classList.add("envelope-fade");
  }, 900);
  window.setTimeout(() => {
    envelopeScene.hidden = true;
    royalLetter.hidden = false;
    royalLetter.classList.add("letter-unfold");
  }, 1550);
});
