# 使用官方 Node.js 鏡像作為基本映像
FROM node:20

# 設定工作目錄
WORKDIR /app

# 複製 package.json 與 package-lock.json 到容器中
COPY package*.json ./

# 安裝應用程式相依套件
RUN npm install

# 複製應用程式程式碼到容器中
COPY . .

# 應用程式執行的預設指令
CMD ["node", "app.js"]