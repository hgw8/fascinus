FROM node:16
RUN apt update && apt install -y python3 python3-pip wget
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
RUN mkdir -p /tmp/fascinus && chown -R node:node /tmp/fascinus
WORKDIR /home/node/app
USER node
COPY --chown=node:node banter/requirements.txt .
RUN pip3 install -r requirements.txt
COPY --chown=node:node package*.json ./
RUN npm i
COPY --chown=node:node . .
CMD [ "node", "bot.js" ]