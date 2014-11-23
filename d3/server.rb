APP_ROOT = File.expand_path(File.join(File.dirname(__FILE__), '.'))

require 'rubygems'
require 'sinatra'
require "sinatra/reloader" if development?
require 'haml'

require File.join(APP_ROOT, *%w[lib biomorph])


get "/" do
  redirect '/biomorphs'
end

get '/biomorphs' do
  haml :biomorphs, :locals => {:biomorphs => Biomorphs.new.go}
end

post '/select_biomorph' do
  genes = eval(params[:genes])
  haml :biomorphs, :locals => {:biomorphs => Biomorphs.new(genes).go}
end



