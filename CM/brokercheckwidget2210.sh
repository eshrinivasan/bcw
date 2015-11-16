#!/bin/bash

. /home/app_jenkins_dev/.bash_profile
#set 
#which rvm

unset http_proxy
npm config list
npm install --production
npm install -g grunt-cli

#echo "Gem list before setting rvm"
#export GEM_PATH=$HOME/.rvm/gems/ruby-1.9.3-p448:$HOME/.rvm/gems/ruby-1.9.3-p448@global
#export GEM_HOME=$HOME/.rvm/gems/ruby-1.9.3-p448

#rvm use 1.9.3-p448

#echo "Gem list after setting rvm"
#gem list

/apps/nodejs/node-v0.10.32/bin/grunt build