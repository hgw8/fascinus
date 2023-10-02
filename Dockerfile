FROM node:18
RUN apt update && apt install -y python3 python3-pip wget
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
USER node
COPY --chown=node:node lib/banter/requirements.txt .
RUN pip3 install -r requirements.txt --break-system-packages
COPY --chown=node:node package*.json ./
RUN npm i
COPY --chown=node:node . .
CMD [ "node", "bot.js" ]