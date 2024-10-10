// Получаем элементы
const serviceName = document.getElementById('serviceName');
const login = document.getElementById('login');
const password = document.getElementById('password');
const savePasswordBtn = document.getElementById('savePasswordBtn');
const generatePasswordBtn = document.getElementById('generatePasswordBtn');
const clearBtn = document.getElementById('clearBtn');
const passwordList = document.getElementById('passwordList');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalLogin = document.getElementById('modalLogin');
const modalPassword = document.getElementById('modalPassword');
const deleteBtn = document.getElementById('deleteBtn');
const copyPasswordBtn = document.getElementById('copyPasswordBtn');
const closeModal = document.querySelector('.close');
const usedSpaceElement = document.getElementById('usedSpace');
const warningElement = document.getElementById('warning');

// Переменная для хранения индекса текущей записи
let currentPasswordIndex = null;

// Максимальный объем localStorage (в КБ)
const MAX_STORAGE = 5000; // 5 MB

// Функция для генерации пароля
function generatePassword() {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let generatedPassword = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
        generatedPassword += charset.charAt(Math.floor(Math.random() * n));
    }
    password.value = generatedPassword;
}

// Функция для загрузки всех записей
function loadPasswords() {
    const passwords = JSON.parse(localStorage.getItem('passwords')) || [];
    passwordList.innerHTML = '';
    passwords.forEach((entry, index) => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${entry.service}</strong> - ${entry.login}`;
        li.addEventListener('click', () => openPassword(index));
        passwordList.appendChild(li);
    });
    updateStorageStatus();
}

// Функция для сохранения записи
function savePassword() {
    const service = serviceName.value.trim();
    const userLogin = login.value.trim();
    const userPassword = password.value.trim();

    if (service && userLogin && userPassword) {
        const passwords = JSON.parse(localStorage.getItem('passwords')) || [];
        const entry = {
            service: service,
            login: userLogin,
            password: userPassword
        };
        passwords.push(entry);
        localStorage.setItem('passwords', JSON.stringify(passwords));
        serviceName.value = '';
        login.value = '';
        password.value = '';
        loadPasswords();
        alert('Запись сохранена!');
    } else {
        alert('Пожалуйста, заполните все поля.');
    }
}

// Функция для открытия записи
function openPassword(index) {
    const passwords = JSON.parse(localStorage.getItem('passwords'));
    const entry = passwords[index];
    modalTitle.textContent = `Сервис: ${entry.service}`;
    modalLogin.textContent = `Логин: ${entry.login}`;
    modalPassword.textContent = `Пароль: ${entry.password}`;
    modal.style.display = 'block';
    currentPasswordIndex = index;
}

// Функция для удаления записи
function deletePassword() {
    const passwords = JSON.parse(localStorage.getItem('passwords'));
    passwords.splice(currentPasswordIndex, 1);
    localStorage.setItem('passwords', JSON.stringify(passwords));
    modal.style.display = 'none';
    loadPasswords();
}

// Функция для копирования пароля в буфер обмена
function copyPassword() {
    const passwordText = modalPassword.textContent.replace('Пароль: ', '');
    navigator.clipboard.writeText(passwordText).then(() => {
        alert('Пароль скопирован в буфер обмена!');
    });
}

// Закрытие модального окна
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Закрытие модального окна при клике вне области
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Функция для очистки поля ввода
function clearFields() {
    serviceName.value = '';
    login.value = '';
    password.value = '';
}

// Функция для обновления состояния хранилища
function updateStorageStatus() {
    const usedBytes = new Blob(Object.values(localStorage)).size;
    const usedKB = (usedBytes / 1024).toFixed(2);
    usedSpaceElement.textContent = usedKB;

    // Если занято больше 80% хранилища, показываем предупреждение
    if (usedKB >= MAX_STORAGE * 0.8) {
        warningElement.textContent = 'Внимание! Почти все хранилище занято.';
    } else {
        warningElement.textContent = '';
    }
}

// Обработчики событий
generatePasswordBtn.addEventListener('click', generatePassword);
savePasswordBtn.addEventListener('click', savePassword);
clearBtn.addEventListener('click', clearFields);
deleteBtn.addEventListener('click', deletePassword);
copyPasswordBtn.addEventListener('click', copyPassword);

// Загрузка сохраненных записей при загрузке страницы
window.addEventListener('load', loadPasswords);