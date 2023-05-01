// элементы в DOM можно получить при помощи функции querySelector
const fruitsList = document.querySelector('.fruits__list'); // список карточек
const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
const kindInput = document.querySelector('.kind__input'); // поле с названием вида
const colorInput = document.querySelector('.color__input'); // поле с названием цвета
const weightInput = document.querySelector('.weight__input'); // поле с весом
const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления

// список фруктов в JSON формате
const fruitsJSON = [
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зелёный", "weight": 35},
  {"kind": "Личи", "color": "красно-розовый", "weight": 17},
  {"kind": "Карамбола", "color": "жёлтый", "weight": 28},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
];

// преобразование JSON в объект JavaScript
let fruits = JSON.parse(JSON.stringify(fruitsJSON));

/*** ОТОБРАЖЕНИЕ ***/

// отрисовка карточек
const display = () => {
  fruitsList.innerHTML = "";

for (let i = 0; i < fruits.length; i++) {
  const fruitsListItem = document.createElement("li");
  fruitsListItem.classList.add("fruit__item");
  fruitsListItem.classList.add(`fruit_${fruits[i].color}`);

  const fruitInfoDiv = document.createElement("div");
  fruitInfoDiv.classList.add("fruit__info");

  const indexSpan = document.createElement("span");
  indexSpan.textContent = `index: ${i}`;

  const kindSpan = document.createElement("span");
  kindSpan.textContent = `kind: ${fruits[i].kind}`;

  const colorSpan = document.createElement("span");
  colorSpan.textContent = `color: ${fruits[i].color}`;

  const weightSpan = document.createElement("span");
  weightSpan.textContent = `weight (кг): ${fruits[i].weight}`;

  fruitInfoDiv.appendChild(indexSpan);
  fruitInfoDiv.appendChild(kindSpan);
  fruitInfoDiv.appendChild(colorSpan);
  fruitInfoDiv.appendChild(weightSpan);

  fruitsListItem.appendChild(fruitInfoDiv);

  fruitsList.appendChild(fruitsListItem);
}  
};



/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
  if (typeof min !== 'number' || typeof max !== 'number') {
    throw new Error('Arguments should be numbers');
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// перемешивание массива
const shuffleFruits = () => {
console.log('shuffleFruits called');
let result = [];

 while (fruits.length > 0) {
  const randomIndex = getRandomInt(0, fruits.length -1);
  const randomElement = fruits.splice(randomIndex,1)[0];
  result.push(randomElement);

}
fruits = result;
display();

};

shuffleButton.addEventListener('click', () => {
try {
  shuffleFruits();
display();
} catch(error) {
  alert('Error: ' + error.message);
}
});

/*** ФИЛЬТРАЦИЯ ***/

// фильтрация массива
const filterFruits = () => {
  const minweight = parseFloat(document.querySelector('.minweight__input').value);
  const maxweight = parseFloat(document.querySelector('.maxweight__input').value);

  // Проверяем, что поля веса заполнены и значения являются числами
  if (!isNaN(minweight) && !isNaN(maxweight)) {
    fruits = fruits.filter((item) => item.weight >= minweight && item.weight <= maxweight);
  } else {
    fruits = [];
  }
};

filterButton.addEventListener('click', () => {
  filterFruits();
  display();
  
});

/*** СОРТИРОВКА ***/

let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки

const comparationColor = (a, b) => {
  const colorA = a.color.toLowerCase();
  const colorB = b.color.toLowerCase();
  
  if (colorA < colorB) {
    return -1;
  }
  if (colorA > colorB) {
    return 1;
  }
  return 0;
};

const sortAPI = {
  bubbleSort(arr, comparation) {
    // функция сортировки пузырьком
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (comparation(arr[j], arr[j+1]) > 0) {
          let temp = arr[j];
          arr[j] = arr[j+1];
          arr[j+1] = temp;
        }
      }
    }
  },

  quickSort(arr, comparation) {
    // Функция быстрой сортировки
    const recursionSort = (arr, left, right, comparation) => {
      if (left >= right) {
        return;
      }
      let pivotIndex = Math.floor(left + (right - left) / 2);
      let pivot = arr[pivotIndex];
      let i = left;
      let j = right;
      while (i <= j) {
        while (comparation(arr[i], pivot) < 0) {
          i++;
        }
        while (comparation(arr[j], pivot) > 0) {
          j--;
        }
        if (i <= j) {
          let temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;
          i++;
          j--;
        }
      }
      recursionSort(arr, left, j, comparation);
      recursionSort(arr, i, right, comparation);
    };
    recursionSort(arr, 0, arr.length - 1, comparation);
  },

  // выполняет сортировку и производит замер времени
  startSort(sort, arr, comparation) {
    sortTimeLabel.textContent = 'sorting...';
    const startTime = performance.now();
    sort(arr, comparation);
    const endTime = performance.now();
    sortTime = `${(endTime - startTime).toFixed(2)} ms`;
    sortTimeLabel.textContent = sortTime;
  },
};

// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener('click', () => {
  if (sortKind === 'bubbleSort') {
    sortKind = 'quickSort';
  } else {
    sortKind = 'bubbleSort';
  }
  sortKindLabel.textContent = sortKind;
});

sortActionButton.addEventListener('click', () => {
  const sortFunction = sortAPI[sortKind];
  sortAPI.startSort(sortFunction, fruits, comparationColor);
  display();
});

/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener('click', () => {
  // Получаем значения из полей ввода
  const kind = kindInput.value.trim();
  const color = colorInput.value.trim();
  const weight = parseFloat(weightInput.value.trim());

  // Проверяем, что все поля заполнены
  if (!kind || !color || isNaN(weight)) {
    alert('Заполните все поля!');
    return;
  }

  // Создаем новый объект фрукта
  const newFruit = { kind, color, weight };

  // Добавляем новый фрукт в массив fruits
  fruits.push(newFruit);

  // Отображаем обновленный список фруктов
  display();
});