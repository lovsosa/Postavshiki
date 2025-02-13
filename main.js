const B24URL = 'https://b24-jba6eg.bitrix24.ru/rest/9/r5qe3dgqqjqvoroo/';
const getURL = window.location.search
const urlParams = new URLSearchParams(getURL)
const getUrlParams = urlParams.get("ID")
// Получаем элементы формы и кнопки
const form = document.getElementById("submit-form");
const UfFieldsCrm = {
  manager: "UF_CRM_1739163157",
  fullName: "UF_CRM_1739163157",
  admin: "UF_CRM_1739163157",
  status: "UF_CRM_1739163157",
  city: "UF_CRM_1739163157",
  bank: "UF_CRM_1739163157",
  translation: "UF_CRM_1739163157",
  current: "UF_CRM_1739163157",
  curs: "UF_CRM_1739163157",
  remainder: "UF_CRM_1739163157",
  budget: "UF_CRM_1739163157",
  outbid: "UF_CRM_1739163157",
  date: "UF_CRM_1739163157",
}
const getDealProductrows = async (id) => {
  try {
    const response = await fetch(`${B24URL}crm.deal.productrows.get?ID=${id}`)
    const data = await response.json(); // Распарсим JSON из ответа
    if (response.ok) {
      return { success: true, data: data.result }
    } else { success: false }
  } catch (error) {
    console.error("Ошибка при отправке данных: getDealProductrows", error);
    return { success: false }
  }

}
const getDealData = async () => {
  try {
    if (getUrlParams) {
      const inputID = document.querySelector(".header__deal-id");
      inputID.innerHTML = `№${getUrlParams}`
      const dealDataProduct = await getDealProductrows(getUrlParams);
      const dealData = await checkDealExists(getUrlParams);
      if (!dealDataProduct.success) {
        return;
      }
      const chooseHeaderList = document.querySelector(".header__list");
      chooseHeaderList.innerHTML = ""; // Очищаем список перед добавлением новых данных
      const datePlace = document.querySelector("#deal-date")
      datePlace.innerHTML = `${dealData.date}`
      const managerPlace = document.querySelector("#deal-manager")
      managerPlace.innerHTML = `${dealData.manager}`
      const fullNamePlace = document.querySelector("#deal-full-name")
      fullNamePlace.innerHTML = `${dealData.fullName}`
      const adminPlace = document.querySelector("#deal-admin")
      adminPlace.innerHTML = `${dealData.admin}`
      const cityPlace = document.querySelector("#deal-city")
      cityPlace.innerHTML = `${dealData.city}`
      const statusPlace = document.querySelector("#deal-status")
      statusPlace.innerHTML = `${dealData.status}`
      const bankPlace = document.querySelector("#deal-bank")
      bankPlace.innerHTML = `${dealData.bank}`
      const translationPlace = document.querySelector("#deal-translation span")
      translationPlace.innerHTML = ` ${dealData.translation}`
      const currentPlace = document.querySelector("#deal-current span")
      currentPlace.innerHTML = ` ${dealData.current}`
      const cursPlace = document.querySelector("#deal-curs span")
      cursPlace.innerHTML = ` ${dealData.curs}`
      const remainderPlace = document.querySelector("#deal-remainder span")
      remainderPlace.innerHTML = ` ${dealData.remainder}`
      const budgetPlace = document.querySelector("#deal-budget span")
      budgetPlace.innerHTML = ` ${dealData.budget}`
      const outbidPlace = document.querySelector("#deal-outbid span")
      outbidPlace.innerHTML = ` ${dealData.outbid}`
      dealDataProduct.data.forEach((item) => {
        const createElement = document.createElement("div");
        createElement.classList.add("header__item");
        createElement.innerHTML = `
          <div class="header__card">
            <input name="name" type="text" placeholder="Название" value="${item.PRODUCT_NAME}" />
          </div>
          <div class="header__card">
            <input name="count" type="number" placeholder="Количество" value="${item.QUANTITY}" />
          </div>
          <div class="header__card">
            <input name="price" type="number" placeholder="Цена" value="${item.PRICE}" />
          </div>
          <div class="header__card">
            <input name="sum" type="number" placeholder="Сумма" readonly />
          </div>
        `;
        chooseHeaderList.appendChild(createElement);

        // Пересчёт суммы для каждого ряда
        const countInput = createElement.querySelector("input[name='count']");
        const priceInput = createElement.querySelector("input[name='price']");
        if (countInput && priceInput) {
          calculateSum(countInput); // Передаём любой input из строки для расчёта
        }
      });
    } else { return }
  } catch (error) {
    console.error("Ошибка при отправке данных: getDealData", error);
  }
};
document.addEventListener("DOMContentLoaded", async () => {
  const preloader = document.querySelector(".preloader");
  const preloaderLine = document.querySelector(".preloader-line");

  // Функция для увеличения прогресса
  const updateProgress = (percentage) => {
    preloaderLine.style.width = `${percentage}%`;
  };

  // Отображаем прелоадер перед загрузкой данных
  preloader.style.display = "block";

  try {
    // Инициализируем прогресс
    updateProgress(10);

    // Загружаем данные
    await getDealData();

    // Завершаем прогресс на 100%
    updateProgress(100);

    // Убираем прелоадер через 500 мс после завершения загрузки
    setTimeout(() => {
      preloader.style.display = "none";
    }, 500);
  } catch (error) {
    console.error("Ошибка во время загрузки страницы:", error);

    // В случае ошибки тоже убираем прелоадер
    preloader.style.display = "none";
  }
});

