APP_ROOT = File.expand_path(File.join(File.dirname(__FILE__), '.'))

require 'rubygems'
require 'sinatra'
require "sinatra/reloader"
require 'haml'



get "/" do
  redirect '/biomorphs'
end

get '/biomorphs' do
  haml :biomorphs
end

