# 🛡️ Node Backup Database

สคริปต์ Node.js สำหรับสำรองข้อมูลฐานข้อมูล MySQL และ SQL Server โดยอัตโนมัติ รองรับการตั้งเวลาและการแจ้งเตือนผ่าน Discord

![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20Linux%20%7C%20macOS-blue)
![Python](https://img.shields.io/badge/node-v22.18.0(LTS)%2B-green)
![MySQL](https://img.shields.io/badge/Database-MariaDB%20%7C%20MySQL%20%7C%20SQL_Server-yellow)
![License](https://img.shields.io/badge/license-MIT-brightgreen)
## ฟีเจอร์หลัก

- สำรองข้อมูลฐานข้อมูล MySQL และ SQL Server
- รองรับการตั้งเวลา (cron) สำหรับการสำรองข้อมูลอัตโนมัติ
- แจ้งเตือนผ่าน Slack เมื่อการสำรองข้อมูลสำเร็จหรือเกิดข้อผิดพลาด
- รองรับการตั้งค่าในไฟล์ `.env` สำหรับความปลอดภัย

## การติดตั้ง

1. คลิกที่ปุ่ม **"Use this template"** ที่มุมขวาบนของหน้านี้ เพื่อสร้าง repository ใหม่ของคุณเอง

2. โคลน repository ที่คุณสร้างขึ้นมาลงในเครื่องของคุณ:

   ```bash
   git clone https://github.com/your-username/node-backup-database.git
   cd node-backup-database
   ```

3. ติดตั้ง dependencies:

   ```bash
   npm install
   ```

4. สร้างไฟล์ `.env` และกำหนดค่าตัวแปรที่จำเป็น:

   ```env
   DOTENV_CONFIG_DEBUG=false
   
   # General
   BACKUP_ROOT=/var/backup/
   
   ENABLE_FTP=false
   ENABLE_GDRIVE=false
   
   # MySQL
   MYSQL_USER=root
   MYSQL_PASSWORD=password
   MYSQL_DATABASES=db1,db2
   
   # SQL Server
   SQLSERVER_HOST=localhost
   SQLSERVER_USER=sa
   SQLSERVER_PASSWORD=password
   SQLSERVER_DATABASES=db3,db4
   
   # Push Notify
   PUSH_URL=https://example.com/push-msg
   
   # FTP
   FTP_HOST=ftp.example.com
   FTP_USER=ftpuser
   FTP_PASSWORD=ftppassword
   FTP_REMOTE_PATH=/backup
   
   
   LINE_CHANNEL_ACCESS_TOKEN = ''
   LINE_TO_USER_ID = ''
   
   DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/xxxx/yyyy
   
   EMAIL_SMTP_SERVER=smtp.gmail.com
   EMAIL_SMTP_PORT=587
   EMAIL_USER=your.email@gmail.com
   EMAIL_PASSWORD=your_email_password
   EMAIL_TO=notify.target@example.com
   ```

## การใช้งาน

### สำรองข้อมูล MySQL

```bash
node backupmysql.js
```

### สำรองข้อมูล SQL Server

```bash
node backupmssql.js
```

### การตั้งเวลา (Cron)

คุณสามารถตั้งเวลาให้สคริปต์ทำงานโดยอัตโนมัติตามช่วงเวลาที่ต้องการ โดยการเพิ่ม cron job:

```bash
crontab -e
```

เพิ่มบรรทัดต่อไปนี้เพื่อตั้งเวลาให้สคริปต์ทำงานทุกวันเวลา 2:00 น.:

```bash
0 2 * * * /usr/bin/node /path/to/backupmysql.js
0 2 * * * /usr/bin/node /path/to/backupmssql.js
```

## การทดสอบ

โปรเจกต์นี้ใช้ Jest สำหรับการทดสอบหน่วย (unit testing) คุณสามารถรันการทดสอบทั้งหมดได้โดยใช้คำสั่ง:

```bash
npm test
```

## การสนับสนุน

หากคุณพบปัญหาหรือมีคำถามเพิ่มเติม สามารถเปิด [Issue](https://github.com/rx8s/node-backup-database/issues) ใน GitHub repository นี้

## ลิขสิทธิ์

โปรเจกต์นี้เผยแพร่ภายใต้ [MIT License](https://opensource.org/licenses/MIT)