document.querySelector(".header__add").addEventListener("click", (event) => {
  const chooseHeaderList = document.querySelector(".header__list");
  const createElement = document.createElement("div");
  createElement.classList.add("header__item");
  createElement.innerHTML = `          

  <div class="header__card">
  <input name="name" type="text" placeholder="Название" />
</div>
<div class="header__card">
  <input name="count" type="number" placeholder="Количество" />
</div>
<div class="header__card">
  <input name="price" type="number" placeholder="Цена" />
</div>
<div class="header__card">
  <input name="sum" type="number" placeholder="Сумма" />
</div>
  `;
  chooseHeaderList.appendChild(createElement);
});
// Отпарвка данных на сервер
// Функция для проверки наличия сделки в Битрикс24
async function checkDealExists(getUrlParams) {
  try {
    const response = await fetch(`${B24URL}crm.deal.get.json?ID=${getUrlParams}`);
    const data = await response.json();
    const manager = data.result[UfFieldsCrm.manager] || "Не указан";
    const admin = data.result[UfFieldsCrm.admin] || "Не указан";
    const bank = data.result[UfFieldsCrm.bank] || "Не указан";
    const budget = data.result[UfFieldsCrm.budget] || "Не указан";
    const city = data.result[UfFieldsCrm.city] || "Не указан";
    const current = data.result[UfFieldsCrm.current] || "Не указан";
    const curs = data.result[UfFieldsCrm.curs] || "Не указан";
    const date = data.result[UfFieldsCrm.date] || "Не указан";
    const fullName = data.result[UfFieldsCrm.fullName] || "Не указан";
    const outbid = data.result[UfFieldsCrm.outbid] || "Не указан";
    const remainder = data.result[UfFieldsCrm.remainder] || "Не указан";
    const status = data.result[UfFieldsCrm.status] || "Не указан";
    const translation = data.result[UfFieldsCrm.translation] || "Не указан";
    if (data.result) {
      return {
        success: true,
        manager: manager,
        admin: admin,
        bank: bank,
        budget: budget,
        city: city,
        current: current,
        curs: curs,
        date: date,
        fullName: fullName,
        outbid: outbid,
        remainder: remainder,
        status: status,
        translation: translation,
      };
    } else { success: false }
  } catch (error) {
    console.error("Ошибка проверки сделки:", error);
    return false;
  }
}

