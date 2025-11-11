// Підключаємо необхідні модулі: http для сервера, fs та path для роботи з файлами/теками
const http = require('http');
const fs = require('fs');
const path = require('path');
const { Command } = require('commander');

// Ініціалізуємо Commander
const program = new Command();

// Визначаємо обов'язкові параметри (-h, -p, -c)
// Використовуємо .requiredOption() — Commander автоматично виведе помилку, якщо параметр пропущено.
program
    .requiredOption('-h, --host <type>', 'адреса сервера')
    .requiredOption('-p, --port <number>', 'порт сервера', parseInt)
    .requiredOption('-c, --cache <type>', 'шлях до директорії кешу')
    .parse(process.argv);

// Отримуємо значення параметрів з об'єкта options
const options = program.opts();
const { host, port, cache } = options;

console.log(`\nСпроба запуску сервера з параметрами: Host=${host}, Port=${port}, CacheDir=${cache}`);

// 1. Перевірка та створення директорії кешу, якщо її не існує
const cacheDirFullPath = path.resolve(process.cwd(), cache);

try {
    // fs.mkdirSync створює теку. { recursive: true } дозволяє не перейматися, якщо батьківські теки чи сама тека вже існує.
    fs.mkdirSync(cacheDirFullPath, { recursive: true });
    console.log(`📂 Директорія кешу готова: ${cacheDirFullPath}`);
} catch (err) {
    console.error(`❌ Помилка при створенні директорії кешу: ${err.message}`);
    process.exit(1); // Зупиняємо програму, якщо не можемо створити теку
}

// 2. Створення HTTP сервера за допомогою вбудованого модуля http
const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end(`Сервер працює!\nHost: ${host}, Port: ${port}\nCache Path: ${cacheDirFullPath}`);
});

// 3. Запуск сервера, використовуючи значення host та port, отримані з командного рядка
server.listen(port, host, () => {
    console.log(`\n✅ Вебсервер успішно запущено та він слухає запити за адресою: http://${host}:${port}/`);
    console.log('Натисніть Ctrl+C для зупинки.');
});