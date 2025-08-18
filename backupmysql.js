const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const config = require("./config.js");
const logs = require("./utils/logger.js");

exports.backupmysql = async () => {
    const dn = new Date();
    await logs.logger.info(`MySQL backup start ${dn}`);
    const results = [];
    for (const dbName of config.MYSQL.DATABASES) {
        const db = dbName.trim();
        if (!db) return;

        try {
            
            const dbFolder = path.join(`${config.BACKUP_ROOT}/mysql`, db);
            await ensureDir(dbFolder);
            const dateStr = await getYesterdayDate();
            const filename = `${dateStr}.sql`;
            const fullPath = path.join(dbFolder, filename);
            let cmd;
            if (isSunday()) {
                cmd = `mysqldump -u ${config.MYSQL.USER} -p${config.MYSQL.PASSWORD} ${db}`;
            } else {
                cmd = `mysqldump --single-transaction --quick --lock-tables=false -u ${config.MYSQL.USER} -p${config.MYSQL.PASSWORD} ${db}`;
            }

            console.log(`Backing up MySQL database '${db}' to ${fullPath}`);
            const result = spawnSync('sh', ['-c', cmd], { encoding: 'utf-8', stdio: ['ignore', fs.openSync(fullPath, 'w'), 'pipe'] });
            if (result.status !== 0) {
                console.error(`MySQL backup failed for ${db}: ${result.stderr}`);
                return;
            }
            await cleanupOldFiles(dbFolder, "sql");
            console.log(`MySQL backup completed for ${db}`);
            logs.logger.info(`MySQL backup completed: ${db}`);
            results.push(db);
        } catch (err) {
            logs.logger.error(`MySQL backup failed for ${db}: ${err}`);
            console.error(`Error in MySQL backup for ${db}: ${err}`);
        }
    }
    return results;
}




// ฟังก์ชันวันที่เมื่อวาน
async function getYesterdayDate() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0]; // YYYY-MM-DD
}

// ตรวจสอบว่าเป็นวันอาทิตย์หรือไม่
function isSunday() {
    return new Date().getDay() === 0; // Sunday = 0
}

// สร้างโฟลเดอร์ถ้าไม่มี
async function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

// ลบไฟล์เก่าเกิน KEEP_DAYS
async function cleanupOldFiles(folder, ext) {
    const files = fs.readdirSync(folder)
        .filter(f => f.endsWith(`.${ext}`))
        .sort();
    if (files.length > config.KEEP_DAYS) {
        files.slice(0, files.length - config.KEEP_DAYS).forEach(file => {
            try {
                fs.unlinkSync(path.join(folder, file));
                console.log(`Deleted old file: ${file}`);
            } catch (err) {
                console.error(`Error deleting file ${file}: ${err}`);
            }
        });
    }
}


