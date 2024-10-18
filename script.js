let questionsData = [];
let currentQuestionIndex = 0;
let totalCost = 0;
let selectedOptionsCosts = [];
let multiplicador = 1;

document.addEventListener('DOMContentLoaded', () => {
    fetch('questions.json')
        .then(response => response.json())
        .then(data => {
            questionsData = data;
            selectedOptionsCosts = Array(questionsData.length).fill(0);

            showWelcomeScreen();
        })
        .catch(error => console.error('Error al cargar las preguntas:', error));
});

function showWelcomeScreen() {
    document.getElementById('welcomeContainer').style.display = 'block';
    document.getElementById('questionContainer').style.display = 'none';
    document.getElementById('prevBtn').style.display = 'none';
    document.getElementById('totalCost').style.display = 'none';

    document.getElementById('startBtn').onclick = startQuestions;
}

function startQuestions() {
    document.getElementById('welcomeContainer').style.display = 'none';
    document.getElementById('questionContainer').style.display = 'block';
    document.getElementById('totalCost').style.display = 'block';
    loadQuestion(currentQuestionIndex);
}


function loadQuestion(index) {
    const questionContainer = document.getElementById('questionContainer');
    questionContainer.innerHTML = '';

    const question = questionsData[index];
    const questionText = document.createElement('p');
    questionText.textContent = question.question;
    questionContainer.appendChild(questionText);

    question.options.forEach(option => {
        const optionContainer = document.createElement('div');
        optionContainer.className = 'option-container';

        if (option.image) {
            const optionImage = document.createElement('img');
            optionImage.src = option.image;
            optionImage.alt = option.text;
            optionImage.className = 'option-image';
            optionContainer.appendChild(optionImage);
        }

        const optionBtn = document.createElement('button');
        optionBtn.textContent = option.text;
        optionBtn.onclick = () => selectOption(index, option.cost, option.text);

        optionContainer.appendChild(optionBtn);
        questionContainer.appendChild(optionContainer);
    });

    document.getElementById('prevBtn').style.display = index > 0 ? 'block' : 'none';
    document.getElementById('prevBtn').onclick = prevQuestion;
}

function selectOption(index, cost, optionText) {
    if (index > 0) {
        cost *= multiplicador;
    } else {
        multiplicador = optionText === "Calidad Optima" ? 3 :
                        optionText === "Buena relación calidad/precio" ? 2 : 1;
    }

    totalCost -= selectedOptionsCosts[index];
    selectedOptionsCosts[index] = cost;
    totalCost += cost;
    document.getElementById('totalCost').textContent = `Costo Total: ${totalCost}`;

    if (index < questionsData.length - 1) {
        currentQuestionIndex++;
        loadQuestion(currentQuestionIndex);
    } else {
        showFinalScreen();
    }
}

function prevQuestion() {
    if (currentQuestionIndex > 0) {
        totalCost -= selectedOptionsCosts[currentQuestionIndex];
        document.getElementById('totalCost').textContent = `Costo Total: ${totalCost}`;

        currentQuestionIndex--;
        loadQuestion(currentQuestionIndex);
    }
}

function showFinalScreen() {
    const questionContainer = document.getElementById('questionContainer');
    questionContainer.innerHTML = '';
    questionContainer.style.display = 'block';

    const finalText1 = document.createElement('p');
    finalText1.textContent = '¡Gracias por completar la cotización! Aquí tienes algunas opciones para continuar:';
    questionContainer.appendChild(finalText1);

    const buttons = [
        { text: 'F Share', url: 'https://www.facebook.com/?locale=es_LA' },
        { text: 'In Share', url: 'https://co.linkedin.com/' },
        { text: 'G Google+', url: 'https://www.google.com/?hl=es' },
        { text: 'X Share', url: 'https://x.com/?lang=es' }
    ];

    buttons.forEach(buttonInfo => {
        const button = document.createElement('button');
        button.textContent = buttonInfo.text;
        button.onclick = () => window.location.href = buttonInfo.url;
        questionContainer.appendChild(button);
    });

    const finalText2 = document.createElement('p');
    finalText2.textContent = 'El costo total estimado es:';
    questionContainer.appendChild(finalText2);

    const costText = document.createElement('p');
    costText.textContent = `Costo Total: ${totalCost}`;
    questionContainer.appendChild(costText);

    const editButton = document.createElement('button');
    editButton.textContent = 'Editar Respuestas';
    editButton.onclick = () => {
        currentQuestionIndex = 0;
        startQuestions();
    };
    questionContainer.appendChild(editButton);

    const finalText3 = document.createElement('p');
    finalText3.textContent = '¿Listo para crear tu proyecto?';
    questionContainer.appendChild(finalText3);

    const createProjectButton = document.createElement('button');
    createProjectButton.textContent = 'Crea tu Proyecto';
    createProjectButton.onclick = () => alert('¡Proyecto creado!');
    questionContainer.appendChild(createProjectButton);

    alert('Hemos terminado la cotización.');
}
