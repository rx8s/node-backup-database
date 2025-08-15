const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const config = require("./config.js");
const logs = require("./utils/logger.js");

exports.backupmssql = async () => {
    config.MYSQL_DATABASES.forEach(dbName => {
        const db = dbName.trim();
        if (!db) return;

        try {
            const dbFolder = path.join(`${config.BACKUP_ROOT}/mysql`, db);
            ensureDir(dbFolder);
            const dateStr = getYesterdayDate();
            const filename = `${dateStr}.sql`;
            const fullPath = path.join(dbFolder, filename);
            let cmd;
            if (isSunday()) {
                cmd = `mysqldump -u ${config.MYSQL_USER} -p${config.MYSQL_PASSWORD} ${db}`;
            } else {
                cmd = `mysqldump --single-transaction --quick --lock-tables=false -u ${config.MYSQL_USER} -p${config.MYSQL_PASSWORD} ${db}`;
            }
            console.log(`Backing up MySQL database '${db}' to ${fullPath}`);
            const result = spawnSync('sh', ['-c', cmd], { encoding: 'utf-8', stdio: ['ignore', fs.openSync(fullPath, 'w'), 'pipe'] });
            if (result.status !== 0) {
                console.error(`MySQL backup failed for ${db}: ${result.stderr}`);
                return;
            }
            cleanupOldFiles(dbFolder, "sql");
            queue.push(fullPath);
            console.log(`MySQL backup completed for ${db}`);
        } catch (err) {
            console.error(`Error in MySQL backup for ${db}: ${err}`);
        }
    });
}




// ฟังก์ชันวันที่เมื่อวาน
function getYesterdayDate() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0]; // YYYY-MM-DD
}

// ตรวจสอบว่าเป็นวันอาทิตย์หรือไม่
function isSunday() {
    return new Date().getDay() === 0; // Sunday = 0
}

// สร้างโฟลเดอร์ถ้าไม่มี
function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

// ลบไฟล์เก่าเกิน KEEP_DAYS
function cleanupOldFiles(folder, ext) {
    const files = fs.readdirSync(folder)
        .filter(f => f.endsWith(`.${ext}`))
        .sort();
    if (files.length > KEEP_DAYS) {
        files.slice(0, files.length - KEEP_DAYS).forEach(file => {
            try {
                fs.unlinkSync(path.join(folder, file));
                console.log(`Deleted old file: ${file}`);
            } catch (err) {
                console.error(`Error deleting file ${file}: ${err}`);
            }
        });
    }
}


