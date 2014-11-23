# To use with thin 
#  thin start -p PORT -R config.ru

require File.join(File.dirname(__FILE__),  'server.rb')

run Rack::URLMap.new \
  "/"       => Sinatra::Application.new