// Функция для пересчета суммы
function calculateSum(inputElement) {
  const row = inputElement.closest(".header__item");
  const countInput = row.querySelector("input[name='count']");
  const priceInput = row.querySelector("input[name='price']");
  const sumInput = row.querySelector("input[name='sum']");
  if (countInput && priceInput && sumInput) {
    const count = parseFloat(countInput.value) || 0;
    const price = parseFloat(priceInput.value) || 0;
    sumInput.value = count * price;
    sumInput.setAttribute("readonly", true); // Делаем поле суммы неизменяемым
  }
  calculateTotalSum();
}
function calculateTotalSum() {
  let totalSum = 0;

  // Ищем все строки и складываем их суммы
  const sumInputs = document.querySelectorAll("input[name='sum']");
  sumInputs.forEach((sumInput) => {
    totalSum += parseFloat(sumInput.value) || 0;
  });

  // Обновляем отображение общей суммы (предположительно, есть элемент для итога)
  const totalSumElement = document.querySelector(".total-sum");
  const totalSumWithCommission = document.querySelector(".total-sum-with-commission");
  const resultSum = document.querySelector(".result");
  totalSumElement.textContent = totalSum;
  const commission = totalSumWithCommission.textContent = totalSum * 0.06;
  resultSum.textContent = (totalSum + commission)
}
// Назначаем обработчики событий для динамических полей
document.addEventListener("input", (event) => {
  if (event.target.name === "count" || event.target.name === "price") {
    calculateSum(event.target);
  }
});

// Обработчик отправки формы
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Получаем элементы прелоадера
  const preloader = document.querySelector(".preloader");
  const preloaderLine = document.querySelector(".preloader-line");

  // Функция обновления прогресса
  const updateProgress = (percentage) => {
    preloaderLine.style.width = `${percentage}%`;
  };

  // Показываем прелоадер
  preloader.style.height = "5px";
  preloader.style.display = "block";
  updateProgress(10);

  if (!getUrlParams) {
    console.log("Введите ID сделки!");
    updateProgress(100); // Завершаем прелоадер в случае ошибки
    setTimeout(() => {
      preloader.style.display = "none";
    }, 500);
    return;
  }

  const dealExists = await checkDealExists(getUrlParams);
  if (!dealExists.success) {
    console.log("Сделка с таким ID не найдена в Битрикс24.");
    updateProgress(100); // Завершаем прелоадер в случае ошибки
    setTimeout(() => {
      preloader.style.display = "none";
    }, 500);
    return;
  }

  updateProgress(50); // Прогресс после проверки существования сделки

  // Сбор данных из формы
  const dealData = {
    ID: Number(getUrlParams),
    rows: [],
  };
  document.querySelectorAll(".header__item").forEach((row) => {
    const nameInput = row.querySelector("input[name='name']");
    const countInput = row.querySelector("input[name='count']");
    const priceInput = row.querySelector("input[name='price']");
    const sumInput = row.querySelector("input[name='sum']");

    if (nameInput && countInput && priceInput && sumInput) {
      dealData.rows.push({
        PRODUCT_NAME: nameInput.value.trim(),
        QUANTITY: parseFloat(countInput.value) || 0,
        PRICE: parseFloat(priceInput.value) || 0,
      });
    }
  });

  console.log(dealData);

  try {
    updateProgress(75); // Прогресс перед отправкой данных

    // Отправка данных в Битрикс24
    const response = await fetch(`${B24URL}crm.deal.productrows.set.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dealData),
    });

    const result = await response.json();
    console.log("Результат обновления сделки:", result);

    updateProgress(100); // Прогресс завершён
    setTimeout(() => {
      preloader.style.display = "none"; // Скрываем прелоадер
    }, 500);
  } catch (error) {
    console.error("Ошибка при отправке данных:", error);

    // Завершаем прелоадер в случае ошибки
    updateProgress(100);
    setTimeout(() => {
      preloader.style.display = "none";
    }, 500);
  }
});

