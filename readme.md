# Node Backup Database

สคริปต์ Node.js สำหรับสำรองข้อมูลฐานข้อมูล MySQL และ SQL Server โดยอัตโนมัติ รองรับการตั้งเวลาและการแจ้งเตือนผ่าน Slack

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
   BACKUP_ROOT=./backups
   MYSQL_HOST=localhost
   MYSQL_USER=root
   MYSQL_PASSWORD=yourpassword
   MYSQL_DATABASES=database1,database2
   SQLSERVER_HOST=localhost
   SQLSERVER_USER=sa
   SQLSERVER_PASSWORD=yourpassword
   SQLSERVER_DATABASES=database1,database2
   SLACK_WEBHOOK_URL=https://hooks.slack.com/services/your/webhook/url
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

