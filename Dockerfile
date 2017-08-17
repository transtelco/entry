FROM kkarczmarczyk/node-yarn:8.0

ADD ./.babelrc ./
ADD ./.jshintrc ./
ADD package.json yarn.lock ./
RUN yarn install

ADD ./server.js ./
ADD ./data/ ./data/

ENTRYPOINT ["npm"]
CMD ["start"]
