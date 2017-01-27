FROM node:6.9.0

# Install dependencies
RUN apt-get update -qq && apt-get install -y \
  build-essential \
  libpq-dev \
  bash \
  curl \
  sudo \
  wget

# Install the heroku toolbelt
RUN wget -O- https://toolbelt.heroku.com/install-ubuntu.sh | sh
ENV PATH /usr/local/heroku/bin:$PATH

# RUN heroku status to install the latest version of the Heroku Toolbelt
RUN heroku status

# Clean the apt cache after Heroku Toolbelt installation
RUN apt-get clean

ADD . .
RUN npm install
RUN npm install --production
RUN npm install -g grunt-cli
RUN echo '{ "allow_root": true }' > /root/.bowerrc
RUN grunt init
RUN grunt prod