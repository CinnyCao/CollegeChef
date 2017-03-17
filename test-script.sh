read -p $'\nLog in'
curl -X "POST" "http://localhost:3000/login" \
     -H "Content-Type: application/json; charset=utf-8" \
     -d $'{
  "userName": "user",
  "password": "user"
}'

read -p $'\nLog in with missing inputs - will get 400'
curl -X "POST" "http://localhost:3000/login" \
     -H "Content-Type: application/json; charset=utf-8" \
     -d $'{
  "userName": "user"
}'

read -p $'\nLog in with wrong inputs - will get 403'
curl -X "POST" "http://localhost:3000/login" \
     -H "Content-Type: application/json; charset=utf-8" \
     -d $'{
  "userName": "user",
  "password": "password"
}'


read -p $'\nGet all ingredients'
curl "http://localhost:3000/ingredients"


read -p $'\nSearch recipes by ingredients case 1 (result might be empty since recipes are randomly created)'
curl -X "POST" "http://localhost:3000/search" \
     -H "Content-Type: application/json; charset=utf-8" \
     -d $'{
  "ingredients": [1, 2]
}'

read -p $'\nSearch recipes by ingredients case 2 (result might be empty since recipes are randomly created)'
curl -X "POST" "http://localhost:3000/search" \
     -H "Content-Type: application/json; charset=utf-8" \
     -d $'{
  "ingredients": [0]
}'

read -p $'\nSearch recipes by ingredients with no input- will get 400'
curl -X "POST" "http://localhost:3000/search" \
     -H "Content-Type: application/json; charset=utf-8" \
     -d $'{

}'


read -p $'\nGet list (10) of new recipes'
curl "http://localhost:3000/recipes/new"


read -p $'\nGet list of recipes uploaded by current user'
curl -X "POST" "http://localhost:3000/recipes/uploaded" \
     -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySUQiOiIxIiwiZXhwIjoxNTUyODQwOTg0Nzk4fQ.oxRn-qB7itdDP-W8zDpwlzfmwHlC8esVqTC1Q5xZOGk"\
     -H "Content-Type: application/json; charset=utf-8" \
     -d $'{

}'

read -p $'\nGet list of recipes uploaded by user called user'
curl -X "POST" "http://localhost:3000/recipes/uploaded" \
     -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySUQiOiIxIiwiZXhwIjoxNTUyODQwOTg0Nzk4fQ.oxRn-qB7itdDP-W8zDpwlzfmwHlC8esVqTC1Q5xZOGk"\
     -H "Content-Type: application/json; charset=utf-8" \
     -d $'{
   "userName": "user"
}'

read -p $'\nGet list of recipes uploaded with no bearer - will get 401'
curl -X "POST" "http://localhost:3000/recipes/uploaded" \
     -H "Content-Type: application/json; charset=utf-8" \
     -d $'{
   "userName": "user"
}'

